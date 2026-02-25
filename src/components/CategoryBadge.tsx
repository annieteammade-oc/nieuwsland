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
    belgie: "bg-red-50 text-red-600",
    wereld: "bg-blue-50 text-blue-700",
    politiek: "bg-purple-50 text-purple-700",
    economie: "bg-green-50 text-green-700",
    sport: "bg-orange-50 text-orange-600",
    tech: "bg-cyan-50 text-cyan-700",
    cultuur: "bg-pink-50 text-pink-700",
    wetenschap: "bg-teal-50 text-teal-700",
    opinie: "bg-amber-50 text-amber-700",
    regionaal: "bg-emerald-50 text-emerald-700",
  };

  return (
    <Link
      href={`/categorie/${category.slug}`}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-105 ${stylesBySlug[category.slug] ?? "bg-blue-50 text-blue-700"}`}
    >
      <span aria-hidden>*</span>
      {category.name}
    </Link>
  );
}

