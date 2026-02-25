import Link from "next/link";
import { LiveBadge } from "@/components/LiveBadge";
import type { Article } from "@/lib/types";

type BreakingBannerProps = {
  items: Article[];
};

export function BreakingBanner({ items }: BreakingBannerProps) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="border-b border-red-200 bg-red-600 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <LiveBadge />
        <span className="text-xs font-bold uppercase tracking-wide">Net Binnen</span>
        <div className="flex flex-1 flex-wrap gap-x-4 gap-y-2 text-sm">
          {items.map((item) => (
            <Link key={item.id} href={`/artikel/${item.slug}`} className="hover:underline">
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

