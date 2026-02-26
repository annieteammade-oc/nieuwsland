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
    <header className="bg-white text-slate-900">
      {/* Top utility bar */}
      <div className="border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
          <button
            aria-label="Menu"
            className="flex items-center gap-2 text-slate-500 transition-colors hover:text-slate-900"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="block">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="hidden text-xs font-medium uppercase tracking-widest sm:inline">Menu</span>
          </button>

          <p className="text-xs capitalize tracking-wide text-slate-400">{vandaag}</p>

          <Link
            href="/zoeken"
            aria-label="Zoeken"
            className="flex items-center gap-2 text-slate-500 transition-colors hover:text-slate-900"
          >
            <span className="hidden text-xs font-medium uppercase tracking-widest sm:inline">Zoeken</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="block">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Logo */}
      <div className="py-6">
        <Link href="/" className="flex justify-center">
          <Image
            src="/logo/nieuwsland-color.png"
            alt="Nieuwsland.be"
            width={320}
            height={72}
            priority
            className="h-14 w-auto sm:h-16"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="border-b border-t border-slate-200">
        <ul className="mx-auto flex max-w-7xl items-center justify-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
          {navCategories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/categorie/${category.slug}`}
                className="inline-block px-3 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 transition-colors duration-200 hover:text-[#1E3A8A]"
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

