import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { formatTimeAgo } from "@/lib/format";

type SidebarProps = {
  latest: Article[];
  bestRead: Article[];
};

export function Sidebar({ latest, bestRead }: SidebarProps) {
  return (
    <aside className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-slate-900">Net Binnen</h2>
        <ul className="space-y-4">
          {latest.slice(0, 6).map((item) => (
            <li key={item.id} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
              <Link href={`/artikel/${item.slug}`} className="text-sm font-semibold text-slate-800 hover:text-blue-900">
                {item.title}
              </Link>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                {formatTimeAgo(item.published_at)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-slate-900">Meest Gelezen</h2>
        <ol className="space-y-4">
          {bestRead.slice(0, 5).map((item, index) => (
            <li key={item.id} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
              <span className="mt-1 text-xl font-black text-orange-500">{index + 1}</span>
              <div className="flex-1">
                <Link href={`/artikel/${item.slug}`} className="text-sm font-semibold text-slate-800 hover:text-blue-900">
                  {item.title}
                </Link>
                {item.image_url ? (
                  <div className="relative mt-2 h-16 w-full overflow-hidden rounded-lg">
                    <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="200px" />
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}

