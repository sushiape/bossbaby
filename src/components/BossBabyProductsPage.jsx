import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { ChevronRight } from "lucide-react";

const brand = {
  pink: "#FF89CC",
  pink2: "#FFE3F2",
  bg: "#FFD2E9",
  ink: "#0f0f0f",
  muted: "#6b7280",
  card: "#fff",
  border: "#efeff0",
  hover: "#ffb8dd",
};

const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1180px] mx-auto px-5 ${className}`}>{children}</div>
);

const moods = [
  {
    letter: "P",
    name: "Power",
    description:
      "Hormonal support with iron and vitamin B6 to help balance and recharge.",
    bgColor: "#ff6b6b",
  },
  {
    letter: "E",
    name: "WaKe Up! (Energy)",
    description:
      "Mental clarity with B-complex, guarana, and L-theanine for sustained focus.",
    bgColor: "#ff8a00",
  },
  {
    letter: "G",
    name: "Glow",
    description:
      "Skin and cell nourishment with collagen peptides, vitamin C, and hyaluronic acid.",
    bgColor: "#ff2d83",
  },
  {
    letter: "C",
    name: "lazy juice (Calm)",
    description:
      "Nervous system regulation with magnesium, lemon balm, and chamomile.",
    bgColor: "#f39c12",
  },
];

export default function BossBabyProductsPage({ currentPage, setCurrentPage }) {
  // Match landing page behavior
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xgvrwpyr", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: brand.bg,
        fontFamily: "Poppins, sans-serif",
        color: brand.ink,
      }}
    >
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Hero Section */}
      <section className="relative text-center py-24 px-4">
        <Container>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 max-w-[900px] mx-auto"
            style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
          >
            Nutrition drinks made for her, backed with science.
          </h1>
          <p className="text-lg text-gray-600 max-w-[780px] mx-auto mt-4">
            Bossbaby shots are designed to empower women through nutrition and
            science.
          </p>
          <div className="flex gap-3 justify-center flex-wrap mt-6">
            <a
              href="#moods"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 font-extrabold text-base border border-black bg-black text-white hover:-translate-y-0.5 transition-transform"
              style={{ fontWeight: 800 }}
            >
              Explore formulas
            </a>
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 rounded-full px-5 py-3.5 font-extrabold text-base border border-gray-300 bg-white text-black hover:-translate-y-0.5 transition-transform"
              style={{ fontWeight: 800 }}
            >
              Join waitlist
            </a>
          </div>
        </Container>
      </section>

      {/* Intro Section */}
      <section id="moods" className="py-16">
        <Container>
          <div className="text-center mb-10">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{ fontSize: "clamp(22px, 3.2vw, 34px)" }}
            >
              Four moods. Four formulas. One ritual.
            </h2>
            <p className="text-base text-gray-600">
              Choose your feeling, grab your shot, and go be unstoppable.
            </p>
          </div>

          {/* Mood Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {moods.map((mood, index) => (
              <article
                key={index}
                className="relative overflow-hidden rounded-2xl bg-white border-0 shadow-lg hover:-translate-y-1 transition-all min-h-[140px] grid grid-cols-[160px_1fr] items-center"
                style={{
                  boxShadow: "0 16px 50px rgba(17,17,17,0.08)",
                }}
                tabIndex={0}
              >
                {/* Mono Letter */}
                <div
                  className="relative h-full flex items-center justify-center font-black text-7xl text-white"
                  style={{
                    backgroundColor: mood.bgColor,
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-28"
                    style={{
                      clipPath: "polygon(0 0, 85% 0, 70% 100%, 0 100%)",
                      backgroundColor: "#000",
                    }}
                  ></div>
                  {mood.letter}
                </div>

                {/* Content */}
                <div className="p-4 pr-5">
                  <h3
                    className="text-xl font-extrabold mb-1"
                    style={{ fontWeight: 800, letterSpacing: "-0.01em" }}
                  >
                    {mood.name}
                  </h3>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {mood.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <a
                      href="#waitlist"
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 font-bold text-sm bg-white"
                      style={{ fontWeight: 700 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                      Join waitlist
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Waitlist CTA Section */}
      <section
        id="waitlist"
        className="py-16 px-4 text-center"
        style={{
          backgroundColor: brand.pink,
          color: brand.ink,
          borderTop: "1px solid #ffd2ea",
          borderBottom: "1px solid #ffd2ea",
        }}
      >
        <Container>
          <h3
            className="text-2xl sm:text-3xl font-bold mb-1"
            style={{ fontSize: "clamp(22px, 3.2vw, 30px)" }}
          >
            Ready to feel unstoppable?
          </h3>
          <p className="mb-4">Join the waitlist</p>

          {/* Same Formspree form as landing page */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 items-center max-w-2xl mx-auto mt-4"
            aria-live="polite"
          >
            <div className="flex gap-2 justify-center flex-wrap">
              <input
                type="email"
                name="email_address"          // important for Formspree mapping
                placeholder="enter your email"
                required
                className="px-4 py-4 rounded-2xl border border-white bg-white text-base min-w-[280px] max-w-[80vw] text-black"
                style={{ fontSize: "15px" }}
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="px-4 py-4 rounded-2xl border border-black bg-black text-white font-extrabold text-base hover:opacity-95 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ fontWeight: 800, fontSize: "15px" }}
              >
                {status === "submitting" ? "SENDING..." : "GO"}
              </button>
            </div>

            <div className="flex items-start gap-2 max-w-md mt-1 text-left">
              <input
                type="checkbox"
                id="gdpr-consent"
                name="gdpr_consent"
                value="consented"
                required
                className="mt-1 w-4 h-4 rounded"
              />
              <label htmlFor="gdpr-consent" className="text-xs text-white">
                I consent to my email address being stored and used{" "}
                <span className="font-semibold">only</span> to notify me when
                Bossbaby launches. I understand I can unsubscribe at any time.
              </label>
            </div>

            {status === "success" && (
              <p className="text-sm text-green-100 mt-1">
                You&apos;re on the waitlist ✨ We&apos;ll email you when Bossbaby
                launches.
              </p>
            )}

            {status === "error" && (
              <p className="text-sm text-red-100 mt-1">
                Something went wrong. Please try again in a moment.
              </p>
            )}
          </form>
        </Container>
      </section>

      {/* Sticky Bar */}
      <div className="sticky bottom-0 z-40 bg-black text-white">
        <div className="flex gap-4 justify-center items-center py-3 px-4">
          <span>
            <strong className="font-extrabold">Early access</strong> drops first
            to the list
          </span>
          <a
            href="#waitlist"
            className="bg-white text-black rounded-full px-4 py-2.5 font-extrabold border border-white"
            style={{ fontWeight: 800 }}
          >
            Join waitlist
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
