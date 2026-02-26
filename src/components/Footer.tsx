"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const columns = [
  {
    title: "Algemeen",
    items: [
      { label: "Privacybeleid", href: "/privacybeleid" },
      { label: "Cookiebeleid", href: "/cookiebeleid" },
      { label: "Gebruiksvoorwaarden", href: "/gebruiksvoorwaarden" },
      { label: "Vacatures", href: "/vacatures" },
      { label: "Adverteren", href: "/adverteren" },
      { label: "Partners", href: "/partners" },
      { label: "Onze redactie", href: "/redactie" },
    ],
  },
  {
    title: "Service",
    items: [
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Klantenservice", href: "/klantenservice" },
    ],
  },
  {
    title: "Meer Nieuwsland",
    items: [
      { label: "Nieuwsbrieven", href: "/nieuwsbrieven" },
      { label: "Mobiele app", href: "/mobiele-app" },
      { label: "RSS", href: "/rss" },
      { label: "Pers", href: "/pers" },
    ],
  },
  {
    title: "Lokaal Nieuws",
    items: [
      { label: "Antwerpen", href: "/regio/antwerpen" },
      { label: "Gent", href: "/regio/gent" },
      { label: "Brussel", href: "/regio/brussel" },
      { label: "Brugge", href: "/regio/brugge" },
      { label: "Leuven", href: "/regio/leuven" },
      { label: "Oudenaarde", href: "/regio/oudenaarde" },
    ],
  },
];

export function Footer() {
  const [tipOpen, setTipOpen] = useState(false);

  return (
    <footer className="mt-16 border-t border-slate-200">
      {/* Nieuwsbrief balk */}
      <section className="bg-gradient-to-r from-[#1E3A8A] via-[#1E3A8A] to-[#0F245E] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-start gap-5">
            <Image src="/logo/nieuwsland-above-footerlogo.png" alt="Nieuwsland" width={64} height={64} className="flex-shrink-0 mt-1" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-200">Nieuwsbrief</p>
              <p className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                Blijf elke dag als eerste op de hoogte
              </p>
              <p className="mt-2 max-w-xl text-sm text-blue-100">
                Schrijf je in voor de Nieuwsland nieuwsbrief met de grootste verhalen, duiding en video.
              </p>
            </div>
          </div>
          <form className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Jouw e-mailadres"
              className="w-full rounded-full border border-blue-300/60 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-blue-100 focus:border-orange-300"
            />
            <button
              type="submit"
              className="rounded-full bg-[#F97316] px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition-all duration-300 hover:scale-105 hover:bg-orange-400 active:scale-95"
            >
              Aanmelden
            </button>
          </form>
        </div>
      </section>

      {/* Tip de redactie — prominent with quote icon */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-start gap-4">
            <span className="text-6xl leading-none text-[#F97316] font-serif">&ldquo;</span>
            <div>
              <p className="text-xl font-bold text-slate-900">Tip de redactie</p>
              <p className="mt-1 text-base text-slate-600">
                Wij zijn altijd op zoek naar het laatste nieuws. Heb je iets gezien? Laat het ons weten!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTipOpen(true)}
            className="rounded-full bg-[#F97316] px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:scale-105 hover:bg-orange-400 active:scale-95"
          >
            Tip Insturen
          </button>
        </div>
      </section>

      {/* Footer columns with logo */}
      <section className="bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Nieuwsland logo above columns */}
          <div className="mb-8">
            <Image src="/logo/nieuwsland-color.png" alt="Nieuwsland" width={200} height={45} className="h-10 w-auto" />
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-3 text-sm font-black uppercase tracking-[0.08em] text-slate-900">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} className="text-sm text-slate-600 hover:text-[#1E3A8A] hover:underline">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            {["Facebook", "X/Twitter", "Instagram", "LinkedIn", "TikTok"].map((item) => (
              <Link
                key={item}
                href="#"
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-all duration-300 hover:scale-105 hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
              >
                {item}
              </Link>
            ))}
          </div>
          <p className="text-xs uppercase tracking-wide text-slate-500">&copy; {new Date().getFullYear()} Nieuwsland.be</p>
        </div>
      </section>

      {/* Tip de redactie modal — HLN style */}
      {tipOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="absolute inset-0" onClick={() => setTipOpen(false)} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl overflow-y-auto max-h-[90vh] rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="text-xl font-black text-slate-900">België deelt nieuws, tips en video&apos;s</h2>
              <button
                type="button"
                onClick={() => setTipOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="px-6 py-6 space-y-5">
              <p className="text-sm text-slate-600 leading-relaxed">
                Heb jij een tip, een nieuwswaardig feit of een video die je wenst te delen met de rest van de wereld? Bezorg het hier aan onze redactie! Laat het hier weten en help Nieuwsland mee het nieuws te brengen.
              </p>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Opmerking bij een artikel? Deel je reactie en vermeld duidelijk over welk artikel het gaat, dan kijken we het meteen na.
              </p>

              {/* Textarea */}
              <div>
                <textarea
                  rows={4}
                  placeholder="Geef hier een korte beschrijving..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
              </div>

              {/* Upload */}
              <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-6">
                <label className="flex cursor-pointer items-center gap-2 rounded-full bg-[#F97316] px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Uploaden
                  <input type="file" className="hidden" />
                </label>
              </div>

              {/* Name fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Voornaam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Achternaam <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                />
              </div>

              {/* Locatie + Telefoon */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700">Locatie</label>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Telefoonnummer</label>
                  <input
                    type="tel"
                    className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full rounded-full bg-[#F97316] py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:bg-orange-400 active:scale-[0.98]"
              >
                Verstuur je tip
              </button>

              <p className="text-center text-xs text-slate-500">
                Liever mailen? tips@nieuwsland.be
              </p>
            </form>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
