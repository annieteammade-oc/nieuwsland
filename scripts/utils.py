"""
Nieuwsland.be Content Engine — Shared Utilities
Discord API, Google Sheets API, OpenRouter API, RSS parsing
"""

import urllib.request, urllib.parse, json, ssl, os, time, hashlib
import xml.etree.ElementTree as ET
from datetime import datetime, timezone

ctx = ssl.create_default_context()

# ============================================================
# CREDENTIALS
# ============================================================

_creds_cache = {}

def _workspace():
    return r"C:\Users\Annie\.openclaw\workspace"

def get_discord_token():
    if "discord" not in _creds_cache:
        path = os.path.join(_workspace(), "credentials", "discord-nieuwsland.json")
        with open(path) as f:
            _creds_cache["discord"] = json.load(f)["bot_token"]
    return _creds_cache["discord"]

def get_openrouter_key():
    if "openrouter" not in _creds_cache:
        env_path = os.path.join(_workspace(), ".env")
        with open(env_path) as f:
            for line in f:
                if line.startswith("OPENROUTER_API_KEY="):
                    _creds_cache["openrouter"] = line.split("=", 1)[1].strip()
    return _creds_cache["openrouter"]

def get_google_creds():
    """Returns path to GA4 service account JSON (has Sheets/Drive scope too)"""
    return os.path.join(_workspace(), "credentials", "ga4-service-account.json")

def get_wp_creds():
    """Returns nieuwsland.be WordPress credentials"""
    path = os.path.join(_workspace(), "credentials", "wp-sites.json")
    with open(path) as f:
        sites = json.load(f)
    for site in sites:
        if "nieuwsland" in site.get("url", ""):
            return site
    return None


# ============================================================
# DISCORD API
# ============================================================

CHANNELS = {
    "review-queue": "1476332912147173450",
    "belgium": "1476332915674714188",
    "world": "1476332919793389772",
    "politics": "1476332924075769886",
    "economy": "1476332928261947392",
    "sport": "1476332932615377101",
    "tech": "1476332937174712340",
    "culture": "1476332943046742120",
    "science": "1476332947115348018",
    "opinion": "1476332951594860656",
    "regional": "1476332956225372326",
    "breaking": "1476332959819628695",
    "images": "1476332964357996782",
    "video-shorts": "1476332968426606724",
    "cartoons": "1476332972427837512",
    "infographics": "1476332977066741791",
    "social-media": "1476332981172961290",
    "seo": "1476332985124130969",
    "newsletter": "1476332989981130772",
    "ads-partnerships": "1476332999476908083",
    "logs": "1476333004380180553",
    "config": "1476333008964550860",
    "dashboard": "1476333013288747018",
}

BOT_ID = "1476329931519557765"

def discord_request(method, endpoint, data=None):
    """Make a Discord API request"""
    url = f"https://discord.com/api/v10{endpoint}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method, headers={
        "Authorization": "Bot " + get_discord_token(),
        "Content-Type": "application/json",
        "User-Agent": "AnnieRedactie (https://nieuwsland.be, 1.0)"
    })
    try:
        resp = urllib.request.urlopen(req, context=ctx)
        return json.loads(resp.read()) if resp.status != 204 else None
    except urllib.error.HTTPError as e:
        print(f"Discord API error {e.code}: {e.read().decode()}")
        return None

def discord_send(channel_name, message, embed=None, file_content=None, filename="artikel.txt"):
    """Send a message to a Discord channel. If message > 2000 chars, splits or attaches file."""
    channel_id = CHANNELS.get(channel_name, channel_name)
    
    # If file_content is provided, send as attachment
    if file_content:
        return discord_send_with_file(channel_id, message[:2000], file_content, filename)
    
    # If message fits, send normally
    if len(message) <= 2000:
        data = {"content": message}
        if embed:
            data["embeds"] = [embed]
        return discord_request("POST", f"/channels/{channel_id}/messages", data)
    
    # Message too long: split into chunks
    return discord_send_long(channel_id, message, embed)

