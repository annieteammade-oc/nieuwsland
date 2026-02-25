import { ArticleCard } from "@/components/ArticleCard";
import type { Article } from "@/lib/types";

type ArticleGridProps = {
  articles: Article[];
  columns?: 2 | 3;
};

export function ArticleGrid({ articles, columns = 3 }: ArticleGridProps) {
  const gridClass = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3";

  return (
    <div className={`grid gap-6 ${gridClass}`}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
