"use client";

import { useState } from "react";

export default function NieuwsbrievenPage() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const email = new FormData(e.currentTarget).get("email");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (res.ok) setSubscribed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-slate-900">Nieuwsbrieven</h1>

      <p className="mb-8 text-lg text-slate-600">
        Blijf op de hoogte van het laatste nieuws met onze gratis nieuwsbrieven. Elke dag een selectie van de belangrijkste verhalen, rechtstreeks in uw inbox.
      </p>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        {[
          { title: "Dagelijks Overzicht", desc: "Elke ochtend de belangrijkste nieuwsverhalen van de dag, samengevat door onze redactie.", freq: "Dagelijks om 07:00" },
          { title: "Weekend Digest", desc: "De beste artikelen, analyses en columns van de week in één overzichtelijke mail.", freq: "Elke zaterdag" },
          { title: "Breaking News", desc: "Directe meldingen bij groot en belangrijk nieuws. Alleen wanneer het er echt toe doet.", freq: "Bij breaking news" },
          { title: "Sport Update", desc: "Alle sportresultaten, transfers en analyses. Voor de echte sportfan.", freq: "Dagelijks om 20:00" },
        ].map((nl) => (
          <div key={nl.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-2 text-lg font-bold text-slate-900">{nl.title}</h3>
            <p className="mb-3 text-sm text-slate-600">{nl.desc}</p>
            <p className="text-xs font-semibold text-[#F97316]">{nl.freq}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#1E3A8A] p-8 text-center text-white">
        {subscribed ? (
          <div>
            <div className="mb-4 text-5xl">✅</div>
            <h2 className="mb-2 text-xl font-bold">Bedankt voor uw inschrijving!</h2>
            <p className="text-blue-100">U ontvangt binnenkort uw eerste nieuwsbrief.</p>
          </div>
        ) : (
          <>
            <h2 className="mb-3 text-xl font-bold">Schrijf u nu in</h2>
            <p className="mb-4 text-blue-100">Vul uw e-mailadres in en ontvang dagelijks het laatste nieuws.</p>
            <form onSubmit={handleSubscribe} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <input name="email" type="email" required placeholder="Uw e-mailadres" className="w-full rounded-full border border-blue-300/60 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-blue-100 focus:border-orange-300" />
              <button type="submit" disabled={loading} className="rounded-full bg-[#F97316] px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:scale-105 hover:bg-orange-400 disabled:opacity-50">
                Aanmelden
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
