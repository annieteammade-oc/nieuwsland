"""Create #annie-chat channel in Discord for direct communication with Dennis"""
import urllib.request, json, ssl, os

ctx = ssl.create_default_context()

cred_path = r"C:\Users\Annie\.openclaw\workspace\credentials\discord-nieuwsland.json"
with open(cred_path) as f:
    creds = json.load(f)
TOKEN = creds["bot_token"]
GUILD_ID = "1476328047803240472"

def discord_api(method, endpoint, data=None):
    url = f"https://discord.com/api/v10{endpoint}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method, headers={
        "Authorization": f"Bot {TOKEN}",
        "Content-Type": "application/json",
        "User-Agent": "AnnieRedactie (https://nieuwsland.be, 1.0)"
    })
    try:
        resp = urllib.request.urlopen(req, context=ctx)
        return json.loads(resp.read()) if resp.status != 204 else None
    except Exception as e:
        if hasattr(e, 'read'):
            print(f"Error: {e.read().decode()[:200]}")
        else:
            print(f"Error: {e}")
        return None

# First check if category "🤖 ANNIE" exists, otherwise create it
print("Checking existing channels...")
channels = discord_api("GET", f"/guilds/{GUILD_ID}/channels")

annie_category_id = None
annie_chat_exists = False

for ch in channels:
    if ch["type"] == 4 and "ANNIE" in ch.get("name", "").upper():
        annie_category_id = ch["id"]
        print(f"Found ANNIE category: {ch['name']} (ID: {ch['id']})")
    if ch.get("name") == "annie-chat":
        annie_chat_exists = True
        print(f"#annie-chat already exists (ID: {ch['id']})")

if not annie_category_id:
    print("Creating 🤖 ANNIE category...")
    result = discord_api("POST", f"/guilds/{GUILD_ID}/channels", {
        "name": "🤖 ANNIE",
        "type": 4,  # Category
    })
    if result:
        annie_category_id = result["id"]
        print(f"Created category: {result['name']} (ID: {result['id']})")

if not annie_chat_exists and annie_category_id:
    print("Creating #annie-chat channel...")
    result = discord_api("POST", f"/guilds/{GUILD_ID}/channels", {
        "name": "annie-chat",
        "type": 0,  # Text channel
        "parent_id": annie_category_id,
        "topic": "💬 Praat hier met Annie — commando's, vragen, breaking news triggers, bronbeheer. Alsof het Telegram is.",
    })
    if result:
        print(f"Created #annie-chat (ID: {result['id']})")
        
        # Send welcome message
        welcome = (
            "👋 **Hey Dennis! Dit is je directe lijn naar Annie.**\n\n"
            "Gebruik dit kanaal om:\n"
            "• 💬 Te chatten zoals in Telegram\n"
            "• 🚨 Breaking news te triggeren: `breaking: [onderwerp]`\n"
            "• 📰 Bronnen toe te voegen: `bron: [categorie] [url]`\n"
            "• 📋 Richtlijnen te updaten: typ gewoon wat je wilt veranderen\n"
            "• ❓ Vragen te stellen over de content engine\n\n"
            "Ik lees alles wat je hier post en reageer automatisch. 🐾"
        )
        discord_api("POST", f"/channels/{result['id']}/messages", {"content": welcome})
        print("Welcome message sent!")
        
        # Save channel ID
        print(f"\nChannel ID: {result['id']}")
    else:
        print("Failed to create #annie-chat")
elif annie_chat_exists:
    print("#annie-chat already exists, skipping creation")
