import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gebruiksvoorwaarden",
  description: "De gebruiksvoorwaarden van Nieuwsland.be",
};

export default function GebruiksvoorwaardenPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-slate-900">Gebruiksvoorwaarden</h1>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
        <p className="text-sm text-slate-500">Laatst bijgewerkt: februari 2026</p>

        <h2 className="text-xl font-bold text-slate-900">1. Aanvaarding</h2>
        <p>Door gebruik te maken van Nieuwsland.be aanvaardt u deze gebruiksvoorwaarden. Indien u niet akkoord gaat, verzoeken wij u de website niet te gebruiken.</p>

        <h2 className="text-xl font-bold text-slate-900">2. Intellectueel eigendom</h2>
        <p>Alle inhoud op Nieuwsland.be — artikelen, foto&apos;s, video&apos;s, logo&apos;s en grafisch materiaal — is beschermd door het auteursrecht. Niets van deze website mag worden gekopieerd, verspreid of hergebruikt zonder voorafgaande schriftelijke toestemming.</p>

        <h2 className="text-xl font-bold text-slate-900">3. Gebruik van de website</h2>
        <p>U mag onze website uitsluitend voor persoonlijke, niet-commerciële doeleinden gebruiken. Het is verboden om:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Inhoud te kopiëren of te herpubliceren zonder toestemming</li>
          <li>De werking van de website te verstoren</li>
          <li>Onrechtmatige of misleidende informatie te verspreiden via onze kanalen</li>
          <li>Geautomatiseerde systemen (scrapers, bots) te gebruiken zonder toestemming</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900">4. Aansprakelijkheid</h2>
        <p>Nieuwsland.be streeft ernaar correcte en actuele informatie te publiceren, maar kan niet garanderen dat alle informatie te allen tijde volledig, juist of up-to-date is. Nieuwsland.be is niet aansprakelijk voor schade die voortvloeit uit het gebruik van de website.</p>

        <h2 className="text-xl font-bold text-slate-900">5. Links naar derden</h2>
        <p>Onze website kan links bevatten naar externe websites. Wij zijn niet verantwoordelijk voor de inhoud of het privacybeleid van deze websites.</p>

        <h2 className="text-xl font-bold text-slate-900">6. Reacties en bijdragen</h2>
        <p>Door het insturen van tips, reacties of bijdragen geeft u Nieuwsland.be het recht deze te gebruiken, bewerken en publiceren. U garandeert dat uw bijdragen geen inbreuk maken op rechten van derden.</p>

        <h2 className="text-xl font-bold text-slate-900">7. Wijzigingen</h2>
        <p>Nieuwsland.be behoudt zich het recht voor deze voorwaarden op elk moment te wijzigen. Wijzigingen worden op deze pagina gepubliceerd.</p>

        <h2 className="text-xl font-bold text-slate-900">8. Toepasselijk recht</h2>
        <p>Op deze gebruiksvoorwaarden is het Belgisch recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechtbanken in België.</p>

        <h2 className="text-xl font-bold text-slate-900">9. Contact</h2>
        <p>Vragen over deze voorwaarden? Neem contact op via <a href="mailto:info@nieuwsland.be" className="text-[#1E3A8A] underline hover:text-[#F97316]">info@nieuwsland.be</a>.</p>
      </div>
    </main>
  );
}