def discord_send_long(channel_id, message, embed=None):
    """Split a long message into multiple 2000-char chunks"""
    chunks = []
    remaining = message
    while remaining:
        if len(remaining) <= 2000:
            chunks.append(remaining)
            break
        # Find a good split point (newline or space near 1950 chars)
        split_at = remaining.rfind("\n", 0, 1950)
        if split_at < 500:
            split_at = remaining.rfind(" ", 0, 1950)
        if split_at < 500:
            split_at = 1950
        chunks.append(remaining[:split_at])
        remaining = remaining[split_at:].lstrip()
    
    last_result = None
    for i, chunk in enumerate(chunks):
        data = {"content": chunk}
        if embed and i == len(chunks) - 1:
            data["embeds"] = [embed]
        last_result = discord_request("POST", f"/channels/{channel_id}/messages", data)
        if len(chunks) > 1:
            time.sleep(0.5)  # Rate limit friendly
    return last_result

def discord_send_with_file(channel_id, message, file_content, filename="artikel.txt"):
    """Send a message with a text file attachment via multipart/form-data"""
    import io
    boundary = "----NieuwslandBoundary"
    
    body = io.BytesIO()
    
    # JSON payload part
    payload_json = json.dumps({"content": message[:2000]})
    body.write(f"--{boundary}\r\n".encode())
    body.write(b'Content-Disposition: form-data; name="payload_json"\r\n')
    body.write(b"Content-Type: application/json\r\n\r\n")
    body.write(payload_json.encode())
    body.write(b"\r\n")
    
    # File part
    file_bytes = file_content.encode("utf-8") if isinstance(file_content, str) else file_content
    body.write(f"--{boundary}\r\n".encode())
    body.write(f'Content-Disposition: form-data; name="files[0]"; filename="{filename}"\r\n'.encode())
    body.write(b"Content-Type: text/plain; charset=utf-8\r\n\r\n")
    body.write(file_bytes)
    body.write(b"\r\n")
    
    body.write(f"--{boundary}--\r\n".encode())
    
    url = f"https://discord.com/api/v10/channels/{channel_id}/messages"
    req = urllib.request.Request(url, data=body.getvalue(), method="POST", headers={
        "Authorization": "Bot " + get_discord_token(),
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "User-Agent": "AnnieRedactie (https://nieuwsland.be, 1.0)"
    })
    try:
        resp = urllib.request.urlopen(req, context=ctx)
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"Discord file upload error {e.code}: {e.read().decode()}")
        return None

def discord_get_messages(channel_name, limit=20):
    """Get recent messages from a channel"""
    channel_id = CHANNELS.get(channel_name, channel_name)
    return discord_request("GET", f"/channels/{channel_id}/messages?limit={limit}")

def discord_get_reactions(channel_id, message_id, emoji):
    """Get users who reacted with a specific emoji"""
    emoji_encoded = urllib.parse.quote(emoji)
    return discord_request("GET", f"/channels/{channel_id}/messages/{message_id}/reactions/{emoji_encoded}")

def discord_add_reaction(channel_id, message_id, emoji):
    """Add a reaction to a message"""
    emoji_encoded = urllib.parse.quote(emoji)
    return discord_request("PUT", f"/channels/{channel_id}/messages/{message_id}/reactions/{emoji_encoded}/@me")


# ============================================================
# LLM API (Google Gemini direct, OpenRouter fallback)
# ============================================================

def _get_google_api_key():
    if "google_api_key" not in _creds_cache:
        config_path = os.path.join(os.path.expanduser("~"), ".openclaw", "openclaw.json")
        with open(config_path) as f:
            config = json.load(f)
        _creds_cache["google_api_key"] = config["models"]["providers"]["google"]["apiKey"]
    return _creds_cache["google_api_key"]

def _llm_google(prompt, system=None, max_tokens=4000, temperature=0.7):
    """Generate text via Google Gemini API directly"""
    api_key = _get_google_api_key()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    
    parts = []
    if system:
        parts.append({"text": f"System: {system}\n\n{prompt}"})
    else:
        parts.append({"text": prompt})
    
    data = {
        "contents": [{"parts": parts}],
        "generationConfig": {
            "maxOutputTokens": max_tokens,
            "temperature": temperature,
        }
    }
    
    body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, method="POST",
                                headers={"Content-Type": "application/json"})
    resp = urllib.request.urlopen(req, context=ctx, timeout=120)
    result = json.loads(resp.read())
    return result["candidates"][0]["content"]["parts"][0]["text"]

