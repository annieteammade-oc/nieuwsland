import type { Article, Author, Category } from "@/lib/types";

export const mockCategories: Category[] = [
  { id: 1, name: "Belgie", slug: "belgie", description: "Nieuws uit Belgie", color: "#ef4444" },
  { id: 2, name: "Wereld", slug: "wereld", description: "Internationaal nieuws", color: "#2563eb" },
  { id: 3, name: "Politiek", slug: "politiek", description: "Binnenlandse politiek", color: "#9333ea" },
  { id: 4, name: "Economie", slug: "economie", description: "Financieel en zakelijk", color: "#16a34a" },
  { id: 5, name: "Sport", slug: "sport", description: "Sportnieuws", color: "#f97316" },
  { id: 6, name: "Tech", slug: "tech", description: "Technologie", color: "#0891b2" },
  { id: 7, name: "Cultuur", slug: "cultuur", description: "Kunst en media", color: "#ec4899" },
  {
    id: 8,
    name: "Wetenschap",
    slug: "wetenschap",
    description: "Wetenschap en innovatie",
    color: "#0d9488",
  },
  { id: 9, name: "Opinie", slug: "opinie", description: "Columns en opinies", color: "#d97706" },
  { id: 10, name: "Regionaal", slug: "regionaal", description: "Lokaal nieuws uit Vlaanderen", color: "#059669" },
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
  {
    id: 5,
    name: "Mila Janssens",
    slug: "mila-janssens",
    bio: "Regionale verslaggever voor Antwerpen en Gent.",
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
  videoUrl?: string;
  youtubeUrl?: string;
  region?: string;
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
    video_url: params.videoUrl ?? null,
    youtube_url: params.youtubeUrl ?? null,
    region: params.region ?? null,
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
    title: "LIVE. Federale coalitie bereikt akkoord over energiefactuur",
    slug: "live-federale-coalitie-akkoord-energiefactuur",
    excerpt: "Na nachtelijk overleg komt er een tijdelijk plafond voor gezinnen met variabel contract.",
    content:
      "De federale regering heeft in de vroege ochtend een akkoord bereikt over een nieuwe energiemaatregel. Het pakket bevat gerichte steun voor kwetsbare gezinnen en extra investeringen in netinfrastructuur.",
    categorySlug: "politiek",
    authorId: 1,
    imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 1,
    featured: true,
    breaking: true,
    views: 24501,
  }),
  article({
    id: 2,
    title: "Brandweer massaal ter plaatse na grote loodsbrand in Antwerpen-Noord",
    slug: "loodsbrand-antwerpen-noord",
    excerpt: "Buurtbewoners kregen de vraag om ramen en deuren gesloten te houden door rookontwikkeling.",
    content:
      "De brandweer is met tientallen manschappen aanwezig in de havenzone. Volgens de eerste metingen is er geen acuut gevaar buiten de directe perimeter.",
    categorySlug: "belgie",
    authorId: 5,
    imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 2,
    breaking: true,
    region: "Antwerpen",
    views: 21990,
  }),
  article({
    id: 3,
    title: "Bel20 op hoogste peil in drie maanden dankzij bankaandelen",
    slug: "bel20-hoogste-peil-drie-maanden",
    excerpt: "Beleggers reageren positief op beter dan verwachte kwartaalresultaten in de financiele sector.",
    content:
      "De Brusselse index sloot stevig hoger. Analisten wijzen op een combinatie van sterke marges en een gunstig renteklimaat.",
    categorySlug: "economie",
    authorId: 2,
    imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 3,
    featured: true,
    views: 16420,
  }),
  article({
    id: 4,
    title: "Nieuwe bondscoach roept drie debutanten op voor kwalificatieduel",
    slug: "nieuwe-bondscoach-drie-debutanten",
    excerpt: "De Rode Duivels openen de campagne met een opvallend jonge selectie.",
    content:
      "De technische staf kiest voor vernieuwing. In de eerste selectie zitten drie spelers die voor het eerst aansluiten bij de nationale ploeg.",
    categorySlug: "sport",
    authorId: 4,
    imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 4,
    featured: true,
    videoUrl: "https://cdn.nieuwsland.be/video/duivels-selectie.mp4",
    views: 18103,
  }),
  article({
    id: 5,
    title: "Brussel test slimme verkeerslichten die files met AI voorspellen",
    slug: "brussel-test-ai-verkeerslichten",
    excerpt: "Het proefproject op twintig kruispunten moet de ochtendspits met 15 procent inkorten.",
    content:
      "Sensoren analyseren realtime verkeersstromen en passen wachttijden automatisch aan. De eerste resultaten worden binnen zes weken verwacht.",
    categorySlug: "tech",
    authorId: 3,
    imageUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 5,
    featured: true,
    videoUrl: "https://cdn.nieuwsland.be/video/slimme-kruispunten.mp4",
    views: 14502,
  }),
  article({
    id: 6,
    title: "Europese top zoekt compromis over defensiefonds en gezamenlijke aankoop",
    slug: "europese-top-defensiefonds",
    excerpt: "Leiders vergaderen in Brussel over een meerjarenbudget voor strategische investeringen.",
    content:
      "Volgens diplomatieke bronnen is er vooruitgang over de financiering, maar blijft er discussie over de verdeelsleutel tussen lidstaten.",
    categorySlug: "wereld",
    authorId: 1,
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 6,
    views: 12344,
  }),
  article({
    id: 7,
    title: "Archeologen vinden uitzonderlijk Romeins badcomplex in Namen",
    slug: "romeins-badcomplex-namen",
    excerpt: "De site is volgens onderzoekers een van de best bewaarde ontdekkingen van de afgelopen twintig jaar.",
    content:
      "Onderzoekers spreken van een unieke vondst die nieuw licht werpt op het dagelijks leven in de tweede eeuw in onze regio.",
    categorySlug: "wetenschap",
    authorId: 3,
    imageUrl: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 7,
    views: 9980,
  }),
  article({
    id: 8,
    title: "Festivalzomer zet in op Belgisch talent met recordaantal headliners",
    slug: "festivalzomer-recordaantal-headliners",
    excerpt: "Op de grote podia komen dit jaar opvallend veel binnenlandse artiesten in primetime.",
    content:
      "Organisatoren willen hun publiek dichter bij lokale acts brengen en investeren in extra podia voor opkomende bands.",
    categorySlug: "cultuur",
    authorId: 5,
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 8,
    views: 11044,
  }),
  article({
    id: 9,
    title: "Opinie. Waarom mobiliteit eindelijk als basisdienst moet worden behandeld",
    slug: "opinie-mobiliteit-basisdienst",
    excerpt: "Betaalbaar openbaar vervoer en veilige fietsroutes zijn geen luxe, maar economische noodzaak.",
    content:
      "Onze steden botsen op hun grenzen. Zonder structurele keuze voor multimodaliteit blijft fileschade oplopen en daalt de leefkwaliteit.",
    categorySlug: "opinie",
    authorId: 2,
    imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 9,
    views: 8820,
  }),
  article({
    id: 10,
    title: "LIVE VIDEO. Burgemeester geeft update over wateroverlast in Gent",
    slug: "live-video-update-wateroverlast-gent",
    excerpt: "In meerdere straten staat het water tot aan de drempel na intense regenval.",
    content:
      "De stad activeert een lokaal noodplan en opent extra opvang voor getroffen bewoners. Een nieuwe update volgt later vanavond.",
    categorySlug: "regionaal",
    authorId: 5,
    imageUrl: "https://images.unsplash.com/photo-1473447198193-6d3f5e2b8d55?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 10,
    breaking: true,
    featured: true,
    youtubeUrl: "https://www.youtube.com/watch?v=QH2-TGUlwu4",
    region: "Gent",
    views: 17412,
  }),
  article({
    id: 11,
    title: "Start-up uit Leuven haalt 18 miljoen euro op voor batterijchips",
    slug: "startup-leuven-batterijchips-18-miljoen",
    excerpt: "Het bedrijf wil de laadtijd van elektrische bussen bijna halveren.",
    content:
      "Met de nieuwe kapitaalronde plant de onderneming extra aanwervingen en een testlijn in Vlaams-Brabant.",
    categorySlug: "economie",
    authorId: 2,
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 11,
    views: 9310,
  }),
  article({
    id: 12,
    title: "Club Brugge wint topper in slotfase en klimt naar plek twee",
    slug: "club-brugge-wint-topper-slotfase",
    excerpt: "Een doelpunt in minuut 89 beslist een intense wedstrijd tegen Union.",
    content:
      "De titelstrijd blijft volledig open. De coach sprak na afloop van een cruciale mentale opsteker.",
    categorySlug: "sport",
    authorId: 4,
    imageUrl: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 12,
    videoUrl: "https://cdn.nieuwsland.be/video/club-union-highlights.mp4",
    views: 15402,
  }),
  article({
    id: 13,
    title: "Noordzee warmt sneller op dan verwacht, waarschuwen mariene biologen",
    slug: "noordzee-warmt-sneller-op",
    excerpt: "Nieuwe meetreeksen tonen een versnelling met duidelijke impact op visbestanden.",
    content:
      "Wetenschappers vragen bijkomende monitoring en sneller beleid rond beschermde zones in de Noordzee.",
    categorySlug: "wetenschap",
    authorId: 3,
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 13,
    views: 10433,
  }),
  article({
    id: 14,
    title: "Video. Hoe een Belgische robotarm artsen helpt bij precisiechirurgie",
    slug: "video-belgische-robotarm-precisiechirurgie",
    excerpt: "Onderzoekers tonen een prototype dat fouten in repetitieve handelingen beperkt.",
    content:
      "In een testomgeving presteerde de robotarm stabieler dan traditionele systemen bij micro-ingrepen.",
    categorySlug: "tech",
    authorId: 3,
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 14,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    views: 12880,
  }),
  article({
    id: 15,
    title: "Brugge voert fietsstraten uit in vijf drukke schoolomgevingen",
    slug: "brugge-voert-fietsstraten-uit",
    excerpt: "De stad wil de verkeersveiligheid rond scholen snel verhogen voor de ochtendspits.",
    content:
      "Buurtbewoners reageren overwegend positief. De eerste evaluatie volgt na de paasvakantie.",
    categorySlug: "regionaal",
    authorId: 5,
    imageUrl: "https://images.unsplash.com/photo-1517394834181-95ed159986c7?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 15,
    region: "Brugge",
    views: 7604,
  }),
  article({
    id: 16,
    title: "Brusselse musea verlengen avondopeningen na recordzomer",
    slug: "brusselse-musea-verlengen-avondopeningen",
    excerpt: "De culturele instellingen willen inspelen op het stijgende aantal jonge bezoekers.",
    content:
      "Een gezamenlijke kalender moet de stad als cultuurbestemming sterker op de kaart zetten.",
    categorySlug: "cultuur",
    authorId: 1,
    imageUrl: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 16,
    views: 6941,
  }),
  article({
    id: 17,
    title: "Wereldbank verlaagt groeiverwachting eurozone na zwakke industrie",
    slug: "wereldbank-verlaagt-groeiverwachting-eurozone",
    excerpt: "Vooral de exportgerichte maakindustrie blijft onder druk staan.",
    content:
      "Economen verwachten dat investeringen in infrastructuur op termijn voor stabilisatie kunnen zorgen.",
    categorySlug: "wereld",
    authorId: 2,
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 18,
    views: 8355,
  }),
  article({
    id: 18,
    title: "Antwerpse haven test elektrische sleepboten in pilootproject",
    slug: "antwerpse-haven-test-elektrische-sleepboten",
    excerpt: "De proef moet uitstoot in het havengebied drastisch verminderen.",
    content:
      "Havenbedrijf en rederijen meten de prestaties gedurende drie maanden onder zware operationele omstandigheden.",
    categorySlug: "regionaal",
    authorId: 5,
    imageUrl: "https://images.unsplash.com/photo-1473447198193-6d3f5e2b8d55?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 20,
    region: "Antwerpen",
    videoUrl: "https://cdn.nieuwsland.be/video/sleepboten-haven.mp4",
    views: 9181,
  }),
  article({
    id: 19,
    title: "Kamer debatteert over digitale identiteit voor elke burger",
    slug: "kamer-debat-digitale-identiteit",
    excerpt: "Oppositie vraagt bijkomende garanties rond privacy en databeheer.",
    content:
      "De bevoegde minister zegt dat het systeem vrijwillig blijft en stapsgewijs wordt uitgerold.",
    categorySlug: "politiek",
    authorId: 1,
    imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 22,
    views: 12014,
  }),
  article({
    id: 20,
    title: "Mechelen opent nieuw jeugdcentrum met esports-ruimte",
    slug: "mechelen-opent-nieuw-jeugdcentrum-esports",
    excerpt: "Het project combineert sport, gaming en huiswerkbegeleiding onder een dak.",
    content:
      "Volgens de stad wordt het centrum een proefmodel voor laagdrempelige jongerenwerking.",
    categorySlug: "regionaal",
    authorId: 5,
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 24,
    region: "Mechelen",
    views: 7054,
  }),
  article({
    id: 21,
    title: "Extra nachttreinen tussen Brussel en Parijs vanaf deze zomer",
    slug: "extra-nachttreinen-brussel-parijs",
    excerpt: "De verbinding moet het groeiende aantal weekendreizigers opvangen.",
    content:
      "Spooroperatoren spreken van een belangrijke stap naar duurzamere mobiliteit op middellange afstand.",
    categorySlug: "belgie",
    authorId: 2,
    imageUrl: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 28,
    views: 8021,
  }),
  article({
    id: 22,
    title: "Video. Wetenschappers tonen nieuwe methode om microplastics te filteren",
    slug: "video-methode-microplastics-filteren",
    excerpt: "Het systeem gebruikt biologisch afbreekbare membranen en werkt op lage energie.",
    content:
      "In labo-omstandigheden werd tot 92 procent van de deeltjes uit afvalwater gehaald.",
    categorySlug: "wetenschap",
    authorId: 3,
    imageUrl: "https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 30,
    videoUrl: "https://cdn.nieuwsland.be/video/microplastics-lab.mp4",
    views: 8730,
  }),
  article({
    id: 23,
    title: "Genk investeert in warmtenet voor drie woonwijken",
    slug: "genk-investeert-in-warmtenet",
    excerpt: "Het stadsbestuur verwacht dat 4.000 gezinnen kunnen aansluiten tegen 2028.",
    content:
      "De eerste werken starten dit najaar met steun van Vlaamse klimaatfondsen.",
    categorySlug: "regionaal",
    authorId: 5,
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 34,
    region: "Genk",
    views: 6420,
  }),
  article({
    id: 24,
    title: "Opinie. Waarom Europa nu moet kiezen voor een industriele sprint",
    slug: "opinie-europa-industriele-sprint",
    excerpt: "Zonder snelle uitvoering van investeringsplannen dreigt structureel verlies aan concurrentiekracht.",
    content:
      "De komende twee jaar worden bepalend voor productie, jobs en technologische autonomie binnen de Europese Unie.",
    categorySlug: "opinie",
    authorId: 2,
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80",
    hoursAgoValue: 36,
    views: 5710,
  }),
];

