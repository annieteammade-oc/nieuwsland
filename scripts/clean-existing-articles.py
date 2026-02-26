"""Clean existing articles in Supabase using quality gate"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import psycopg2
from quality_gate import clean_content, clean_title

DB_URL = "postgresql://postgres:ANNIE%2BJn%2FpuX2j5gB-T9@db.ndeebbjlsuhcewllolvp.supabase.co:5432/postgres"

conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

# Get all published articles
cur.execute("SELECT id, title, content FROM articles WHERE status = 'published'")
articles = cur.fetchall()

print(f"Found {len(articles)} published articles to check\n")

for aid, title, content in articles:
    cleaned_title = clean_title(title)
    cleaned_content = clean_content(content or "")
    
    changed = False
    if cleaned_title != title:
        print(f"[{aid}] Title cleaned: '{title[:60]}' → '{cleaned_title[:60]}'")
        changed = True
    if cleaned_content != (content or ""):
        diff = len(content or "") - len(cleaned_content)
        print(f"[{aid}] Content cleaned: removed {diff} chars of metadata")
        changed = True
    
    # Check minimum quality
    word_count = len(cleaned_content.split())
    if word_count < 100:
        print(f"[{aid}] ⚠️ Very short ({word_count} words) — archiving: {cleaned_title[:60]}")
        cur.execute("UPDATE articles SET status = 'archived' WHERE id = %s", (aid,))
        changed = True
    elif changed:
        cur.execute("UPDATE articles SET title = %s, content = %s WHERE id = %s",
                   (cleaned_title, cleaned_content, aid))
    
    if not changed:
        print(f"[{aid}] ✅ OK: {cleaned_title[:60]} ({word_count} words)")

conn.commit()
cur.close()
conn.close()
print("\nDone!")
