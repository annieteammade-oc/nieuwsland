import type { Metadata } from "next";
import { ArticleGrid } from "@/components/ArticleGrid";
import { searchArticles } from "@/lib/news";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Zoeken",
  description: "Zoek artikels op Nieuwsland.be",
  openGraph: {
    title: "Zoeken | Nieuwsland.be",
    description: "Doorzoek het volledige nieuwsoverzicht van Nieuwsland.be.",
    url: "https://nieuwsland.be/zoeken",
  },
};

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const results = q ? await searchArticles(q) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-4xl font-black uppercase tracking-tight text-slate-900">Zoeken</h1>

      <form action="/zoeken" method="get" className="mb-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Zoek op titel, onderwerp of inhoud"
          className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-slate-900 outline-none focus:border-[#1E3A8A]"
        />
        <button
          type="submit"
          className="rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#F97316] active:scale-95"
        >
          Zoek
        </button>
      </form>

      {q ? (
        <p className="mb-6 text-sm text-slate-600">
          {results.length} resultaat/resultaten voor <span className="font-semibold text-slate-900">&quot;{q}&quot;</span>
        </p>
      ) : (
        <p className="mb-6 text-sm text-slate-600">Geef een zoekterm in om artikels te vinden.</p>
      )}

      {results.length > 0 ? (
        <ArticleGrid articles={results} columns={3} />
      ) : q ? (
        <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">Geen resultaten gevonden.</p>
      ) : null}
    </div>
  );
}

