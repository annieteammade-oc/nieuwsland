import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type Dict = Record<string, string>;

type CategorySeed = {
  name: string;
  slug: string;
  description: string;
  color: string;
};

type AuthorSeed = {
  name: string;
  slug: string;
  bio: string;
  avatar_url: string | null;
};

type TagSeed = {
  name: string;
  slug: string;
};

type ArticleSeed = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  image_caption: string;
  category_slug: string;
  author_slug: string;
  source_name: string;
  source_url: string;
  is_featured: boolean;
  is_breaking: boolean;
  views: number;
  published_at: string;
  tags: string[];
};

const categories: CategorySeed[] = [
  { name: "Belgie", slug: "belgie", description: "Nieuws uit Belgie", color: "#b91c1c" },
  { name: "Wereld", slug: "wereld", description: "Internationaal nieuws", color: "#0f766e" },
  { name: "Politiek", slug: "politiek", description: "Binnenlandse politiek", color: "#1d4ed8" },
  { name: "Economie", slug: "economie", description: "Financieel en zakelijk", color: "#6d28d9" },
  { name: "Sport", slug: "sport", description: "Sportnieuws", color: "#ea580c" },
  { name: "Tech", slug: "tech", description: "Technologie", color: "#334155" },
  { name: "Cultuur", slug: "cultuur", description: "Kunst en media", color: "#be185d" },
  { name: "Wetenschap", slug: "wetenschap", description: "Wetenschap en innovatie", color: "#0e7490" },
  { name: "Opinie", slug: "opinie", description: "Columns en opinies", color: "#111827" },
];

const authors: AuthorSeed[] = [
  {
    name: "Sofie Van den Broeck",
    slug: "sofie-van-den-broeck",
    bio: "Politiek redacteur in Brussel.",
    avatar_url: null,
  },
  {
    name: "Thomas Peeters",
    slug: "thomas-peeters",
    bio: "Gespecialiseerd in economie en markten.",
    avatar_url: null,
  },
  {
    name: "Lina De Smet",
    slug: "lina-de-smet",
    bio: "Schrijft over technologie en wetenschap.",
    avatar_url: null,
  },
  {
    name: "Jamal Idrissi",
    slug: "jamal-idrissi",
    bio: "Sportredacteur met focus op voetbal.",
    avatar_url: null,
  },
];

const tags: TagSeed[] = [
  { name: "Live", slug: "live" },
  { name: "Analyse", slug: "analyse" },
  { name: "Brussel", slug: "brussel" },
  { name: "Beurs", slug: "beurs" },
  { name: "Voetbal", slug: "voetbal" },
  { name: "AI", slug: "ai" },
  { name: "Klimaat", slug: "klimaat" },
  { name: "Europa", slug: "europa" },
  { name: "Cultuur", slug: "cultuur" },
  { name: "Wetenschap", slug: "wetenschap" },
  { name: "Opinie", slug: "opinie" },
];

const now = Date.now();
const hoursAgo = (hours: number) => new Date(now - hours * 60 * 60 * 1000).toISOString();

