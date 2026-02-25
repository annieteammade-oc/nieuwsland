import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
        <article className="overflow-hidden border border-zinc-200 bg-white">
          {article.image_url ? (
            <div className="relative h-[340px] w-full sm:h-[440px]">
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
              <span className="text-xs uppercase tracking-wide text-zinc-500">
                {formatDutchDateTime(article.published_at)}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight text-zinc-900 sm:text-5xl">{article.title}</h1>

            {article.excerpt ? <p className="mt-5 text-lg leading-8 text-zinc-700">{article.excerpt}</p> : null}

            <div className="prose mt-8 max-w-none text-zinc-800">
              {(article.content ?? "").split("\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {article.author ? (
              <p className="mt-8 border-t border-zinc-200 pt-4 text-sm text-zinc-600">
                Door <span className="font-semibold text-zinc-800">{article.author.name}</span>
              </p>
            ) : null}
          </div>
        </article>

        <aside className="space-y-8">
          <Sidebar latest={homepageData.latest} bestRead={homepageData.bestRead} />
          <section className="border border-zinc-200 bg-white p-4">
            <h2 className="mb-4 text-lg font-bold text-zinc-900">Gerelateerd</h2>
            <ul className="space-y-3">
              {relatedArticles.map((item) => (
                <li key={item.id} className="border-b border-zinc-100 pb-3 last:border-b-0 last:pb-0">
                  <Link href={`/artikel/${item.slug}`} className="text-sm font-medium text-zinc-800 hover:text-red-700">
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
