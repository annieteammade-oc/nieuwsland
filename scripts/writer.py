"""
Nieuwsland.be — Writer Agent
Pakt een topic uit de Sheet (status=NIEUW, score>=4), schrijft een volledig artikel,
post in Discord #categorie + #review-queue.
Draait via cron elke 4 uur.
"""

import sys, os, json, re, time
sys.path.insert(0, os.path.dirname(__file__))
from utils import (
    discord_send, log, llm_generate, sheets_read, sheets_update,
    now_str, hash_url
)
from quality_gate import run_quality_gate

SHEET_ID_FILE = os.path.join(os.path.dirname(__file__), "sheet-id.json")
ARTICLES_FILE = os.path.join(os.path.dirname(__file__), "articles-written.json")

# Models per category (Dennis's choices + defaults)
CATEGORY_MODELS = {
    "tech": "google/gemini-2.5-flash",
    "belgium": "google/gemini-2.5-flash",
    "sport": "google/gemini-2.5-flash",
    "world": "google/gemini-2.5-flash",
    "science": "google/gemini-2.5-flash",
    "economy": "google/gemini-2.5-flash",
    "politics": "google/gemini-2.5-flash",
    "culture": "google/gemini-2.5-flash",
    "regional": "google/gemini-2.5-flash",
}

def get_sheet_id():
    if os.path.exists(SHEET_ID_FILE):
        with open(SHEET_ID_FILE) as f:
            return json.load(f).get("id")
    return None

def load_articles():
    if os.path.exists(ARTICLES_FILE):
        with open(ARTICLES_FILE) as f:
            return json.load(f)
    return []

def save_article(article):
    articles = load_articles()
    articles.append(article)
    with open(ARTICLES_FILE, "w") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)