const articles: ArticleSeed[] = [
  {
    title: "LIVE. Regering bereikt akkoord over federale klimaatnormen",
    slug: "live-regering-akkoord-klimaatnormen",
    excerpt: "Na nachtelijk overleg ligt er een compromis op tafel met strengere uitstootdoelen tegen 2030.",
    content:
      "De federale regering heeft na uren onderhandelen een akkoord bereikt over nieuwe klimaatnormen. Volgens bronnen bevat het plan extra investeringen in openbaar vervoer en renovatiepremies voor gezinnen.",
    image_url: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
    image_caption: "Overleg in Brussel",
    category_slug: "politiek",
    author_slug: "sofie-van-den-broeck",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: true,
    is_breaking: true,
    views: 18344,
    published_at: hoursAgo(1),
    tags: ["live", "klimaat", "brussel"],
  },
  {
    title: "Bel20 sluit hoger na sterke kwartaalcijfers van banken",
    slug: "bel20-hoger-na-sterke-kwartaalcijfers-banken",
    excerpt: "Financiele waarden trokken de Brusselse index naar een weekpiek.",
    content:
      "De Brusselse beurs sloot 1,2 procent hoger. Vooral bankaandelen presteerden sterk na beter dan verwachte kwartaalresultaten.",
    image_url: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Beursdag in Brussel",
    category_slug: "economie",
    author_slug: "thomas-peeters",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: true,
    is_breaking: false,
    views: 9244,
    published_at: hoursAgo(3),
    tags: ["beurs", "analyse"],
  },
  {
    title: "Rode Duivels starten met nieuwe bondscoach aan kwalificatiecampagne",
    slug: "rode-duivels-starten-met-nieuwe-bondscoach",
    excerpt: "De selectie telt drie debutanten voor de eerste interland van het jaar.",
    content:
      "De nieuwe bondscoach kiest voor een mix van ervaring en jeugd. In de eerste selectie zitten drie nieuwe namen uit de Jupiler Pro League.",
    image_url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Training van de Rode Duivels",
    category_slug: "sport",
    author_slug: "jamal-idrissi",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: true,
    is_breaking: false,
    views: 11203,
    published_at: hoursAgo(4),
    tags: ["voetbal"],
  },
  {
    title: "Brussel test slimme verkeerslichten met AI",
    slug: "brussel-test-slimme-verkeerslichten-met-ai",
    excerpt: "Het proefproject moet files tijdens de spits met 15 procent verminderen.",
    content:
      "De Stad Brussel start met een netwerk van slimme verkeerslichten die in realtime verkeersstromen analyseren en kruispunten aanpassen.",
    image_url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Verkeer in Brussel",
    category_slug: "tech",
    author_slug: "lina-de-smet",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: false,
    is_breaking: false,
    views: 6798,
    published_at: hoursAgo(6),
    tags: ["ai", "brussel"],
  },
  {
    title: "Nieuwe archeologische vondst werpt licht op Gallo-Romeins verleden",
    slug: "nieuwe-archeologische-vondst-gallo-romeins-verleden",
    excerpt: "Onderzoekers ontdekten een uitzonderlijk goed bewaarde site in Namen.",
    content:
      "Wetenschappers spreken van een unieke vondst die meer inzicht geeft in het dagelijkse leven in de tweede eeuw.",
    image_url: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Archeologische site",
    category_slug: "wetenschap",
    author_slug: "lina-de-smet",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: false,
    is_breaking: false,
    views: 4411,
    published_at: hoursAgo(8),
    tags: ["wetenschap"],
  },
  {
    title: "Festivalzomer kondigt recordaantal Belgische acts aan",
    slug: "festivalzomer-recordaantal-belgische-acts",
    excerpt: "Organisatoren zetten dit jaar extra in op lokaal talent.",
    content:
      "Grote zomerfestivals presenteren hun affiche met opvallend veel Belgische namen in de avondslots.",
    image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Festivalpodium",
    category_slug: "cultuur",
    author_slug: "sofie-van-den-broeck",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: false,
    is_breaking: false,
    views: 5580,
    published_at: hoursAgo(10),
    tags: ["cultuur"],
  },
  {
    title: "Europese leiders zoeken akkoord over defensiefonds",
    slug: "europese-leiders-zoeken-akkoord-over-defensiefonds",
    excerpt: "Topoverleg in Brussel focust op gezamenlijke investeringen.",
    content:
      "Tijdens een extra top in Brussel proberen de lidstaten een compromis te vinden over de financiering van een nieuw defensiefonds.",
    image_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Europese top",
    category_slug: "wereld",
    author_slug: "sofie-van-den-broeck",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: false,
    is_breaking: false,
    views: 7420,
    published_at: hoursAgo(12),
    tags: ["europa", "analyse"],
  },
  {
    title: "Opinie: Waarom stedelijke mobiliteit opnieuw moet worden uitgevonden",
    slug: "opinie-stedelijke-mobiliteit-opnieuw-uitvinden",
    excerpt: "Een pleidooi voor betaalbaar openbaar vervoer en veilige fietsinfrastructuur.",
    content:
      "Onze steden staan op een kantelpunt. Zonder structurele ingrepen blijft mobiliteit een rem op economische en sociale kansen.",
    image_url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Stedelijke mobiliteit",
    category_slug: "opinie",
    author_slug: "thomas-peeters",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: false,
    is_breaking: false,
    views: 3290,
    published_at: hoursAgo(14),
    tags: ["opinie"],
  },
  {
    title: "Brandweer rukt massaal uit na zware industriebrand in Antwerpen",
    slug: "brandweer-massaal-uit-na-zware-industriebrand-antwerpen",
    excerpt: "Bewoners krijgen het advies ramen en deuren gesloten te houden.",
    content:
      "Een grote industriebrand veroorzaakt rookhinder in meerdere wijken. De brandweer is met tientallen manschappen ter plaatse.",
    image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Industriebrand",
    category_slug: "belgie",
    author_slug: "sofie-van-den-broeck",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: false,
    is_breaking: true,
    views: 15420,
    published_at: hoursAgo(2),
    tags: ["live", "brussel"],
  },
  {
    title: "Start-up uit Gent haalt 12 miljoen euro op voor batterijtechnologie",
    slug: "startup-gent-haalt-12-miljoen-op-voor-batterijtechnologie",
    excerpt: "Investeerders geloven in een doorbraak voor snellere laadtijden.",
    content:
      "De Gentse start-up wil met de nieuwe investering haar productiecapaciteit verdrievoudigen.",
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Tech-startup",
    category_slug: "economie",
    author_slug: "thomas-peeters",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: false,
    is_breaking: false,
    views: 4988,
    published_at: hoursAgo(18),
    tags: ["analyse", "ai"],
  },
  {
    title: "Onderzoek toont aan: Noordzee warmt sneller op dan verwacht",
    slug: "onderzoek-noordzee-warmt-sneller-op-dan-verwacht",
    excerpt: "Mariene biologen waarschuwen voor impact op visbestanden.",
    content:
      "Nieuwe meetgegevens bevestigen dat de temperatuur van het zeewater sneller stijgt dan eerdere modellen voorspelden.",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Noordzee",
    category_slug: "wetenschap",
    author_slug: "lina-de-smet",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: false,
    is_breaking: false,
    views: 6102,
    published_at: hoursAgo(20),
    tags: ["wetenschap", "klimaat"],
  },
  {
    title: "Club Brugge pakt late zege in topper tegen Union",
    slug: "club-brugge-pakt-late-zege-in-topper-tegen-union",
    excerpt: "Een doelpunt in de 89e minuut beslist een intense topper.",
    content:
      "Club Brugge heeft in eigen huis een belangrijke overwinning geboekt in de titelstrijd.",
    image_url: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1200&q=80",
    image_caption: "Topper in de competitie",
    category_slug: "sport",
    author_slug: "jamal-idrissi",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: false,
    is_breaking: false,
    views: 8755,
    published_at: hoursAgo(22),
    tags: ["voetbal"],
  },
];

