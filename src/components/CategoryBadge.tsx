import Link from "next/link";
import type { Category } from "@/lib/types";

type CategoryBadgeProps = {
  category: Category | null;
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  if (!category) {
    return null;
  }

  return (
    <Link
      href={`/categorie/${category.slug}`}
      className="inline-flex items-center rounded-sm px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white"
      style={{ backgroundColor: category.color ?? "#111827" }}
    >
      {category.name}
    </Link>
  );
}
