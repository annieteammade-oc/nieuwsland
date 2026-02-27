"""
Nieuwsland.be — Cartoonist Agent
Genereert dagelijks 1 editoriale cartoon op basis van het meest interessante artikel.
Post naar Discord #cartoons + upload naar Supabase Storage.
Draait via cron dagelijks om 10:00 Brussel-tijd.
"""

import sys, os, json, re, time, hashlib
sys.path.insert(0, os.path.dirname(__file__))
from utils import (
    discord_send, discord_send_with_file, log, llm_generate,
    get_openai_key, get_supabase_creds, supabase_request,
    now_str, CHANNELS
)
import urllib.request, urllib.parse, ssl
from datetime import datetime, timezone, timedelta

ctx = ssl.create_default_context()

DB_URL = "postgresql://postgres:ANNIE%2BJn%2FpuX2j5gB-T9@db.ndeebbjlsuhcewllolvp.supabase.co:5432/postgres"

# ============================================================
# STEP 1: Fetch today's articles from Supabase
# ============================================================

def fetch_todays_articles():
    """Fetch articles published in the last 24h from Supabase via REST API"""
    sb = get_supabase_creds()
    yesterday = (datetime.now(timezone.utc) - timedelta(hours=24)).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    params = (
        f"?select=id,title,excerpt,content,slug,source_name,source_url,created_at,is_featured,is_breaking"
        f"&status=eq.published"
        f"&created_at=gte.{yesterday}"
        f"&order=created_at.desc"
        f"&limit=20"
    )
    
    articles = supabase_request("GET", "articles", params=params)
    if not articles:
        print("No articles found, trying last 48h...")
        yesterday2 = (datetime.now(timezone.utc) - timedelta(hours=48)).strftime("%Y-%m-%dT%H:%M:%SZ")
        params2 = params.replace(yesterday, yesterday2)
        articles = supabase_request("GET", "articles", params=params2)
    
    return articles or []


# ============================================================
# STEP 2: Pick best article + generate cartoon concept via LLM
# ============================================================

def generate_cartoon_concept(articles):
    """Use LLM to pick the best article and create a cartoon concept"""
    if not articles:
        print("No articles to pick from")
        return None
    
    # Build article summaries for LLM
    article_list = ""
    for i, a in enumerate(articles):
        excerpt = (a.get("excerpt") or a.get("content", "")[:200]).strip()
        article_list += f"\n{i+1}. **{a['title']}**\n   {excerpt}\n"
    
    system = """Je bent een briljante Belgische editoriale cartoonist, in de stijl van Lectrr, Kroll en GAL.
Je maakt scherpe, satirische cartoons met een duidelijke mening. Je denkt visueel.

Je output is ALTIJD exact dit JSON-formaat (geen markdown codeblocks, puur JSON):
{
  "article_index": <nummer van gekozen artikel, 1-indexed>,
  "reason": "<waarom dit artikel het beste is voor een cartoon>",
  "concept": "<gedetailleerde beschrijving van de cartoon: scène, personages, visuele metafoor, gezichtsuitdrukkingen, setting>",
  "dalle_prompt": "<Engelse DALL-E prompt, max 900 chars. Beschrijf: editorial cartoon style, hand-drawn ink illustration, bold lines, crosshatching, satirical exaggeration, newspaper editorial cartoon aesthetic. Beschrijf de EXACTE scène, personages, hun poses, gezichtsuitdrukkingen, objecten, achtergrond. GEEN tekst in het beeld.>",
  "caption_nl": "<grappig/scherp onderschrift in het Nederlands, max 2 regels>"
}"""

    prompt = f"""Hier zijn de artikelen van vandaag op Nieuwsland.be:
{article_list}

Kies het artikel dat zich het BESTE leent voor een editoriale cartoon.
Denk aan: controverse, politiek, absurditeit, ironie, maatschappelijk debat.
Maak een briljant cartoonconcept met een sterke visuele metafoor."""

    result = llm_generate(prompt, model="google/gemini-2.5-flash", system=system, max_tokens=1500, temperature=0.8)
    if not result:
        print("LLM failed to generate concept")
        return None
    
    # Parse JSON from response
    try:
        # Strip markdown code blocks if present
        cleaned = result.strip()
        # Remove markdown code fences
        cleaned = re.sub(r'^```(?:json)?\s*\n?', '', cleaned)
        cleaned = re.sub(r'\n?```\s*$', '', cleaned)
        concept = json.loads(cleaned)
        
        # Attach the chosen article
        idx = concept.get("article_index", 1) - 1
        if 0 <= idx < len(articles):
            concept["article"] = articles[idx]
        else:
            concept["article"] = articles[0]
        
        return concept
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}\nRaw: {result[:500]}")
        return None


# ============================================================
# STEP 3: Generate cartoon image via DALL-E 3
# ============================================================

