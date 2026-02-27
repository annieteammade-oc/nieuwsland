"""
Nieuwsland.be — Discord Command Watcher
Checkt #site-development op nieuwe berichten en print ze als taken.
Draait via cron elke 15-30 min.

Output: JSON met nieuwe taken die de cron-agent kan doorsturen naar Codex.
"""

import sys, os, json, time
sys.path.insert(0, os.path.dirname(__file__))
from utils import get_discord_token
import urllib.request, ssl

ctx = ssl.create_default_context()

SITE_DEV_CHANNEL = "1476584301561647265"
CARTOONS_CHANNEL = "1476332972427837512"
STATE_FILE = os.path.join(os.path.dirname(__file__), "watcher-state.json")

# Channels to watch and their purpose
WATCHED_CHANNELS = {
    SITE_DEV_CHANNEL: "site-development",
    CARTOONS_CHANNEL: "cartoons",
}

# Bot user ID (Annie Redactie) - skip own messages
BOT_ID = "1476329931519557765"


def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            return json.load(f)
    return {"last_message_ids": {}}


def save_state(state):
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def fetch_messages(channel_id, after=None, limit=10):
    """Fetch recent messages from a Discord channel"""
    token = get_discord_token()
    url = f"https://discord.com/api/v10/channels/{channel_id}/messages?limit={limit}"
    if after:
        url += f"&after={after}"
    
    req = urllib.request.Request(url, headers={
        "Authorization": f"Bot {token}",
        "Content-Type": "application/json",
    })
    
    try:
        resp = urllib.request.urlopen(req, context=ctx, timeout=15)
        return json.loads(resp.read())
    except Exception as e:
        print(f"Error fetching messages from {channel_id}: {e}")
        return []


def main():
    state = load_state()
    last_ids = state.get("last_message_ids", {})
    new_tasks = []
    
    for channel_id, channel_name in WATCHED_CHANNELS.items():
        after = last_ids.get(channel_id)
        messages = fetch_messages(channel_id, after=after)
        
        if not messages:
            print(f"#{channel_name}: geen nieuwe berichten")
            continue
        
        # Messages come newest-first, reverse for chronological
        messages.reverse()
        
        for msg in messages:
            # Skip bot messages
            if msg["author"]["id"] == BOT_ID:
                continue
            # Skip empty messages
            if not msg.get("content", "").strip():
                continue
            
            new_tasks.append({
                "channel": channel_name,
                "channel_id": channel_id,
                "message_id": msg["id"],
                "author": msg["author"].get("username", "unknown"),
                "content": msg["content"],
                "timestamp": msg["timestamp"],
            })
        
        # Update last seen message ID (newest)
        last_ids[channel_id] = messages[-1]["id"]
    
    state["last_message_ids"] = last_ids
    save_state(state)
    
    if new_tasks:
        print(f"\n=== {len(new_tasks)} NIEUWE TAKEN GEVONDEN ===\n")
        for task in new_tasks:
            print(f"[#{task['channel']}] @{task['author']} ({task['timestamp']}):")
            print(f"  {task['content']}")
            print()
        
        # Output as JSON for the cron agent to process
        print("---JSON---")
        print(json.dumps(new_tasks, indent=2))
    else:
        print("Geen nieuwe taken.")


if __name__ == "__main__":
    main()
