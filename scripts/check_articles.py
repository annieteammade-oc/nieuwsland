from utils import get_supabase_creds
import requests
creds = get_supabase_creds()
url = creds['url']
key = creds['key']
headers = {"apikey": key, "Authorization": f"Bearer {key}"}
res = requests.get(f"{url}/rest/v1/articles?select=id,slug,title,status&order=id", headers=headers)
for r in res.json():
    print(f"{r['id']} | {r['status']} | {r['slug']}")
