import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatDutchDateTime } from "@/lib/format";

type SidebarProps = {
  latest: Article[];
  bestRead: Article[];
};

export function Sidebar({ latest, bestRead }: SidebarProps) {
  return (
    <aside className="space-y-8">
      <section className="border border-zinc-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-bold text-zinc-900">Net Binnen</h2>
        <ul className="space-y-4">
          {latest.slice(0, 6).map((item) => (
            <li key={item.id} className="border-b border-zinc-100 pb-3 last:border-b-0 last:pb-0">
              <Link href={`/artikel/${item.slug}`} className="text-sm font-medium leading-5 text-zinc-800 hover:text-red-700">
                {item.title}
              </Link>
              <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                {formatDutchDateTime(item.published_at)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-zinc-200 bg-white p-4">
        <h2 className="mb-4 text-lg font-bold text-zinc-900">Best Gelezen</h2>
        <ol className="space-y-4">
          {bestRead.map((item, index) => (
            <li key={item.id} className="flex items-start gap-3 border-b border-zinc-100 pb-3 last:border-b-0 last:pb-0">
              <span className="mt-0.5 text-lg font-bold text-red-700">{index + 1}</span>
              <Link href={`/artikel/${item.slug}`} className="text-sm font-medium leading-5 text-zinc-800 hover:text-red-700">
                {item.title}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