def fetch_source(url):
    """Fetch source article text for rewriting"""
    import urllib.request, ssl
    ctx = ssl.create_default_context()
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"})
        resp = urllib.request.urlopen(req, context=ctx, timeout=15)
        html = resp.read().decode("utf-8", errors="replace")
        # Strip HTML tags (basic)
        text = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL)
        text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
        text = re.sub(r'<[^>]+>', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text[:5000]  # Max 5000 chars to save tokens
    except Exception as e:
        print(f"Fetch error for {url}: {e}")
        return None

def pick_topic():
    """Pick best available topic from Sheet (NIEUW, highest score)"""
    sheet_id = get_sheet_id()
    if not sheet_id:
        print("No Sheet ID")
        return None, None
    
    rows = sheets_read(sheet_id, "Topics!A:J")
    if not rows:
        return None, None
    
    # Find best NIEUW topic (highest score first)
    best = None
    best_row = None
    for i, row in enumerate(rows):
        if len(row) < 8:
            continue
        status = row[7] if len(row) > 7 else ""
        if status != "NIEUW":
            continue
        score = int(row[5]) if len(row) > 5 and row[5].isdigit() else 3
        if best is None or score > best.get("score", 0):
            best = {
                "row_index": i + 1,  # 1-indexed for Sheets
                "found_at": row[0],
                "category": row[1],
                "source": row[2],
                "title": row[3],
                "link": row[4],
                "score": score,
                "reden": row[6] if len(row) > 6 else "",
            }
            best_row = i + 1
    
    return best, best_row

def write_article(topic):
    """Write a full article based on topic"""
    # Fetch source for context
    source_text = fetch_source(topic["link"])
    source_context = f"\n\nBrontekst (ter referentie):\n{source_text}" if source_text else ""
    
    model = CATEGORY_MODELS.get(topic["category"], "google/gemini-2.5-flash")
    
    system = """Je bent een ervaren journalist bij Nieuwsland.be, een Belgische nieuwssite.
Je schrijft in het Nederlands, gericht op een Belgisch publiek.

STRUCTUUR (verplicht):
- **Lead** (2-3 zinnen, vetgedrukt intro die de kern samenvat)
- **Kernpunten** (bullet list met 3-5 belangrijkste feiten)
- Meerdere korte paragrafen (MAX 3 zinnen per alinea)
- Minstens 2-3 tussenkoppen (## Subtitel)
- Minstens 1 bullet/opsommingslijst in de body
- 5-8x **vette tekst** voor scanbaarheid
- Eindig met ## Wat nu? of ## Vooruitblik

REGELS:
- De lead MOET de 5 W's beantwoorden: Wie, Wat, Waar, Wanneer, Waarom/Hoe
- Ontbrekende kerninfo (datums, namen, locaties) ALTIJD opzoeken in de bron — NOOIT weglaten
- Schrijf een COMPLEET artikel (400-800 woorden)
- Korte alinea's (MAX 3 zinnen, NOOIT een wall of text)
- Wissel af: paragraaf → subtitel → bullets → paragraaf → quote
- Gebruik **vette tekst** voor belangrijke termen
- Gebruik bullets (•) waar nuttig
- Begin met een pakkende intro (2-3 zinnen)
- Eindig met een conclusie of vooruitblik
- Schrijf in een toegankelijke, journalistieke stijl
- HERSCHRIJF volledig — NOOIT copy-paste van bron
- Vermeld de bron subtiel in het artikel
- Voeg suggesties toe voor een passende afbeelding (beschrijving)

OUTPUT FORMAT (exact):
TITEL: [pakkende titel]
SUBTITEL: [korte subtitel]
TAGS: [tag1, tag2, tag3]
AFBEELDING: [beschrijving van gewenste header afbeelding]

---

[artikel tekst met **bold**, *cursief*, bullets etc.]

---

*Bron: [bronvermelding]*"""

    prompt = f"""Schrijf een artikel over dit onderwerp:

Titel: {topic['title']}
Categorie: {topic['category']}
Bron: {topic['source']}
URL: {topic['link']}{source_context}"""

    result = llm_generate(prompt, model=model, system=system, max_tokens=3000, temperature=0.7)
    return result

def post_to_discord(topic, article_text, quality_issues=None):
    """Post article to category channel + review-queue with full article as file"""
    category = topic["category"]
    
    # Post in category channel — full article (discord_send auto-splits if >2000)
    discord_send(category, f"📝 **Nieuw artikel geschreven**\n\n{article_text}")
    
    time.sleep(1)
    
    # Parse metadata from article text
    import re as _re
    titel_m = _re.search(r'TITEL:\s*(.+)', article_text)
    subtitel_m = _re.search(r'SUBTITEL:\s*(.+)', article_text)
    tags_m = _re.search(r'TAGS:\s*(.+)', article_text)
    afbeelding_m = _re.search(r'AFBEELDING:\s*(.+)', article_text)
    
    titel = titel_m.group(1).strip() if titel_m else topic['title']
    subtitel = subtitel_m.group(1).strip() if subtitel_m else ""
    tags = tags_m.group(1).strip() if tags_m else ""
    afbeelding = afbeelding_m.group(1).strip() if afbeelding_m else ""
    
    # Quality warning if issues remain
    quality_warning = ""
    if quality_issues:
        issues_list = "\n".join(f"  • {issue}" for issue in quality_issues)
        quality_warning = (
            f"\n⚠️ **QUALITY GATE GEFAALD** (na 2 auto-rewrites):\n"
            f"{issues_list}\n"
            f"👉 Extra aandacht nodig bij review!\n"
        )
    
    # Review-queue: metadata as message, full article as .txt attachment
    review_header = (
        f"📋 REVIEW NODIG — {category.upper()} artikel\n"
        f"Topic: {topic['title']}\n"
        f"Bron: {topic['source']}\n"
        f"Score: {'⭐️' * topic.get('score', 3)}\n"
        f"TITEL: {titel}\n"
        f"SUBTITEL: {subtitel}\n"
        f"TAGS: {tags}\n"
        f"AFBEELDING: {afbeelding}\n"
        f"{quality_warning}\n"
        f"---\n"
        f"✅ = Goedkeuren & publiceren op Nieuwsland.be\n"
        f"❌ = Afwijzen (geef feedback als reply)"
    )
    
    result = discord_send("review-queue", review_header,
                         file_content=article_text,
                         filename=f"artikel-{category}-{hash_url(topic['link'])}.txt")
    return result

def update_sheet_status(row_index, status, writer="Writer Agent"):
    """Update topic status in Sheet"""
    sheet_id = get_sheet_id()
    if not sheet_id:
        return
    sheets_update(sheet_id, f"Topics!H{row_index}:I{row_index}", [[status, writer]])

def run(max_articles=2):
    """Main writer run — pick topics and write articles"""
    print(f"[{now_str()}] Writer agent gestart")
    log("Writer", "📝 Writer agent gestart — zoek topics om te schrijven")
    
    written = 0
    for _ in range(max_articles):
        topic, row_index = pick_topic()
        if not topic:
            print("Geen topics beschikbaar")
            break
        
        print(f"Schrijf artikel over: {topic['title']}")
        
        # Mark as IN_PROGRESS
        if row_index:
            update_sheet_status(row_index, "SCHRIJVEN")
        
        # Write article
        article = write_article(topic)
        if not article:
            print(f"Artikel schrijven mislukt voor: {topic['title']}")
            if row_index:
                update_sheet_status(row_index, "MISLUKT")
            continue
        
        # Quality gate check with auto-rewrite loop (max 2 retries)
        MAX_RETRIES = 2
        titel_match = re.search(r'TITEL:\s*(.+)', article)
        parsed_title = titel_match.group(1).strip() if titel_match else topic['title']
        
        qg_result = run_quality_gate(parsed_title, article)
        retry_count = 0
        
        while not qg_result["pass"] and retry_count < MAX_RETRIES:
            retry_count += 1
            issues_text = "\n".join(f"- {issue}" for issue in qg_result["issues"])
            print(f"Quality gate FAIL (poging {retry_count}/{MAX_RETRIES}): {qg_result['issues']}")
            log("Writer", f"🔄 Quality gate gefaald voor **{topic['title']}** — auto-rewrite poging {retry_count}/{MAX_RETRIES}")
            
            model = CATEGORY_MODELS.get(topic["category"], "google/gemini-2.5-flash")
            rewrite_prompt = f"""Je vorige versie van dit artikel had kwaliteitsproblemen. Herschrijf het artikel en los ALLE issues op.

PROBLEMEN:
{issues_text}

VORIG ARTIKEL:
{article}

Schrijf een verbeterde versie. Zelfde OUTPUT FORMAT (TITEL/SUBTITEL/TAGS/AFBEELDING + artikel). Los alle bovenstaande problemen op."""

            rewrite_system = """Je bent een ervaren journalist bij Nieuwsland.be. Je herschrijft een artikel om kwaliteitsproblemen op te lossen.
Zorg voor: korte alinea's (max 3 zinnen), minstens 2-3 subtitels (##), minstens 1 bullet lijst, 5-8x **vette tekst**, een lead die de 5 W's beantwoordt.
Schrijf 400-800 woorden. Eindig met ## Wat nu? of ## Vooruitblik."""

            article = llm_generate(rewrite_prompt, model=model, system=rewrite_system, max_tokens=3000, temperature=0.7)
            if not article:
                print("Rewrite mislukt, gebruik vorige versie")
                break
            
            titel_match = re.search(r'TITEL:\s*(.+)', article)
            parsed_title = titel_match.group(1).strip() if titel_match else topic['title']
            qg_result = run_quality_gate(parsed_title, article)
        
        quality_passed = qg_result["pass"]
        remaining_issues = qg_result["issues"] if not quality_passed else []
        
        if quality_passed:
            print(f"Quality gate PASS{' (na ' + str(retry_count) + ' rewrite(s))' if retry_count > 0 else ''}")
            log("Writer", f"✅ Quality gate passed voor **{topic['title']}**{' na ' + str(retry_count) + ' rewrite(s)' if retry_count > 0 else ''}")
        else:
            print(f"Quality gate FAIL na {retry_count} retries — post met waarschuwing")
            log("Writer", f"⚠️ Quality gate gefaald na {retry_count} retries voor **{topic['title']}** — issues: {', '.join(remaining_issues)}")
        
        # Post to Discord (with warning if quality gate failed)
        result = post_to_discord(topic, article, quality_issues=remaining_issues)
        
        # Update Sheet
        if row_index:
            update_sheet_status(row_index, "REVIEW")
        
        # Save locally
        save_article({
            "topic": topic,
            "article": article[:500] + "...",
            "discord_msg_id": result.get("id") if result else None,
            "written_at": now_str(),
            "status": "REVIEW",
        })
        
        written += 1
        log("Writer", f"✅ Artikel geschreven: **{topic['title']}** → #review-queue")
        
        time.sleep(2)  # Rate limit
    
    if written == 0:
        log("Writer", "ℹ️ Geen nieuwe topics om over te schrijven")
    else:
        log("Writer", f"✅ {written} artikel(en) geschreven en naar review gestuurd")
    
    print(f"Writer klaar: {written} artikelen geschreven")

if __name__ == "__main__":
    run()
