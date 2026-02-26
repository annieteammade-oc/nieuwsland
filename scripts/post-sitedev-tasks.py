import sys, os, time
sys.path.insert(0, os.path.dirname(__file__))
from utils import discord_send

CH = "1476584301561647265"

tasks = [
    ("🎮 GAMES: PHP → Supabase migratie",
     "**Prioriteit:** Hoog\n**Status:** TODO\n\n"
     "De 5 games (be-politiek, belgische-voetbal-trivia, realmrunner, slime-soccer, trivia) "
     "gebruiken PHP voor scoreborden (`save_score.php`, `get_scores.php`). "
     "PHP draait niet op Vercel.\n\n"
     "**Actie:**\n"
     "- Supabase tabel `game_scores` aanmaken\n"
     "- PHP calls vervangen door JavaScript fetch() naar Supabase REST API\n"
     "- Games integreren als Next.js routes of static pages\n"
     "- Testen\n\n"
     "**Assignee:** Codex"),

    ("🔍 SEO: Meta titles & descriptions",
     "**Prioriteit:** Hoog\n**Status:** TODO\n\n"
     "Zonder WordPress moeten we zelf SEO meta beheren.\n\n"
     "**Actie:**\n"
     "- `meta_title` en `meta_description` kolommen toevoegen aan articles tabel\n"
     "- generateMetadata() in artikel/[slug]/page.tsx dynamisch maken\n"
     "- Open Graph tags (og:title, og:image, og:description)\n"
     "- Twitter Card tags\n"
     "- Canonical URLs"),

    ("📊 Schema Markup (JSON-LD)",
     "**Prioriteit:** Hoog\n**Status:** TODO\n\n"
     "**Actie:**\n"
     "- NewsArticle schema op artikelpagina's\n"
     "- Organization schema op homepage\n"
     "- BreadcrumbList schema\n"
     "- WebSite schema met SearchAction\n"
     "- Author schema per persona"),

    ("👤 Auteurspagina's & archieven",
     "**Prioriteit:** Medium\n**Status:** TODO\n\n"
     "**Actie:**\n"
     "- /auteur/[slug] route aanmaken\n"
     "- Auteur bio, avatar, lijst van artikelen\n"
     "- Link naar auteur vanuit artikelpagina\n"
     "- Mugshots genereren voor 9 persona's (AI)"),

    ("🗺️ Sitemap & robots.txt",
     "**Prioriteit:** Medium\n**Status:** TODO\n\n"
     "**Actie:**\n"
     "- Dynamische sitemap.xml (alle artikelen + categorieën)\n"
     "- robots.txt met sitemap verwijzing\n"
     "- Submit aan Google Search Console"),

    ("📰 RSS Feed",
     "**Prioriteit:** Medium\n**Status:** TODO\n\n"
     "**Actie:**\n"
     "- /feed.xml of /rss route\n"
     "- Laatste 50 artikelen\n"
     "- Per-categorie feeds"),

    ("🏠 Homepage: mock data → live data",
     "**Prioriteit:** Hoog\n**Status:** TODO\n\n"
     "De homepage valt terug op mock-data als Supabase leeg is. "
     "Nu er echte artikelen komen, moet alles smooth werken.\n\n"
     "**Actie:**\n"
     "- Mock data fallback verwijderen zodra 10+ artikelen live staan\n"
     "- Secties vullen: Meest Gelezen, Video, Regionaal"),
]

for title, body in tasks:
    msg = f"## {title}\n\n{body}"
    discord_send(CH, msg)
    time.sleep(1)
    print(f"Posted: {title}")

print("Done!")
