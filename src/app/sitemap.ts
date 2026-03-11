import { MetadataRoute } from "next";
import { createSupabaseServerClient } from "@/lib/supabase";

const BASE_URL = "https://nieuwsland.be";

// Category slugs matching the site structure
const CATEGORIES = [
  "belgie",
  "wereld",
  "politiek",
  "economie",
  "sport",
  "tech",
  "cultuur",
  "wetenschap",
  "opinie",
  "regionaal",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseServerClient();

  // Fetch all published articles
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/redactie`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/privacybeleid`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/cookiebeleid`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/gebruiksvoorwaarden`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/categorie/${cat}`,
    lastModified: new Date(),
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  // Article pages
  const articlePages: MetadataRoute.Sitemap = (articles || []).map(
    (article) => ({
      url: `${BASE_URL}/artikel/${article.slug}`,
      lastModified: new Date(article.updated_at || article.created_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [...staticPages, ...categoryPages, ...articlePages];
}
