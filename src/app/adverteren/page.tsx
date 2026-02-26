import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adverteren",
  description: "Adverteren op Nieuwsland.be — bereik duizenden Belgische lezers",
};

export default function AdverterenPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-slate-900">Adverteren op Nieuwsland.be</h1>

      <p className="mb-8 text-lg text-slate-600">
        Wil je jouw merk, product of dienst onder de aandacht brengen bij een breed Belgisch publiek? Nieuwsland.be biedt diverse advertentiemogelijkheden.
      </p>

      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        {[
          { title: "Banner advertenties", desc: "Leaderboard, rectangle en skyscraper formaten op alle pagina's", price: "Vanaf €250/maand" },
          { title: "Sponsored content", desc: "Redactioneel artikel in samenwerking met uw merk", price: "Op aanvraag" },
          { title: "Nieuwsbrief", desc: "Bereik onze abonnees rechtstreeks in hun inbox", price: "Vanaf €150/editie" },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-2 text-lg font-bold text-slate-900">{item.title}</h3>
            <p className="mb-4 text-sm text-slate-600">{item.desc}</p>
            <p className="text-sm font-semibold text-[#F97316]">{item.price}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#1E3A8A] p-8 text-center text-white">
        <h2 className="mb-3 text-xl font-bold">Interesse? Neem contact op!</h2>
        <p className="mb-4 text-blue-100">Ontvang een vrijblijvende offerte op maat van uw campagne.</p>
        <a href="mailto:adverteren@nieuwsland.be" className="inline-block rounded-full bg-[#F97316] px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-orange-400">
          adverteren@nieuwsland.be
        </a>
      </div>
    </main>
  );
}
