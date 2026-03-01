import Link from "next/link";
import type { Category } from "@/lib/types";

type CategoryBadgeProps = {
  category: Category | null;
};

// Vaste kleur per categorie — GEEN dynamische strings zodat Tailwind ze niet purgt
const BG: Record<string, string> = {
  belgie:     "#ea580c", // orange-600
  wereld:     "#1e3a8a", // blue-900
  politiek:   "#581c87", // purple-900
  economie:   "#065f46", // emerald-800
  sport:      "#b91c1c", // red-700
  tech:       "#075985", // sky-800
  cultuur:    "#9d174d", // pink-800
  wetenschap: "#134e4a", // teal-900
  opinie:     "#92400e", // amber-800
  regionaal:  "#166534", // green-800
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  if (!category) return null;

  const bg = BG[category.slug] ?? "#1e3a8a";

  return (
    <Link
      href={`/categorie/${category.slug}`}
      style={{ backgroundColor: bg, color: "#ffffff" }}
      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm transition-all duration-300 hover:scale-105 hover:opacity-90"
    >
      <span aria-hidden>●</span>
      {category.name}
    </Link>
  );
}
