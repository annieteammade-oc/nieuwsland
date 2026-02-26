import psycopg2
DB = "postgresql://postgres:ANNIE%2BJn%2FpuX2j5gB-T9@db.ndeebbjlsuhcewllolvp.supabase.co:5432/postgres"
conn = psycopg2.connect(DB)
conn.autocommit = True
cur = conn.cursor()
cur.execute("UPDATE articles SET status = 'archived' WHERE id BETWEEN 8 AND 15 RETURNING id, title")
for row in cur.fetchall():
    print(f"Archived [{row[0]}]: {row[1][:60]}")
cur.close()
conn.close()
print("Done - all fabricated articles archived!")
