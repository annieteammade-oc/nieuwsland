import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RSS Feeds",
  description: "Volg Nieuwsland.be via RSS feeds",
};

export default function RssPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-slate-900">RSS Feeds</h1>

      <p className="mb-8 text-lg text-slate-600">
        Met RSS (Really Simple Syndication) kunt u het laatste nieuws van Nieuwsland.be automatisch ontvangen in uw favoriete RSS-lezer, zonder onze website te hoeven bezoeken.
      </p>

      <h2 className="mb-4 text-xl font-bold text-slate-900">Hoe werkt het?</h2>
      <ol className="mb-8 list-decimal pl-6 space-y-2 text-slate-600">
        <li>Download een RSS-lezer (bijv. Feedly, Inoreader of NetNewsWire)</li>
        <li>Kopieer de RSS-link hieronder</li>
        <li>Plak de link in uw RSS-lezer</li>
        <li>U ontvangt automatisch nieuwe artikelen!</li>
      </ol>

      <h2 className="mb-4 text-xl font-bold text-slate-900">Onze feeds</h2>
      <div className="space-y-3">
        {[
          { title: "Alle artikelen", url: "/feed.xml" },
          { title: "Binnenland", url: "/feed.xml?category=binnenland" },
          { title: "Wereldnieuws", url: "/feed.xml?category=wereldnieuws" },
          { title: "Sport", url: "/feed.xml?category=sport" },
          { title: "Tech & AI", url: "/feed.xml?category=tech" },
        ].map((feed) => (
          <div key={feed.title} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-3">
            <span className="font-semibold text-slate-900">{feed.title}</span>
            <a href={feed.url} className="rounded-full bg-[#F97316] px-4 py-1.5 text-xs font-bold text-white transition-all hover:scale-105 hover:bg-orange-400">
              RSS Feed
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}
