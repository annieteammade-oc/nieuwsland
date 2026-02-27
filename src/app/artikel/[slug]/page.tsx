import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { marked } from "marked";
import { notFound } from "next/navigation";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LiveBadge } from "@/components/LiveBadge";
import { Sidebar } from "@/components/Sidebar";
import { formatDutchDateTime } from "@/lib/format";
import { getArticleBySlug, getHomepageData, getRelatedArticles, getAllPublishedArticles } from "@/lib/news";

export const revalidate = 300;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Artikel niet gevonden" };
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

  const [relatedArticles, homepageData, allArticles] = await Promise.all([
    getRelatedArticles(article),
    getHomepageData(),
    getAllPublishedArticles(),
  ]);

  // "Lees meer" — mixed articles (different from related), max 6
  const leesmeerArticles = allArticles
    .filter((a) => a.id !== article.id && !relatedArticles.some((r) => r.id === a.id))
    .slice(0, 6);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.image_url ? [article.image_url] : undefined,
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: article.author
      ? { "@type": "Person", name: article.author.name }
      : undefined,
    publisher: { "@type": "Organization", name: "Nieuwsland.be" },
    mainEntityOfPage: `https://nieuwsland.be/artikel/${article.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Full-width header image */}
      {article.image_url ? (
        <div className="relative h-[340px] w-full sm:h-[500px]">
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Main article column */}
          <article className="max-w-none">
            {/* Category badge + date */}
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <CategoryBadge category={article.category} />
              {article.is_breaking ? <LiveBadge /> : null}
              <span className="text-xs tracking-wide text-slate-500">
                {formatDutchDateTime(article.published_at)}
              </span>
            </div>

            {/* Title — HLN style */}
            <h1
              className="text-slate-900"
              style={{ fontSize: "2.375rem", fontWeight: 400, lineHeight: "46px" }}
            >
              {article.title}
            </h1>

            {/* Intro/excerpt — bold */}
            {article.excerpt ? (
              <p
                className="mt-4 text-slate-800"
                style={{ fontSize: "20px", fontWeight: 700, lineHeight: "30px" }}
              >
                {article.excerpt}
              </p>
            ) : null}

            {/* Author */}
            {article.author ? (
              <div className="mt-4 flex items-center gap-3">
                {article.author.avatar_url ? (
                  <Image
                    src={article.author.avatar_url}
                    alt={article.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : null}
                <div>
                  <p className="text-sm text-slate-700">
                    Door{" "}
                    <Link
                      href={`/auteur/${article.author.slug}`}
                      className="font-bold text-slate-900 hover:text-[#1E3A8A] hover:underline"
                    >
                      {article.author.name}
                    </Link>
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatDutchDateTime(article.published_at)}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Divider */}
            <hr className="my-6 border-slate-200" />

            {/* Body text */}
            <div
              className="prose max-w-none text-slate-800"
              style={{ fontSize: "18px", lineHeight: "27px" }}
              dangerouslySetInnerHTML={{
                __html: marked(article.content ?? "") as string,
              }}
            />

            {/* Ook interessant voor jou */}
            {relatedArticles.length > 0 ? (
              <section className="mt-12 border-t border-slate-200 pt-8">
                <h2 className="mb-5 text-lg font-bold text-slate-900">
                  Ook interessant voor jou
                </h2>
                <ul className="space-y-4">
                  {relatedArticles.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/artikel/${item.slug}`}
                        className="flex items-start gap-4 group"
                      >
                        {item.image_url ? (
                          <div className="relative h-[80px] w-[120px] flex-shrink-0 overflow-hidden rounded-lg">
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="120px"
                            />
                          </div>
                        ) : (
                          <div className="h-[80px] w-[120px] flex-shrink-0 rounded-lg bg-slate-200" />
                        )}
                        <span
                          className="font-semibold text-slate-800 group-hover:text-[#1E3A8A]"
                          style={{ fontSize: "20px", lineHeight: "26px" }}
                        >
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Lees meer — overlay grid */}
            {leesmeerArticles.length > 0 ? (
              <section className="mt-12 border-t border-slate-200 pt-8">
                <h2 className="mb-5 text-lg font-bold text-slate-900">Lees meer</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {leesmeerArticles.map((item) => (
                    <Link
                      key={item.id}
                      href={`/artikel/${item.slug}`}
                      className="group relative block h-[220px] overflow-hidden rounded-xl"
                    >
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-300" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <span className="absolute bottom-0 left-0 right-0 p-4 text-lg font-bold leading-tight text-white">
                        {item.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            <Sidebar latest={homepageData.latest} bestRead={homepageData.bestRead} />
          </aside>
        </div>
      </div>

      {/* Nieuwsbrief + Tip staan in de Footer component */}
    </>
  );
}
