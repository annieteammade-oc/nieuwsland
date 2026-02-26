"""Write 1 real article per category from ACTUAL RSS feeds — no fabrication."""
import sys, os, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from utils import parse_rss, llm_generate, supabase_publish, RSS_FEEDS, is_processed, mark_processed

SYSTEM = """Je bent journalist bij Nieuwsland.be. Herschrijf dit nieuwsbericht als COMPLEET artikel (400-600 woorden).

STRUCTUUR (verplicht):
- **Lead** (2-3 zinnen, vetgedrukt)
- Kernpunten als bullet list (3-5 items)
- Korte alinea's (MAX 3 zinnen, gescheiden door dubbele newline)
- 2-3 tussenkoppen (## Subtitel)
- 5-8x **vette tekst**
- Eindig met ## Wat nu?
- Vermeld de bron subtiel in de tekst

REGELS:
- HERSCHRIJF volledig, nooit copy-paste
- Belgisch perspectief waar relevant
- GEEN titel bovenaan, GEEN metadata
- ALLEEN de artikeltekst"""

# Map Supabase category slugs to RSS_FEEDS keys
CAT_MAP = {
    "wereld": "world",
    "politiek": "politics",
    "economie": "economy",
    "sport": "sport",
    "cultuur": None,  # no feed yet
    "wetenschap": "science",
    "regionaal": None,  # no feed yet
    "opinie": None,
}
CATEGORIES_TO_FILL = ["wereld", "politiek", "economie", "sport", "wetenschap"]

for cat in CATEGORIES_TO_FILL:
    feed_key = CAT_MAP.get(cat, cat)
    if not feed_key:
        print(f"\n⚠️ Geen feeds voor {cat}, skip")
        continue
    feeds = RSS_FEEDS.get(feed_key, [])
    if not feeds:
        print(f"\n⚠️ Geen feeds voor {cat}, skip")
        continue
    
    print(f"\n📰 Zoek actueel artikel voor: {cat}")
    
    found = False
    for feed_name, feed_url in feeds:
        items = parse_rss(feed_url, max_items=5)
        for item in items:
            if is_processed(item["link"]):
                continue
            
            print(f"  📝 Bron: {feed_name} — {item['title'][:60]}...")
            
            prompt = f"""Herschrijf dit artikel voor Nieuwsland.be:

Originele titel: {item['title']}
Bron: {feed_name}
URL: {item['link']}
Samenvatting: {item['summary'][:500]}

Schrijf VOLLEDIG uit (400-600 woorden). Belgisch perspectief."""
            
            content = llm_generate(prompt, model="google/gemini-2.5-flash", system=SYSTEM, max_tokens=2500, temperature=0.7)
            
            if not content:
                print(f"  ❌ LLM fout")
                continue
            
            # Generate a good Dutch title
            title_prompt = f"Geef een pakkende Nederlandse nieuwstitel (max 80 tekens) voor dit artikel. Geen aanhalingstekens. Alleen de titel.\n\nOrigineel: {item['title']}\nBron: {feed_name}"
            dutch_title = llm_generate(title_prompt, model="google/gemini-2.5-flash", max_tokens=100, temperature=0.5)
            if not dutch_title or len(dutch_title) > 120:
                dutch_title = item["title"]
            dutch_title = dutch_title.strip().strip('"').strip("'")
            
            excerpt = content.replace("**","").replace("##","").strip()[:200].rsplit(" ",1)[0] + "..."
            
            result = supabase_publish(
                title=dutch_title,
                content=content,
                category_slug=cat,
                excerpt=excerpt,
                source_name=feed_name,
                source_url=item["link"],
                status="published",
            )
            
            if result:
                mark_processed(item["link"])
                print(f"  ✅ Published: {dutch_title[:60]}...")
                found = True
                break
            else:
                print(f"  ❌ Publish failed (quality gate?)")
        
        if found:
            break
    
    if not found:
        print(f"  ⚠️ Geen geschikt artikel gevonden voor {cat}")
    
    time.sleep(2)

print("\n🎉 Klaar!")
