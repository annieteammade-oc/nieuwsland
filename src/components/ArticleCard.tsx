import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { Article } from "@/lib/types";
import { formatDutchDateTime } from "@/lib/format";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden border border-zinc-200 bg-white">
      <Link href={`/artikel/${article.slug}`} className="relative block h-48 w-full bg-zinc-100">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <CategoryBadge category={article.category} />
        <h3 className="text-xl font-semibold leading-tight text-zinc-900">
          <Link href={`/artikel/${article.slug}`} className="hover:text-red-700">
            {article.title}
          </Link>
        </h3>
        <p className="text-sm leading-6 text-zinc-700">{article.excerpt}</p>
        <p className="mt-auto text-xs uppercase tracking-wide text-zinc-500">
          {formatDutchDateTime(article.published_at)}
        </p>
      </div>
    </article>
  );
}
