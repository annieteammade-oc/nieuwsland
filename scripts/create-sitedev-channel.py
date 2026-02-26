import sys, os
sys.path.insert(0, os.path.dirname(__file__))
from utils import discord_request

# Get SYSTEEM category from #logs channel
logs = discord_request("GET", "/channels/1476333004380180553")
parent_id = logs.get("parent_id") if logs else None
print(f"SYSTEEM category: {parent_id}")

# Create channel
result = discord_request("POST", "/guilds/1476328047803240472/channels", {
    "name": "site-development",
    "type": 0,
    "parent_id": parent_id,
    "topic": "Opmerkingen, bugs, features en taken voor nieuwsland.be — Codex pikt taken hier op"
})
if result:
    print(f"Channel created: {result['id']}")
else:
    print("Failed")
