import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onze Redactie",
  description: "Maak kennis met het team van Nieuwsland.be",
};

const team = [
  { name: "Lara Van den Bossche", role: "Binnenland & Regionaal", desc: "Snel, helder, menselijk. Wat betekent dit voor jouw gemeente?", color: "bg-blue-100 text-blue-700" },
  { name: "Pieter De Smet", role: "Politiek & Duiding", desc: "Analytisch, context-first. Mini-tijdlijn + wat ligt er op tafel.", color: "bg-indigo-100 text-indigo-700" },
  { name: "Noor El Kadi", role: "Economie & Werk", desc: "Concreet, cijfermatig. In cijfers blok + impact gezinnen/bedrijven.", color: "bg-emerald-100 text-emerald-700" },
  { name: "Jonas Vercauteren", role: "Sport", desc: "Energiek. 3 sleutelmomenten + tactische duiding.", color: "bg-orange-100 text-orange-700" },
  { name: "Elise Martens", role: "Tech & AI", desc: "Helder, begrippen uitgelegd. Wat is het echt? + België/Europa impact.", color: "bg-violet-100 text-violet-700" },
  { name: "Dries Claes", role: "Wetenschap", desc: "Nauwkeurig, nuance. Sterkte van bewijs-schaal.", color: "bg-teal-100 text-teal-700" },
  { name: "Camille Dupont", role: "Cultuur & Entertainment", desc: "Levendig, beschrijvend. Waarom dit nu scoort.", color: "bg-pink-100 text-pink-700" },
  { name: "Tom Wouters", role: "Wereldnieuws", desc: "Bondig, update-gericht. Wat weten we zeker? vs Wat is nog onduidelijk?", color: "bg-sky-100 text-sky-700" },
  { name: "Sofie Vermeulen", role: "Opinie & Columns", desc: "Scherp maar fair. These + tegenargument.", color: "bg-amber-100 text-amber-700" },
];

export default function RedactiePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-black text-slate-900">Onze Redactie</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600">
          Achter elk artikel staat een mens. Maak kennis met de journalisten die dagelijks het nieuws brengen op Nieuwsland.be.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <div key={member.name} className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:border-[#1E3A8A]/30">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1E3A8A] text-2xl font-black text-white">
              {member.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <h3 className="mb-1 text-lg font-bold text-slate-900">{member.name}</h3>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${member.color}`}>
              {member.role}
            </span>
            <p className="mt-3 text-sm italic text-slate-500">&ldquo;{member.desc}&rdquo;</p>
          </div>
        ))}
      </div>
    </main>
  );
}
