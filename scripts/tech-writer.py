"""
Nieuwsland.be — Tech Writer Agent (Fase 1 Lego-steen)
Scant RSS feeds, herschrijft artikelen, post naar Discord #tech kanaal
Model: MiniMax M2.5 via OpenRouter
"""

import urllib.request, json, ssl, xml.etree.ElementTree as ET, time, os, hashlib

# Config
DISCORD_TOKEN = None
DISCORD_CHANNEL_TECH = "1476332937174712340"
DISCORD_CHANNEL_REVIEW = "1476332912147173450"
DISCORD_CHANNEL_LOGS = "1476333004380180553"
OPENROUTER_KEY = None
MODEL = "minimax/minimax-m2.5"  # via OpenRouter

# RSS Feeds for #tech
FEEDS = [
    "https://www.theverge.com/rss/index.xml",
    "https://feeds.arstechnica.com/arstechnica/index",
    "https://tweakers.net/feeds/mixed.xml",
]

PROCESSED_FILE = os.path.join(os.path.dirname(__file__), "tech-processed.json")
ctx = ssl.create_default_context()

def load_env():
    """Load tokens from workspace .env and credentials"""
    global DISCORD_TOKEN, OPENROUTER_KEY
    
    # Discord token
    cred_path = os.path.join(os.path.dirname(__file__), "..", "..", "credentials", "discord-nieuwsland.json")
    if not os.path.exists(cred_path):
        cred_path = r"C:\Users\Annie\.openclaw\workspace\credentials\discord-nieuwsland.json"
    
    if os.path.exists(cred_path):
        with open(cred_path) as f:
            creds = json.load(f)
            DISCORD_TOKEN = creds.get("bot_token")
    
    # OpenRouter key from .env
    # Try .env first
    env_path = os.path.join(os.path.dirname(__file__), "..", "..", ".env")
    if not os.path.exists(env_path):
        env_path = r"C:\Users\Annie\.openclaw\workspace\.env"
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                if line.startswith("OPENROUTER_API_KEY="):
                    OPENROUTER_KEY = line.split("=", 1)[1].strip()
    
    # Fallback: read from openclaw.json
    if not OPENROUTER_KEY:
        oc_path = r"C:\Users\Annie\.openclaw\openclaw.json"
        if os.path.exists(oc_path):
            with open(oc_path) as f:
                cfg = json.load(f)
                OPENROUTER_KEY = cfg.get("models", {}).get("providers", {}).get("openrouter", {}).get("apiKey")
    
    if not DISCORD_TOKEN:
        print("ERROR: No Discord token found")
        return False
    if not OPENROUTER_KEY:
        print("ERROR: No OpenRouter API key found")
        return False
    return True


def load_processed():
    """Load list of already processed article URLs"""
    if os.path.exists(PROCESSED_FILE):
        with open(PROCESSED_FILE) as f:
            return json.load(f)
    return []


def save_processed(urls):
    with open(PROCESSED_FILE, "w") as f:
        json.dump(urls[-200:], f)  # Keep last 200


def fetch_rss(feed_url):
    """Fetch and parse RSS feed, return list of (title, link, description)"""
    articles = []
    try:
        req = urllib.request.Request(feed_url, headers={"User-Agent": "Nieuwsland/1.0"})
        resp = urllib.request.urlopen(req, context=ctx, timeout=15)
        data = resp.read().decode("utf-8", errors="replace")
        
        # Handle both RSS and Atom feeds
        root = ET.fromstring(data)
        
        # RSS 2.0
        for item in root.findall(".//item")[:5]:
            title = item.findtext("title", "")
            link = item.findtext("link", "")
            desc = item.findtext("description", "")
            if title and link:
                articles.append({"title": title, "link": link, "description": desc[:500]})
        
        # Atom
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        for entry in root.findall(".//atom:entry", ns)[:5]:
            title = entry.findtext("atom:title", "", ns)
            link_el = entry.find("atom:link", ns)
            link = link_el.get("href", "") if link_el is not None else ""
            desc = entry.findtext("atom:summary", "", ns) or entry.findtext("atom:content", "", ns) or ""
            if title and link:
                articles.append({"title": title, "link": link, "description": desc[:500]})
    except Exception as e:
        print(f"  RSS error ({feed_url}): {e}")
    
    return articles


