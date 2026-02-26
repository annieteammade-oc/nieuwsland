"""Generate images for all published articles that don't have one."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import psycopg2
from utils import generate_article_image, upload_image_to_supabase
import re, hashlib

DB_URL = "postgresql://postgres:ANNIE%2BJn%2FpuX2j5gB-T9@db.ndeebbjlsuhcewllolvp.supabase.co:5432/postgres"

conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

cur.execute("""
    SELECT a.id, a.title, c.slug as cat_slug, a.excerpt 
    FROM articles a 
    LEFT JOIN categories c ON a.category_id = c.id
    WHERE a.status = 'published' AND (a.image_url IS NULL OR a.image_url = '')
    ORDER BY a.id
""")
articles = cur.fetchall()

print(f"Generating images for {len(articles)} articles...\n")

for aid, title, cat_slug, excerpt in articles:
    print(f"[{aid}] {title[:60]}...")
    
    image_url = generate_article_image(title, cat_slug or "nieuws", excerpt)
    if image_url:
        # Upload to Supabase storage
        safe_slug = re.sub(r'[^a-z0-9]', '-', title.lower()[:50])
        filename = f"{safe_slug}-{hashlib.md5(title.encode()).hexdigest()[:8]}.png"
        permanent_url = upload_image_to_supabase(image_url, filename)
        
        cur.execute("UPDATE articles SET image_url = %s WHERE id = %s", (permanent_url, aid))
        conn.commit()
        print(f"  ✅ Image saved: {permanent_url[:80]}...")
    else:
        print(f"  ❌ Failed")

cur.close()
conn.close()
print("\nDone!")
