import Link from "next/link";
import type { Category } from "@/lib/types";

type CategoryBadgeProps = {
  category: Category | null;
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  if (!category) {
    return null;
  }

  // Altijd donkere achtergrond + witte tekst voor maximale leesbaarheid
  const stylesBySlug: Record<string, string> = {
    belgie:     "bg-orange-600 text-white",
    wereld:     "bg-blue-900 text-white",
    politiek:   "bg-purple-900 text-white",
    economie:   "bg-emerald-800 text-white",
    sport:      "bg-red-700 text-white",
    tech:       "bg-sky-800 text-white",
    cultuur:    "bg-pink-800 text-white",
    wetenschap: "bg-teal-800 text-white",
    opinie:     "bg-amber-800 text-white",
    regionaal:  "bg-green-800 text-white",
  };

  return (
    <Link
      href={`/categorie/${category.slug}`}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm transition-all duration-300 hover:scale-105 ${stylesBySlug[category.slug] ?? "bg-blue-900 text-white"}`}
    >
      <span aria-hidden>*</span>
      {category.name}
    </Link>
  );
}

