"""Write 1 article for each category that has no articles yet."""
import sys, os, time, hashlib, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from utils import llm_generate, supabase_publish, generate_article_image, upload_image_to_supabase, log

CATEGORIES = {
    "wereld": {
        "topic": "EU bereikt historisch akkoord over defensiebudget: 150 miljard euro voor Europese veiligheid",
        "context": "De EU-leiders bereikten een akkoord over een gemeenschappelijk defensiefonds. Impact op België en NAVO.",
    },
    "politiek": {
        "topic": "Federale coalitie bereikt akkoord over energiefactuur: wat verandert er voor de Belg?",
        "context": "De Arizona-coalitie heeft een compromis bereikt over de energiefactuur. Sociale tarieven, btw en accijnzen.",
    },
    "economie": {
        "topic": "Belgische huizenprijzen stijgen opnieuw: gemiddeld 285.000 euro voor een woning in Vlaanderen",
        "context": "Vastgoedcijfers Q4 2025. Regionale verschillen, impact rentestijging, vooruitzichten.",
    },
    "sport": {
        "topic": "Club Brugge stunt in Champions League: historische zege tegen AC Milan",
        "context": "Club Brugge wint in de Champions League. Tactische analyse, reacties, gevolgen voor Belgisch voetbal.",
    },
    "cultuur": {
        "topic": "Gentse Feesten 2026 onthullen programmatie: internationale headliners en vernieuwde festivalformule",
        "context": "Het grootste stadsfestival van Europa. Nieuwe locaties, ticketprijzen, bereikbaarheid.",
    },
    "wetenschap": {
        "topic": "Belgische onderzoekers maken doorbraak in alzheimertherapie: nieuwe behandeling vertraagt ziekte met 40 procent",
        "context": "VIB-KU Leuven onderzoek. Klinische trials, impact, tijdlijn voor beschikbaarheid.",
    },
    "opinie": {
        "topic": "Waarom België dringend moet investeren in kernenergie: een pleidooi voor realisme",
        "context": "Column over het energiedebat. Kernuitstap, hernieuwbare energie, betaalbaarheid, klimaat.",
    },
    "regionaal": {
        "topic": "Wateroverlast in Oost-Vlaanderen: Oudenaarde en Ronse zwaarst getroffen na noodweer",
        "context": "Lokaal noodweer, schade, hulpdiensten, evacuaties. Focus op Oudenaarde en omgeving.",
    },
}

SYSTEM = """Je bent een ervaren journalist bij Nieuwsland.be, een Belgisch nieuwsplatform.
Schrijf een COMPLEET, professioneel en SCANBAAR nieuwsartikel.

STRUCTUUR (verplicht):
- **Lead** (2-3 zinnen, vetgedrukt, vat de kern samen)
- **Kernpunten** (bullet list met 3-5 belangrijkste feiten)
- Meerdere korte paragrafen (MAX 3 zinnen per alinea)
- Minstens 2-3 tussenkoppen (## Subtitel)
- Minstens 1 bullet/opsommingslijst in de body
- 5-8x **vette tekst** voor scanbaarheid
- Eindig met ## Wat nu?
- Vermeld bronnen subtiel ("Volgens...", "Uit cijfers van... blijkt...")

REGELS:
- 500-800 woorden, VOLLEDIG afgemaakt
- Korte alinea's (MAX 3 zinnen)
- Belgisch perspectief
- Neutraal, feitelijk (behalve bij opinie)
- GEEN titel bovenaan
- GEEN metadata (TITEL:, TAGS:, etc)

OUTPUT: ALLEEN de artikeltekst met markdown opmaak."""

for cat_slug, info in CATEGORIES.items():
    print(f"\n📝 Schrijf artikel voor: {cat_slug}")
    
    prompt = f"""Schrijf een artikel over:
Titel: {info['topic']}
Context: {info['context']}
Categorie: {cat_slug}

Schrijf het artikel VOLLEDIG uit (500-800 woorden)."""
    
    content = llm_generate(prompt, model="google/gemini-2.5-flash", system=SYSTEM, max_tokens=3000, temperature=0.7)
    
    if not content:
        print(f"  ❌ LLM fout")
        continue
    
    # Clean
    content = content.strip()
    if content.startswith("#") or content.startswith("TITEL"):
        lines = content.split('\n', 1)
        if len(lines) > 1:
            content = lines[1].strip()
    
    word_count = len(content.split())
    print(f"  ✅ {word_count} woorden")
    
    # Generate excerpt
    clean_excerpt = content.replace('**', '').replace('*', '').replace('##', '').strip()[:200].rsplit(' ', 1)[0] + "..."
    
    # Publish to Supabase (with image generation)
    result = supabase_publish(
        title=info["topic"],
        content=content,
        category_slug=cat_slug,
        excerpt=clean_excerpt,
        status="published",
    )
    
    if result:
        print(f"  ✅ Published: ID {result['id']}, slug: {result['slug'][:50]}")
    else:
        print(f"  ❌ Publish failed")
    
    time.sleep(2)

print("\n🎉 Alle categorieën gevuld!")
