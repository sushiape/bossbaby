import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function BossBabyTermsPage({ currentPage, setCurrentPage }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff", fontFamily: "Poppins, sans-serif" }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10" style={{ fontWeight: 800 }}>
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>

          <div className="space-y-8 text-base leading-relaxed" style={{ color: "#1f1f1f" }}>

            <div>
              <h2 className="font-bold mb-2 text-lg">1. Geltungsbereich</h2>
              <p>Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Website bossbaby.de sowie für alle zukünftigen Vertragsbeziehungen zwischen Gabrielle Fu (Bossbaby) und den Nutzerinnen dieser Website.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">2. Anbieter</h2>
              <p>Gabrielle Fu<br />Bossbaby<br />c/o TUM Venture Lab Food, Agro &amp; Biotech<br />Alte Akademie 8<br />85354 Freising<br />Deutschland</p>
              <p className="mt-2">E-Mail: <a href="mailto:bossbabiezzy@gmail.com" className="underline hover:opacity-70" style={{ color: "#FF89CC" }}>bossbabiezzy@gmail.com</a></p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">3. Warteliste</h2>
              <p>Die Eintragung in die Warteliste begründet kein Vertragsverhältnis und keinen Anspruch auf den Kauf eines Produktes. Die Warteliste dient ausschließlich der unverbindlichen Voranmeldung und dem Erhalt von Informationen zum Produktlaunch.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">4. Nutzung der Website</h2>
              <p>Die Inhalte dieser Website dienen ausschließlich Informationszwecken. Alle Texte, Bilder und sonstigen Inhalte sind urheberrechtlich geschützt. Eine Vervielfältigung oder Verwendung ohne ausdrückliche schriftliche Genehmigung ist nicht gestattet.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">5. Haftungsbeschränkung</h2>
              <p>Bossbaby übernimmt keine Gewähr für die Aktualität, Vollständigkeit und Richtigkeit der auf dieser Website bereitgestellten Informationen. Haftungsansprüche, die sich auf Schäden materieller oder ideeller Art beziehen, die durch die Nutzung oder Nichtnutzung der dargebotenen Informationen entstanden sind, sind grundsätzlich ausgeschlossen.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">6. Gesundheitshinweis</h2>
              <p>Die auf dieser Website beschriebenen Produkte und Inhaltsstoffe ersetzen keine ärztliche Beratung oder Behandlung. Bei gesundheitlichen Beschwerden wende dich an eine Ärztin oder einen Arzt.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">7. Änderungen der AGB</h2>
              <p>Bossbaby behält sich das Recht vor, diese AGB jederzeit zu ändern. Die jeweils aktuelle Fassung ist auf dieser Seite einsehbar.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">8. Anwendbares Recht</h2>
              <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist, soweit gesetzlich zulässig, Freising.</p>
            </div>

            <p className="text-sm text-gray-400 pt-4">Stand: April 2026</p>
          </div>
        </div>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
