import Link from "next/link";
import type { Article, Category } from "@/lib/types";
import { formatDutchDate } from "@/lib/format";

type HeaderProps = {
  categories: Category[];
  topArticle?: Article | null;
};

export function Header({ categories, topArticle }: HeaderProps) {
  const vandaag = formatDutchDate(new Date().toISOString());

  return (
    <header className="border-b border-zinc-800 bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center justify-between gap-4 text-sm text-zinc-300">
          <span className="capitalize">{vandaag}</span>
          <Link href="/zoeken" aria-label="Zoeken" className="text-lg hover:text-red-300">
            ??
          </Link>
        </div>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <Link href="/" className="text-3xl font-bold tracking-tight text-white">
            Nieuwsland.be
          </Link>
          {topArticle ? (
            <Link href={`/artikel/${topArticle.slug}`} className="max-w-xl text-sm text-zinc-200 hover:text-white">
              {topArticle.title}
            </Link>
          ) : null}
        </div>
        <nav className="overflow-x-auto pb-1">
          <ul className="flex min-w-max gap-5 text-sm font-medium">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/categorie/${category.slug}`} className="whitespace-nowrap text-zinc-100 hover:text-red-300">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
