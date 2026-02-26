"""
Nieuwsland.be — Scout Agent
Scant RSS feeds per categorie, vindt nieuwe topics, plaatst ze in Google Sheet + Discord.
Draait via cron elke 2 uur.
"""

import sys, os, json, time
sys.path.insert(0, os.path.dirname(__file__))
from utils import (
    parse_rss, RSS_FEEDS, discord_send, log, is_processed, mark_processed,
    sheets_append, sheets_read, hash_url, now_str, llm_generate
)

# Sheet ID wordt opgeslagen na eerste run
SHEET_ID_FILE = os.path.join(os.path.dirname(__file__), "sheet-id.json")

def get_sheet_id():
    if os.path.exists(SHEET_ID_FILE):
        with open(SHEET_ID_FILE) as f:
            return json.load(f).get("id")
    return None

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
    """Add new topics to Google Sheet"""
    sheet_id = get_sheet_id()
    if not sheet_id:
        print("No Sheet ID found — skipping sheet update")
        return
    
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
    
    if rows:
        sheets_append(sheet_id, "Topics", rows)

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
