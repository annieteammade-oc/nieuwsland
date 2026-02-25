import Image from "next/image";
import Link from "next/link";
import type { Article, Category } from "@/lib/types";
import { formatDutchDate } from "@/lib/format";

type HeaderProps = {
  categories: Category[];
  topArticle?: Article | null;
};

const navOrder = [
  "belgie",
  "wereld",
  "politiek",
  "economie",
  "sport",
  "tech",
  "cultuur",
  "wetenschap",
  "opinie",
];

function orderedCategories(categories: Category[]) {
  const map = new Map(categories.map((category) => [category.slug, category]));
  return navOrder.map((slug) => map.get(slug)).filter(Boolean) as Category[];
}

export function Header({ categories }: HeaderProps) {
  const vandaag = formatDutchDate(new Date().toISOString());
  const navCategories = orderedCategories(categories);

  return (
    <header className="bg-[#1E3A8A] text-white">
      <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-8">
        <p className="text-center text-xs capitalize tracking-wide text-blue-100">{vandaag}</p>

        <div className="relative mt-3 pb-4">
          <Link href="/" className="flex justify-center transition-transform duration-300 hover:scale-105">
            <Image
              src="/logo/nieuwsland-white.svg"
              alt="Nieuwsland.be"
              width={220}
              height={50}
              priority
              className="h-10 w-auto"
            />
          </Link>

          <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-3">
            <Link
              href="/zoeken"
              aria-label="Zoeken"
              className="rounded-full border border-blue-300/60 p-2 transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#1E3A8A] active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="block">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Link>
            <button
              aria-label="Menu"
              className="rounded-full border border-blue-300/60 px-2 py-2 transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#1E3A8A] active:scale-95"
            >
              <span className="block h-0.5 w-4 bg-current" />
              <span className="mt-1 block h-0.5 w-4 bg-current" />
              <span className="mt-1 block h-0.5 w-4 bg-current" />
            </button>
          </div>
        </div>
      </div>

      <nav className="border-t border-blue-500/50 bg-[#1E3A8A]">
        <ul className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {navCategories.map((category) => (
            <li key={category.id} className="min-w-max flex-1 text-center">
              <Link
                href={`/categorie/${category.slug}`}
                className="inline-block text-xs font-bold uppercase tracking-[0.08em] text-blue-50 transition-colors duration-300 hover:text-orange-300"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

