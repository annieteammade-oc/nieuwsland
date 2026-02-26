"""Create tips table in Supabase via Python client."""
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))

from supabase import create_client

url = "https://ndeebbjlsuhcewllolvp.supabase.co"
key = json.load(open(os.path.join(os.path.dirname(__file__), "..", "..", "..", "credentials", "supabase-nieuwsland.json")))["service_role_key"] if os.path.exists(os.path.join(os.path.dirname(__file__), "..", "..", "..", "credentials", "supabase-nieuwsland.json")) else "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZWViYmpsc3VoY2V3bGxvbHZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAyNTA2MiwiZXhwIjoyMDg3NjAxMDYyfQ.MegHKyNzo_eHKSLPbXaCOb9t8xQY4ZxcthuXIYAw39E"

sb = create_client(url, key)

# Use rpc to run raw SQL
sql = """
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
"""

# Supabase Python client doesn't have raw SQL, so we'll just test insert/table existence
try:
    result = sb.table("tips").select("id").limit(1).execute()
    print("Table 'tips' already exists ✅")
except Exception as e:
    if "relation" in str(e) and "does not exist" in str(e):
        print("Table 'tips' does not exist. Please create it via Supabase Dashboard SQL Editor:")
        print(sql)
    else:
        print(f"Error: {e}")
