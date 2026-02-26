"""
Nieuwsland.be — Setup Content Dashboard (Google Sheet)
Maakt de Sheet aan, vult headers, deelt met Dennis.
"""

import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from utils import create_spreadsheet, sheets_update, share_spreadsheet, sheets_append

SHEET_ID_FILE = os.path.join(os.path.dirname(__file__), "sheet-id.json")

def setup():
    print("📊 Google Sheet aanmaken...")
    
    # Check if already exists
    if os.path.exists(SHEET_ID_FILE):
        with open(SHEET_ID_FILE) as f:
            existing = json.load(f)
        print(f"Sheet bestaat al: {existing['id']}")
        print(f"URL: https://docs.google.com/spreadsheets/d/{existing['id']}")
        return existing["id"]
    
    # Create spreadsheet
    sheet_id = create_spreadsheet("Nieuwsland.be — Content Dashboard")
    if not sheet_id:
        print("❌ Aanmaken mislukt!")
        return None
    
    print(f"✅ Sheet aangemaakt: {sheet_id}")
    
    # Save ID
    with open(SHEET_ID_FILE, "w") as f:
        json.dump({"id": sheet_id, "url": f"https://docs.google.com/spreadsheets/d/{sheet_id}"}, f, indent=2)
    
    # Add headers
    print("📝 Headers toevoegen...")
    
    # Topics tab
    sheets_update(sheet_id, "Topics!A1:J1", [[
        "Gevonden", "Categorie", "Bron", "Titel", "Link", 
        "Score", "Reden", "Status", "Schrijver", "WP URL"
    ]])
    
    # Artikelen tab
    sheets_update(sheet_id, "Artikelen!A1:H1", [[
        "Datum", "Titel", "Categorie", "Status", "WP ID", 
        "WP URL", "Model", "Kosten (tokens)"
    ]])
    
    # Bronnen tab
    sheets_update(sheet_id, "Bronnen!A1:E1", [[
        "Categorie", "Naam", "Type", "URL", "Actief"
    ]])
    
    # Schrijvers tab
    sheets_update(sheet_id, "Schrijvers!A1:E1", [[
        "Agent", "Model", "Categorie", "Artikelen", "Status"
    ]])
    
    # Fill Bronnen tab with all RSS feeds
    print("📡 Bronnen vullen...")
    bronnen = [
        # Tech
        ["tech", "The Verge", "RSS", "https://www.theverge.com/rss/index.xml", "JA"],
        ["tech", "Ars Technica", "RSS", "https://feeds.arstechnica.com/arstechnica/index", "JA"],
        ["tech", "Tweakers", "RSS", "https://tweakers.net/feeds/mixed.xml", "JA"],
        ["tech", "TechCrunch", "RSS", "https://techcrunch.com/feed/", "JA"],
        # Belgium
        ["belgium", "VRT NWS", "RSS", "https://www.vrt.be/vrtnws/nl.rss.articles.xml", "JA"],
        ["belgium", "HLN", "RSS", "https://www.hln.be/rss.xml", "JA"],
        ["belgium", "De Morgen", "RSS", "https://www.demorgen.be/rss.xml", "JA"],
        # Sport
        ["sport", "Sporza", "RSS", "https://sporza.be/nl.rss.xml", "JA"],
        ["sport", "WielerFlits", "RSS", "https://www.wielerflits.nl/feed/", "JA"],
        # World
        ["world", "BBC World", "RSS", "http://feeds.bbci.co.uk/news/world/rss.xml", "JA"],
        ["world", "Reuters", "RSS", "https://www.reuters.com/arc/outboundfeeds/news/?outputType=xml", "JA"],
        ["world", "Al Jazeera", "RSS", "https://www.aljazeera.com/xml/rss/all.xml", "JA"],
        # Science
        ["science", "Nature", "RSS", "https://www.nature.com/nature.rss", "JA"],
        ["science", "EOS Wetenschap", "RSS", "https://www.eoswetenschap.eu/rss.xml", "JA"],
        # Economy
        ["economy", "De Tijd", "RSS", "https://www.tijd.be/rss/nieuws.xml", "JA"],
        # Politics
        ["politics", "Politico EU", "RSS", "https://www.politico.eu/feed/", "JA"],
        # YouTube Shorts
        ["video-shorts", "Karrewiet", "YouTube", "https://www.youtube.com/@KarrewietvanKetnet/shorts", "JA"],
        ["video-shorts", "VRT NWS", "YouTube", "https://www.youtube.com/@vrtnws/shorts", "JA"],
        ["video-shorts", "VTM Nieuws", "YouTube", "https://www.youtube.com/@vtmnieuws/shorts", "JA"],
        ["video-shorts", "GZERO Media", "YouTube", "https://www.youtube.com/@GZEROMedia/shorts", "JA"],
    ]
    sheets_append(sheet_id, "Bronnen", bronnen)
    
    # Fill Schrijvers tab
    print("🤖 Schrijvers vullen...")
    schrijvers = [
        ["Scout Agent", "Gemini 2.5 Flash", "alle", "0", "ACTIEF"],
        ["Tech Writer", "Gemini 2.5 Flash", "tech", "0", "ACTIEF"],
        ["Belgium Writer", "Gemini 2.5 Flash", "belgium", "0", "KLAAR"],
        ["Sport Writer", "Gemini 2.5 Flash", "sport", "0", "KLAAR"],
        ["World Writer", "Gemini 2.5 Flash", "world", "0", "KLAAR"],
        ["Editor Agent", "Gemini 2.5 Flash", "review", "0", "ACTIEF"],
        ["Media Agent", "Gemini 3 Pro", "images", "0", "GEPLAND"],
        ["SEO Agent", "Gemini 2.5 Flash", "seo", "0", "GEPLAND"],
        ["Social Agent", "Grok 4.1 Fast", "social-media", "0", "GEPLAND"],
    ]
    sheets_append(sheet_id, "Schrijvers", schrijvers)
    
    # Share with Dennis
    print("🔗 Delen met Dennis...")
    share_spreadsheet(sheet_id, "dennis.teammade@gmail.com", "writer")
    share_spreadsheet(sheet_id, "annieteammade@gmail.com", "writer")
    
    url = f"https://docs.google.com/spreadsheets/d/{sheet_id}"
    print(f"\n✅ Content Dashboard klaar!")
    print(f"📊 URL: {url}")
    
    return sheet_id

if __name__ == "__main__":
    setup()
