import type { Metadata } from "next";
import { ArticleGrid } from "@/components/ArticleGrid";
import { HeroArticle } from "@/components/HeroArticle";
import { Sidebar } from "@/components/Sidebar";
import { getHomepageData } from "@/lib/news";

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

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <HeroArticle article={data.hero} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-10">
          <div>
            <h2 className="mb-5 border-b border-zinc-300 pb-3 text-2xl font-bold">Uitgelicht</h2>
            <ArticleGrid articles={data.featuredGrid} columns={2} />
          </div>

          <div>
            <h2 className="mb-5 border-b border-zinc-300 pb-3 text-2xl font-bold">Laatste Nieuws</h2>
            <ArticleGrid articles={data.latest} columns={3} />
          </div>
        </section>

        <Sidebar latest={data.latest} bestRead={data.bestRead} />
      </div>
    </div>
  );
}
