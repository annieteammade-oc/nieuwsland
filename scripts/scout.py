"""
Nieuwsland.be — Scout Agent
Scant RSS feeds per categorie, vindt nieuwe topics, plaatst ze in Google Sheet + Discord.
Draait via cron elke 2 uur.
"""

import sys, os, json, time
from datetime import datetime
sys.path.insert(0, os.path.dirname(__file__))
from utils import (
    parse_rss, RSS_FEEDS, discord_send, log, is_processed, mark_processed,
    sheets_append, sheets_read, sheets_update, create_spreadsheet,
    hash_url, now_str, llm_generate
)

# Sheet ID wordt opgeslagen na eerste run
SHEET_ID_FILE = os.path.join(os.path.dirname(__file__), "sheet-id.json")

def get_sheet_id():
    if os.path.exists(SHEET_ID_FILE):
        with open(SHEET_ID_FILE) as f:
            return json.load(f).get("id")
    return None


def save_sheet_id(sheet_id):
    with open(SHEET_ID_FILE, "w") as f:
        json.dump({
            "id": sheet_id,
            "url": f"https://docs.google.com/spreadsheets/d/{sheet_id}"
        }, f, indent=2)

def backup_topics_locally(topics):
    """Fallback when Google Sheets is unavailable: write topics to local JSONL backup."""
    backup_dir = os.path.join(os.path.dirname(__file__), "fallback")
    os.makedirs(backup_dir, exist_ok=True)
    backup_file = os.path.join(backup_dir, f"topics-failed-sheet-{datetime.now().strftime('%Y%m%d')}.jsonl")

    with open(backup_file, "a", encoding="utf-8") as f:
        for t in topics:
            f.write(json.dumps(t, ensure_ascii=False) + "\n")

    return backup_file

def scout_category(category, feeds):
    """Scan feeds for a category and return new topics"""
    new_topics = []
    
    for source_name, feed_url in feeds:
        items = parse_rss(feed_url, max_items=8)
        for item in items:
            if not item["link"] or is_processed(item["link"]):
                continue
            
            new_topics.append({
                "category": category,
                "source": source_name,
                "title": item["title"],
                "link": item["link"],
                "summary": item["summary"][:300],
                "found_at": now_str(),
            })
            mark_processed(item["link"])
    
    return new_topics

def deduplicate_against_published(topics):
    """Remove topics that overlap with recently published articles in Supabase.
    Uses fuzzy keyword matching first, then LLM for borderline cases."""
    from utils import supabase_request
    from datetime import datetime, timedelta, timezone
    
    if not topics:
        return topics
    
    seven_days_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    
    try:
        recent = supabase_request(
            "GET",
            "articles",
            params=f"?status=eq.published&created_at=gte.{seven_days_ago}&select=id,title&order=created_at.desc&limit=100"
        )
    except Exception as e:
        print(f"Dedup check failed ({e}), keeping all topics")
        return topics
    
    if not recent:
        return topics
    
    # Build keyword sets for published articles
    def key_terms(s):
        stop = {'deze','voor','door','maar','niet','over','naar','werd','heeft','zijn','haar',
                'jaar','week','meer','alle','moet','gaat','ziet','komt','wordt','kunnen',
                'alleen','eigen','eerste','nieuwe','belgische','vlaamse'}
        words = ''.join(c if c.isalnum() or c == ' ' else ' ' for c in s.lower()).split()
        return set(w for w in words if len(w) > 3 and w not in stop)
    
    published_terms = [(a['title'], key_terms(a['title'])) for a in recent]
    
    filtered = []
    for topic in topics:
        topic_terms = key_terms(topic['title'])
        if not topic_terms:
            filtered.append(topic)
            continue
        
        is_duplicate = False
        for pub_title, pub_terms in published_terms:
            if not pub_terms:
                continue
            overlap = topic_terms & pub_terms
            similarity = len(overlap) / min(len(topic_terms), len(pub_terms))
            if similarity >= 0.5:
                print(f"  SCOUT DEDUP: '{topic['title']}' overlapt met '{pub_title}' ({similarity:.0%}) → SKIP")
                is_duplicate = True
                break
        
        if not is_duplicate:
            filtered.append(topic)
    
    removed = len(topics) - len(filtered)
    if removed > 0:
        print(f"Scout dedup: {removed} topics verwijderd (al gepubliceerd)")
    
    return filtered


