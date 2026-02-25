import { ArticleCard } from "@/components/ArticleCard";
import type { Article } from "@/lib/types";

type ArticleGridProps = {
  articles: Article[];
  columns?: 2 | 3 | 4;
};

export function ArticleGrid({ articles, columns = 3 }: ArticleGridProps) {
  const gridClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 xl:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
  }[columns];

  return (
    <div className={`grid gap-6 ${gridClass}`}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

