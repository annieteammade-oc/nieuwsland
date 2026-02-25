"use client";

import Link from "next/link";
import { useState } from "react";

const columns = [
  {
    title: "Algemeen",
    items: ["Privacybeleid", "Cookiebeleid", "Gebruiksvoorwaarden", "Vacatures", "Adverteren", "Partners"],
  },
  {
    title: "Service",
    items: ["Contact", "FAQ", "Klantenservice"],
  },
  {
    title: "Meer Nieuwsland",
    items: ["Nieuwsbrieven", "Mobiele app", "RSS", "Pers"],
  },
  {
    title: "Lokaal Nieuws",
    items: ["Antwerpen", "Gent", "Brussel", "Brugge", "Leuven"],
  },
];

export function Footer() {
  const [tipOpen, setTipOpen] = useState(false);

  return (
    <footer className="mt-16 border-t border-slate-200">
      <section className="bg-gradient-to-r from-[#1E3A8A] via-[#1E3A8A] to-[#0F245E] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-200">Nieuwsbrief</p>
            <p className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
              Blijf elke dag als eerste op de hoogte
            </p>
            <p className="mt-2 max-w-xl text-sm text-blue-100">
              Schrijf je in voor de Nieuwsland nieuwsbrief met de grootste verhalen, duiding en video.
            </p>
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

      <section className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-orange-500">Tip de redactie</p>
            <p className="mt-2 text-lg font-semibold text-slate-800">
              Heb je nieuws in jouw buurt? Mail ons via tips@nieuwsland.be
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTipOpen(true)}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition-all duration-300 hover:scale-105 hover:bg-[#F97316] active:scale-95"
          >
            Tip Insturen
          </button>
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-3 text-sm font-black uppercase tracking-[0.08em] text-slate-900">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-slate-600 hover:text-[#1E3A8A] hover:underline">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            {[
              { label: "Facebook", href: "#" },
              { label: "X/Twitter", href: "#" },
              { label: "Instagram", href: "#" },
              { label: "LinkedIn", href: "#" },
              { label: "TikTok", href: "#" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-all duration-300 hover:scale-105 hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p className="text-xs uppercase tracking-wide text-slate-500">(c) {new Date().getFullYear()} Nieuwsland.be</p>
        </div>
      </section>

      {tipOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="absolute inset-0" onClick={() => setTipOpen(false)} aria-hidden />
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Tip de redactie</p>
              <button
                type="button"
                onClick={() => setTipOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 transition-all duration-300 hover:scale-105 hover:border-slate-400 hover:text-slate-900"
              >
                Sluiten
              </button>
            </div>
            <form className="grid gap-4 px-5 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Naam
                  <input
                    type="text"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none focus:border-[#1E3A8A]"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Email
                  <input
                    type="email"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none focus:border-[#1E3A8A]"
                  />
                </label>
              </div>
              <label className="text-sm font-semibold text-slate-700">
                Onderwerp
                <input
                  type="text"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none focus:border-[#1E3A8A]"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Bericht
                <textarea
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 outline-none focus:border-[#1E3A8A]"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Bestand (optioneel)
                <input
                  type="file"
                  className="mt-2 w-full rounded-2xl border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-600"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-[#1E3A8A] px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition-all duration-300 hover:scale-[1.01] hover:bg-[#F97316] active:scale-95"
              >
                Verstuur Tip
              </button>
              <p className="text-xs text-slate-500">Liever mailen? tips@nieuwsland.be</p>
            </form>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
