import type { Article, Author, Category } from "@/lib/types";

export const mockCategories: Category[] = [
  { id: 1, name: "Belgie", slug: "belgie", description: "Nieuws uit Belgie", color: "#b91c1c" },
  { id: 2, name: "Wereld", slug: "wereld", description: "Internationaal nieuws", color: "#0f766e" },
  { id: 3, name: "Politiek", slug: "politiek", description: "Binnenlandse politiek", color: "#1d4ed8" },
  { id: 4, name: "Economie", slug: "economie", description: "Financieel en zakelijk", color: "#6d28d9" },
  { id: 5, name: "Sport", slug: "sport", description: "Sportnieuws", color: "#ea580c" },
  { id: 6, name: "Tech", slug: "tech", description: "Technologie", color: "#334155" },
  { id: 7, name: "Cultuur", slug: "cultuur", description: "Kunst en media", color: "#be185d" },
  { id: 8, name: "Wetenschap", slug: "wetenschap", description: "Wetenschap en innovatie", color: "#0e7490" },
  { id: 9, name: "Opinie", slug: "opinie", description: "Columns en opinies", color: "#111827" },
];

const mockAuthors: Author[] = [
  {
    id: 1,
    name: "Sofie Van den Broeck",
    slug: "sofie-van-den-broeck",
    bio: "Politiek redacteur in Brussel.",
    avatar_url: null,
  },
  {
    id: 2,
    name: "Thomas Peeters",
    slug: "thomas-peeters",
    bio: "Gespecialiseerd in economie en markten.",
    avatar_url: null,
  },
  {
    id: 3,
    name: "Lina De Smet",
    slug: "lina-de-smet",
    bio: "Schrijft over technologie en wetenschap.",
    avatar_url: null,
  },
  {
    id: 4,
    name: "Jamal Idrissi",
    slug: "jamal-idrissi",
    bio: "Sportredacteur met focus op voetbal.",
    avatar_url: null,
  },
];

const now = Date.now();

function hoursAgo(hours: number) {
  return new Date(now - hours * 60 * 60 * 1000).toISOString();
}

function article(params: {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categorySlug: string;
  authorId: number;
  imageUrl: string;
  hoursAgoValue: number;
  featured?: boolean;
  breaking?: boolean;
  views: number;
}): Article {
  const category = mockCategories.find((item) => item.slug === params.categorySlug) ?? null;
  const author = mockAuthors.find((item) => item.id === params.authorId) ?? null;

  return {
    id: params.id,
    title: params.title,
    slug: params.slug,
    excerpt: params.excerpt,
    content: params.content,
    image_url: params.imageUrl,
    image_caption: "Foto: Nieuwsland",
    source_name: "Nieuwsland.be",
    source_url: "https://nieuwsland.be",
    is_featured: Boolean(params.featured),
    is_breaking: Boolean(params.breaking),
    published_at: hoursAgo(params.hoursAgoValue),
    views: params.views,
    status: "published",
    category_id: category?.id ?? 1,
    author_id: params.authorId,
    category,
    author,
  };
}

