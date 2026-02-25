import Link from "next/link";

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
    items: ["Facebook", "Twitter/X", "Instagram", "Nieuwsbrieven"],
  },
  {
    title: "Lokaal Nieuws",
    items: ["Antwerpen", "Gent", "Brussel", "Brugge", "Leuven"],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200">
      <section className="bg-[#1E3A8A] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-blue-100">Nieuwsbrief</p>
            <p className="text-lg font-black uppercase tracking-tight">Blijf op de hoogte van het laatste nieuws</p>
          </div>

          <form className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Jouw e-mailadres"
              className="w-full rounded-full border border-blue-300/40 bg-white/10 px-4 py-2 text-sm text-white outline-none placeholder:text-blue-100 focus:border-orange-300"
            />
            <button
              type="submit"
              className="rounded-full bg-[#F97316] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-orange-400 active:scale-95"
            >
              Aanmelden
            </button>
          </form>

          <div className="flex items-center gap-2">
            {[
              { label: "X", href: "#" },
              { label: "f", href: "#" },
              { label: "ig", href: "#" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-full border border-blue-300/50 px-3 py-1 text-sm font-bold transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#1E3A8A]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-slate-700">
            <span className="mr-2 text-2xl text-orange-500">\"</span>
            Tip de redactie: heb je nieuws in jouw buurt? Mail ons via tips@nieuwsland.be
            <span className="ml-2 text-2xl text-orange-500">\"</span>
          </p>
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
        <p className="border-t border-slate-200 px-4 py-4 text-center text-xs uppercase tracking-wide text-slate-500">
          (c) {new Date().getFullYear()} Nieuwsland.be
        </p>
      </section>
    </footer>
  );
}