def generate_cartoon_image(dalle_prompt):
    """Generate editorial cartoon via DALL-E 3"""
    api_key = get_openai_key()
    if not api_key:
        print("No OpenAI API key")
        return None
    
    # Ensure the prompt emphasizes cartoon style
    full_prompt = (
        f"Editorial newspaper cartoon in black ink and watercolor wash style. "
        f"Hand-drawn illustration with bold expressive lines, crosshatching, and satirical exaggeration. "
        f"Style of European editorial cartoons (Belgian/French tradition). "
        f"NO photorealism, NO 3D rendering, NO AI-looking art. "
        f"NO text, NO speech bubbles, NO labels, NO words in the image. "
        f"{dalle_prompt}"
    )
    
    # Truncate to DALL-E limit
    full_prompt = full_prompt[:3900]
    
    data = {
        "model": "dall-e-3",
        "prompt": full_prompt,
        "n": 1,
        "size": "1024x1024",
        "quality": "standard",
        "style": "vivid",
    }
    
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations",
        data=body, method="POST",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
    )
    
    try:
        resp = urllib.request.urlopen(req, context=ctx, timeout=90)
        result = json.loads(resp.read())
        image_url = result["data"][0]["url"]
        revised_prompt = result["data"][0].get("revised_prompt", "")
        print(f"🎨 Cartoon generated!")
        if revised_prompt:
            print(f"   Revised prompt: {revised_prompt[:100]}...")
        return image_url
    except Exception as e:
        print(f"DALL-E error: {e}")
        return None


# ============================================================
# STEP 4: Upload to Supabase Storage
# ============================================================

def upload_cartoon_to_supabase(image_url):
    """Download image and upload to Supabase Storage bucket 'article-images'"""
    sb = get_supabase_creds()
    
    try:
        # Download
        req = urllib.request.Request(image_url, headers={"User-Agent": "Nieuwsland/1.0"})
        resp = urllib.request.urlopen(req, context=ctx, timeout=30)
        image_data = resp.read()
        
        # Upload
        date_str = datetime.now().strftime("%Y-%m-%d")
        filename = f"cartoons/cartoon-{date_str}.png"
        
        upload_url = f"{sb['url']}/storage/v1/object/article-images/{filename}"
        upload_req = urllib.request.Request(upload_url, data=image_data, method="POST", headers={
            "apikey": sb["key"],
            "Authorization": f"Bearer {sb['key']}",
            "Content-Type": "image/png",
            "x-upsert": "true",
        })
        urllib.request.urlopen(upload_req, context=ctx, timeout=30)
        
        public_url = f"{sb['url']}/storage/v1/object/public/article-images/{filename}"
        print(f"📤 Uploaded to Supabase: {public_url}")
        return public_url
    except Exception as e:
        print(f"Upload error: {e}")
        return None


# ============================================================
# STEP 5: Post to Discord #cartoons
# ============================================================

def post_cartoon_to_discord(concept, image_url, supabase_url=None):
    """Post cartoon to Discord #cartoons channel with image embed"""
    article = concept.get("article", {})
    caption = concept.get("caption_nl", "")
    
    message = (
        f"🎨 **Cartoon van de dag**\n\n"
        f"*{caption}*\n\n"
        f"Gebaseerd op: **{article.get('title', 'Onbekend')}**"
    )
    
    # Send with image embed
    embed = {
        "title": "🎨 Cartoon van de dag",
        "description": f"*{caption}*",
        "image": {"url": image_url},
        "color": 0xFF6B35,
        "footer": {"text": f"Nieuwsland.be • {datetime.now().strftime('%d/%m/%Y')}"},
        "fields": [
            {
                "name": "Gebaseerd op",
                "value": article.get("title", "—"),
                "inline": False,
            }
        ],
    }
    
    # Use supabase URL in embed if available (DALL-E URLs expire)
    if supabase_url:
        embed["image"]["url"] = supabase_url
    
    channel_id = CHANNELS["cartoons"]
    from utils import discord_request
    data = {"content": message[:500], "embeds": [embed]}
    result = discord_request("POST", f"/channels/{channel_id}/messages", data)
    
    if result:
        print(f"✅ Cartoon posted to Discord #cartoons")
    else:
        print("❌ Failed to post to Discord")
    
    return result


# ============================================================
# MAIN
# ============================================================

def run():
    print(f"[{now_str()}] 🎨 Cartoonist agent gestart")
    log("Cartoonist", "🎨 Cartoonist agent gestart — dagelijkse cartoon genereren")
    
    # 1. Fetch articles
    articles = fetch_todays_articles()
    if not articles:
        msg = "Geen artikelen gevonden voor cartoon — skip"
        print(msg)
        log("Cartoonist", f"⚠️ {msg}")
        return
    
    print(f"📰 {len(articles)} artikelen gevonden")
    
    # 2. Pick article + generate concept
    concept = generate_cartoon_concept(articles)
    if not concept:
        log("Cartoonist", "❌ Kon geen cartoonconcept genereren")
        return
    
    print(f"💡 Concept: {concept.get('caption_nl', '?')}")
    print(f"   Artikel: {concept.get('article', {}).get('title', '?')}")
    
    # 3. Generate image
    image_url = generate_cartoon_image(concept.get("dalle_prompt", ""))
    if not image_url:
        log("Cartoonist", "❌ DALL-E kon geen cartoon genereren")
        return
    
    # 4. Upload to Supabase
    supabase_url = upload_cartoon_to_supabase(image_url)
    
    # 5. Post to Discord
    post_cartoon_to_discord(concept, image_url, supabase_url)
    
    log("Cartoonist", 
        f"✅ Cartoon van de dag gepost!\n"
        f"📰 Artikel: **{concept.get('article', {}).get('title', '?')}**\n"
        f"💬 Caption: *{concept.get('caption_nl', '')}*")
    
    print(f"[{now_str()}] 🎨 Cartoonist klaar!")


if __name__ == "__main__":
    run()
