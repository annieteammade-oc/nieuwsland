"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-slate-900">Contact</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="mb-6 text-slate-600">
            Heeft u een vraag, opmerking of suggestie? Vul het onderstaande formulier in en wij nemen zo snel mogelijk contact met u op.
          </p>
          <div className="space-y-4 text-sm text-slate-600">
            <div>
              <p className="font-semibold text-slate-900">E-mail</p>
              <a href="mailto:info@nieuwsland.be" className="text-[#1E3A8A] underline hover:text-[#F97316]">info@nieuwsland.be</a>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Redactie</p>
              <a href="mailto:redactie@nieuwsland.be" className="text-[#1E3A8A] underline hover:text-[#F97316]">redactie@nieuwsland.be</a>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Tips</p>
              <a href="mailto:tips@nieuwsland.be" className="text-[#1E3A8A] underline hover:text-[#F97316]">tips@nieuwsland.be</a>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="mb-4 text-5xl">✅</div>
              <h2 className="mb-2 text-xl font-bold text-slate-900">Bedankt!</h2>
              <p className="text-slate-600">Uw bericht is verzonden. Wij nemen zo snel mogelijk contact met u op.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Naam <span className="text-red-500">*</span></label>
                <input type="text" required className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">E-mail <span className="text-red-500">*</span></label>
                <input type="email" required className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Bericht <span className="text-red-500">*</span></label>
                <textarea rows={5} required className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]" />
              </div>
              <button type="submit" className="w-full rounded-full bg-[#F97316] py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:bg-orange-400 active:scale-[0.98]">
                Verstuur bericht
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
