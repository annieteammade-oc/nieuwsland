import { createSupabaseServerClient } from "@/lib/supabase";
import type { Article, Category } from "@/lib/types";
import { mockArticles, mockCategories } from "@/lib/mock-data";

type ArticleRow = Omit<Article, "category" | "author"> & {
  category: Article["category"];
  author: Article["author"];
};

function fallbackSortByDate(items: Article[]) {
  return [...items].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
  );
}

function mapArticle(row: ArticleRow): Article {
  return {
    ...row,
    category: row.category,
    author: row.author,
  };
}

async function fetchArticlesQuery() {
  const supabase = createSupabaseServerClient();

  const response = await supabase
    .from("articles")
    .select(
      `id,title,slug,excerpt,content,image_url,image_caption,source_name,source_url,
       video_url,youtube_url,region,is_featured,is_breaking,published_at,views,status,category_id,author_id,
       category:categories!articles_category_id_fkey(id,name,slug,description,color),
       author:authors!articles_author_id_fkey(id,name,slug,bio,avatar_url)`,
    )
    .eq("status", "published");

  if (response.error) {
    throw response.error;
  }

  return (response.data as ArticleRow[]).map(mapArticle);
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,slug,description,color")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    return data as Category[];
  } catch {
    return mockCategories;
  }
}

export async function getAllPublishedArticles(): Promise<Article[]> {
  try {
    const rows = await fetchArticlesQuery();
    return fallbackSortByDate(rows);
  } catch {
    return fallbackSortByDate(mockArticles);
  }
}

export async function getHomepageData() {
  const articles = await getAllPublishedArticles();

  const featured = articles.filter((item) => item.is_featured);
  const breaking = articles.filter((item) => item.is_breaking).slice(0, 4);
  const videos = articles.filter((item) => item.video_url || item.youtube_url);
  const regional = articles.filter(
    (item) => item.category?.slug === "regionaal" || Boolean(item.region),
  );
  const bestRead = [...articles].sort((a, b) => b.views - a.views).slice(0, 10);

  return {
    hero: featured[0] ?? articles[0] ?? null,
    heroSide: featured.slice(1, 3),
    featuredGrid: featured.slice(3, 9),
    latest: articles.slice(0, 12),
    mixedPrimary: articles.slice(6, 11),
    mixedSecondary: articles.slice(11, 16),
    videos: videos.slice(0, 8),
    regional: regional.slice(0, 8),
    breaking,
    bestRead,
  };
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((item) => item.slug === slug) ?? null;
}

export async function getArticlesByCategory(slug: string): Promise<Article[]> {
  const articles = await getAllPublishedArticles();
  return articles.filter((item) => item.category?.slug === slug);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getAllPublishedArticles();
  return articles.find((item) => item.slug === slug) ?? null;
}

export async function getRelatedArticles(article: Article): Promise<Article[]> {
  const articles = await getAllPublishedArticles();
  return articles
    .filter(
      (item) => item.id !== article.id && item.category?.slug === article.category?.slug,
    )
    .slice(0, 4);
}

export async function searchArticles(term: string): Promise<Article[]> {
  const query = term.trim().toLowerCase();
  if (!query) {
    return [];
  }

  const articles = await getAllPublishedArticles();
  return articles.filter((item) => {
    const haystack = `${item.title} ${item.excerpt ?? ""} ${item.content ?? ""}`.toLowerCase();
    return haystack.includes(query);
  });
}

