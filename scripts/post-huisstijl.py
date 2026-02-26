"""Post brand guidelines + redactiehandboek to #huisstijl Discord channel."""
import urllib.request, json, time, os
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env.local'))

TOKEN = os.environ.get("DISCORD_BOT_TOKEN", "")
CHANNEL = "1476563950794706995"
HEADERS = {
    "Authorization": f"Bot {TOKEN}",
    "Content-Type": "application/json",
    "User-Agent": "AnnieRedactie (https://nieuwsland.be, 1.0)",
}

def send(content):
    data = json.dumps({"content": content}).encode()
    req = urllib.request.Request(
        f"https://discord.com/api/v10/channels/{CHANNEL}/messages",
        data=data, headers=HEADERS, method="POST"
    )
    resp = json.loads(urllib.request.urlopen(req).read())
    print(f"Sent: {resp['id']}")
    time.sleep(1)

# --- Brand Guidelines ---
send("""# 🎨 Nieuwsland.be — Huisstijl & Brand Guidelines

## Kleurenpalet

### Primaire Kleuren
• **Deep Navy** — `#1E3A8A` (headers, logo, accenten)
• **Action Orange** — `#F97316` ('land' in logo, decoratieve punt, hover accenten)

### Neutrale Kleuren
• **Ink Black** — `#0F172A` (koppen, donkere achtergronden)
• **Slate Gray** — `#64748B` (secundaire tekst, body)
• **Paper White** — `#F8FAFC` (pagina achtergrond)
• **Pure White** — `#FFFFFF` (kaarten, tekst op donker)""")

send("""## Typografie — Inter (Google Fonts)

### Koppen & Logo
• Font: **Inter Black (900)** — Uppercase, Tracking Tight (-0.05em)

### Logo Accent ('land')
• Font: **Inter Light (300)** — Italic, Tracking Tight (-0.02em)

### Body Tekst
• Font: **Inter Regular (400)** of **Medium (500)** — Line Height 1.6""")

send("""## Logo Gebruik

### Varianten
• **Kleur logo** — op witte/lichte achtergronden
• **Wit logo** — op donkerblauwe/zwarte achtergronden
• **Minimalistisch** — zonder icoon, voor smalle headers

### Regels
• Vrije ruimte: minstens de hoogte van de 'N' rondom het logo
• Minimale breedte: 120px (voor leesbaarheid tagline)
• Bestanden: `/public/logo/nieuwsland-color.png` + `nieuwsland-white.png`""")

send("""## UI Elementen

### Tags (categorieën)
• Pill shape (rounded-full), uppercase, bold, 12px
• Op donker: witte tekst, rgba(255,255,255,0.1) bg
• Op licht: blue-700 tekst, blue-50 bg

### Knoppen
• Standaard: slate-900 bg, wit tekst, rounded-full
• Hover: slate-800, scale-95 bij klik
• AI Generator: wit bg → oranje hover

### Iconen
• Bibliotheek: **Lucide-react** (stroke width 2)
• Hoofdicoon: Newspaper | Accent: Sparkles""")

send("""## Header Stijl (De Morgen-geïnspireerd)

• **Clean, wit, minimalistisch** — geen gekleurde balken
• Menu links | Datum gecentreerd | Zoeken rechts (utility bar)
• Logo groot gecentreerd met padding
• Navigatie: dunne lijn boven+onder, categorieën gecentreerd
• Tekst: donkergrijs, hover naar navy blauw
• Geen schaduwen, geen gradients — puur en strak""")

# --- Post logos as files ---
workspace = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for logo_name in ["nieuwsland-color.png", "nieuwsland-white.png"]:
    logo_path = os.path.join(workspace, "public", "logo", logo_name)
    if os.path.exists(logo_path):
        import io
        boundary = "----FormBoundary7MA4YWxkTrZu0gW"
        body = io.BytesIO()
        # JSON payload
        payload = json.dumps({"content": f"📎 Logo: **{logo_name}**"})
        body.write(f"--{boundary}\r\nContent-Disposition: form-data; name=\"payload_json\"\r\nContent-Type: application/json\r\n\r\n{payload}\r\n".encode())
        # File
        with open(logo_path, "rb") as f:
            file_data = f.read()
        body.write(f"--{boundary}\r\nContent-Disposition: form-data; name=\"files[0]\"; filename=\"{logo_name}\"\r\nContent-Type: image/png\r\n\r\n".encode())
        body.write(file_data)
        body.write(f"\r\n--{boundary}--\r\n".encode())
        
        file_headers = {
            "Authorization": f"Bot {TOKEN}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "User-Agent": "AnnieRedactie (https://nieuwsland.be, 1.0)",
        }
        req = urllib.request.Request(
            f"https://discord.com/api/v10/channels/{CHANNEL}/messages",
            data=body.getvalue(), headers=file_headers, method="POST"
        )
        resp = json.loads(urllib.request.urlopen(req).read())
        print(f"Logo sent: {resp['id']}")
        time.sleep(1)

# --- Redactiehandboek samenvatting ---
send("""## 📋 Redactiehandboek — Kernpunten

**Toon:**
• Nieuws: neutraal, feitelijk, helder
• Opinie: persoonlijk maar onderbouwd
• Altijd Belgisch perspectief waar relevant

**Vermijden:** clickbait, speculatie, overdrijving, polarisatie

**Lengte artikelen:** zie REDACTIEHANDBOEK.md voor volledige richtlijnen

**Workflow:** Scout → Schrijver → #review-queue → Eindredactie → Publicatie → Promo

📄 Volledig handboek: `projects/nieuwsland/REDACTIEHANDBOEK.md`
📄 Volledige styleguide: `projects/nieuwsland/STYLEGUIDE.md`""")

print("\n✅ Huisstijl & brand guidelines gepost in #huisstijl!")
