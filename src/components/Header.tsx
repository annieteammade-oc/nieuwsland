"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Category } from "@/lib/types";
import { formatDutchDate } from "@/lib/format";

type HeaderProps = {
  categories: Category[];
};

const navOrder = [
  "belgie",
  "wereld",
  "politiek",
  "economie",
  "sport",
  "tech",
  "cultuur",
  "wetenschap",
  "opinie",
];

const sidebarSections = [
  {
    title: "ONTDEK",
    items: [
      { label: "Bewaarde artikelen", href: "#", icon: "bookmark" },
      { label: "Nieuwsbrieven", href: "#", icon: "mail" },
      { label: "Puzzels", href: "#", icon: "puzzle" },
    ],
  },
  {
    title: "RUBRIEKEN",
    items: [
      { label: "België", href: "/categorie/belgie" },
      { label: "Wereld", href: "/categorie/wereld" },
      { label: "Politiek", href: "/categorie/politiek" },
      { label: "Economie", href: "/categorie/economie" },
      { label: "Sport", href: "/categorie/sport" },
      { label: "Tech", href: "/categorie/tech" },
      { label: "Cultuur", href: "/categorie/cultuur" },
      { label: "Wetenschap", href: "/categorie/wetenschap" },
      { label: "Opinie", href: "/categorie/opinie" },
    ],
  },
];

function orderedCategories(categories: Category[]) {
  const map = new Map(categories.map((c) => [c.slug, c]));
  return navOrder.map((slug) => map.get(slug)).filter(Boolean) as Category[];
}

export function Header({ categories }: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const vandaag = formatDutchDate(new Date().toISOString());
  const navCategories = orderedCategories(categories);

  return (
    <>
      <header className="bg-white text-slate-900">
        {/* Top bar: Menu | Datum | Zoeken */}
        <div className="border-b border-slate-100">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
            <button
              aria-label="Menu"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 text-slate-500 transition-colors hover:text-slate-900"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="block">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-widest">Menu</span>
            </button>

            <p className="text-xs capitalize tracking-wide text-slate-400">{vandaag}</p>

            <Link
              href="/zoeken"
              aria-label="Zoeken"
              className="flex items-center gap-2 text-slate-500 transition-colors hover:text-slate-900"
            >
              <span className="hidden text-xs font-semibold uppercase tracking-widest sm:inline">Zoeken</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="block">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Logo — compact, minimal padding */}
        <div className="py-3">
          <Link href="/" className="flex justify-center">
            <Image
              src="/logo/nieuwsland-color.png"
              alt="Nieuwsland.be"
              width={320}
              height={72}
              priority
              className="h-12 w-auto sm:h-14"
            />
          </Link>
        </div>

        {/* Navigation — spread across full width */}
        <nav className="border-b border-t border-slate-200">
          <ul className="mx-auto flex max-w-7xl items-center justify-between overflow-x-auto px-4 sm:px-6 lg:px-8">
            {navCategories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/categorie/${category.slug}`}
                  className="inline-block px-2 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 transition-colors duration-200 hover:text-[#1E3A8A] sm:px-3"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />

          {/* Sidebar panel */}
          <aside className="relative z-10 flex h-full w-80 max-w-[85vw] flex-col overflow-y-auto bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#F97316]">Rubrieken</p>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Sluiten"
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Sections */}
            {sidebarSections.map((section) => (
              <div key={section.title} className="px-5 py-4">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  {section.title}
                </p>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center justify-between rounded-lg px-2 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-[#1E3A8A]"
                      >
                        <span>{item.label}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-slate-300">
                          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>
        </div>
      )}
    </>
  );
}
