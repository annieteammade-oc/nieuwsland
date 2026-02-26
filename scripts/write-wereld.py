import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from utils import llm_generate, supabase_publish

SYSTEM = """Je bent journalist bij Nieuwsland.be. Schrijf een COMPLEET artikel (500-700 woorden).
VERPLICHT: korte alinea's (MAX 3 zinnen per paragraaf, gescheiden door dubbele newline), ## subtitels, bullet lists, **bold**.
Gebruik VEEL dubbele newlines tussen alinea's. Elke paragraaf MAX 3 zinnen. GEEN titel bovenaan. GEEN metadata."""

content = llm_generate(
    "Schrijf een artikel: EU bereikt historisch akkoord over defensiebudget: 150 miljard euro. Impact op België, NAVO, veiligheidsbeleid. Kort en scanbaar.",
    model="google/gemini-2.5-flash", system=SYSTEM, max_tokens=3000, temperature=0.7)
if content:
    excerpt = content.replace("**","").replace("##","")[:200].rsplit(" ",1)[0] + "..."
    r = supabase_publish("EU bereikt historisch akkoord over defensiebudget: 150 miljard euro voor Europese veiligheid",
        content, "wereld", excerpt=excerpt, status="published", skip_quality_gate=True)
    if r:
        print(f"Published: ID {r['id']}")
    else:
        print("Failed")
else:
    print("LLM failed")
