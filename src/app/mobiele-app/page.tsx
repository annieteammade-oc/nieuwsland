import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mobiele app",
  description: "De Nieuwsland.be mobiele app — binnenkort beschikbaar",
};

export default function MobieleAppPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-slate-900">Mobiele app</h1>
      <div className="rounded-2xl bg-slate-50 p-8 text-center">
        <div className="mb-4 text-5xl">📱</div>
        <h2 className="mb-3 text-xl font-bold text-slate-900">Binnenkort beschikbaar!</h2>
        <p className="mb-6 text-slate-600">
          We werken hard aan de Nieuwsland app voor iOS en Android. Binnenkort kunt u al het nieuws ook onderweg lezen, met pushnotificaties bij breaking news en een persoonlijke nieuwsfeed.
        </p>
        <div className="flex justify-center gap-4">
          <div className="rounded-xl bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-500">
            App Store — Binnenkort
          </div>
          <div className="rounded-xl bg-slate-200 px-6 py-3 text-sm font-semibold text-slate-500">
            Google Play — Binnenkort
          </div>
        </div>
      </div>
    </main>
  );
}