def _llm_openrouter(prompt, model="google/gemini-2.5-flash", system=None, max_tokens=4000, temperature=0.7):
    """Generate text via OpenRouter"""
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    
    data = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
    }
    
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=body,
        method="POST",
        headers={
            "Authorization": "Bearer " + get_openrouter_key(),
            "Content-Type": "application/json",
            "HTTP-Referer": "https://nieuwsland.be",
            "X-Title": "Nieuwsland Content Engine",
        }
    )
    
    resp = urllib.request.urlopen(req, context=ctx, timeout=120)
    result = json.loads(resp.read())
    return result["choices"][0]["message"]["content"]

def llm_generate(prompt, model="google/gemini-2.5-flash", system=None, max_tokens=4000, temperature=0.7):
    """Generate text - tries Google Gemini direct first, falls back to OpenRouter"""
    # Try Google Gemini direct first (faster, no OpenRouter dependency)
    try:
        return _llm_google(prompt, system=system, max_tokens=max_tokens, temperature=temperature)
    except Exception as e:
        print(f"Google Gemini direct failed: {e}, trying OpenRouter...")
    
    # Fallback to OpenRouter
    try:
        return _llm_openrouter(prompt, model=model, system=system, max_tokens=max_tokens, temperature=temperature)
    except Exception as e:
        print(f"OpenRouter also failed: {e}")
        return None


# ============================================================
# RSS PARSING
# ============================================================

RSS_FEEDS = {
    "tech": [
        ("The Verge", "https://www.theverge.com/rss/index.xml"),
        ("Ars Technica", "https://feeds.arstechnica.com/arstechnica/index"),
        ("Tweakers", "https://tweakers.net/feeds/mixed.xml"),
        ("TechCrunch", "https://techcrunch.com/feed/"),
    ],
    "belgium": [
        ("VRT NWS", "https://www.vrt.be/vrtnws/nl.rss.articles.xml"),
        ("HLN", "https://www.hln.be/rss.xml"),
        ("De Morgen", "https://www.demorgen.be/rss.xml"),
    ],
    "sport": [
        ("Sporza", "https://sporza.be/nl.rss.xml"),
        ("WielerFlits", "https://www.wielerflits.nl/feed/"),
    ],
    "world": [
        ("BBC World", "http://feeds.bbci.co.uk/news/world/rss.xml"),
        ("AP News", "https://feedx.net/rss/ap.xml"),
        ("Al Jazeera", "https://www.aljazeera.com/xml/rss/all.xml"),
    ],
    "science": [
        ("ScienceDaily", "https://www.sciencedaily.com/rss/all.xml"),
        ("EOS", "https://www.eoswetenschap.eu/rss.xml"),
    ],
    "economy": [
        ("De Tijd", "https://www.tijd.be/rss/nieuws.xml"),
    ],
    "politics": [
        ("Politico EU", "https://www.politico.eu/feed/"),
    ],
    "regional": [
        ("Nieuwsblad Regio", "https://www.nieuwsblad.be/rss/"),
        ("HLN Antwerpen", "https://www.hln.be/antwerpen/rss.xml"),
        ("HLN Gent", "https://www.hln.be/gent/rss.xml"),
        ("HLN Brussel", "https://www.hln.be/brussel/rss.xml"),
        ("HLN Leuven", "https://www.hln.be/leuven/rss.xml"),
        ("HLN Brugge", "https://www.hln.be/brugge/rss.xml"),
        ("HLN Mechelen", "https://www.hln.be/mechelen/rss.xml"),
        ("HLN Hasselt", "https://www.hln.be/hasselt/rss.xml"),
        ("HLN Oudenaarde", "https://www.hln.be/oudenaarde/rss.xml"),
    ],
}

