import React from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";
import step2 from "../assets/step2.png";
import step3 from "../assets/step3.png";
import step4 from "../assets/step4.png";


const brand = {
  pink: "#FF89CC",
  pink2: "#FFE3F2",
  bg: "#FFD2E9",
  ink: "#0f0f0f",
  muted: "#6b7280",
  white: "#fff",
};

const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1100px] mx-auto px-5 ${className}`}>{children}</div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] } },
};

const vo = { once: true, margin: "-60px" };

function StepTag({ num, label }) {
  return (
    <div className="flex items-end gap-3 mb-5">
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 800,
          fontSize: 80,
          lineHeight: 1,
          color: "rgba(0,0,0,0.18)",
          letterSpacing: "-0.04em",
          userSelect: "none",
        }}
      >
        {num}
      </span>
      <div
        style={{
          display: "inline-block",
          background: brand.pink,
          borderRadius: 100,
          padding: "4px 14px",
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#fff",
          marginBottom: 14,
          fontFamily: "Poppins, sans-serif",
        }}
      >
        {label}
      </div>
    </div>
  );
}

const steps = [
  {
    num: "01",
    tag: "Download",
    title: "Install the app.",
    body: "Download the Bossbaby app and you're already halfway there.\nIt takes two minutes to set up and zero effort to use.",
    note: null,
    photoSrc: null,
    flip: false,
    accent: brand.pink2,
  },
  {
    num: "02",
    tag: "Set up",
    title: "Create your profile.",
    body: "Answer a few quick questions: your age, weight, activity level, where you're based. This is how the algorithm gets to know you so your formula is built around your actual body, not some random average.",
    note: null,
    photoSrc: step2,
    flip: true,
    accent: "#fff",
  },
  {
    num: "03",
    tag: "Check in",
    title: "Pick your mood.",
    body: "Tired? Stressed? Want to glow? Just tap how you feel right now and how you want to feel. That's literally it. The app does the rest.",
    note: null,
    photoSrc: step3,
    flip: false,
    accent: brand.pink2,
  },
  {
    num: "04",
    tag: "Your formula",
    title: "Get your blend, backed by science.",
    body: "Our AI pulls from thousands of peer-reviewed studies, combines them with your profile and mood data, and builds a formula that's specific to you in real time. It learns from your feedback after each use and keeps getting better.",
    note: "Safety logic runs automatically in the background to make sure every dose stays within your personal daily limits.",
    photoSrc: step4,
    flip: true,
    accent: "#fff",
  },
  {
    num: "05",
    tag: "Connect",
    title: "Link up to your machine.",
    body: "The Bossbaby machine connects to your app and reads your formula directly. The modular cartridge system doses and mixes your exact blend with precision.",
    note: null,
    photoSrc: null,
    flip: false,
    accent: brand.pink2,
  },
  {
    num: "06",
    tag: "The good part",
    title: "Enjoy the drink.",
    body: "Press. Pour. Done. Your personalized shot is ready in seconds and it actually tastes good. This is what a wellness routine is supposed to feel like.",
    note: null,
    photoSrc: null,
    flip: true,
    accent: "#fff",
  },
];

export default function BossBabyHowItWorksPage({ currentPage, setCurrentPage }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fff", fontFamily: "Poppins, sans-serif", color: brand.ink }}>
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Hero */}
      <section className="relative overflow-hidden py-28 px-4 text-center" style={{ backgroundColor: brand.bg }}>
        <Container>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ display: "inline-block", background: "rgba(0,0,0,0.08)", borderRadius: 100, padding: "6px 18px", fontWeight: 700, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#000", marginBottom: 20 }}>
              How it works
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-black mb-5 mx-auto max-w-3xl" style={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
              Six steps to your perfect drink.
            </h1>
            <p className="text-xl text-gray-700 max-w-lg mx-auto mb-10" style={{ fontWeight: 400, lineHeight: 1.65 }}>
              From download to first sip, the entire process takes way less time than your morning scroll.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {["Install", "Profile", "Mood", "Formula", "Connect", "Enjoy"].map((s, i) => (
                <button
                  key={s}
                  onClick={() => document.getElementById(`step-0${i + 1}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  style={{ background: brand.pink, borderRadius: 100, padding: "7px 18px", fontWeight: 700, fontSize: 13, color: "#fff", border: `1px solid ${brand.pink}`, display: "flex", alignItems: "center", gap: 7, cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                >
                  <span style={{ fontWeight: 800, fontSize: 10, opacity: 0.85 }}>0{i + 1}</span> {s}
                </button>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Steps */}
      {steps.map((step, idx) => (
        <section key={step.num} id={`step-${step.num}`} style={{ backgroundColor: step.accent, borderBottom: "1px solid #f0f0f0" }}>
          <Container className="py-20">
            {step.photoSrc ? (
              /* 2-col layout for screenshot steps */
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${step.flip ? "md:[direction:rtl]" : ""}`}>
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vo} style={{ direction: "ltr" }}>
                  <StepTag num={step.num} label={step.tag} />
                  <h2 className="text-4xl sm:text-5xl font-extrabold mb-3" style={{ fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                    {step.title}
                  </h2>
                  <p className="text-base text-gray-600 mb-4" style={{ lineHeight: 1.8, maxWidth: 440, whiteSpace: "pre-wrap" }}>
                    {step.body}
                  </p>
                  {step.note && (
                    <p className="text-sm" style={{ color: brand.pink, fontWeight: 600, lineHeight: 1.65, maxWidth: 420 }}>
                      {step.note}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={vo}
                  style={{ direction: "ltr", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <img
                    src={step.photoSrc}
                    alt={`Step ${step.num}`}
                    style={{
                      width: 300,
                      borderRadius: 32,
                      boxShadow: "none",
                      display: "block",
                      background: "transparent",
                    }}
                  />
                </motion.div>
              </div>
            ) : (
              /* Single-col layout for text-only steps */
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={vo}
                className={`max-w-2xl ${step.flip ? "ml-auto" : ""}`}
              >
                <StepTag num={step.num} label={step.tag} />
                <h2 className="text-4xl sm:text-5xl font-extrabold mb-3" style={{ fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                  {step.title}
                </h2>
                <p className="text-base text-gray-600 mb-4" style={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {step.body}
                </p>

              </motion.div>
            )}
          </Container>
        </section>
      ))}

      {/* Bottom CTA */}
      <section className="py-24 px-4 text-center" style={{ backgroundColor: brand.ink }}>
        <Container>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vo}>
            <div style={{ fontWeight: 700, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: brand.pink, marginBottom: 20 }}>
              ready when you are
            </div>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 mx-auto max-w-2xl" style={{ fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Your ritual, built around you.
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setCurrentPage("products")}
                className="px-8 py-4 rounded-full font-extrabold text-base"
                style={{ background: brand.pink, color: "#fff", fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.87"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                Explore ready-to-go drinks
              </button>
              <button
                onClick={() => setCurrentPage("landing")}
                className="px-8 py-4 rounded-full font-extrabold text-base"
                style={{ background: "transparent", color: "#fff", fontWeight: 800, fontSize: 15, border: "1.5px solid rgba(255,255,255,0.28)", cursor: "pointer" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.65)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
              >
                Join waitlist
              </button>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
