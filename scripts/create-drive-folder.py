"""Create Google Drive folder with all Nieuwsland docs and share with Dennis."""
import json, os, requests

# Refresh token
creds = json.load(open(os.path.expanduser("~/.openclaw/workspace/credentials/google_docs_token.json")))
token_resp = requests.post("https://oauth2.googleapis.com/token", json={
    "client_id": creds["client_id"],
    "client_secret": creds["client_secret"],
    "refresh_token": creds["refresh_token"],
    "grant_type": "refresh_token"
}).json()
TOKEN = token_resp["access_token"]
H = {"Authorization": f"Bearer {TOKEN}"}

# Use existing folder
folder_id = "17bsUeBaW7T3lA3Pe5MmEAYZzr-8Gxhtf"
print(f"📁 Using existing folder: {folder_id}")

# 3. Create docs in folder
docs = {
    "1. Content Engine Architectuur": open(os.path.expanduser("~/.openclaw/workspace/projects/nieuwsland/CONTENT-ENGINE.md"), encoding="utf-8").read(),
    "2. Redactiehandboek": open(os.path.expanduser("~/.openclaw/workspace/projects/nieuwsland/REDACTIEHANDBOEK.md"), encoding="utf-8").read(),
    "3. Styleguide (Brand)": open(os.path.expanduser("~/.openclaw/workspace/projects/nieuwsland/STYLEGUIDE.md"), encoding="utf-8").read(),
    "4. Technische Setup": f"""# Nieuwsland.be — Technische Setup

## Stack
- **Frontend:** Next.js 15 + Tailwind CSS (deployed on Vercel)
- **Database:** Supabase (PostgreSQL)
- **Domain:** nieuwsland.be (Hostinger)
- **CMS:** WordPress op nieuwsland.be (optioneel, backup)
- **Deployment:** Vercel (auto-deploy via GitHub push)

## URLs
- **Live site:** https://nieuwsland.be
- **GitHub:** https://github.com/annieteammade-oc/nieuwsland
- **Supabase Dashboard:** https://supabase.com/dashboard/project/ndeebbjlsuhcewllolvp
- **Vercel Dashboard:** https://vercel.com/annieteammade-5793/nieuwsland

## Database (Supabase)
- **Project:** ndeebbjlsuhcewllolvp
- **Tabellen:** categories (10), authors (9), articles
- **RLS:** Publiek kan alleen published articles lezen, service_role heeft volledige toegang
- **Credentials:** In .env.local (NIET committen)

## WordPress (backup/optioneel)
- **URL:** https://nieuwsland.be/wp-json/wp/v2/
- **Login:** info@teammade.be
- **10 categorieën + 35 tags** aangemaakt
- WordPress is optioneel — primaire data zit in Supabase

## Content Engine
- **Discord server** als message bus (23 kanalen, 4 categorieën)
- **AI agents** schrijven artikelen, droppen in Discord kanalen
- **Brain agent** reviewt en publiceert naar Supabase
- **Scripts:** projects/nieuwsland/scripts/

## Modellen (via OpenRouter)
- **Hoofdredacteur:** Gemini 3 Flash Preview
- **Content Writers:** MiniMax M2.5 (tech), meer categorieën volgen
- **Images:** Gemini 3 Pro Image Preview
- **Social Media:** Grok 4.1 Fast
- **SEO:** Gemini 3 Flash Preview

## Redactie Persona's (in Supabase)
- Lara Van den Bossche — België & Regionaal
- Pieter De Smet — Politiek & Duiding
- Noor El Kadi — Economie & Werk
- Jonas Vercauteren — Sport
- Elise Martens — Tech & AI
- Dries Claes — Wetenschap
- Camille Dupont — Cultuur & Entertainment
- Tom Wouters — Wereldnieuws
- Sofie Vermeulen — Opinie & Columns
""",
    "5. Fase Plan & Roadmap": f"""# Nieuwsland.be — Fase Plan

## Status: Fase 1 (Tech Writer) ✅ gestart

### Fase 1: Eerste Lego-steen (#tech) — IN PROGRESS
- [x] RSS monitor voor #tech bronnen (The Verge, Tweakers, Ars Technica)
- [x] Muscle agent: scant RSS, schrijft draft, dropt in #tech
- [x] Eerste artikel succesvol geschreven en gepost
- [ ] JSON parsing fix (MiniMax control characters)
- [ ] Brain agent: review-queue workflow
- [ ] Dennis review via Discord (✅/❌)
- [ ] Bij ✅: publiceer naar Supabase → live op site

### Fase 2: Uitbreiden naar 3 kanalen
- [ ] #belgium + #world toevoegen
- [ ] Media agent: auto header image
- [ ] SEO agent: meta descriptions + tags

### Fase 3: Volledig redactieteam
- [ ] Alle 12 categorie-kanalen actief
- [ ] Promo agent: auto social media posting
- [ ] Newsletter agent: dagelijkse digest
- [ ] Dashboard in #dashboard

### Fase 4: Autonomous Publishing
- [ ] Confidence scoring systeem
- [ ] Auto-publish bij hoge score
- [ ] Dennis review alleen bij twijfel
- [ ] Full loop: bron → publicatie → promo (0 menselijke interventie)

## Beslissingen
- Supabase als primaire database (niet WordPress)
- WordPress als optionele backup/CMS
- Next.js + Vercel als frontend
- Discord als communicatie-laag tussen agents
- Annie = COO (stuurt aan), niet de eindredacteur
- Content wordt HERSCHREVEN, nooit 1-op-1 gekopieerd
"""
}

for title, content in docs.items():
    # Create Google Doc in folder
    doc = requests.post("https://www.googleapis.com/drive/v3/files", headers=H,
        json={"name": title, "mimeType": "application/vnd.google-apps.document", "parents": [folder_id]}).json()
    doc_id = doc["id"]
    
    # Insert content
    requests.post(f"https://docs.googleapis.com/v1/documents/{doc_id}:batchUpdate", headers=H,
        json={"requests": [{"insertText": {"location": {"index": 1}, "text": content}}]})
    print(f"  📄 {title}")

# Get folder URL
print(f"\n🔗 Folder URL: https://drive.google.com/drive/folders/{folder_id}")
