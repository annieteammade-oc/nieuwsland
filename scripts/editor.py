"""
Nieuwsland.be — Editor Agent (Hoofdredacteur)
Monitort #review-queue voor Dennis' reacties (✅/❌).
Bij ✅ → publiceert naar Supabase (live op nieuwsland.be).
Bij ❌ → leest feedback, laat herschrijven.
Draait via cron elke 15 minuten.
"""

import sys, os, json, time, re
sys.path.insert(0, os.path.dirname(__file__))
from utils import (
    discord_send, discord_get_messages, discord_request, log,
    llm_generate, supabase_publish, now_str, sheets_read, sheets_update,
    BOT_ID, CHANNELS
)

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

def get_wp_category_id(channel_or_category):
    """Get WordPress category ID from channel name or category slug"""
    if os.path.exists(WP_TAXONOMY_FILE):
        with open(WP_TAXONOMY_FILE) as f:
            data = json.load(f)
        cats = data.get("categories", {})
        slug = CHANNEL_TO_WP_CAT.get(channel_or_category, channel_or_category)
        return cats.get(slug)
    return None

def get_wp_tag_ids(tag_names):
    """Get WordPress tag IDs from tag names"""
    if not os.path.exists(WP_TAXONOMY_FILE):
        return []
    with open(WP_TAXONOMY_FILE) as f:
        data = json.load(f)
    tags = data.get("tags", {})
    ids = []
    for name in tag_names:
        slug = name.lower().strip().replace(" ", "-").replace("ë", "e").replace("ï", "i")
        if slug in tags:
            ids.append(tags[slug])
    return ids

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

def get_review_messages():
    """Get messages from #review-queue that have reactions OR text replies with ✅/❌"""
    messages = discord_get_messages("review-queue", limit=30)
    if not messages:
        return []
    
    reviewed = []
    processed = load_processed()
    
    # Build a map of bot review messages
    bot_reviews = {}
    human_replies = []
    
    for msg in messages:
        if msg["author"]["id"] == BOT_ID and "REVIEW NODIG" in msg.get("content", ""):
            bot_reviews[msg["id"]] = msg
        elif msg["author"]["id"] != BOT_ID:
            human_replies.append(msg)
    
    for msg_id, msg in bot_reviews.items():
        if msg_id in processed:
            continue
        
        approved = False
        rejected = False
        feedback_text = ""
        
        # Method 1: Check emoji reactions on the message
        reactions = msg.get("reactions", [])
        for r in reactions:
            emoji = r["emoji"]["name"]
            if r["count"] > 0:
                if emoji in ["✅", "👍", "white_check_mark"]:
                    approved = True
                elif emoji in ["❌", "👎", "x"]:
                    rejected = True
        
        # Method 2: Check text replies that reference this message
        for reply in human_replies:
            ref = reply.get("message_reference", {})
            if ref.get("message_id") == msg_id:
                content = reply["content"]
                if "✅" in content or "👍" in content:
                    approved = True
                if "❌" in content or "👎" in content:
                    rejected = True
                feedback_text += content + "\n"
        
        # Method 3: Check text messages right after bot message that contain ✅/❌
        # (Dennis might just type without replying)
        msg_timestamp = msg["timestamp"]
        for reply in human_replies:
            if reply.get("message_reference"):
                continue  # Already handled above
            reply_content = reply["content"]
            if "❌" in reply_content or "✅" in reply_content:
                # Check if this is close in time to the review
                if reply["timestamp"] > msg_timestamp:
                    if "✅" in reply_content:
                        approved = True
                    if "❌" in reply_content:
                        rejected = True
                    feedback_text += reply_content + "\n"
        
        if approved or rejected:
            reviewed.append({
                "message_id": msg_id,
                "content": msg["content"],
                "approved": approved and not rejected,
                "feedback": feedback_text.strip(),
            })
    
    return reviewed

def get_feedback_replies(message_id):
    """Check for reply messages with feedback after a ❌"""
    channel_id = CHANNELS["review-queue"]
    messages = discord_get_messages("review-queue", limit=30)
    if not messages:
        return ""
    
    feedback = []
    for msg in messages:
        # Check if it's a reply to our review message
        ref = msg.get("message_reference", {})
        if ref.get("message_id") == message_id:
            if msg["author"]["id"] != BOT_ID:  # Not from bot
                feedback.append(msg["content"])
        
        # Also check messages right after the review that aren't from bot
        # (Dennis might just type feedback without replying)
    
    return "\n".join(feedback)

def extract_article_from_review(content):
    """Extract article text and metadata from review message"""
    # Parse the review format
    title_match = re.search(r'TITEL:\s*(.+)', content)
    title = title_match.group(1).strip() if title_match else ""
    
    # If no TITEL format, try to extract from the topic line
    if not title:
        topic_match = re.search(r'\*\*Topic:\*\*\s*(.+)', content)
        title = topic_match.group(1).strip() if topic_match else "Untitled"
    
    # Extract category
    cat_match = re.search(r'—\s*(\w+)\s*artikel', content)
    category = cat_match.group(1).lower() if cat_match else "algemeen"
    
    # Extract the actual article (after the metadata block)
    parts = content.split("---")
    if len(parts) >= 2:
        article_body = parts[1].strip()
    else:
        # Just take everything after the metadata
        article_body = content
    
    return {
        "title": title,
        "category": category,
        "body": article_body,
        "full_content": content,
    }

