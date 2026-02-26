"""Setup WordPress categories and tags for nieuwsland.be"""
import urllib.request, json, ssl, base64

ctx = ssl.create_default_context()
auth = base64.b64encode(b"info@teammade.be:dAPX bWlp 1wCW UHiS pJ7S yjId").decode()
BASE = "https://nieuwsland.be/wp-json/wp/v2"

def wp_post(endpoint, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(f"{BASE}/{endpoint}", data=body, method="POST", headers={
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/json",
    })
    try:
        resp = urllib.request.urlopen(req, context=ctx)
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        if "term_exists" in err:
            r = json.loads(err)
            return {"name": data["name"], "id": r.get("data", {}).get("term_id", "exists"), "existed": True}
        print(f"  Error: {err[:150]}")
        return None

# Categories
categories = [
    {"name": "België", "slug": "belgie", "description": "Nieuws uit België"},
    {"name": "Wereld", "slug": "wereld", "description": "Internationaal nieuws"},
    {"name": "Politiek", "slug": "politiek", "description": "Binnenlandse en Europese politiek"},
    {"name": "Economie", "slug": "economie", "description": "Economisch en financieel nieuws"},
    {"name": "Sport", "slug": "sport", "description": "Sportnieuws"},
    {"name": "Tech", "slug": "tech", "description": "Technologie en wetenschap"},
    {"name": "Cultuur", "slug": "cultuur", "description": "Cultuur, entertainment en media"},
    {"name": "Wetenschap", "slug": "wetenschap", "description": "Wetenschap en innovatie"},
    {"name": "Opinie", "slug": "opinie", "description": "Opiniestukken en columns"},
    {"name": "Regionaal", "slug": "regionaal", "description": "Regionaal nieuws"},
]

print("=== CATEGORIEËN AANMAKEN ===")
cat_ids = {}
for cat in categories:
    r = wp_post("categories", cat)
    if r:
        cid = r.get("id", "?")
        existed = r.get("existed", False)
        status = "al aanwezig" if existed else "aangemaakt"
        print(f"  ✅ {cat['name']} → ID {cid} ({status})")
        cat_ids[cat["slug"]] = cid
    else:
        print(f"  ❌ {cat['name']} mislukt")

# Tags (veelgebruikte tags alvast aanmaken)
tags = [
    "AI", "Klimaat", "Voetbal", "Wielrennen", "Europa", "Vlaanderen", "Brussel", "Wallonië",
    "Onderwijs", "Gezondheidszorg", "Cybersecurity", "Startup", "Energie", "Migratie",
    "Verkeer", "Justitie", "Defensie", "Koningshuis", "Media", "Telecom",
    "Smartphone", "Gaming", "Ruimtevaart", "Milieu", "Landbouw",
    "Rode Duivels", "Jupiler Pro League", "Tour de France", "Olympische Spelen",
    "NATO", "EU", "Verenigde Naties", "Oekraïne", "VS", "China",
]

print("\n=== TAGS AANMAKEN ===")
tag_ids = {}
for tag in tags:
    slug = tag.lower().replace(" ", "-").replace("ë", "e").replace("ï", "i")
    r = wp_post("tags", {"name": tag, "slug": slug})
    if r:
        tid = r.get("id", "?")
        existed = r.get("existed", False)
        status = "✓" if existed else "+"
        tag_ids[slug] = tid
        print(f"  {status} {tag} → ID {tid}")
    else:
        print(f"  ❌ {tag}")

# Save IDs for use by content engine
output = {
    "categories": cat_ids,
    "tags": tag_ids,
}
import os
out_path = os.path.join(os.path.dirname(__file__), "wp-taxonomy-ids.json")
with open(out_path, "w") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)
print(f"\nIDs opgeslagen in {out_path}")
print(f"\nTotaal: {len(cat_ids)} categorieën, {len(tag_ids)} tags")
