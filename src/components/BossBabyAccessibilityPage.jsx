import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function BossBabyAccessibilityPage({ currentPage, setCurrentPage }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff", fontFamily: "Poppins, sans-serif" }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10" style={{ fontWeight: 800 }}>
            Barrierefreiheitserklärung
          </h1>

          <div className="space-y-8 text-base leading-relaxed" style={{ color: "#1f1f1f" }}>

            <div>
              <p>Bossbaby ist bestrebt, seine Website für alle Nutzerinnen und Nutzer zugänglich zu gestalten, unabhängig von etwaigen Einschränkungen. Wir arbeiten kontinuierlich daran, die Barrierefreiheit zu verbessern.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">Unser Ziel</h2>
              <p>Wir orientieren uns an den Web Content Accessibility Guidelines (WCAG) 2.1, Level AA, um sicherzustellen, dass unsere Website für möglichst viele Menschen nutzbar ist.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">Bekannte Einschränkungen</h2>
              <p>Da sich unsere Website noch in der Entwicklung befindet, können einzelne Bereiche noch nicht vollständig barrierefrei sein. Wir arbeiten aktiv daran, diese zu verbessern.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">Maßnahmen zur Barrierefreiheit</h2>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-700">
                <li>Verwendung semantischer HTML-Strukturen</li>
                <li>Alt-Texte für Bilder und grafische Elemente</li>
                <li>Ausreichende Farbkontraste für Texte</li>
                <li>Tastaturnavigation für alle Kernfunktionen</li>
                <li>Responsive Design für alle Endgeräte</li>
              </ul>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">Feedback und Kontakt</h2>
              <p>Wenn du Barrieren auf unserer Website feststellst oder Unterstützung benötigst, freuen wir uns über deine Rückmeldung. Bitte kontaktiere uns unter:</p>
              <p className="mt-2">E-Mail: <a href="mailto:bossbabiezzy@gmail.com" className="underline hover:opacity-70" style={{ color: "#FF89CC" }}>bossbabiezzy@gmail.com</a></p>
              <p className="mt-2">Wir bemühen uns, deine Anfrage innerhalb von 5 Werktagen zu beantworten.</p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-lg">Schlichtungsverfahren</h2>
              <p>Solltest du mit unserer Antwort nicht zufrieden sein, hast du die Möglichkeit, dich an die Schlichtungsstelle für Barrierefreiheit zu wenden. Weitere Informationen findest du unter <a href="https://www.schlichtungsstelle-bgg.de" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70" style={{ color: "#FF89CC" }}>www.schlichtungsstelle-bgg.de</a>.</p>
            </div>

            <p className="text-sm text-gray-400 pt-4">Stand: April 2026</p>
          </div>
        </div>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