def publish_to_wp(article_data):
    """Publish approved article to WordPress"""
    # Convert Discord markdown to HTML
    html = article_data["body"]
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    html = re.sub(r'^• (.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'(<li>.*</li>)', r'<ul>\1</ul>', html, flags=re.DOTALL)
    # Paragraphs
    paragraphs = html.split("\n\n")
    html = "\n".join([f"<p>{p.strip()}</p>" if not p.strip().startswith("<") else p for p in paragraphs if p.strip()])
    
    result = wp_publish(
        title=article_data["title"],
        content=html,
        status="draft",  # Start as draft, Dennis can publish from WP
    )
    
    return result

def rewrite_article(article_data, feedback):
    """Rewrite rejected article based on feedback"""
    system = """Je bent een ervaren journalist bij Nieuwsland.be.
Je herschrijft een afgekeurd artikel op basis van feedback van de hoofdredacteur.

REGELS:
- Verwerk ALLE feedback punten
- Behoud de kern van het verhaal
- Schrijf COMPLEET (400-800 woorden)
- Gebruik **vette tekst**, *cursief*, bullets
- Eindig het artikel VOLLEDIG (nooit halverwege stoppen)

OUTPUT: het volledige herschreven artikel, klaar voor publicatie."""

    prompt = f"""ORIGINEEL ARTIKEL:
{article_data['full_content'][:2000]}

FEEDBACK VAN REDACTEUR:
{feedback}

Herschrijf het artikel en verwerk alle feedback."""

    return llm_generate(prompt, model="google/gemini-2.5-flash", system=system, max_tokens=3000)

def handle_approval(review):
    """Handle an approved article — publish to Supabase"""
    article_data = extract_article_from_review(review["content"])
    
    # Map channel category to Supabase category slug
    cat_slug = CHANNEL_TO_WP_CAT.get(article_data["category"], article_data["category"])
    
    # Extract tags from review content
    tags_match = re.search(r'TAGS:\s*(.+)', review["content"])
    tag_names = [t.strip() for t in tags_match.group(1).split(",")] if tags_match else []
    
    # Extract source info
    source_match = re.search(r'Bron:\s*(.+)', review["content"])
    source_name = source_match.group(1).strip() if source_match else None
    
    # Publish to Supabase
    result = supabase_publish(
        title=article_data["title"],
        content=article_data["body"],
        category_slug=cat_slug,
        source_name=source_name,
        status="published",
    )
    
    if result and result.get("id"):
        article_url = f"https://nieuwsland.be/artikel/{result['slug']}"
        cat_name = cat_slug.upper()
        tags_str = ", ".join(tag_names) if tag_names else "geen"
        discord_send("review-queue", 
            f"✅ **GEPUBLICEERD** — {article_data['title']}\n"
            f"Supabase ID: {result['id']}\n"
            f"Categorie: {cat_name} | Tags: {tags_str}\n"
            f"Status: live op nieuwsland.be\n"
            f"URL: {article_url}")
        
        log("Editor", f"✅ Artikel gepubliceerd: {article_data['title']} (#{result['id']})")
        
        # Update Sheet status
        update_sheet_article_status(article_data["title"], "GEPUBLICEERD", article_url)
    else:
        discord_send("review-queue",
            f"⚠️ Publicatie mislukt voor: {article_data['title']}\n"
            f"Supabase API error — check #logs")
        log("Editor", f"❌ Publicatie mislukt: {article_data['title']}")

def handle_rejection(review):
    """Handle a rejected article — get feedback and rewrite"""
    article_data = extract_article_from_review(review["content"])
    feedback = get_feedback_replies(review["message_id"])
    
    if not feedback:
        # Check if feedback is in the same message as a reply
        discord_send("review-queue",
            f"❌ Artikel afgekeurd: **{article_data['title']}**\n"
            f"Geen feedback gevonden — geef feedback als reply op het review-bericht, "
            f"dan herschrijf ik het artikel.")
        log("Editor", f"❌ Afgekeurd zonder feedback: {article_data['title']}")
        return
    
    log("Editor", f"🔄 Herschrijven: {article_data['title']} (feedback: {feedback[:100]}...)")
    
    # Rewrite
    new_article = rewrite_article(article_data, feedback)
    
    if new_article:
        # Post rewritten version — metadata as message, full article as file
        review_header = (
            f"📋 **HERSCHREVEN — REVIEW NODIG** — {article_data['category'].upper()}\n\n"
            f"**Topic:** {article_data['title']}\n"
            f"**Verwerkte feedback:** {feedback[:200]}\n\n"
            f"---\n"
            f"✅ = Goedkeuren & publiceren\n"
            f"❌ = Nogmaals afwijzen (geef feedback als reply)"
        )
        
        discord_send("review-queue", review_header, file_content=new_article, filename=f"herschreven-{article_data['category']}.txt")
        log("Editor", f"🔄 Herschreven artikel gepost: {article_data['title']}")
    else:
        discord_send("review-queue", f"⚠️ Herschrijven mislukt voor: {article_data['title']}")

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

def run():
    """Main editor run"""
    print(f"[{now_str()}] Editor agent gestart")
    
    reviews = get_review_messages()
    
    if not reviews:
        print("Geen nieuwe reviews gevonden")
        return
    
    processed = load_processed()
    
    for review in reviews:
        if review["approved"]:
            print(f"✅ Goedgekeurd: {review['message_id']}")
            handle_approval(review)
        else:
            print(f"❌ Afgekeurd: {review['message_id']}")
            handle_rejection(review)
        
        # Mark as processed
        processed.append(review["message_id"])
        time.sleep(2)
    
    save_processed(processed)
    print(f"Editor klaar: {len(reviews)} reviews verwerkt")

if __name__ == "__main__":
    run()
