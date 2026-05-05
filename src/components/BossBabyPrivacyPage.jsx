import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function BossBabyPrivacyPage({ currentPage, setCurrentPage }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff", fontFamily: "Poppins, sans-serif" }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10" style={{ fontWeight: 800 }}>
            Datenschutzerklärung
          </h1>

          <div className="space-y-8 text-base leading-relaxed" style={{ color: "#1f1f1f" }}>

            <div>
              <h2 className="font-bold mb-2 text-lg">1. Verantwortlicher</h2>
              <p>Verantwortlicher im Sinne der DSGVO ist:</p>
              <p className="mt-2">Gabrielle Fu<br />Bossbaby<br />Connollystraße 3<br />80809 München<br />Deutschland</p>
              <p className="mt-2">E-Mail: <a href="mailto:bossbabiezzy@gmail.com" className="underline hover:opacity-70" style={{ color: "#FF89CC" }}>bossbabiezzy@gmail.com</a></p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
              <p>Wir erheben personenbezogene Daten nur, wenn du sie uns freiwillig mitteilst – zum Beispiel beim Eintragen in unsere Warteliste. Dabei wird lediglich deine E-Mail-Adresse erfasst.</p>
              <p className="mt-2">Die Verarbeitung erfolgt auf Grundlage deiner Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO. Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, indem du uns eine E-Mail sendest.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">3. Dienstleister – Formspree</h2>
              <p>Die Verarbeitung von Wartelisten-Anmeldungen erfolgt über den Drittanbieter <strong>Formspree, Inc.</strong> (USA). Formspree verarbeitet eingegebene E-Mail-Adressen in unserem Auftrag. Weitere Informationen findest du in der <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70" style={{ color: "#FF89CC" }}>Datenschutzerklärung von Formspree</a>.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">4. Zweck der Datenverarbeitung</h2>
              <p>Deine E-Mail-Adresse verwenden wir ausschließlich, um dich über den Launch von Bossbaby und exklusive Neuigkeiten zu informieren. Eine Weitergabe an Dritte zu Werbezwecken erfolgt nicht.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">5. Speicherdauer</h2>
              <p>Deine Daten werden gespeichert, bis du dich aus der Warteliste abmeldest oder deinen Widerruf erklärst. Nach Widerruf löschen wir deine Daten unverzüglich.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">6. Deine Rechte</h2>
              <p>Du hast jederzeit das Recht auf:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                <li>Auskunft über die gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              </ul>
              <p className="mt-2">Zur Ausübung deiner Rechte wende dich an: <a href="mailto:bossbabiezzy@gmail.com" className="underline hover:opacity-70" style={{ color: "#FF89CC" }}>bossbabiezzy@gmail.com</a></p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">7. Beschwerderecht</h2>
              <p>Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die zuständige Behörde für Bayern ist das Bayerische Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">8. Cookies und Tracking</h2>
              <p>Unsere Website verwendet keine Tracking-Cookies oder Analyse-Tools von Drittanbietern. Es werden keine Nutzungsprofile erstellt.</p>
            </div>

            <p className="text-sm text-gray-400 pt-4">Stand: April 2026</p>
          </div>
        </div>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