def deduplicate_within_batch(topics):
    """Remove duplicate topics within the same scout batch (different sources, same story)."""
    if len(topics) <= 1:
        return topics
    
    def key_terms(s):
        stop = {'deze','voor','door','maar','niet','over','naar','werd','heeft','zijn','haar',
                'jaar','week','meer','alle','moet','gaat','ziet','komt','wordt','kunnen',
                'alleen','eigen','eerste','nieuwe','belgische','vlaamse'}
        words = ''.join(c if c.isalnum() or c == ' ' else ' ' for c in s.lower()).split()
        return set(w for w in words if len(w) > 3 and w not in stop)
    
    kept = []
    used = set()
    
    for i, topic in enumerate(topics):
        if i in used:
            continue
        t1 = key_terms(topic['title'])
        if not t1:
            kept.append(topic)
            continue
        
        # Keep the one with highest score in case of duplicates within batch
        best = topic
        for j in range(i + 1, len(topics)):
            if j in used:
                continue
            t2 = key_terms(topics[j]['title'])
            if not t2:
                continue
            overlap = t1 & t2
            similarity = len(overlap) / min(len(t1), len(t2))
            if similarity >= 0.5:
                used.add(j)
                print(f"  BATCH DEDUP: '{topics[j]['title']}' merged with '{best['title']}'")
                if topics[j].get('score', 3) > best.get('score', 3):
                    best = topics[j]
        
        kept.append(best)
    
    removed = len(topics) - len(kept)
    if removed > 0:
        print(f"Batch dedup: {removed} duplicate topics binnen batch verwijderd")
    
    return kept


def rate_topics(topics):
    """Use LLM to rate topic relevance for Belgian audience (token-efficient)"""
    if not topics:
        return topics
    
    # Batch rate - send all titles at once
    titles = "\n".join([f"{i+1}. [{t['category']}] {t['title']} ({t['source']})" for i, t in enumerate(topics)])
    
    prompt = f"""Je bent de scout van nieuwsland.be, een Belgische nieuwssite.
Beoordeel deze {len(topics)} artikelen op relevantie voor een Belgisch publiek.
Geef per artikel een score 1-5 (5=zeer relevant) en een korte reden (max 10 woorden).

Artikelen:
{titles}

Antwoord als JSON array: [{{"nr": 1, "score": 4, "reden": "..."}}, ...]
Alleen de JSON, niets anders."""

    result = llm_generate(prompt, model="google/gemini-2.5-flash", max_tokens=2000, temperature=0.3)
    
    if result:
        try:
            # Clean up response
            result = result.strip()
            if result.startswith("```"):
                result = result.split("\n", 1)[1].rsplit("```", 1)[0]
            # Try to extract JSON array even if response is truncated
            if "[" in result:
                start = result.index("[")
                end = result.rfind("]")
                if end > start:
                    result = result[start:end+1]
                else:
                    # Truncated: try to close open objects and array
                    partial = result[start:]
                    # Remove trailing incomplete object
                    last_complete = partial.rfind("},")
                    if last_complete > 0:
                        result = partial[:last_complete+1] + "]"
                    else:
                        result = partial.rsplit("{", 1)[0].rstrip(", ") + "]"
            ratings = json.loads(result)
            for r in ratings:
                idx = r["nr"] - 1
                if 0 <= idx < len(topics):
                    topics[idx]["score"] = r.get("score", 3)
                    topics[idx]["reden"] = r.get("reden", "")
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Rating parse error: {e}")
            for t in topics:
                t["score"] = 3
                t["reden"] = "auto"
    
    return topics

