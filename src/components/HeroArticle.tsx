import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LiveBadge } from "@/components/LiveBadge";
import type { Article } from "@/lib/types";

type HeroArticleProps = {
  article: Article | null;
};

export function HeroArticle({ article }: HeroArticleProps) {
  if (!article) {
    return null;
  }

  return (
    <article className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
      <Link href={`/artikel/${article.slug}`} className="relative block min-h-[440px]">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover opacity-70"
            priority
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="mb-4 flex items-center gap-3">
            <CategoryBadge category={article.category} />
            {article.is_breaking ? <LiveBadge /> : null}
          </div>
          <h1 className="max-w-4xl text-3xl font-black uppercase leading-tight tracking-[-0.03em] sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-100 sm:text-lg">{article.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}

