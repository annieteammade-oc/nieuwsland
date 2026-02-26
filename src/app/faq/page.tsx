import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description: "FAQ — Veelgestelde vragen over Nieuwsland.be",
};

const faqs = [
  { q: "Wat is Nieuwsland.be?", a: "Nieuwsland.be is een Belgisch online nieuwsplatform dat het laatste nieuws brengt uit België en de wereld. Onze redactie brengt betrouwbaar, helder en toegankelijk nieuws over politiek, economie, sport, tech, cultuur en meer." },
  { q: "Is Nieuwsland.be gratis?", a: "Ja, alle artikelen op Nieuwsland.be zijn volledig gratis te lezen. Wij geloven dat iedereen toegang moet hebben tot betrouwbaar nieuws." },
  { q: "Hoe kan ik mij inschrijven voor de nieuwsbrief?", a: "U kunt zich inschrijven via de nieuwsbrief-sectie onderaan elke pagina, of via onze nieuwsbrieven-pagina. Vul uw e-mailadres in en u ontvangt dagelijks het belangrijkste nieuws." },
  { q: "Hoe kan ik een tip insturen?", a: "Via de knop 'Tip de redactie' onderaan de website of via tips@nieuwsland.be. U kunt foto's en video's meesturen." },
  { q: "Wie schrijft de artikelen?", a: "Onze artikelen worden geschreven door een professionele redactie met expertise in verschillende domeinen. Bekijk onze redactiepagina voor meer informatie over ons team." },
  { q: "Hoe zit het met mijn privacy?", a: "Wij respecteren uw privacy volledig conform de AVG/GDPR. Lees ons privacybeleid voor meer details." },
  { q: "Kan ik adverteren op Nieuwsland.be?", a: "Ja! Wij bieden diverse advertentiemogelijkheden. Neem contact op via adverteren@nieuwsland.be voor een offerte op maat." },
  { q: "Hoe kan ik contact opnemen met de redactie?", a: "Via ons contactformulier op de contactpagina, of mail rechtstreeks naar redactie@nieuwsland.be." },
  { q: "Heeft Nieuwsland.be een mobiele app?", a: "We werken momenteel aan een mobiele app voor iOS en Android. Houd onze website in de gaten voor updates!" },
  { q: "Hoe kan ik een fout in een artikel melden?", a: "Stuur een mail naar redactie@nieuwsland.be met vermelding van het artikel en de fout. Wij corrigeren zo snel mogelijk." },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-slate-900">Veelgestelde vragen</h1>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <details key={i} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <summary className="cursor-pointer text-lg font-bold text-slate-900 group-open:text-[#1E3A8A]">
              {faq.q}
            </summary>
            <p className="mt-3 text-slate-600">{faq.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
