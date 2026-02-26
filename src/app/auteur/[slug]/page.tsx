import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryBadge } from "@/components/CategoryBadge";
import { formatDutchDateTime } from "@/lib/format";
import { getAllPublishedArticles, getCategories } from "@/lib/news";
import { createSupabaseServerClient } from "@/lib/supabase";
import type { Author, Article } from "@/lib/types";

export const revalidate = 300;

type AuthorPageProps = {
  params: Promise<{ slug: string }>;
};

async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("authors")
    .select("id,name,slug,bio,avatar_url")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return data as Author;
}

async function getArticlesByAuthor(authorId: number): Promise<Article[]> {
  const articles = await getAllPublishedArticles();
  return articles.filter((a) => a.author?.id === authorId);
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: "Auteur niet gevonden" };
  return {
    title: `${author.name} — Nieuwsland.be`,
    description: author.bio ?? `Artikelen van ${author.name} op Nieuwsland.be`,
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const articles = await getArticlesByAuthor(author.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">
          {author.name}
        </h1>
        {author.bio ? (
          <p className="mt-3 text-lg leading-relaxed text-slate-600">{author.bio}</p>
        ) : null}
        <p className="mt-2 text-sm text-slate-400">
          {articles.length} artikel{articles.length !== 1 ? "en" : ""} gepubliceerd
        </p>
      </div>

      <h2 className="mb-6 text-xl font-black uppercase tracking-tight text-slate-900">
        Artikelen
      </h2>

      <div className="space-y-4">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/artikel/${article.slug}`}
            className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-center gap-3 mb-2">
              <CategoryBadge category={article.category} />
              <span className="text-xs uppercase tracking-wide text-slate-400">
                {formatDutchDateTime(article.published_at)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">{article.title}</h3>
            {article.excerpt ? (
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">{article.excerpt.replace(/\*\*/g, '')}</p>
            ) : null}
          </Link>
        ))}

        {articles.length === 0 ? (
          <p className="text-slate-500">Nog geen artikelen gepubliceerd.</p>
        ) : null}
      </div>
    </div>
  );
}