def post_to_sheet(topics):
    """Add new topics to Google Sheet. Auto-recovers by creating a new sheet when access is lost."""
    sheet_id = get_sheet_id()

    rows = []
    for t in topics:
        rows.append([
            t["found_at"],
            t["category"],
            t["source"],
            t["title"],
            t["link"],
            str(t.get("score", 3)),
            t.get("reden", ""),
            "NIEUW",  # status
            "",  # writer
            "",  # article_url
        ])

    if not rows:
        return

    def _append_or_none(target_sheet_id):
        if not target_sheet_id:
            return None
        try:
            return sheets_append(target_sheet_id, "Topics", rows)
        except RuntimeError as e:
            print(f"⚠️ Sheet append runtime error: {e}")
            return None

    # First try configured sheet
    result = _append_or_none(sheet_id)
    if result:
        return

    # Recovery path: create a fresh spreadsheet under current credentials
    print("Waarschuwing: bestaande Google Sheet niet schrijfbaar. Maak automatisch een nieuwe sheet aan...")
    new_sheet_id = create_spreadsheet(f"Nieuwsland Topics {now_str()}")
    if not new_sheet_id:
        backup_file = backup_topics_locally(topics)
        log("Scout", f"⚠️ Sheet update mislukt: geen toegang tot bestaande sheet en nieuwe sheet aanmaken faalde. Lokale backup: {backup_file}")
        return

    # Add headers on Topics tab
    headers = [[
        "found_at", "category", "source", "title", "link", "score", "reden", "status", "writer", "article_url"
    ]]
    sheets_update(new_sheet_id, "Topics!A1:J1", headers)

    # Persist new sheet id and retry append
    save_sheet_id(new_sheet_id)
    retry_result = _append_or_none(new_sheet_id)
    if retry_result:
        log("Scout", f"✅ Nieuwe Google Sheet aangemaakt en gekoppeld: {new_sheet_id}")
    else:
        backup_file = backup_topics_locally(topics)
        log("Scout", f"⚠️ Nieuwe Google Sheet aangemaakt, maar append faalde alsnog. Lokale backup: {backup_file}")

def post_to_discord(topics_by_category):
    """Post summaries to Discord category channels"""
    for category, topics in topics_by_category.items():
        if not topics:
            continue
        
        # Only post topics with score >= 3
        good_topics = [t for t in topics if t.get("score", 3) >= 3]
        if not good_topics:
            continue
        
        lines = [f"🔍 **Scout rapport — {len(good_topics)} nieuwe topics gevonden**\n"]
        for t in good_topics[:5]:  # Max 5 per post
            score_stars = "⭐" * t.get("score", 3)
            lines.append(f"• **{t['title']}** ({t['source']}) {score_stars}")
            lines.append(f"  {t['link']}")
        
        if len(good_topics) > 5:
            lines.append(f"\n_...en {len(good_topics) - 5} meer. Zie Google Sheet voor alle topics._")
        
        discord_send(category, "\n".join(lines))

def run():
    """Main scout run"""
    print(f"[{now_str()}] Scout agent gestart")
    log("Scout", "🔍 Scan gestart voor alle categorieën")
    
    all_topics = []
    topics_by_cat = {}
    
    for category, feeds in RSS_FEEDS.items():
        topics = scout_category(category, feeds)
        if topics:
            topics_by_cat[category] = topics
            all_topics.extend(topics)
    
    if not all_topics:
        log("Scout", "✅ Geen nieuwe topics gevonden")
        print("Geen nieuwe topics")
        return
    
    print(f"Gevonden: {len(all_topics)} nieuwe topics")
    
    # Dedup 1: Remove topics already published in Supabase (last 7 days)
    all_topics = deduplicate_against_published(all_topics)
    
    # Dedup 2: Remove duplicates within the same batch (same story, different source)
    all_topics = deduplicate_within_batch(all_topics)
    
    if not all_topics:
        log("Scout", "✅ Alle topics waren duplicaten van bestaande artikelen")
        print("Alle topics waren duplicaten")
        return
    
    print(f"Na dedup: {len(all_topics)} unieke topics over")
    
    # Rate topics (1 LLM call for all)
    all_topics = rate_topics(all_topics)
    
    # Rebuild by category after rating
    topics_by_cat = {}
    for t in all_topics:
        cat = t["category"]
        if cat not in topics_by_cat:
            topics_by_cat[cat] = []
        topics_by_cat[cat].append(t)
    
    # Post to Sheet
    post_to_sheet(all_topics)
    
    # Post to Discord
    post_to_discord(topics_by_cat)
    
    # Summary log
    summary = ", ".join([f"{cat}: {len(tops)}" for cat, tops in topics_by_cat.items()])
    log("Scout", f"✅ {len(all_topics)} topics gevonden en beoordeeld. {summary}")
    
    print(f"Scout klaar: {len(all_topics)} topics verwerkt")

if __name__ == "__main__":
    run()
