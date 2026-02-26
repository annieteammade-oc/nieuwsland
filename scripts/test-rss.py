from utils import parse_rss, RSS_FEEDS, is_processed
for cat, feeds in RSS_FEEDS.items():
    print(f"\n{cat}:")
    for name, url in feeds[:2]:
        items = parse_rss(url, 3)
        print(f"  {name}: {len(items)} items")
        for it in items[:2]:
            processed = is_processed(it["link"])
            print(f"    {'[DONE]' if processed else '[NEW]'} {it['title'][:60]}")
