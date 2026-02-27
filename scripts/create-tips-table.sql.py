import psycopg2

conn = psycopg2.connect("postgresql://postgres:ANNIE%2BJn%2FpuX2j5gB-T9@db.ndeebbjlsuhcewllolvp.supabase.co:5432/postgres")
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS public.tips (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    message text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    location text,
    phone text,
    created_at timestamptz DEFAULT now(),
    status text DEFAULT 'new'
);
""")
conn.commit()
print("Table created ✅")

cur.execute("ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;")
conn.commit()
print("RLS enabled ✅")

try:
    cur.execute("CREATE POLICY tips_anon_insert ON public.tips FOR INSERT TO anon WITH CHECK (true);")
    conn.commit()
    print("Policy created ✅")
except Exception as e:
    conn.rollback()
    if "already exists" in str(e):
        print("Policy already exists ✅")
    else:
        print(f"Policy error: {e}")

conn.close()
print("Done!")
