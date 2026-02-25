import Image from "next/image";
import Link from "next/link";
import { CategoryBadge } from "@/components/CategoryBadge";
import type { Article } from "@/lib/types";
import { formatTimeAgo } from "@/lib/format";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-lg">
      <Link href={`/artikel/${article.slug}`} className="relative block h-52 w-full bg-slate-100">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
        <div className="absolute left-3 top-3">
          <CategoryBadge category={article.category} />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-xl font-black uppercase leading-tight tracking-[-0.03em] text-slate-900">
          <Link href={`/artikel/${article.slug}`} className="transition-colors duration-300 hover:text-blue-900">
            {article.title}
          </Link>
        </h3>
        <p className="text-sm leading-6 text-slate-500">{article.excerpt}</p>
        <p className="mt-auto text-xs font-medium uppercase tracking-wide text-slate-500">
          {formatTimeAgo(article.published_at)} | {article.source_name ?? "Nieuwsland.be"}
        </p>
      </div>
    </article>
  );
}