YOUTUBE_SHORTS = [
    ("Karrewiet", "https://www.youtube.com/@KarrewietvanKetnet/shorts"),
    ("VRT NWS", "https://www.youtube.com/@vrtnws/shorts"),
    ("VTM Nieuws", "https://www.youtube.com/@vtmnieuws/shorts"),
    ("GZERO Media", "https://www.youtube.com/@GZEROMedia/shorts"),
]

def parse_rss(url, max_items=5):
    """Parse RSS feed and return list of {title, link, summary, published}"""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Nieuwsland/1.0"})
        resp = urllib.request.urlopen(req, context=ctx, timeout=15)
        raw = resp.read()
        root = ET.fromstring(raw)
        
        items = []
        # Handle both RSS 2.0 and Atom feeds
        ns = {"atom": "http://www.w3.org/2005/Atom"}
        
        # Try Atom first
        entries = root.findall(".//atom:entry", ns)
        if entries:
            for entry in entries[:max_items]:
                title = entry.findtext("atom:title", "", ns)
                link_el = entry.find("atom:link[@rel='alternate']", ns)
                if link_el is None:
                    link_el = entry.find("atom:link", ns)
                link = link_el.get("href", "") if link_el is not None else ""
                summary = entry.findtext("atom:summary", "", ns) or entry.findtext("atom:content", "", ns) or ""
                published = entry.findtext("atom:published", "", ns) or entry.findtext("atom:updated", "", ns) or ""
                items.append({"title": title.strip(), "link": link.strip(), "summary": summary[:500], "published": published})
        
        # Try RSS 2.0
        if not items:
            for item in root.findall(".//item")[:max_items]:
                title = item.findtext("title", "")
                link = item.findtext("link", "")
                summary = item.findtext("description", "")
                published = item.findtext("pubDate", "")
                items.append({"title": title.strip(), "link": link.strip(), "summary": summary[:500], "published": published})
        
        return items
    except Exception as e:
        print(f"RSS error for {url}: {e}")
        return []

def hash_url(url):
    """Create a short hash for deduplication"""
    return hashlib.md5(url.encode()).hexdigest()[:12]


# ============================================================
# GOOGLE SHEETS API (via service account)
# ============================================================

_sheets_token = None
_sheets_token_exp = 0

def _get_sheets_token():
    """Get OAuth2 token for Google Sheets/Drive using OAuth refresh token"""
    global _sheets_token, _sheets_token_exp
    
    if _sheets_token and time.time() < _sheets_token_exp - 60:
        return _sheets_token
    
    cred_path = os.path.join(_workspace(), "credentials", "google_docs_token.json")
    with open(cred_path) as f:
        creds = json.load(f)
    
    # Refresh the access token
    token_data = urllib.parse.urlencode({
        "client_id": creds["client_id"],
        "client_secret": creds["client_secret"],
        "refresh_token": creds["refresh_token"],
        "grant_type": "refresh_token",
    }).encode()
    
    req = urllib.request.Request(creds.get("token_uri", "https://oauth2.googleapis.com/token"), data=token_data, method="POST")
    resp = urllib.request.urlopen(req, context=ctx)
    result = json.loads(resp.read())
    
    _sheets_token = result["access_token"]
    _sheets_token_exp = time.time() + result.get("expires_in", 3600)
    
    # Update stored token
    creds["access_token"] = _sheets_token
    with open(cred_path, "w") as f:
        json.dump(creds, f, indent=2)
    
    return _sheets_token

def sheets_request(method, url, data=None):
    """Make a Google Sheets/Drive API request"""
    token = _get_sheets_token()
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, method=method, headers={
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
    })
    try:
        resp = urllib.request.urlopen(req, context=ctx)
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"Sheets API error {e.code}: {e.read().decode()}")
        return None

def create_spreadsheet(title):
    """Create a new Google Spreadsheet and return its ID"""
    data = {
        "properties": {"title": title},
        "sheets": [
            {"properties": {"title": "Topics", "index": 0}},
            {"properties": {"title": "Artikelen", "index": 1}},
            {"properties": {"title": "Bronnen", "index": 2}},
            {"properties": {"title": "Schrijvers", "index": 3}},
        ]
    }
    result = sheets_request("POST", "https://sheets.googleapis.com/v4/spreadsheets", data)
    if result:
        return result["spreadsheetId"]
    return None

