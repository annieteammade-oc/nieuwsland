"""
Nieuwsland.be — Editor Agent (Autonome Hoofdredacteur)
Monitort #review-queue voor nieuwe artikelen.
Doet een AI quality check en publiceert automatisch naar Supabase.
Geen handmatige goedkeuring nodig — volledig autonoom.
Draait via cron elke 15 minuten.
"""

import sys, os, json, time, re
sys.path.insert(0, os.path.dirname(__file__))
from utils import (
    discord_send, discord_get_messages, discord_request, log,
    llm_generate, supabase_publish, now_str, sheets_read, sheets_update,
    BOT_ID, CHANNELS
)
from quality_gate import run_quality_gate

SHEET_ID_FILE = os.path.join(os.path.dirname(__file__), "sheet-id.json")
PROCESSED_REVIEWS_FILE = os.path.join(os.path.dirname(__file__), "processed-reviews.json")
WP_TAXONOMY_FILE = os.path.join(os.path.dirname(__file__), "wp-taxonomy-ids.json")

# Discord channel name → WP category slug mapping
CHANNEL_TO_WP_CAT = {
    "belgium": "belgie", "world": "wereld", "politics": "politiek",
    "economy": "economie", "sport": "sport", "tech": "tech",
    "culture": "cultuur", "science": "wetenschap", "opinion": "opinie",
    "regional": "regionaal",
}

def get_sheet_id():
    if os.path.exists(SHEET_ID_FILE):
        with open(SHEET_ID_FILE) as f:
            return json.load(f).get("id")
    return None

def load_processed():
    if os.path.exists(PROCESSED_REVIEWS_FILE):
        with open(PROCESSED_REVIEWS_FILE) as f:
            return json.load(f)
    return []

def save_processed(processed):
    with open(PROCESSED_REVIEWS_FILE, "w") as f:
        json.dump(processed, f)

def get_pending_reviews():
    """Get bot messages from #review-queue that haven't been processed yet"""
    messages = discord_get_messages("review-queue", limit=30)
    if not messages:
        return []
    
    processed = load_processed()
    pending = []
    
    for msg in messages:
        if msg["author"]["id"] == BOT_ID and "REVIEW NODIG" in msg.get("content", ""):
            if msg["id"] not in processed:
                pending.append({
                    "message_id": msg["id"],
                    "content": msg["content"],
                    "attachments": msg.get("attachments", []),
                })
    
    return pending

def download_attachment_text(attachments):
    """Download the .txt attachment and return its content."""
    for att in attachments:
        if att.get("filename", "").endswith(".txt"):
            try:
                import urllib.request, ssl
                ctx = ssl.create_default_context()
                req = urllib.request.Request(att["url"], headers={"User-Agent": "Nieuwsland/1.0"})
                resp = urllib.request.urlopen(req, context=ctx, timeout=15)
                return resp.read().decode("utf-8", errors="replace")
            except Exception as e:
                print(f"Attachment download error: {e}")
                return None
    return None

def extract_article_from_review(content):
    """Extract article text and metadata from review message"""
    title_match = re.search(r'TITEL:\s*(.+)', content)
    title = title_match.group(1).strip() if title_match else ""
    
    if not title:
        topic_match = re.search(r'\*\*Topic:\*\*\s*(.+)', content)
        title = topic_match.group(1).strip() if topic_match else "Untitled"
    
    cat_match = re.search(r'—\s*(\w+)\s*artikel', content)
    category = cat_match.group(1).lower() if cat_match else "algemeen"
    
    tags_match = re.search(r'TAGS:\s*(.+)', content)
    tags = [t.strip() for t in tags_match.group(1).split(",")] if tags_match else []
    
    source_match = re.search(r'Bron:\s*(.+)', content)
    source = source_match.group(1).strip() if source_match else None
    
    # Extract body (after ---)
    parts = content.split("---")
    body = parts[1].strip() if len(parts) >= 2 else content
    
    return {
        "title": title,
        "category": category,
        "tags": tags,
        "source": source,
        "body": body,
        "full_content": content,
    }

