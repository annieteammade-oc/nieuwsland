import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleGrid } from "@/components/ArticleGrid";
import { Sidebar } from "@/components/Sidebar";
import { getArticlesByCategory, getCategoryBySlug, getHomepageData } from "@/lib/news";

export const revalidate = 300;

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categorie niet gevonden",
    };
  }

  return {
    title: category.name,
    description: category.description ?? `Nieuws uit de categorie ${category.name} op Nieuwsland.be.`,
    openGraph: {
      title: `${category.name} | Nieuwsland.be`,
      description: category.description ?? `Laatste updates in ${category.name}.`,
      url: `https://nieuwsland.be/categorie/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [category, articles, homepageData] = await Promise.all([
    getCategoryBySlug(slug),
    getArticlesByCategory(slug),
    getHomepageData(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#1E3A8A] to-blue-700 p-7 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-100">Categorie</p>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-tight">{category.name}</h1>
        <p className="mt-3 max-w-3xl text-sm text-blue-50">
          {category.description ?? `Alle recente artikels uit ${category.name}.`}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <section>
          {articles.length ? (
            <ArticleGrid articles={articles} columns={3} />
          ) : (
            <p className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
              Nog geen artikels in deze categorie.
            </p>
          )}
        </section>
        <Sidebar latest={homepageData.latest} bestRead={homepageData.bestRead} />
      </div>
    </div>
  );
}

