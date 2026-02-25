import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Voorpagina" },
  { href: "/zoeken", label: "Zoeken" },
  { href: "/categorie/politiek", label: "Politiek" },
  { href: "/categorie/economie", label: "Economie" },
  { href: "/categorie/sport", label: "Sport" },
];

export function Footer() {
  return (
    <footer className="mt-14 border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-700">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-red-700 hover:underline">
              {link.label}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-sm text-zinc-500">(c) {new Date().getFullYear()} Nieuwsland.be. Alle rechten voorbehouden.</p>
      </div>
    </footer>
  );
}
