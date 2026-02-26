import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookiebeleid",
  description: "Het cookiebeleid van Nieuwsland.be",
};

export default function CookiebeleidPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-slate-900">Cookiebeleid</h1>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
        <p className="text-sm text-slate-500">Laatst bijgewerkt: februari 2026</p>

        <h2 className="text-xl font-bold text-slate-900">Wat zijn cookies?</h2>
        <p>Cookies zijn kleine tekstbestanden die op uw toestel worden opgeslagen wanneer u onze website bezoekt. Ze helpen ons de website beter te laten werken en uw ervaring te verbeteren.</p>

        <h2 className="text-xl font-bold text-slate-900">Welke cookies gebruiken wij?</h2>

        <h3 className="text-lg font-semibold text-slate-800">Noodzakelijke cookies</h3>
        <p>Deze cookies zijn essentieel voor het functioneren van de website. Zonder deze cookies kan de site niet correct werken. Ze worden niet gebruikt voor tracking of marketing.</p>

        <h3 className="text-lg font-semibold text-slate-800">Analytische cookies</h3>
        <p>Wij gebruiken analytische cookies (zoals Google Analytics) om inzicht te krijgen in hoe bezoekers onze website gebruiken. Deze gegevens worden geanonimiseerd verwerkt.</p>

        <h3 className="text-lg font-semibold text-slate-800">Functionele cookies</h3>
        <p>Deze cookies onthouden uw voorkeuren (zoals taalinstellingen of regio) zodat wij u een betere ervaring kunnen bieden.</p>

        <h3 className="text-lg font-semibold text-slate-800">Marketing- en advertentiecookies</h3>
        <p>Deze cookies worden gebruikt om advertenties relevanter te maken voor u. Ze worden alleen geplaatst met uw toestemming.</p>

        <h2 className="text-xl font-bold text-slate-900">Hoe kunt u cookies beheren?</h2>
        <p>U kunt uw cookievoorkeuren op elk moment aanpassen via de cookie-instellingen op onze website. U kunt ook cookies blokkeren of verwijderen via uw browserinstellingen:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Chrome:</strong> Instellingen → Privacy en beveiliging → Cookies</li>
          <li><strong>Firefox:</strong> Instellingen → Privacy &amp; Beveiliging</li>
          <li><strong>Safari:</strong> Voorkeuren → Privacy</li>
          <li><strong>Edge:</strong> Instellingen → Cookies en sitegegevens</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900">Meer informatie</h2>
        <p>Lees ook ons <a href="/privacybeleid" className="text-[#1E3A8A] underline hover:text-[#F97316]">privacybeleid</a> voor meer informatie over hoe wij omgaan met uw gegevens.</p>
        <p>Vragen? Neem contact op via <a href="mailto:privacy@nieuwsland.be" className="text-[#1E3A8A] underline hover:text-[#F97316]">privacy@nieuwsland.be</a>.</p>
      </div>
    </main>
  );
}
