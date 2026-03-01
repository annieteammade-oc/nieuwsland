import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArticleGrid } from "@/components/ArticleGrid";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LiveBadge } from "@/components/LiveBadge";
import { Sidebar } from "@/components/Sidebar";
import { VideoShorts } from "@/components/VideoSections";
import { getHomepageData } from "@/lib/news";
import { formatTimeAgo } from "@/lib/format";
import type { Article } from "@/lib/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Voorpagina",
  description: "De voorpagina van Nieuwsland.be met de belangrijkste verhalen van de dag.",
  openGraph: {
    title: "Nieuwsland.be Voorpagina",
    description: "Ontdek het belangrijkste nieuws van vandaag op Nieuwsland.be.",
    url: "https://nieuwsland.be",
  },
};

function SectionTitle({
  title,
  subtitle,
  inverse = false,
}: {
  title: string;
  subtitle?: string;
  inverse?: boolean;
}) {
  return (
    <div className={`mb-5 flex items-end justify-between gap-3 border-b pb-3 ${inverse ? "border-blue-300/50" : "border-slate-200"}`}>
      <h2 className={`text-2xl font-black uppercase tracking-tight ${inverse ? "text-white" : "text-slate-900"}`}>{title}</h2>
      {subtitle ? <p className={`text-sm ${inverse ? "text-blue-100" : "text-slate-500"}`}>{subtitle}</p> : null}
    </div>
  );
}

