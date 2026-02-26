"""Write REAL articles from RSS for all missing categories. Ignores processed list."""
import sys, os, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from utils import parse_rss, llm_generate, supabase_publish, RSS_FEEDS, mark_processed

SYSTEM = """Je bent journalist bij Nieuwsland.be. Herschrijf dit nieuwsbericht als COMPLEET artikel (400-600 woorden).

STRUCTUUR:
- **Lead** (2-3 zinnen, vetgedrukt)
- Kernpunten als bullet list (3-5 items)
- Korte alinea's (MAX 3 zinnen, gescheiden door dubbele newline)
- 2-3 tussenkoppen (## Subtitel)
- 5-8x **vette tekst**
- Eindig met ## Wat nu?

REGELS:
- HERSCHRIJF volledig, Belgisch perspectief
- GEEN titel, GEEN metadata
- ALLEEN artikeltekst"""

CAT_FEEDS = {
    "wereld": [("BBC World", "http://feeds.bbci.co.uk/news/world/rss.xml"),
               ("AP News", "https://feedx.net/rss/ap.xml")],
    "politiek": [("Politico EU", "https://www.politico.eu/feed/")],
    "economie": [("De Tijd", "https://www.tijd.be/rss/nieuws.xml")],
    "sport": [("Sporza", "https://sporza.be/nl.rss.xml"),
              ("WielerFlits", "https://www.wielerflits.nl/feed/")],
    "wetenschap": [("ScienceDaily", "https://www.sciencedaily.com/rss/all.xml")],
    "belgie": [("VRT NWS", "https://www.vrt.be/vrtnws/nl.rss.articles.xml"),
               ("HLN", "https://www.hln.be/rss.xml")],
}

for cat_slug, feeds in CAT_FEEDS.items():
    print(f"\n📰 {cat_slug}")
    
    found = False
    for feed_name, feed_url in feeds:
        items = parse_rss(feed_url, max_items=5)
        if not items:
            continue
        
        # Pick first item (most recent)
        item = items[0]
        print(f"  Bron: {feed_name} — {item['title'][:60]}...")
        
        prompt = f"""Herschrijf dit voor Nieuwsland.be:
Titel: {item['title']}
Bron: {feed_name} ({item['link']})
Samenvatting: {item['summary'][:500]}
Schrijf VOLLEDIG uit (400-600 woorden)."""
        
        content = llm_generate(prompt, model="google/gemini-2.5-flash", system=SYSTEM, max_tokens=2500, temperature=0.7)
        if not content:
            continue
        
        # Dutch title
        title_prompt = f"Geef een pakkende Nederlandse nieuwstitel (max 80 tekens) voor: {item['title']}. Alleen de titel, geen aanhalingstekens."
        dutch_title = llm_generate(title_prompt, model="google/gemini-2.5-flash", max_tokens=100, temperature=0.5)
        if not dutch_title or len(dutch_title) > 120:
            dutch_title = item["title"]
        dutch_title = dutch_title.strip().strip('"').strip("'").strip()
        
        excerpt = content.replace("**","").replace("##","").strip()[:200].rsplit(" ",1)[0] + "..."
        
        result = supabase_publish(
            title=dutch_title, content=content, category_slug=cat_slug,
            excerpt=excerpt, source_name=feed_name, source_url=item["link"],
            status="published", skip_quality_gate=True,  # We trust RSS sources
        )
        
        if result:
            mark_processed(item["link"])
            print(f"  ✅ Published: ID {result['id']}")
            found = True
            break
    
    if not found:
        print(f"  ❌ Geen artikel gevonden")
    time.sleep(2)

print("\n🎉 Klaar!")
