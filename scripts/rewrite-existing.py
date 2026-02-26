"""Rewrite all existing published articles to be complete, well-formatted, 400-800 words."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import psycopg2, json
from utils import llm_generate

DB_URL = "postgresql://postgres:ANNIE%2BJn%2FpuX2j5gB-T9@db.ndeebbjlsuhcewllolvp.supabase.co:5432/postgres"

SYSTEM = """Je bent een ervaren journalist bij Nieuwsland.be, een Belgisch nieuwsplatform.
Je herschrijft een bestaand artikel om het COMPLEET en professioneel te maken.

REGELS:
- Schrijf 400-800 woorden, VOLLEDIG afgemaakt
- Gebruik **vette tekst** voor belangrijke termen (max 5-8 per artikel)
- Gebruik korte paragrafen (2-4 zinnen)
- Begin met een sterke lead (2-3 zinnen die de kern samenvatten)
- Voeg context en achtergrond toe
- Eindig met een conclusie of vooruitblik ("Wat nu?")
- Schrijf in toegankelijk Nederlands, gericht op Belgisch publiek
- GEEN markdown headers (## etc) — gewoon paragrafen
- GEEN metadata (TITEL:, TAGS:, etc)
- GEEN sterretjes die niet als bold bedoeld zijn
- Het artikel moet COMPLEET zijn — niet halverwege stoppen
- Vermeld de bron subtiel in het artikel

OUTPUT: ALLEEN het artikel. Geen titel, geen tags, geen metadata. Puur de artikeltekst."""

conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

cur.execute("SELECT id, title, content, excerpt FROM articles WHERE status = 'published' ORDER BY id")
articles = cur.fetchall()

print(f"Herschrijven van {len(articles)} artikelen...\n")

for aid, title, content, excerpt in articles:
    print(f"[{aid}] {title[:60]}...")
    
    prompt = f"""Herschrijf dit artikel VOLLEDIG (400-800 woorden). 
Het origineel is onvolledig of slecht opgemaakt. Maak er een professioneel, compleet nieuwsartikel van.

TITEL: {title}

HUIDIG ARTIKEL (onvolledig):
{content[:3000]}

Schrijf het artikel VOLLEDIG uit. Gebruik de informatie die er is en vul aan met context."""
    
    new_content = llm_generate(prompt, model="google/gemini-2.5-flash", system=SYSTEM, max_tokens=3000, temperature=0.6)
    
    if not new_content:
        print(f"  ❌ LLM fout, overslaan")
        continue
    
    # Clean any accidental metadata
    new_content = new_content.strip()
    if new_content.startswith("TITEL:") or new_content.startswith("#"):
        # Strip first line if it's a title
        lines = new_content.split('\n', 1)
        if len(lines) > 1:
            new_content = lines[1].strip()
    
    word_count = len(new_content.split())
    print(f"  ✅ Herschreven: {word_count} woorden")
    
    # Generate clean excerpt (first ~200 chars, no markdown)
    clean_excerpt = new_content.replace('**', '').replace('*', '')[:200].rsplit(' ', 1)[0] + "..."
    
    cur.execute("UPDATE articles SET content = %s, excerpt = %s WHERE id = %s",
               (new_content, clean_excerpt, aid))

conn.commit()
cur.close()
conn.close()
print("\nAlle artikelen herschreven! ✅")
