import { createSupabaseServerClient } from "@/lib/supabase";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const regions: Record<string, string> = {
  antwerpen: "Antwerpen",
  gent: "Gent",
  brussel: "Brussel",
  brugge: "Brugge",
  leuven: "Leuven",
  oudenaarde: "Oudenaarde",
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(regions).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = regions[slug] || slug;
  return { title: `Nieuws uit ${name}`, description: `Het laatste nieuws uit ${name} op Nieuwsland.be` };
}

export default async function RegioPage({ params }: Props) {
  const { slug } = await params;
  const name = regions[slug];

  if (!name) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 text-center">
        <h1 className="text-3xl font-black text-slate-900">Regio niet gevonden</h1>
        <p className="mt-4 text-slate-600">Deze regio bestaat niet. Ga terug naar de <Link href="/" className="text-[#1E3A8A] underline">homepage</Link>.</p>
      </main>
    );
  }

  const supabase = createSupabaseServerClient();
  const { data: articles } = await supabase
    .from("articles")
    .select(
      `id,title,slug,excerpt,image_url,published_at,
       category:categories!articles_category_id_fkey(id,name,slug),
       author:authors!articles_author_id_fkey(id,name,slug)`
    )
    .eq("status", "published")
    .ilike("region", `%${name}%`)
    .order("published_at", { ascending: false })
    .limit(20);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-black text-slate-900">Nieuws uit {name}</h1>
      <p className="mb-8 text-slate-500">Het laatste regionale nieuws uit {name} en omstreken.</p>

      {!articles || articles.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-8 text-center">
          <p className="text-slate-600">Er zijn nog geen artikelen voor {name}. Kom binnenkort terug!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article: any) => (
            <Link key={article.id} href={`/artikel/${article.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg">
              {article.image_url && (
                <div className="relative aspect-video overflow-hidden">
                  <Image src={article.image_url} alt={article.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              )}
              <div className="p-4">
                <h2 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-[#1E3A8A]">{article.title}</h2>
                {article.excerpt && <p className="text-sm text-slate-600 line-clamp-2">{article.excerpt}</p>}
                <p className="mt-2 text-xs text-slate-400">{new Date(article.published_at).toLocaleDateString("nl-BE")}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Andere regio&apos;s</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(regions).filter(([s]) => s !== slug).map(([s, n]) => (
            <Link key={s} href={`/regio/${s}`} className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-semibold text-slate-600 transition-all hover:border-[#1E3A8A] hover:text-[#1E3A8A]">
              {n}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
