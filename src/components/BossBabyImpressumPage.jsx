import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function BossBabyImpressumPage({ currentPage, setCurrentPage }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff", fontFamily: "Poppins, sans-serif" }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-10" style={{ fontWeight: 800 }}>
            Impressum
          </h1>

          <div className="space-y-8 text-base leading-relaxed" style={{ color: "#1f1f1f" }}>

            <div>
              <h2 className="font-bold mb-1 text-lg">Angaben gemäß § 5 TMG</h2>
              <p>Gabrielle Fu</p>
              <p>Bossbaby</p>
              <p>Connollystraße 3</p>
              <p>80809 München</p>
              <p>Deutschland</p>
            </div>

            <div>
              <h2 className="font-bold mb-1 text-lg">Kontakt</h2>
              <p>
                E-Mail:{" "}
                <a
                  href="mailto:bossbabiezzy@gmail.com"
                  className="underline hover:opacity-70 transition-opacity"
                  style={{ color: "#FF89CC" }}
                >
                  bossbabiezzy@gmail.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="font-bold mb-1 text-lg">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <p>Gabrielle Fu</p>
            </div>

            <div>
              <h2 className="font-bold mb-1 text-lg">EU-Streitschlichtung</h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-70 transition-opacity"
                  style={{ color: "#FF89CC" }}
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
                . Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </div>

            <div>
              <h2 className="font-bold mb-1 text-lg">Haftungsausschluss</h2>
              <p className="text-sm text-gray-500">
                Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
