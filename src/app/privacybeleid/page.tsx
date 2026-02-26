import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description: "Het privacybeleid van Nieuwsland.be",
};

export default function PrivacybeleidPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-black text-slate-900">Privacybeleid</h1>
      <div className="prose prose-slate max-w-none space-y-6 text-slate-700">
        <p className="text-sm text-slate-500">Laatst bijgewerkt: februari 2026</p>

        <h2 className="text-xl font-bold text-slate-900">1. Wie zijn wij?</h2>
        <p>Nieuwsland.be is een Belgisch online nieuwsplatform. Wij hechten groot belang aan de bescherming van uw persoonsgegevens en respecteren uw privacy volledig in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG/GDPR) en de Belgische privacywetgeving.</p>

        <h2 className="text-xl font-bold text-slate-900">2. Welke gegevens verzamelen wij?</h2>
        <p>Wij kunnen de volgende persoonsgegevens verzamelen:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Naam en e-mailadres (bij nieuwsbrief-inschrijving of contactformulier)</li>
          <li>IP-adres en browsergegevens (via cookies en analytics)</li>
          <li>Gebruiksgegevens van de website (bezochte pagina&apos;s, klikgedrag)</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900">3. Waarvoor gebruiken wij uw gegevens?</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Het verzenden van nieuwsbrieven (enkel met uw toestemming)</li>
          <li>Het beantwoorden van uw vragen via het contactformulier</li>
          <li>Het verbeteren van onze website en diensten via anonieme statistieken</li>
          <li>Het tonen van relevante advertenties</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900">4. Cookies</h2>
        <p>Wij gebruiken cookies om uw ervaring te verbeteren. Meer informatie vindt u in ons <a href="/cookiebeleid" className="text-[#1E3A8A] underline hover:text-[#F97316]">cookiebeleid</a>.</p>

        <h2 className="text-xl font-bold text-slate-900">5. Delen van gegevens</h2>
        <p>Wij delen uw persoonsgegevens niet met derden, tenzij dit noodzakelijk is voor onze dienstverlening (bijv. e-mailprovider voor nieuwsbrieven) of wanneer wij hiertoe wettelijk verplicht zijn.</p>

        <h2 className="text-xl font-bold text-slate-900">6. Bewaartermijn</h2>
        <p>Wij bewaren uw gegevens niet langer dan noodzakelijk voor de doeleinden waarvoor ze zijn verzameld, of zolang de wet dit vereist.</p>

        <h2 className="text-xl font-bold text-slate-900">7. Uw rechten</h2>
        <p>Conform de AVG heeft u het recht op:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Inzage in uw persoonsgegevens</li>
          <li>Rectificatie van onjuiste gegevens</li>
          <li>Verwijdering van uw gegevens (&quot;recht om vergeten te worden&quot;)</li>
          <li>Beperking van de verwerking</li>
          <li>Overdraagbaarheid van uw gegevens</li>
          <li>Bezwaar tegen de verwerking</li>
        </ul>
        <p>Neem hiervoor contact op via <a href="mailto:privacy@nieuwsland.be" className="text-[#1E3A8A] underline hover:text-[#F97316]">privacy@nieuwsland.be</a>.</p>

        <h2 className="text-xl font-bold text-slate-900">8. Toezichthouder</h2>
        <p>U heeft het recht een klacht in te dienen bij de Gegevensbeschermingsautoriteit (GBA): <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer" className="text-[#1E3A8A] underline hover:text-[#F97316]">www.gegevensbeschermingsautoriteit.be</a>.</p>

        <h2 className="text-xl font-bold text-slate-900">9. Contact</h2>
        <p>Vragen over dit privacybeleid? Mail naar <a href="mailto:privacy@nieuwsland.be" className="text-[#1E3A8A] underline hover:text-[#F97316]">privacy@nieuwsland.be</a>.</p>
      </div>
    </main>
  );
}