def sheets_append(spreadsheet_id, sheet_name, rows):
    """Append rows to a sheet. rows = list of lists"""
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{urllib.parse.quote(sheet_name)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS"
    data = {"values": rows}
    return sheets_request("POST", url, data)

def sheets_read(spreadsheet_id, range_str):
    """Read values from a sheet range"""
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{urllib.parse.quote(range_str)}"
    result = sheets_request("GET", url)
    if result:
        return result.get("values", [])
    return []

def sheets_update(spreadsheet_id, range_str, values):
    """Update specific cells"""
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}/values/{urllib.parse.quote(range_str)}?valueInputOption=USER_ENTERED"
    data = {"values": values}
    return sheets_request("PUT", url, data)

def share_spreadsheet(spreadsheet_id, email, role="writer"):
    """Share spreadsheet with a user"""
    url = f"https://www.googleapis.com/drive/v3/files/{spreadsheet_id}/permissions"
    data = {"type": "user", "role": role, "emailAddress": email}
    return sheets_request("POST", url, data)


# ============================================================
# WORDPRESS REST API
# ============================================================

def wp_publish(title, content, category=None, tags=None, featured_image_url=None, status="draft"):
    """Publish article to WordPress via REST API"""
    wp = get_wp_creds()
    if not wp:
        print("No WordPress credentials for nieuwsland.be")
        return None
    
    import base64
    auth = base64.b64encode(f"{wp['username']}:{wp['app_password']}".encode()).decode()
    
    post_data = {
        "title": title,
        "content": content,
        "status": status,
    }
    if category:
        post_data["categories"] = category if isinstance(category, list) else [category]
    if tags:
        post_data["tags"] = tags if isinstance(tags, list) else [tags]
    
    body = json.dumps(post_data).encode()
    api_url = wp["url"].rstrip("/") + "/wp-json/wp/v2/posts"
    req = urllib.request.Request(api_url, data=body, method="POST", headers={
        "Authorization": "Basic " + auth,
        "Content-Type": "application/json",
        "User-Agent": "Nieuwsland/1.0",
    })
    
    try:
        resp = urllib.request.urlopen(req, context=ctx)
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"WordPress API error {e.code}: {e.read().decode()[:500]}")
        return None


# ============================================================
# IMAGE GENERATION (OpenAI DALL-E 3)
# ============================================================

def get_openai_key():
    if "openai" not in _creds_cache:
        env_path = os.path.join(_workspace(), ".env")
        with open(env_path) as f:
            for line in f:
                if line.startswith("OPENAI_API_KEY="):
                    _creds_cache["openai"] = line.split("=", 1)[1].strip()
    return _creds_cache.get("openai")

def generate_article_image(title, category, excerpt=None):
    """Generate a header image for an article using OpenAI DALL-E 3.
    Returns the image URL or None."""
    api_key = get_openai_key()
    if not api_key:
        print("⚠️ No OpenAI API key, skipping image generation")
        return None
    
    # Build a prompt for a photorealistic news header image
    # Keep it simple — overly detailed prompts make DALL-E produce more artificial results
    prompt = (
        f"Editorial press photograph: {title[:120]}. "
        f"Photojournalism style, natural lighting, candid moment. "
        f"No text, no logos, no watermarks."
    )
    
    data = {
        "model": "gpt-image-1",
        "prompt": prompt,
        "n": 1,
        "size": "1536x1024",
        "quality": "medium",
    }
    
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=body,
        method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
    )
    
    try:
        resp = urllib.request.urlopen(req, context=ctx, timeout=90)
        result = json.loads(resp.read())
        # gpt-image-1 returns base64, convert to a data URI for downstream upload
        b64_data = result["data"][0].get("b64_json")
        if b64_data:
            # Save to temp file and return as file path for upload_image_to_supabase
            import tempfile, base64
            tmp = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
            tmp.write(base64.b64decode(b64_data))
            tmp.close()
            print(f"🖼️ Image generated (gpt-image-1) for: {title[:50]}...")
            return f"file://{tmp.name}"
        # Fallback: URL-based response
        image_url = result["data"][0]["url"]
        print(f"🖼️ Image generated for: {title[:50]}...")
        return image_url
    except Exception as e:
        print(f"Image generation error: {e}")
        return None