function parseEnv(path: string): Dict {
  const content = readFileSync(path, "utf8");
  const lines = content.split(/\r?\n/);
  const env: Dict = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    if (index === -1) {
      continue;
    }

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    env[key] = value;
  }

  return env;
}

const envPath = resolve(process.cwd(), ".env.local");
const env = parseEnv(envPath);
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL of SUPABASE_SERVICE_ROLE_KEY ontbreekt in .env.local");
}

const restUrl = `${supabaseUrl}/rest/v1`;
const headers = {
  "Content-Type": "application/json",
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
};

async function rest(path: string, options: RequestInit = {}) {
  const response = await fetch(`${restUrl}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${body}`);
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  return JSON.parse(text);
}

async function tableAvailable(table: string) {
  try {
    await rest(`/${table}?select=id&limit=1`, { method: "GET" });
    return true;
  } catch {
    return false;
  }
}

async function executeSchemaSql(sql: string) {
  const rpcCandidates = [
    { name: "exec_sql", body: { sql } },
    { name: "execute_sql", body: { sql } },
    { name: "run_sql", body: { sql } },
    { name: "query", body: { query: sql } },
  ];

  const errors: string[] = [];

  for (const candidate of rpcCandidates) {
    try {
      await rest(`/rpc/${candidate.name}`, {
        method: "POST",
        body: JSON.stringify(candidate.body),
      });
      return;
    } catch (error) {
      errors.push(`${candidate.name}: ${(error as Error).message}`);
    }
  }

  throw new Error(`Schema SQL kon niet via REST RPC uitgevoerd worden. Pogingen: ${errors.join(" | ")}`);
}

