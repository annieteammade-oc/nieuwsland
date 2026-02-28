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
    belgie: "bg-[#F97316]",
    wereld: "bg-[#1E3A8A]",
    politiek: "bg-purple-800",
    economie: "bg-emerald-800",
    sport: "bg-red-700",
    tech: "bg-cyan-800",
    cultuur: "bg-pink-700",
    wetenschap: "bg-teal-800",
    opinie: "bg-amber-700",
    regionaal: "bg-green-800",
  };

  return (
    <Link
      href={`/categorie/${category.slug}`}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-sm transition-all duration-300 hover:scale-105 ${stylesBySlug[category.slug] ?? "bg-blue-700"}`}
    >
      <span aria-hidden>*</span>
      {category.name}
    </Link>
  );
}