def upload_image_to_supabase(image_url, filename):
    """Download image from URL and upload to Supabase Storage.
    Returns the public URL or the original URL if upload fails."""
    sb = get_supabase_creds()
    
    try:
        # Download/read image
        if image_url.startswith("file://"):
            local_path = image_url[7:]  # strip file://
            with open(local_path, "rb") as f:
                image_data = f.read()
            content_type = "image/png"
            import os as _os
            try:
                _os.unlink(local_path)
            except OSError:
                pass
        else:
            req = urllib.request.Request(image_url, headers={"User-Agent": "Nieuwsland/1.0"})
            resp = urllib.request.urlopen(req, context=ctx, timeout=30)
            image_data = resp.read()
            content_type = resp.headers.get("Content-Type", "image/png")
        
        # Upload to Supabase Storage (bucket: article-images)
        upload_url = f"{sb['url']}/storage/v1/object/article-images/{filename}"
        upload_req = urllib.request.Request(upload_url, data=image_data, method="POST", headers={
            "apikey": sb["key"],
            "Authorization": f"Bearer {sb['key']}",
            "Content-Type": content_type,
            "x-upsert": "true",
        })
        urllib.request.urlopen(upload_req, context=ctx, timeout=30)
        
        # Return public URL
        public_url = f"{sb['url']}/storage/v1/object/public/article-images/{filename}"
        return public_url
    except Exception as e:
        print(f"Image upload error: {e}, using original URL")
        return image_url


# ============================================================
# SUPABASE API
# ============================================================

def get_supabase_creds():
    """Returns Supabase URL and service role key"""
    if "supabase" not in _creds_cache:
        path = os.path.join(_workspace(), "credentials", "supabase-nieuwsland.json")
        with open(path) as f:
            data = json.load(f)
        _creds_cache["supabase"] = {
            "url": data["project_url"],
            "key": data["service_role_key"],
        }
    return _creds_cache["supabase"]