async function ensureSchema() {
  const requiredTables = ["categories", "authors", "articles", "tags", "article_tags"];

  const checks = await Promise.all(requiredTables.map((table) => tableAvailable(table)));
  const missing = requiredTables.filter((_, index) => !checks[index]);

  if (!missing.length) {
    console.log("Schema bestaat al, tabellen zijn aanwezig.");
    return;
  }

  console.log(`Ontbrekende tabellen: ${missing.join(", ")}. Probeert schema aan te maken via REST RPC...`);

  const schemaSql = `
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#000000',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS articles (
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

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS article_tags (
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read" ON articles;
DROP POLICY IF EXISTS "Public read" ON categories;
DROP POLICY IF EXISTS "Public read" ON authors;
DROP POLICY IF EXISTS "Public read" ON tags;
DROP POLICY IF EXISTS "Public read" ON article_tags;

CREATE POLICY "Public read" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read" ON authors FOR SELECT USING (true);
CREATE POLICY "Public read" ON tags FOR SELECT USING (true);
CREATE POLICY "Public read" ON article_tags FOR SELECT USING (true);
`;

  await executeSchemaSql(schemaSql);

  const postChecks = await Promise.all(requiredTables.map((table) => tableAvailable(table)));
  const stillMissing = requiredTables.filter((_, index) => !postChecks[index]);

  if (stillMissing.length) {
    throw new Error(`Schema aanmaak niet bevestigd. Nog ontbrekend: ${stillMissing.join(", ")}`);
  }

  console.log("Schema succesvol aangemaakt via REST RPC.");
}

async function upsertBaseData() {
  await rest("/categories?on_conflict=slug", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(categories),
  });

  await rest("/authors?on_conflict=slug", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(authors),
  });

  await rest("/tags?on_conflict=slug", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(tags),
  });
}

async function upsertArticlesAndRelations() {
  const categoryRows = (await rest("/categories?select=id,slug&limit=1000", { method: "GET" })) as Array<{
    id: number;
    slug: string;
  }>;
  const authorRows = (await rest("/authors?select=id,slug&limit=1000", { method: "GET" })) as Array<{
    id: number;
    slug: string;
  }>;

  const categoryBySlug = new Map(categoryRows.map((row) => [row.slug, row.id]));
  const authorBySlug = new Map(authorRows.map((row) => [row.slug, row.id]));

  const articleRows = articles.map((article) => {
    const categoryId = categoryBySlug.get(article.category_slug);
    const authorId = authorBySlug.get(article.author_slug);

    if (!categoryId || !authorId) {
      throw new Error(`Categorie of auteur ontbreekt voor artikel: ${article.slug}`);
    }

    return {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      image_url: article.image_url,
      image_caption: article.image_caption,
      category_id: categoryId,
      author_id: authorId,
      source_name: article.source_name,
      source_url: article.source_url,
      is_featured: article.is_featured,
      is_breaking: article.is_breaking,
      published_at: article.published_at,
      views: article.views,
      status: "published",
      updated_at: new Date().toISOString(),
    };
  });

  await rest("/articles?on_conflict=slug", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(articleRows),
  });

  const savedArticles = (await rest("/articles?select=id,slug&limit=1000", { method: "GET" })) as Array<{
    id: number;
    slug: string;
  }>;
  const savedTags = (await rest("/tags?select=id,slug&limit=1000", { method: "GET" })) as Array<{
    id: number;
    slug: string;
  }>;

  const articleBySlug = new Map(savedArticles.map((row) => [row.slug, row.id]));
  const tagBySlug = new Map(savedTags.map((row) => [row.slug, row.id]));

  const articleTagRows: Array<{ article_id: number; tag_id: number }> = [];

  for (const article of articles) {
    const articleId = articleBySlug.get(article.slug);
    if (!articleId) {
      continue;
    }

    for (const tagSlug of article.tags) {
      const tagId = tagBySlug.get(tagSlug);
      if (!tagId) {
        continue;
      }
      articleTagRows.push({ article_id: articleId, tag_id: tagId });
    }
  }

  if (articleTagRows.length) {
    await rest("/article_tags?on_conflict=article_id,tag_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(articleTagRows),
    });
  }
}

async function main() {
  await ensureSchema();
  await upsertBaseData();
  await upsertArticlesAndRelations();
  console.log(`Seed voltooid: ${categories.length} categorieen, ${authors.length} auteurs, ${articles.length} artikels.`);
}

main().catch((error) => {
  console.error("Seed mislukt:", error.message);
  process.exit(1);
});
