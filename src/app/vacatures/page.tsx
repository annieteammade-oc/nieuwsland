import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vacatures",
  description: "Werken bij Nieuwsland.be — bekijk onze openstaande vacatures",
};

export default function VacaturesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-slate-900">Vacatures</h1>
      <div className="rounded-2xl bg-slate-50 p-8 text-center">
        <div className="mb-4 text-5xl">📝</div>
        <h2 className="mb-3 text-xl font-bold text-slate-900">Wil je werken bij Nieuwsland?</h2>
        <p className="mb-6 text-slate-600">
          Nieuwsland.be is altijd op zoek naar getalenteerde journalisten, redacteuren, developers en creatievelingen die het verschil willen maken in de Belgische media.
        </p>
        <p className="mb-2 text-slate-700 font-semibold">Stuur je CV en motivatie naar:</p>
        <a href="mailto:redactie@nieuwsland.be" className="inline-block rounded-full bg-[#F97316] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-orange-400">
          redactie@nieuwsland.be
        </a>
        <p className="mt-6 text-sm text-slate-500">Momenteel geen openstaande vacatures, maar spontane sollicitaties zijn altijd welkom!</p>
      </div>
    </main>
  );
}