def supabase_request(method, table, data=None, params=""):
    """Make a Supabase REST API request using service_role key"""
    sb = get_supabase_creds()
    url = f"{sb['url']}/rest/v1/{table}{params}"
    body = json.dumps(data).encode() if data else None
    headers = {
        "apikey": sb["key"],
        "Authorization": f"Bearer {sb['key']}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    req = urllib.request.Request(url, data=body, method=method, headers=headers)
    try:
        resp = urllib.request.urlopen(req, context=ctx)
        result = resp.read().decode()
        return json.loads(result) if result else None
    except urllib.error.HTTPError as e:
        print(f"Supabase API error {e.code}: {e.read().decode()}")
        return None

def supabase_get_category_id(slug):
    """Get category ID from slug"""
    result = supabase_request("GET", "categories", params=f"?slug=eq.{slug}&select=id&limit=1")
    if result and len(result) > 0:
        return result[0]["id"]
    return None

def supabase_get_author_id(category_slug):
    """Get the assigned author ID for a category based on REDACTIEHANDBOEK mapping"""
    CATEGORY_AUTHOR = {
        "belgie": "lara-van-den-bossche",
        "regionaal": "lara-van-den-bossche",
        "politiek": "pieter-de-smet",
        "economie": "noor-el-kadi",
        "sport": "jonas-vercauteren",
        "tech": "elise-martens",
        "wetenschap": "dries-claes",
        "cultuur": "camille-dupont",
        "wereld": "tom-wouters",
        "opinie": "sofie-vermeulen",
    }
    author_slug = CATEGORY_AUTHOR.get(category_slug)
    if not author_slug:
        return None
    result = supabase_request("GET", "authors", params=f"?slug=eq.{author_slug}&select=id&limit=1")
    if result and len(result) > 0:
        return result[0]["id"]
    return None

def supabase_publish(title, content, category_slug, excerpt=None, image_url=None,
                     source_name=None, source_url=None, status="published",
                     is_featured=False, is_breaking=False, region=None,
                     skip_quality_gate=False):
    """Publish an article to Supabase. Runs quality gate first. Returns the created article or None."""
    import re as _re
    
    # Run quality gate BEFORE publishing
    if not skip_quality_gate:
        try:
            from quality_gate import run_quality_gate
            qg = run_quality_gate(title, content)
            if not qg["pass"]:
                print(f"❌ QUALITY GATE BLOCKED: {title}")
                for issue in qg["issues"]:
                    print(f"   - {issue}")
                # Post rejection to Discord #logs
                try:
                    discord_send("logs", 
                        f"🚫 **Quality Gate BLOCKED**: {title}\n"
                        f"Issues: {', '.join(qg['issues'])}")
                except:
                    pass
                return None
            # Use cleaned content
            title = qg["cleaned_title"]
            content = qg["cleaned_content"]
            print(f"✅ Quality gate passed: {title}")
        except ImportError:
            print("⚠️ quality_gate.py not found, publishing without checks")
    
    # Generate image if none provided
    if not image_url:
        try:
            cat_name = category_slug or "nieuws"
            generated_url = generate_article_image(title, cat_name, excerpt)
            if generated_url:
                # Upload to Supabase Storage for permanent hosting
                safe_slug = _re.sub(r'[^a-z0-9]', '-', title.lower()[:50])
                filename = f"{safe_slug}-{hashlib.md5(title.encode()).hexdigest()[:8]}.png"
                image_url = upload_image_to_supabase(generated_url, filename)
        except Exception as e:
            print(f"Image generation skipped: {e}")
    
    # Generate slug from title
    slug = title.lower().strip()
    slug = _re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = _re.sub(r'\s+', '-', slug)
    slug = slug[:80].rstrip('-')
    # Add hash to ensure uniqueness
    slug = f"{slug}-{hashlib.md5(title.encode()).hexdigest()[:6]}"
    
    category_id = supabase_get_category_id(category_slug)
    author_id = supabase_get_author_id(category_slug)
    
    article_data = {
        "title": title,
        "slug": slug,
        "content": content,
        "excerpt": excerpt or content[:200] + "..." if content else None,
        "image_url": image_url,
        "source_name": source_name,
        "source_url": source_url,
        "status": status,
        "is_featured": is_featured,
        "is_breaking": is_breaking,
        "region": region,
        "category_id": category_id,
        "author_id": author_id,
        "views": 0,
    }
    
    # Remove None values
    article_data = {k: v for k, v in article_data.items() if v is not None}
    
    result = supabase_request("POST", "articles", article_data)
    if result and len(result) > 0:
        return result[0]
    return None


# ============================================================
# CONTENT TRACKING (local JSON as backup)
# ============================================================

TRACKING_FILE = os.path.join(os.path.dirname(__file__), "content-tracking.json")

def load_tracking():
    """Load local content tracking"""
    if os.path.exists(TRACKING_FILE):
        with open(TRACKING_FILE) as f:
            return json.load(f)
    return {"processed_urls": [], "topics": [], "articles": []}

def save_tracking(data):
    """Save local content tracking"""
    with open(TRACKING_FILE, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def is_processed(url):
    """Check if URL was already processed"""
    tracking = load_tracking()
    return hash_url(url) in tracking["processed_urls"]

def mark_processed(url):
    """Mark URL as processed"""
    tracking = load_tracking()
    h = hash_url(url)
    if h not in tracking["processed_urls"]:
        tracking["processed_urls"].append(h)
        save_tracking(tracking)


# ============================================================
# HELPERS
# ============================================================

def now_str():
    return datetime.now().strftime("%Y-%m-%d %H:%M")

def log(agent_name, message):
    """Log to Discord #logs channel"""
    discord_send("logs", f"[{now_str()}] **{agent_name}**: {message}")
    print(f"[{now_str()}] {agent_name}: {message}")
