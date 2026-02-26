"""Create Supabase tables for Nieuwsland.be"""
import psycopg2

DB_URL = "postgresql://postgres:ANNIE%2BJn%2FpuX2j5gB-T9@db.ndeebbjlsuhcewllolvp.supabase.co:5432/postgres"

SQL = """
-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT
);

-- Authors
CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT
);

-- Articles
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  image_url TEXT,
  image_caption TEXT,
  source_name TEXT,
  source_url TEXT,
  video_url TEXT,
  youtube_url TEXT,
  region TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_breaking BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  category_id INTEGER REFERENCES categories(id),
  author_id INTEGER REFERENCES authors(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public read categories" ON categories;
  DROP POLICY IF EXISTS "Public read authors" ON authors;
  DROP POLICY IF EXISTS "Public read published articles" ON articles;
  DROP POLICY IF EXISTS "Service role full access categories" ON categories;
  DROP POLICY IF EXISTS "Service role full access authors" ON authors;
  DROP POLICY IF EXISTS "Service role full access articles" ON articles;
END $$;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read authors" ON authors FOR SELECT USING (true);
CREATE POLICY "Public read published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Service role full access categories" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access authors" ON authors FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access articles" ON articles FOR ALL USING (auth.role() = 'service_role');

-- Seed categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('België', 'belgie', 'Nieuws uit België', '#ef4444'),
  ('Wereld', 'wereld', 'Internationaal nieuws', '#2563eb'),
  ('Politiek', 'politiek', 'Binnenlandse politiek', '#9333ea'),
  ('Economie', 'economie', 'Financieel en zakelijk', '#16a34a'),
  ('Sport', 'sport', 'Sportnieuws', '#f97316'),
  ('Tech', 'tech', 'Technologie', '#0891b2'),
  ('Cultuur', 'cultuur', 'Kunst en media', '#ec4899'),
  ('Wetenschap', 'wetenschap', 'Wetenschap en innovatie', '#0d9488'),
  ('Opinie', 'opinie', 'Columns en opinies', '#d97706'),
  ('Regionaal', 'regionaal', 'Lokaal nieuws uit Vlaanderen', '#059669')
ON CONFLICT (slug) DO NOTHING;

-- Seed authors (redactie persona's)
INSERT INTO authors (name, slug, bio) VALUES
  ('Lara Van den Bossche', 'lara-van-den-bossche', 'Binnenland & Regionaal — snel, helder, menselijk'),
  ('Pieter De Smet', 'pieter-de-smet', 'Politiek & Duiding — analytisch, context-first'),
  ('Noor El Kadi', 'noor-el-kadi', 'Economie & Werk — concreet, cijfermatig'),
  ('Jonas Vercauteren', 'jonas-vercauteren', 'Sport — energiek, tactische duiding'),
  ('Elise Martens', 'elise-martens', 'Tech & AI — helder, begrippen uitgelegd'),
  ('Dries Claes', 'dries-claes', 'Wetenschap — nauwkeurig, nuance'),
  ('Camille Dupont', 'camille-dupont', 'Cultuur & Entertainment — levendig, beschrijvend'),
  ('Tom Wouters', 'tom-wouters', 'Wereldnieuws — bondig, update-gericht'),
  ('Sofie Vermeulen', 'sofie-vermeulen', 'Opinie & Columns — scherp maar fair')
ON CONFLICT (slug) DO NOTHING;
"""

conn = psycopg2.connect(DB_URL)
conn.autocommit = True
cur = conn.cursor()
cur.execute(SQL)
cur.close()
conn.close()
print("✅ Tables created + categories & authors seeded!")