export const mockArticles: Article[] = [
  article({
    id: 1,
    title: "LIVE. Regering bereikt akkoord over federale klimaatnormen",
    slug: "live-regering-akkoord-klimaatnormen",
    excerpt: "Na nachtelijk overleg ligt er een compromis op tafel met strengere uitstootdoelen tegen 2030.",
    content:
      "De federale regering heeft na uren onderhandelen een akkoord bereikt over nieuwe klimaatnormen. Volgens bronnen bevat het plan extra investeringen in openbaar vervoer en renovatiepremies voor gezinnen.",
    categorySlug: "politiek",
    authorId: 1,
    imageUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
    hoursAgoValue: 1,
    featured: true,
    breaking: true,
    views: 18344,
  }),
  article({
    id: 2,
    title: "Bel20 sluit hoger na sterke kwartaalcijfers van banken",
    slug: "bel20-hoger-na-sterke-kwartaalcijfers-banken",
    excerpt: "Financiele waarden trokken de Brusselse index naar een weekpiek.",
    content:
      "De Brusselse beurs sloot 1,2 procent hoger. Vooral bankaandelen presteerden sterk na beter dan verwachte kwartaalresultaten.",
    categorySlug: "economie",
    authorId: 2,
    imageUrl: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    hoursAgoValue: 3,
    featured: true,
    views: 9244,
  }),
  article({
    id: 3,
    title: "Rode Duivels starten met nieuwe bondscoach aan kwalificatiecampagne",
    slug: "rode-duivels-starten-met-nieuwe-bondscoach",
    excerpt: "De selectie telt drie debutanten voor de eerste interland van het jaar.",
    content:
      "De nieuwe bondscoach kiest voor een mix van ervaring en jeugd. In de eerste selectie zitten drie nieuwe namen uit de Jupiler Pro League.",
    categorySlug: "sport",
    authorId: 4,
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",
    hoursAgoValue: 4,
    featured: true,
    views: 11203,
  }),
  article({
    id: 4,
    title: "Brussel test slimme verkeerslichten met AI",
    slug: "brussel-test-slimme-verkeerslichten-met-ai",
    excerpt: "Het proefproject moet files tijdens de spits met 15 procent verminderen.",
    content:
      "De Stad Brussel start met een netwerk van slimme verkeerslichten die in realtime verkeersstromen analyseren en kruispunten aanpassen.",
    categorySlug: "tech",
    authorId: 3,
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80",
    hoursAgoValue: 6,
    views: 6798,
  }),
  article({
    id: 5,
    title: "Nieuwe archeologische vondst werpt licht op Gallo-Romeins verleden",
    slug: "nieuwe-archeologische-vondst-gallo-romeins-verleden",
    excerpt: "Onderzoekers ontdekten een uitzonderlijk goed bewaarde site in Namen.",
    content:
      "Wetenschappers spreken van een unieke vondst die meer inzicht geeft in het dagelijkse leven in de tweede eeuw.",
    categorySlug: "wetenschap",
    authorId: 3,
    imageUrl: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1200&q=80",
    hoursAgoValue: 8,
    views: 4411,
  }),
  article({
    id: 6,
    title: "Festivalzomer kondigt recordaantal Belgische acts aan",
    slug: "festivalzomer-recordaantal-belgische-acts",
    excerpt: "Organisatoren zetten dit jaar extra in op lokaal talent.",
    content:
      "Grote zomerfestivals presenteren hun affiche met opvallend veel Belgische namen in de avondslots.",
    categorySlug: "cultuur",
    authorId: 1,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    hoursAgoValue: 10,
    views: 5580,
  }),
  article({
    id: 7,
    title: "Europese leiders zoeken akkoord over defensiefonds",
    slug: "europese-leiders-zoeken-akkoord-over-defensiefonds",
    excerpt: "Topoverleg in Brussel focust op gezamenlijke investeringen.",
    content:
      "Tijdens een extra top in Brussel proberen de lidstaten een compromis te vinden over de financiering van een nieuw defensiefonds.",
    categorySlug: "wereld",
    authorId: 1,
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
    hoursAgoValue: 12,
    views: 7420,
  }),
  article({
    id: 8,
    title: "Opinie: Waarom stedelijke mobiliteit opnieuw moet worden uitgevonden",
    slug: "opinie-stedelijke-mobiliteit-opnieuw-uitvinden",
    excerpt: "Een pleidooi voor betaalbaar openbaar vervoer en veilige fietsinfrastructuur.",
    content:
      "Onze steden staan op een kantelpunt. Zonder structurele ingrepen blijft mobiliteit een rem op economische en sociale kansen.",
    categorySlug: "opinie",
    authorId: 2,
    imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80",
    hoursAgoValue: 14,
    views: 3290,
  }),
  article({
    id: 9,
    title: "Brandweer rukt massaal uit na zware industriebrand in Antwerpen",
    slug: "brandweer-massaal-uit-na-zware-industriebrand-antwerpen",
    excerpt: "Bewoners krijgen het advies ramen en deuren gesloten te houden.",
    content:
      "Een grote industriebrand veroorzaakt rookhinder in meerdere wijken. De brandweer is met tientallen manschappen ter plaatse.",
    categorySlug: "belgie",
    authorId: 1,
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    hoursAgoValue: 2,
    breaking: true,
    views: 15420,
  }),
  article({
    id: 10,
    title: "Start-up uit Gent haalt 12 miljoen euro op voor batterijtechnologie",
    slug: "startup-gent-haalt-12-miljoen-op-voor-batterijtechnologie",
    excerpt: "Investeerders geloven in een doorbraak voor snellere laadtijden.",
    content:
      "De Gentse start-up wil met de nieuwe investering haar productiecapaciteit verdrievoudigen.",
    categorySlug: "economie",
    authorId: 2,
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    hoursAgoValue: 18,
    views: 4988,
  }),
  article({
    id: 11,
    title: "Onderzoek toont aan: Noordzee warmt sneller op dan verwacht",
    slug: "onderzoek-noordzee-warmt-sneller-op-dan-verwacht",
    excerpt: "Mariene biologen waarschuwen voor impact op visbestanden.",
    content:
      "Nieuwe meetgegevens bevestigen dat de temperatuur van het zeewater sneller stijgt dan eerdere modellen voorspelden.",
    categorySlug: "wetenschap",
    authorId: 3,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    hoursAgoValue: 20,
    views: 6102,
  }),
  article({
    id: 12,
    title: "Club Brugge pakt late zege in topper tegen Union",
    slug: "club-brugge-pakt-late-zege-in-topper-tegen-union",
    excerpt: "Een doelpunt in de 89e minuut beslist een intense topper.",
    content:
      "Club Brugge heeft in eigen huis een belangrijke overwinning geboekt in de titelstrijd.",
    categorySlug: "sport",
    authorId: 4,
    imageUrl: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1200&q=80",
    hoursAgoValue: 22,
    views: 8755,
  }),
];
