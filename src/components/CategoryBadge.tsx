import Link from "next/link";
import type { Category } from "@/lib/types";

type CategoryBadgeProps = {
  category: Category | null;
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  if (!category) {
    return null;
  }

  const stylesBySlug: Record<string, string> = {
    belgie: "bg-red-600 text-white",
    wereld: "bg-blue-700 text-white",
    politiek: "bg-purple-700 text-white",
    economie: "bg-green-700 text-white",
    sport: "bg-orange-600 text-white",
    tech: "bg-cyan-700 text-white",
    cultuur: "bg-pink-600 text-white",
    wetenschap: "bg-teal-700 text-white",
    opinie: "bg-amber-600 text-white",
    regionaal: "bg-emerald-700 text-white",
  };

  return (
    <Link
      href={`/categorie/${category.slug}`}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-105 ${stylesBySlug[category.slug] ?? "bg-blue-700 text-white"}`}
    >
      <span aria-hidden>*</span>
      {category.name}
    </Link>
  );
}

