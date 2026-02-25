import type { Metadata } from "next";
import "./globals.css";
import { BreakingBanner } from "@/components/BreakingBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getCategories, getHomepageData } from "@/lib/news";

export const revalidate = 300;

export const metadata: Metadata = {
  metadataBase: new URL("https://nieuwsland.be"),
  title: {
    default: "Nieuwsland.be | Laatste nieuws uit Belgie en de wereld",
    template: "%s | Nieuwsland.be",
  },
  description:
    "Nieuwsland.be brengt het laatste nieuws uit Belgie en de wereld: politiek, economie, sport, tech, cultuur en meer.",
  openGraph: {
    type: "website",
    locale: "nl_BE",
    title: "Nieuwsland.be",
    description:
      "Volg het laatste nieuws, live-updates en diepgaande analyses op Nieuwsland.be.",
    siteName: "Nieuwsland.be",
    url: "https://nieuwsland.be",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, homepageData] = await Promise.all([getCategories(), getHomepageData()]);

  return (
    <html lang="nl-BE">
      <body className="bg-slate-50 font-sans text-slate-900 antialiased" style={{ fontFamily: "Inter, sans-serif" }}>
        <Header categories={categories} topArticle={homepageData.hero} />
        <BreakingBanner items={homepageData.breaking} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
