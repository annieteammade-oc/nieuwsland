import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { marked } from "marked";
import { notFound } from "next/navigation";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LiveBadge } from "@/components/LiveBadge";
import { Sidebar } from "@/components/Sidebar";
import { formatDutchDateTime } from "@/lib/format";
import { getArticleBySlug, getHomepageData, getRelatedArticles } from "@/lib/news";

export const revalidate = 300;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel niet gevonden",
    };
  }

  return {
    title: article.title,
    description: article.excerpt ?? "Nieuwsartikel op Nieuwsland.be",
    openGraph: {
      title: article.title,
      description: article.excerpt ?? "Nieuwsartikel op Nieuwsland.be",
      url: `https://nieuwsland.be/artikel/${article.slug}`,
      type: "article",
      images: article.image_url ? [{ url: article.image_url }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const [relatedArticles, homepageData] = await Promise.all([
    getRelatedArticles(article),
    getHomepageData(),
  ]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.image_url ? [article.image_url] : undefined,
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: article.author
      ? {
          "@type": "Person",
          name: article.author.name,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Nieuwsland.be",
    },
    mainEntityOfPage: `https://nieuwsland.be/artikel/${article.slug}`,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {article.image_url ? (
            <div className="relative h-[340px] w-full sm:h-[460px]">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
          ) : null}
          <div className="p-6 sm:p-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <CategoryBadge category={article.category} />
              {article.is_breaking ? <LiveBadge /> : null}
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {formatDutchDateTime(article.published_at)}
              </span>
            </div>

            <h1 className="text-2xl font-black leading-tight tracking-tight text-slate-900 sm:text-3xl">
              {article.title}
            </h1>

            {article.excerpt ? (
              <p className="text-lg text-slate-600 mt-3 leading-relaxed">
                {article.excerpt}
              </p>
            ) : null}

            <div
              className="prose prose-lg mt-8 max-w-none text-slate-800"
              dangerouslySetInnerHTML={{ __html: marked(article.content ?? "") as string }}
            />

            {article.author ? (
              <p className="mt-8 border-t border-slate-200 pt-4 text-sm text-slate-600">
                Door <Link href={`/auteur/${article.author.slug}`} className="font-semibold text-slate-800 hover:text-[#1E3A8A] hover:underline">{article.author.name}</Link>
              </p>
            ) : null}
          </div>
        </article>

        <aside className="space-y-8">
          <Sidebar latest={homepageData.latest} bestRead={homepageData.bestRead} />
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-slate-900">Gerelateerd</h2>
            <ul className="space-y-3">
              {relatedArticles.map((item) => (
                <li key={item.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                  <Link href={`/artikel/${item.slug}`} className="text-sm font-semibold text-slate-800 hover:text-[#1E3A8A]">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

