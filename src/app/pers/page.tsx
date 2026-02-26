import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pers",
  description: "Perscontact en media-informatie — Nieuwsland.be",
};

export default function PersPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-slate-900">Pers</h1>

      <p className="mb-8 text-lg text-slate-600">
        Bent u journalist of werkt u voor een mediabedrijf? Hieronder vindt u alle informatie voor persgerelateerde vragen.
      </p>

      <div className="mb-8 rounded-2xl bg-slate-50 p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Perscontact</h2>
        <div className="space-y-2 text-slate-600">
          <p><strong>E-mail:</strong> <a href="mailto:pers@nieuwsland.be" className="text-[#1E3A8A] underline hover:text-[#F97316]">pers@nieuwsland.be</a></p>
          <p><strong>Telefoon:</strong> Op aanvraag</p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Over Nieuwsland.be</h2>
        <p className="text-slate-600">
          Nieuwsland.be is een onafhankelijk Belgisch online nieuwsplatform dat in 2026 werd gelanceerd. Onze missie is om betrouwbaar, helder en toegankelijk nieuws te brengen voor iedereen in België. Met een professionele redactie van negen journalisten bestrijken wij alle grote nieuwsdomeinen.
        </p>
        <p className="text-sm text-slate-500">
          Voor persberichten, interviews of media-aanvragen: neem contact op via bovenstaand e-mailadres.
        </p>
      </div>
    </main>
  );
}