def ai_editorial_check(title, article_text):
    """AI-powered editorial quality check — returns pass/fail + reasoning"""
    system = """Je bent de hoofdredacteur van Nieuwsland.be. Je beoordeelt artikelen voor publicatie.

CHECK OP:
1. Is het artikel in correct Nederlands geschreven?
2. Is het informatief en feitelijk? (geen hallucinaties, geen vage claims)
3. Is de structuur goed? (lead, tussenkopjes, bullets, conclusie)
4. Is de titel pakkend maar niet clickbait?
5. Is het artikel compleet (niet halverwege afgebroken)?
6. Geen metadata-lekkage (TITEL:, TAGS:, REVIEW NODIG, etc. in de body)?

ANTWOORD IN JSON:
{"pass": true/false, "score": 1-10, "issues": ["issue1", "issue2"], "reason": "korte samenvatting"}

Wees streng maar redelijk. Score 6+ = publiceren. Onder 6 = afwijzen."""

    prompt = f"TITEL: {title}\n\nARTIKEL:\n{article_text[:3000]}"
    
    result = llm_generate(prompt, model="google/gemini-2.5-flash", system=system, max_tokens=500, temperature=0.3)
    
    if not result:
        # Fallback: publish anyway (don't block pipeline)
        return {"pass": True, "score": 7, "issues": [], "reason": "AI check niet beschikbaar — fallback approve"}
    
    try:
        # Extract JSON from response
        json_match = re.search(r'\{[^}]+\}', result, re.DOTALL)
        if json_match:
            parsed = json.loads(json_match.group())
            return parsed
    except (json.JSONDecodeError, AttributeError):
        pass
    
    # Fallback: publish anyway
    return {"pass": True, "score": 7, "issues": [], "reason": "AI response niet parseable — fallback approve"}

VALID_CATEGORIES = ["belgie", "wereld", "politiek", "economie", "sport", "tech", "cultuur", "wetenschap", "opinie", "regionaal"]

def reclassify_category(title, body, current_category):
    """Use AI to assign the best category based on article content, not just source feed."""
    cat_slug = CHANNEL_TO_WP_CAT.get(current_category, current_category)
    
    system = """Je bent de categoriseerder van Nieuwsland.be.
Bepaal de BESTE categorie voor dit artikel op basis van de inhoud (niet de bron).

CATEGORIEËN: belgie, wereld, politiek, economie, sport, tech, cultuur, wetenschap, opinie, regionaal

REGELS:
- "belgie" is ALLEEN voor algemeen Belgisch nieuws dat niet in een andere categorie past
- Politieke artikelen over België → "politiek" (niet "belgie")
- Economische artikelen over België → "economie" (niet "belgie")
- Sport in België → "sport" (niet "belgie")
- Artikelen over andere landen → "wereld"
- Bij twijfel: kies de meest specifieke categorie

ANTWOORD: alleen de categorie-slug, niets anders."""

    prompt = f"Huidige categorie: {cat_slug}\nTitel: {title}\nArtikel (eerste 500 tekens): {body[:500]}"
    
    result = llm_generate(prompt, model="google/gemini-2.5-flash", system=system, max_tokens=30, temperature=0.1)
    
    if result:
        new_cat = result.strip().lower().replace('"', '').replace("'", "")
        if new_cat in VALID_CATEGORIES:
            if new_cat != cat_slug:
                print(f"  Recategorized: {cat_slug} → {new_cat} ({title[:50]})")
            return new_cat
    
    return cat_slug

def publish_article(article_data):
    """Publish approved article to Supabase"""
    # Re-classify category based on content instead of blindly trusting source feed
    cat_slug = reclassify_category(
        article_data["title"],
        article_data["body"],
        article_data["category"]
    )
    
    result = supabase_publish(
        title=article_data["title"],
        content=article_data["body"],
        category_slug=cat_slug,
        source_name=article_data.get("source"),
        status="published",
    )
    
    return result

