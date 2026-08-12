import React from "react";
import Header from "../shared/components/Header";
import Footer from "../shared/components/Footer";

const brand = {
  pink: "#FF89CC",
  lightPink: "#FFE3F2",
  bg: "#FFD2E9",
  text: "#1f1f1f",
  muted: "#6b7280",
  white: "#fff",
  border: "#f1f1f1",
};

const upcomingEvents = [
  {
    title: "Superbloom 2026",
    date: "29/30.08.26",
    description: "We’ll be there on the weekend, meeting amazing people, sharing our bossbaby journey, and showcasing our prototype. Visit us at https://superbloom.de for more info.",
    link: "https://superbloom.de",
    image: "/superbloom.jpeg",
  },
];

const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1200px] mx-auto px-4 sm:px-6 ${className}`}>{children}</div>
);

const pastEvents = [];

export default function BossBabyFlavourLabPage({ currentPage, setCurrentPage }) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: brand.bg, fontFamily: "Poppins, sans-serif", color: brand.text }}
    >
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <section className="py-20 px-4">
        <Container>
          <div className="max-w-[800px] mx-auto text-center">
            <p className="inline-block rounded-full px-4 py-2 text-sm font-semibold mb-4" style={{ backgroundColor: brand.lightPink, color: brand.text }}>
              Flavour Lab
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              Where taste, testing, and community meet.
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              We’re building the next Bossbaby flavours with the people who love them most. Come taste, test, and be part of the story.
            </p>
            <button
              type="button"
              className="rounded-full px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: brand.pink }}
              onClick={() => setCurrentPage("community")}
            >
              Back to community
            </button>
          </div>

          <div className="mt-12 space-y-6">
            <div className="rounded-[32px] border bg-white/80 p-6 md:p-8 shadow-sm" style={{ borderColor: "#ffeaf4" }}>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: brand.pink }}>
                  Upcoming events
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-2" style={{ fontWeight: 800 }}>
                  Coming up soon
                </h2>
              </div>

              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="rounded-2xl border bg-[#fffdfd] p-5" style={{ borderColor: "#ffeaf4" }}>
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-72 object-cover rounded-2xl mb-4 -mt-4"
                        style={{ objectPosition: '50% 65%' }}
                      />
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-lg" style={{ fontWeight: 800 }}>
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        {event.link && (
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex text-sm font-semibold underline"
                            style={{ color: brand.pink }}
                          >
                            Visit the event page
                          </a>
                        )}
                      </div>
                      <div className="rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: brand.lightPink }}>
                        {event.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border bg-white/80 p-6 md:p-8 shadow-sm" style={{ borderColor: "#ffeaf4" }}>
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: brand.pink }}>
                  Past events
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold mt-2" style={{ fontWeight: 800 }}>
                  What we’ve already shared
                </h2>
              </div>

              <div className="space-y-4">
                {pastEvents.map((event, index) => (
                  <div key={index} className="rounded-2xl border bg-[#fffdfd] p-5" style={{ borderColor: "#ffeaf4" }}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-lg" style={{ fontWeight: 800 }}>
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      </div>
                      <div className="rounded-full px-3 py-1 text-sm font-semibold" style={{ backgroundColor: brand.lightPink }}>
                        {event.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
