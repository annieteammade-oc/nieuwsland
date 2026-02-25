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
    <article className="relative overflow-hidden bg-zinc-900 text-white">
      <Link href={`/artikel/${article.slug}`} className="relative block min-h-[420px]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="mb-3 flex items-center gap-3">
            <CategoryBadge category={article.category} />
            {article.is_breaking ? <LiveBadge /> : null}
          </div>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-100 sm:text-lg">{article.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
