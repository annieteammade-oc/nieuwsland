import urllib.request, json, ssl
ctx = ssl.create_default_context()
key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZWViYmpsc3VoY2V3bGxvbHZwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAyNTA2MiwiZXhwIjoyMDg3NjAxMDYyfQ.MegHKyNzo_eHKSLPbXaCOb9t8xQY4ZxcthuXIYAw39E'
url = 'https://ndeebbjlsuhcewllolvp.supabase.co/rest/v1/articles?select=id,title,slug,status,created_at&order=created_at.desc&limit=5'
req = urllib.request.Request(url)
req.add_header('apikey', key)
req.add_header('Authorization', 'Bearer ' + key)
resp = urllib.request.urlopen(req, context=ctx)
for a in json.loads(resp.read().decode()):
    print(f"#{a['id']} | {a['status']} | {a['title'][:70]}")
