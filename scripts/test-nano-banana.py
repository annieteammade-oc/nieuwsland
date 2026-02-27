"""Test Nano Banana (Gemini 2.5 Flash Image) via OpenRouter"""
import urllib.request, json, ssl, base64, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from utils import get_openrouter_key

ctx = ssl.create_default_context()
key = get_openrouter_key()

body = json.dumps({
    "model": "google/gemini-2.5-flash-image",
    "messages": [{"role": "user", "content": "Generate a satirical editorial cartoon about Belgian politics. Simple black and white line art style. Two politicians arguing about who gets credit for good weather. Include one speech bubble in Dutch."}],
    "response_format": {"type": "image"},
}).encode()

req = urllib.request.Request("https://openrouter.ai/api/v1/chat/completions", data=body, headers={
    "Authorization": f"Bearer {key}", "Content-Type": "application/json",
})

print("Requesting image from Nano Banana...")
resp = urllib.request.urlopen(req, context=ctx, timeout=90)
raw = resp.read()
# Debug: save raw response
with open(os.path.join(os.path.dirname(__file__), "..", "nano-banana-raw.json"), "wb") as f:
    f.write(raw)
data = json.loads(raw)
print(f"Keys: {list(data.keys())}")
msg = data["choices"][0]["message"]
print(f"Message keys: {list(msg.keys())}")
print(f"Content type: {type(msg.get('content'))}")
content = msg.get("content", "")
if isinstance(content, str) and len(content) > 1000:
    print(f"Content length: {len(content)} (might contain base64)")
    print(f"First 200 chars: {content[:200]}")

if isinstance(content, list):
    for part in content:
        if isinstance(part, dict):
            ptype = part.get("type", "")
            if ptype == "image_url":
                img_data = part["image_url"]["url"]
                if img_data.startswith("data:"):
                    header, b64 = img_data.split(",", 1)
                    img_bytes = base64.b64decode(b64)
                    out = os.path.join(os.path.dirname(__file__), "..", "test-nano-banana.png")
                    with open(out, "wb") as f:
                        f.write(img_bytes)
                    print(f"IMAGE SAVED: {len(img_bytes)} bytes -> {out}")
                else:
                    print(f"URL: {img_data[:200]}")
            elif ptype == "text":
                print(f"Text: {part['text'][:300]}")
            else:
                print(f"Other: {ptype} - {str(part)[:200]}")
        else:
            print(f"String: {str(part)[:200]}")
else:
    print(f"Content (string): {str(content)[:500]}")

print(f"Model: {data.get('model')}")
