# CLAUDE.md - Nieuwsland.be

## Project
Belgian news website. Next.js 15 + Tailwind CSS + Supabase. Headless WordPress as content source.

## Design Reference
- Layout inspired by **De Morgen** (demorgen.be) and **New York Times** (nytimes.com)
- Clean, modern, lots of whitespace
- Dark header/nav, white content area
- Hero article with large image + overlay text
- Grid layout: featured articles (2-3 columns), smaller article cards below
- Sidebar with "Net Binnen" (breaking/latest), "Best Gelezen" (most read)
- Category nav bar: België, Wereld, Politiek, Economie, Sport, Tech, Cultuur, Wetenschap, Opinie
- Red accent color for breaking news / live badges
- Responsive: mobile-first

## Tech Stack
- **Framework:** Next.js 15 App Router, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (tables: articles, categories, sources, authors)
- **Content Source:** WordPress REST API (headless) OR direct Supabase
- **Auth:** None for readers (public site)
- **Deployment:** Vercel

## Supabase Schema (create these tables)
```sql
-- Categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#000000',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Authors
CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  image_caption TEXT,
  category_id INTEGER REFERENCES categories(id),
  author_id INTEGER REFERENCES authors(id),
  source_name TEXT,
  source_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived'))
);

-- Tags
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE article_tags (
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Enable RLS
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read" ON authors FOR SELECT USING (true);
CREATE POLICY "Public read" ON tags FOR SELECT USING (true);
CREATE POLICY "Public read" ON article_tags FOR SELECT USING (true);
```

## Pages to Build
1. **Homepage** (`/`) — Hero + featured grid + latest + sidebar (best gelezen, net binnen)
2. **Category page** (`/categorie/[slug]`) — Articles filtered by category, same grid layout
3. **Article page** (`/artikel/[slug]`) — Full article, related articles sidebar
4. **Search** (`/zoeken`) — Search articles by title/content

## Components Needed
- `Header` — Logo "Nieuwsland.be", category nav, search icon, date
- `Footer` — Links, copyright, social
- `HeroArticle` — Large featured article with image overlay
- `ArticleCard` — Thumbnail + category badge + title + excerpt + time
- `ArticleGrid` — Responsive grid of ArticleCards
- `Sidebar` — "Net Binnen" list + "Best Gelezen" numbered list
- `CategoryBadge` — Colored label (e.g., red for België, blue for Sport)
- `BreakingBanner` — Red banner for breaking news
- `LiveBadge` — Pulsing red dot + "Live" text

## Environment
- `.env.local` is already configured with Supabase + WordPress credentials
- Install `@supabase/supabase-js` package
- Use `@supabase/ssr` for server-side rendering

## Important
- ALL text/UI in Dutch (Nederlands)
- Use ISR (Incremental Static Regeneration) with revalidate: 300 (5 min)
- SEO: proper meta tags, Open Graph, structured data (NewsArticle schema)
- Mobile responsive
- Fast: aim for 95+ Lighthouse score
- Seed the database with 10-15 sample articles across all categories
- Add a seed script in `scripts/seed.ts` that creates categories + sample articles