function MixedNews({ items }: { items: Article[] }) {
  const [lead, ...rest] = items;
  if (!lead) return null;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <Link href={`/artikel/${lead.slug}`} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-72 bg-slate-100">
          {lead.image_url ? <Image src={lead.image_url} alt={lead.title} fill className="object-cover" sizes="60vw" /> : null}
          <div className="absolute left-4 top-4">
            <CategoryBadge category={lead.category} />
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-2xl font-black uppercase leading-tight tracking-tight text-slate-900">{lead.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{lead.excerpt}</p>
        </div>
      </Link>
      <div className="space-y-3">
        {rest.slice(0, 4).map((item) => (
          <Link
            key={item.id}
            href={`/artikel/${item.slug}`}
            className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
              {item.image_url ? <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="120px" /> : null}
            </div>
            <div>
              <p className="text-sm font-black uppercase leading-tight tracking-tight text-slate-900">{item.title}</p>
              <p className="mt-1 text-xs uppercase text-slate-500">{formatTimeAgo(item.published_at)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Dedup: verwijder artikelen die al in usedIds zitten
function dedup(items: Article[], usedIds: Set<number>, max: number): Article[] {
  const result = items.filter((a) => !usedIds.has(a.id)).slice(0, max);
  result.forEach((a) => usedIds.add(a.id));
  return result;
}

export default async function HomePage() {
  const data = await getHomepageData();
  const hero = data.hero;
  if (!hero) return null;

  // Globale dedup tracker — elk artikel mag maar 1x op de homepage
  const used = new Set<number>();
  used.add(hero.id);

  // Hero side items
  const heroSide = dedup(data.heroSide.length >= 4 ? data.heroSide : data.latest, used, 4);

  // Nieuws van vandaag — recente items (nog niet gebruikt)
  const vandaagItems = dedup(data.latest, used, 8);

  // Categorie-secties — filter op categorie slug, dedup
  const bySlug = (slug: string) =>
    dedup(data.latest.filter((a) => a.category?.slug === slug), used, 6);

  const sportItems    = bySlug("sport");
  const techItems     = bySlug("tech");
  const politiekItems = bySlug("politiek");
  const cultuurItems  = bySlug("cultuur");
  const wereldItems   = bySlug("wereld");
  const belgieItems   = bySlug("belgie");

  // Actualiteit — mix van recente items
  const actualiteitItems = dedup(data.latest, used, 5);

  // Meer nieuws — resterende niet-gebruikte items
  const meerItems = dedup(data.latest, used, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 pt-5 pb-6 sm:px-6 lg:px-8">
      {/* Trending ticker */}
      <section className="mb-5 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-4 overflow-hidden">
          <span className="flex-shrink-0 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase text-white">Trending</span>
          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee-slow flex whitespace-nowrap gap-8">
              {[...data.latest.slice(0, 5), ...data.latest.slice(0, 5)].map((item, i) => (
                <Link key={`${item.id}-${i}`} href={`/artikel/${item.slug}`} className="inline-block text-sm font-semibold text-slate-700 hover:text-[#F97316] whitespace-nowrap">
                  <span className="mr-2 text-orange-500">{(i % 5) + 1}.</span>{item.title.length > 50 ? item.title.slice(0, 50) + "…" : item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero + sidebar */}
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr] entrance-fade">
        <div className="space-y-6">
          {/* Hero */}
          <article className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl">
            <Link href={`/artikel/${hero.slug}`} className="relative block min-h-[420px]">
              {hero.image_url ? (
                <Image src={hero.image_url} alt={hero.title} fill className="object-cover opacity-75" priority sizes="66vw" />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="mb-3 flex items-center gap-3">
                  <CategoryBadge category={hero.category} />
                  {hero.is_breaking ? <LiveBadge /> : null}
                </div>
                <h1 className="max-w-3xl text-2xl font-black uppercase leading-tight tracking-[-0.03em] sm:text-3xl">
                  {hero.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">{hero.excerpt}</p>
              </div>
            </Link>
          </article>

          {/* 4 sub-hero items */}
          <div className="grid grid-cols-2 gap-4">
            {heroSide.map((item) => (
              <Link
                key={item.id}
                href={`/artikel/${item.slug}`}
                className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  {item.image_url ? <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="120px" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <CategoryBadge category={item.category} />
                  <p className="mt-1 text-xs font-black uppercase leading-tight tracking-tight text-slate-900 line-clamp-2">{item.title}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{formatTimeAgo(item.published_at)}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Nieuws van Vandaag */}
          <div>
            <SectionTitle title="Nieuws van Vandaag" subtitle="Laatste updates" />
            <ArticleGrid articles={vandaagItems} columns={2} />
          </div>
        </div>

        <aside className="space-y-6">
          <Sidebar latest={data.latest} bestRead={data.bestRead} />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-black uppercase tracking-tight text-slate-900">Cartoon van de Dag</h3>
            {data.cartoonUrl ? (
              <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                <Image src={data.cartoonUrl} alt="Cartoon van de dag" fill className="object-contain" sizes="300px" />
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                <span className="text-6xl">🎨</span>
              </div>
            )}
          </div>
        </aside>
      </section>

      {/* Breaking ticker */}
      {data.breaking.length > 0 && (
        <section className="mt-6 overflow-hidden rounded-2xl bg-[#F97316] px-5 py-3 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex-shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase text-[#F97316]">Breaking</span>
            <div className="relative flex-1 overflow-hidden">
              <div className="animate-marquee flex whitespace-nowrap gap-8">
                {[...data.breaking, ...data.breaking].map((item, i) => (
                  <Link key={`${item.id}-${i}`} href={`/artikel/${item.slug}`} className="inline-block text-sm font-semibold text-white hover:text-orange-200 whitespace-nowrap">
                    ● {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Actualiteit */}
      <section className="mt-10">
        <SectionTitle title="Actualiteit" subtitle="Het laatste nieuws" />
        <MixedNews items={actualiteitItems} />
      </section>

      {/* Video Nieuws */}
      <section className="mt-10 rounded-3xl bg-slate-900 p-6 text-white">
        <div className="mb-5 flex items-end justify-between gap-3 border-b border-white/20 pb-3">
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">Video Nieuws</h2>
          <Link href="/videos" className="text-sm font-semibold text-orange-400 hover:underline">Alle video&apos;s →</Link>
        </div>
        <VideoShorts videos={data.videos} />
      </section>

      {/* Meer Nieuws */}
      {meerItems.length > 0 && (
        <section className="mt-10">
          <SectionTitle title="Meer Nieuws" />
          <MixedNews items={meerItems} />
        </section>
      )}

      {/* Sport */}
      {sportItems.length > 0 && (
        <section className="mt-10">
          <SectionTitle title="Sportnieuws" subtitle="Highlights van de sportredactie" />
          <ArticleGrid articles={sportItems} columns={3} />
        </section>
      )}

      {/* België */}
      {belgieItems.length > 0 && (
        <section className="mt-10">
          <SectionTitle title="België" subtitle="Binnenlands nieuws" />
          <ArticleGrid articles={belgieItems} columns={3} />
        </section>
      )}

      {/* Wereld */}
      {wereldItems.length > 0 && (
        <section className="mt-10">
          <SectionTitle title="Wereldnieuws" subtitle="Internationaal" />
          <ArticleGrid articles={wereldItems} columns={3} />
        </section>
      )}

      {/* Tech */}
      {techItems.length > 0 && (
        <section className="mt-10">
          <SectionTitle title="Tech News" subtitle="Innovatie en digitale trends" />
          <ArticleGrid articles={techItems} columns={3} />
        </section>
      )}

      {/* Politiek */}
      {politiekItems.length > 0 && (
        <section className="mt-10">
          <SectionTitle title="Politiek Nieuws" subtitle="Beslissingen en debatten" />
          <ArticleGrid articles={politiekItems} columns={3} />
        </section>
      )}

      {/* Cultuur */}
      {cultuurItems.length > 0 && (
        <section className="mt-10">
          <SectionTitle title="Cultuur & Entertainment" subtitle="Kunst, media en muziek" />
          <ArticleGrid articles={cultuurItems} columns={3} />
        </section>
      )}

      {/* Meest Gelezen */}
      <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title="Meest Gelezen" subtitle="Top 10" />
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.bestRead.map((item, index) => (
            <li key={item.id} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-2xl font-black text-orange-500">{index + 1}</span>
              <Link href={`/artikel/${item.slug}`} className="flex flex-1 gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black uppercase leading-tight tracking-tight text-slate-900">{item.title}</p>
                </div>
                <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-200">
                  {item.image_url ? <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="80px" /> : null}
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Regionaal */}
      {data.regional.length > 0 && (
        <section className="mt-10 rounded-3xl bg-[#1E3A8A] p-6 text-white">
          <SectionTitle title="Regionaal" subtitle="Populair op Regio" inverse />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {data.regional.map((item) => (
              <Link
                key={item.id}
                href={`/artikel/${item.slug}`}
                className="rounded-2xl border border-blue-400/60 bg-blue-800/40 p-3 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="relative h-36 overflow-hidden rounded-xl">
                  {item.image_url ? <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="300px" /> : null}
                </div>
                <p className="mt-3 text-xs uppercase tracking-wide text-orange-300">{item.region ?? "Vlaanderen"}</p>
                <p className="mt-1 text-sm font-black uppercase leading-tight tracking-tight">{item.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="mt-10 rounded-3xl bg-[#1E3A8A] p-8 text-white text-center">
        <h2 className="text-2xl font-black uppercase tracking-tight">Blijf elke dag als eerste op de hoogte</h2>
        <p className="mt-2 text-blue-200 text-sm">Schrijf je in op onze gratis nieuwsbrief en mis nooit meer een belangrijk verhaal.</p>
        <form className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto" action="#" method="post">
          <input
            type="email"
            name="email"
            placeholder="jouw@emailadres.be"
            className="flex-1 rounded-full px-5 py-3 text-slate-900 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            className="rounded-full bg-[#F97316] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-orange-600 whitespace-nowrap"
          >
            Inschrijven →
          </button>
        </form>
        <p className="mt-3 text-xs text-blue-300">Geen spam. Uitschrijven kan altijd.</p>
      </section>

      {/* Games */}
      <section className="mt-10 mb-4 rounded-3xl border-2 border-slate-900 bg-white p-6 retro-card">
        <SectionTitle title="Spelletjes" subtitle="Retro arcade" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Trivia Quiz", icon: "🧠", text: "Test je algemene kennis met spannende vragen.", href: "/games/trivia/index.html" },
            { name: "Politiek Trivia", icon: "🏛️", text: "Hoeveel weet jij over Belgische politiek?", href: "/games/be-politiek/index.html" },
            { name: "Voetbal Trivia", icon: "⚽", text: "Test je kennis over Belgisch voetbal.", href: "/games/belgische-voetbal-trivia/index.html" },
            { name: "Realm Runner", icon: "🎮", text: "Spring en ren door een eindeloos arcade level.", href: "/games/realmrunner/index.html" },
            { name: "Slime Soccer", icon: "🟢", text: "Speel een potje slime-voetbal tegen de AI.", href: "/games/slime-soccer/index.html" },
          ].map((game) => (
            <Link key={game.name} href={game.href} target="_blank" className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[4px_4px_0_0_#0f172a] transition-all duration-300 hover:scale-[1.03] hover:shadow-[6px_6px_0_0_#F97316]">
              <p className="text-3xl">{game.icon}</p>
              <h3 className="mt-2 text-lg font-black uppercase tracking-tight text-slate-900">{game.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{game.text}</p>
              <span className="mt-4 inline-block rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Speel →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