def update_sheet_article_status(title, status, url=""):
    """Update article status in Sheet by matching title"""
    sheet_id = get_sheet_id()
    if not sheet_id:
        return
    
    rows = sheets_read(sheet_id, "Topics!A:J")
    for i, row in enumerate(rows):
        if len(row) > 3 and row[3] == title:
            sheets_update(sheet_id, f"Topics!H{i+1}:J{i+1}", [[status, "", url]])
            break

def handle_article(review):
    """Process a single article: quality check + auto-publish"""
    article_data = extract_article_from_review(review["content"])
    
    # Download actual article body from .txt attachment
    attachment_text = download_attachment_text(review.get("attachments", []))
    if attachment_text and len(attachment_text) > 100:
        article_data["body"] = attachment_text
    
    # Step 1: Run code-based quality gate
    qg_result = run_quality_gate(article_data["title"], article_data["body"])
    
    if not qg_result["pass"]:
        issues = ", ".join(qg_result["issues"])
        discord_send("review-queue",
            f"🚫 **AUTO-REJECT** — {article_data['title']}\n"
            f"Quality gate gefaald: {issues}\n"
            f"Artikel wordt NIET gepubliceerd.")
        log("Editor", f"🚫 Auto-reject: {article_data['title']} — {issues}")
        update_sheet_article_status(article_data["title"], "AFGEKEURD")
        return False
    
    # Step 2: AI editorial check
    ai_check = ai_editorial_check(article_data["title"], article_data["body"])
    
    if not ai_check.get("pass", True) and ai_check.get("score", 7) < 4:
        reason = ai_check.get("reason", "kwaliteit onvoldoende")
        discord_send("review-queue",
            f"🚫 **AUTO-REJECT** — {article_data['title']}\n"
            f"Score: {ai_check.get('score', '?')}/10 — {reason}\n"
            f"Issues: {', '.join(ai_check.get('issues', []))}")
        log("Editor", f"🚫 AI reject: {article_data['title']} — score {ai_check.get('score')}")
        update_sheet_article_status(article_data["title"], "AFGEKEURD")
        return False
    
    # Step 3: Publish!
    result = publish_article(article_data)
    
    if result and result.get("id"):
        article_url = f"https://nieuwsland.be/artikel/{result['slug']}"
        cat_name = article_data["category"].upper()
        tags_str = ", ".join(article_data.get("tags", [])) or "geen"
        score = ai_check.get("score", "?")
        
        discord_send("review-queue",
            f"✅ **AUTO-GEPUBLICEERD** — {article_data['title']}\n"
            f"AI Score: {score}/10 | Categorie: {cat_name} | Tags: {tags_str}\n"
            f"URL: {article_url}")
        
        log("Editor", f"✅ Auto-gepubliceerd: {article_data['title']} (score {score}/10, #{result['id']})")
        update_sheet_article_status(article_data["title"], "GEPUBLICEERD", article_url)
        return True
    else:
        discord_send("review-queue",
            f"⚠️ Publicatie mislukt voor: {article_data['title']}\n"
            f"Supabase API error — check #logs")
        log("Editor", f"❌ Publicatie mislukt: {article_data['title']}")
        return False

def run():
    """Main editor run — auto-process all pending reviews"""
    print(f"[{now_str()}] Editor agent gestart (AUTONOOM)")
    
    pending = get_pending_reviews()
    
    if not pending:
        print("Geen nieuwe artikelen in review-queue")
        return
    
    processed = load_processed()
    published = 0
    rejected = 0
    
    for review in pending:
        success = handle_article(review)
        if success:
            published += 1
        else:
            rejected += 1
        
        processed.append(review["message_id"])
        time.sleep(2)
    
    save_processed(processed)
    
    total = published + rejected
    print(f"Editor klaar: {published} gepubliceerd, {rejected} afgekeurd (van {total} artikelen)")
    if published > 0:
        log("Editor", f"📊 Batch klaar: {published} gepubliceerd, {rejected} afgekeurd")

if __name__ == "__main__":
    run()
