import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArticleGrid } from "@/components/ArticleGrid";
import { CategoryBadge } from "@/components/CategoryBadge";
import { LiveBadge } from "@/components/LiveBadge";
import { Sidebar } from "@/components/Sidebar";
import { VideoGallery, VideoShorts } from "@/components/VideoSections";
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

function HeroSideItem({ article }: { article: Article }) {
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className="group relative block h-52 overflow-hidden rounded-2xl bg-slate-900"
    >
      {article.image_url ? (
        <Image src={article.image_url} alt={article.title} fill className="object-cover opacity-80" sizes="33vw" />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      <div className="absolute bottom-0 p-4">
        <CategoryBadge category={article.category} />
        <p className="mt-3 text-base font-black uppercase leading-tight tracking-tight text-white">
          {article.title}
        </p>
      </div>
    </Link>
  );
}

function MixedNews({ items }: { items: Article[] }) {
  const [lead, ...rest] = items;
  if (!lead) {
    return null;
  }

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

export default async function HomePage() {
  const data = await getHomepageData();
  const hero = data.hero;

  if (!hero) {
    return null;
  }

  const videoLead = data.videos[0];
  const fallbackItems = data.latest.slice(0, 6);
  const pickCategory = (items: Article[]) => (items.length ? items : fallbackItems);
  const sportItems = pickCategory(data.latest.filter((item) => item.category?.slug === "sport").slice(0, 6));
  const techItems = pickCategory(data.latest.filter((item) => item.category?.slug === "tech").slice(0, 6));
  const politiekItems = pickCategory(data.latest.filter((item) => item.category?.slug === "politiek").slice(0, 6));
  const cultuurItems = pickCategory(data.latest.filter((item) => item.category?.slug === "cultuur").slice(0, 6));
  const actualiteitItems = pickCategory(
    data.latest
      .filter((item) => ["belgie", "wereld", "economie", "wetenschap"].includes(item.category?.slug ?? ""))
      .slice(0, 6),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-5 pb-6 sm:px-6 lg:px-8">
      {/* Trending ticker — bovenaan direct onder header */}
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

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr] entrance-fade">
        {/* Linkerkolom 2/3: Hero + 4 items + Nieuws van Vandaag */}
        <div className="space-y-6">
          {/* a) Hero nieuwsitem */}
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

          {/* b) 4 kleine nieuwsitems (2x2) */}
          <div className="grid grid-cols-2 gap-4">
            {(data.heroSide.length >= 4 ? data.heroSide.slice(0, 4) : data.latest.slice(0, 4)).map((item) => (
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

          {/* c) Nieuws van Vandaag — in de linkerkolom */}
          <div>
            <SectionTitle title="Nieuws van Vandaag" subtitle="Laatste updates" />
            <ArticleGrid
              articles={[...data.latest.slice(0, 9)].sort(
                (a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime()
              )}
              columns={2}
            />
          </div>
        </div>

        {/* Rechterkolom 1/3: Sidebar + Cartoon van de Dag */}
        <aside className="space-y-6">
          <Sidebar latest={data.latest} bestRead={data.bestRead} />

          {/* Cartoon van de Dag */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-black uppercase tracking-tight text-slate-900">Cartoon van de Dag</h3>
            <div className="flex aspect-square items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <span className="text-6xl">🎨</span>
            </div>
            <Link
              href="#"
              className="mt-4 block rounded-full bg-[#F97316] px-4 py-2.5 text-center text-sm font-bold text-white transition-all hover:bg-orange-600"
            >
              Meer cartoons
            </Link>
          </div>
        </aside>
      </section>

      {/* Breaking news auto-scroll ticker */}
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

      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between gap-3 border-b pb-3 border-slate-200">
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Bekijk Video&apos;s</h2>
          <Link href="/videos" className="text-sm font-semibold text-[#1E3A8A] hover:underline">Alle video&apos;s →</Link>
        </div>
        <VideoShorts videos={data.videos} />
      </section>

      <section className="mt-10">
        <SectionTitle title="Meer Nieuws" />
        <MixedNews items={data.mixedPrimary} />
      </section>

      <section className="mt-10">
        <SectionTitle title="Sportnieuws" subtitle="Highlights van de sportredactie" />
        <ArticleGrid articles={sportItems.slice(0, 6)} columns={3} />
      </section>

      <section className="mt-10">
        <SectionTitle title="Actualiteit" subtitle="Binnenland en buitenland" />
        <ArticleGrid articles={actualiteitItems.slice(0, 6)} columns={3} />
      </section>

      <section className="mt-10">
        <SectionTitle title="Tech News" subtitle="Innovatie en digitale trends" />
        <ArticleGrid articles={techItems.slice(0, 6)} columns={3} />
      </section>

      <section className="mt-10">
        <SectionTitle title="Politiek Nieuws" subtitle="Beslissingen en debatten" />
        <ArticleGrid articles={politiekItems.slice(0, 6)} columns={3} />
      </section>

      <section className="mt-10">
        <SectionTitle title="Cultuur & Entertainment" subtitle="Kunst, media en muziek" />
        <ArticleGrid articles={cultuurItems.slice(0, 6)} columns={3} />
      </section>

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

      {videoLead ? (
        <section className="mt-10">
          <SectionTitle title="Video Galerij" subtitle="Uitgelichte reportages" />
          <VideoGallery lead={videoLead} items={data.videos.slice(1, 5)} />
        </section>
      ) : null}

      <section className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <SectionTitle title="Regionale Verdieping" subtitle="Focus op lokale verhalen" />
          <MixedNews items={data.mixedSecondary} />
        </div>
        <Sidebar latest={data.latest.slice(3)} bestRead={data.bestRead} />
      </section>

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
              <span className="mt-4 inline-block rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-[#F97316]">
                Speel →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
