import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners",
  description: "Onze partners — Nieuwsland.be",
};

export default function PartnersPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-slate-900">Partners</h1>
      <div className="rounded-2xl bg-slate-50 p-8 text-center">
        <div className="mb-4 text-5xl">🤝</div>
        <h2 className="mb-3 text-xl font-bold text-slate-900">Onze partners</h2>
        <p className="mb-6 text-slate-600">
          Nieuwsland.be werkt samen met betrouwbare partners om u het beste nieuws en de beste ervaring te bieden. Binnenkort vindt u hier meer informatie over onze samenwerkingen.
        </p>
        <p className="text-sm text-slate-500">
          Geïnteresseerd in een partnerschap? Neem contact op via{" "}
          <a href="mailto:partners@nieuwsland.be" className="text-[#1E3A8A] underline hover:text-[#F97316]">partners@nieuwsland.be</a>.
        </p>
      </div>
    </main>
  );
}