def rewrite_article(title, description, source_url):
    """Use OpenRouter LLM to rewrite article in Dutch, Nieuwsland style"""
    prompt = f"""Je bent een tech-journalist voor Nieuwsland.be, een Belgisch nieuwsplatform.
Herschrijf dit artikel in het Nederlands. Maak het informatief, helder en professioneel.
Gebruik een neutrale journalistieke toon. Geen clickbait. Geen kopiëren — herschrijf volledig.

Originele titel: {title}
Samenvatting: {description}
Bron: {source_url}

Geef je output in dit JSON formaat:
{{
  "titel": "Nederlandse titel (max 80 tekens)",
  "samenvatting": "Korte lead/intro (max 200 tekens)",
  "artikel": "Het volledige artikel (300-500 woorden)",
  "tags": ["tag1", "tag2", "tag3"],
  "categorie": "Tech"
}}

Antwoord ALLEEN met valid JSON, geen andere tekst."""

    body = json.dumps({
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 1500,
    }).encode()

    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=body,
        headers={
            "Authorization": f"Bearer {OPENROUTER_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://nieuwsland.be",
            "X-Title": "Nieuwsland Tech Writer",
        },
    )

    try:
        resp = urllib.request.urlopen(req, context=ctx, timeout=60)
        data = json.loads(resp.read())
        content = data["choices"][0]["message"]["content"]
        
        # Try to parse JSON from response
        # Strip markdown code blocks if present
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1] if "\n" in content else content[3:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()
        
        return json.loads(content)
    except Exception as e:
        print(f"  LLM error: {e}")
        return None


def discord_post(channel_id, content, embed=None, file_content=None, filename="artikel.txt"):
    """Post message to Discord channel, optionally with file attachment"""
    import io
    
    if file_content:
        # Multipart upload with file
        boundary = "----NieuwslandBoundary"
        body = io.BytesIO()
        
        payload = {"content": content[:2000]}
        if embed:
            payload["embeds"] = [embed]
        
        body.write(f"--{boundary}\r\n".encode())
        body.write(b'Content-Disposition: form-data; name="payload_json"\r\n')
        body.write(b"Content-Type: application/json\r\n\r\n")
        body.write(json.dumps(payload).encode())
        body.write(b"\r\n")
        
        file_bytes = file_content.encode("utf-8") if isinstance(file_content, str) else file_content
        body.write(f"--{boundary}\r\n".encode())
        body.write(f'Content-Disposition: form-data; name="files[0]"; filename="{filename}"\r\n'.encode())
        body.write(b"Content-Type: text/plain; charset=utf-8\r\n\r\n")
        body.write(file_bytes)
        body.write(b"\r\n")
        body.write(f"--{boundary}--\r\n".encode())
        
        url = f"https://discord.com/api/v10/channels/{channel_id}/messages"
        req = urllib.request.Request(url, data=body.getvalue(), method="POST")
        req.add_header("Authorization", f"Bot {DISCORD_TOKEN}")
        req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
        req.add_header("User-Agent", "Nieuwsland/1.0")
    else:
        url = f"https://discord.com/api/v10/channels/{channel_id}/messages"
        data = {"content": content[:2000]}
        if embed:
            data["embeds"] = [embed]
        
        req = urllib.request.Request(url, data=json.dumps(data).encode(), method="POST")
        req.add_header("Authorization", f"Bot {DISCORD_TOKEN}")
        req.add_header("Content-Type", "application/json")
        req.add_header("User-Agent", "Nieuwsland/1.0")
    
    try:
        resp = urllib.request.urlopen(req, context=ctx)
        return json.loads(resp.read())
    except Exception as e:
        print(f"  Discord error: {e}")
        if hasattr(e, 'read'):
            print(f"  Body: {e.read().decode()}")
        return None


def run():
    """Main: scan feeds, rewrite, post to Discord"""
    print("=" * 50)
    print("Nieuwsland Tech Writer — Starting run")
    print("=" * 50)
    
    if not load_env():
        return
    
    processed = load_processed()
    new_articles = []
    
    # 1. Scan all RSS feeds
    for feed_url in FEEDS:
        print(f"\nScanning: {feed_url}")
        articles = fetch_rss(feed_url)
        print(f"  Found {len(articles)} articles")
        
        for art in articles:
            url_hash = hashlib.md5(art["link"].encode()).hexdigest()
            if url_hash not in processed:
                new_articles.append(art)
                processed.append(url_hash)
    
    if not new_articles:
        print("\nNo new articles found.")
        discord_post(DISCORD_CHANNEL_LOGS, "🤖 **Tech Writer** — Geen nieuwe artikelen gevonden.")
        save_processed(processed)
        return
    
    print(f"\n{len(new_articles)} new articles to process")
    
    # 2. Process max 3 per run (budget control)
    for art in new_articles[:3]:
        print(f"\nRewriting: {art['title'][:60]}...")
        
        result = rewrite_article(art["title"], art["description"], art["link"])
        
        if not result:
            print("  Skipped (LLM error)")
            continue
        
        # 3. Post to #tech channel
        embed = {
            "title": result.get("titel", art["title"]),
            "description": result.get("samenvatting", ""),
            "color": 0x1E3A8A,  # Deep Navy
            "fields": [
                {"name": "📝 Artikel", "value": result.get("artikel", "")[:1024], "inline": False},
                {"name": "🏷️ Tags", "value": ", ".join(result.get("tags", [])), "inline": True},
                {"name": "🔗 Bron", "value": art["link"], "inline": True},
            ],
            "footer": {"text": "Nieuwsland.be — Tech Writer Agent | MiniMax M2.5"},
        }
        
        msg = discord_post(
            DISCORD_CHANNEL_TECH,
            f"📰 **Nieuw tech-artikel klaar voor review**",
            embed=embed,
        )
        
        if msg:
            print(f"  Posted to #tech ✅")
            
            # 4. Also post to #review-queue with FULL article as file attachment
            full_article = result.get("artikel", "")
            titel = result.get("titel", art["title"])
            samenvatting = result.get("samenvatting", "")
            tags = ", ".join(result.get("tags", []))
            
            review_header = (
                f"📋 REVIEW NODIG — TECH artikel\n"
                f"Topic: {titel}\n"
                f"Bron: {art['link']}\n"
                f"Score: {'⭐️' * 4}\n"
                f"TITEL: {titel}\n"
                f"SUBTITEL: {samenvatting}\n"
                f"TAGS: {tags}\n\n"
                f"---\n"
                f"✅ = Goedkeuren & publiceren op WordPress\n"
                f"❌ = Afwijzen (geef feedback als reply)"
            )
            
            # Full article as .txt attachment so nothing gets truncated
            discord_post(
                DISCORD_CHANNEL_REVIEW,
                review_header,
                file_content=full_article,
                filename=f"artikel-{hashlib.md5(art['link'].encode()).hexdigest()[:12]}.txt",
            )
            print(f"  Posted to #review-queue ✅")
            
            # 5. Log
            discord_post(
                DISCORD_CHANNEL_LOGS,
                f"🤖 **Tech Writer** — Artikel geschreven: *{result.get('titel', 'Untitled')}*\n"
                f"Model: MiniMax M2.5 | Bron: {art['link']}"
            )
        
        time.sleep(2)
    
    save_processed(processed)
    print(f"\nDone! Processed {min(3, len(new_articles))} articles.")


if __name__ == "__main__":
    run()
