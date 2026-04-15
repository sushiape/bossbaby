import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

const brand = {
  pink: "#FF89CC",
  pink2: "#FFE3F2",
  bg: "#FFD6E9",
  ink: "#111",
  muted: "#6b7280",
  white: "#fff",
  border: "#f3e3ee",
};

const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const viewport = { once: true, margin: "-70px" };

const affiliations = [
  { name: "Growth Alliance Accelerator", logo: "https://framerusercontent.com/images/NSMdvir5eKfM69KzEdpQZYBBFNY.svg" },
  { name: "Federal Ministry of Agriculture", logo: "https://www.bmleh.de/SiteGlobals/Frontend/Images/logo.svg?__blob=normal&v=8" },
  { name: "Rentenbank", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Rentenbank_logo.svg" },
  { name: "TechQuartier", logo: "https://framerusercontent.com/images/ofOJUgFa83WGUnL2bf4V8anqOeQ.svg" },
  { name: "TUM", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Logo_of_the_Technical_University_of_Munich.svg" },
  { name: "LMU Munich", logo: "https://cms-cdn.lmu.de/assets/img/Logo_LMU.svg" },
  { name: "UnternehmerTUM", logo: "https://ut-um.files.svdcdn.com/production/media/logos/logo-unternehmertum.svg" },
  { name: "TUM Venture Labs", logo: "https://ut-um.files.svdcdn.com/production/media/images/venture-labs/TUM-UTUM-Logos.svg" },
  { name: "TUM Venture Lab FAB", logo: "https://www.tum-venture-labs.de/media/images/lab-logos/tum-venture-labs-food-agro-biotech.svg" },
  { name: "KfW Stiftung", logo: "https://kfw-stiftung.de/fileadmin/logo/Logo_KfW_Stiftung_rgb.svg" },
  { name: "Social Business Women e.V.", logo: "https://www.social-business-women.com/wp-content/uploads/2026/01/BerufsWege-fuer-Frauen-und-Social-Business-Women-eV_Logo_klein-1.png" },
  { name: "CoCo – Female Founders", logo: "https://coco-frauen-gruenden.de/wp-content/uploads/2025/02/Coco_logo_dunkel.svg" },
];

const principles = [
  {
    number: "01",
    title: "Made by women, for women",
    body: "We built this from the inside out — as women who were tired of products that didn't reflect how we actually live, feel, and move through the world.",
  },
  {
    number: "02",
    title: "Science, not trends",
    body: "Every formula is developed with nutrition experts and grounded in research. We don't chase what's buzzing — we build what works.",
  },
  {
    number: "03",
    title: "Wellness should feel good",
    body: "If you're forcing yourself to take it, it won't stick. We designed Bossbaby to be something you genuinely look forward to — a ritual, not a chore.",
  },
  {
    number: "04",
    title: "Mood is data",
    body: "Your energy, focus, skin, and calm aren't random — they're signals. We take that seriously and built formulas that respond to how you actually feel day to day.",
  },
];

const stats = [
  { value: "4", label: "mood-based formulas" },
  { value: "100%", label: "science-backed" },
  { value: "Munich", label: "born & brewing" },
  { value: "Women", label: "founded & led" },
];

export default function BossBabyAboutPage({ currentPage, setCurrentPage }) {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const response = await fetch("https://formspree.io/f/xgvrwpyr", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.target),
      });
      if (response.ok) { setStatus("success"); e.target.reset(); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: brand.bg, fontFamily: "Poppins, sans-serif", color: brand.ink }}
    >
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* ── Hero ── */}
      <section
        className="py-28 px-4 text-center"
        style={{ backgroundColor: "#FF64BE" }}
      >
        <motion.div
          className="max-w-3xl mx-auto"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={fadeUp}
            className="font-extrabold mb-5"
            style={{
              fontSize: "clamp(2.6rem, 7vw, 5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "#fff",
            }}
          >
            We make nutrition drinks for women.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}
          >
            That taste amazing, fit busy routines, and turn wellness into a moment of empowerment and identity.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Our story ── */}
      <section className="py-20 px-4" style={{ backgroundColor: "#fff" }}>
        <Container>
          <motion.div
            className="max-w-[760px] mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: brand.pink }}
            >
              Our story
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-bold mb-8"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.2, color: brand.ink }}
            >
              We started Bossbaby because the supplement aisle wasn&apos;t built for us.
            </motion.h2>

            <motion.div variants={stagger} className="space-y-6">
              <motion.p
                variants={fadeUp}
                className="leading-relaxed"
                style={{ fontSize: "1.05rem", color: "#333336", lineHeight: 1.85 }}
              >
                We started Bossbaby because we couldn&apos;t find nutrition supplements that truly
                reflect the way women live and feel. Most supplements are inconvenient, overly
                masculine, and not designed with women&apos;s unique health needs in mind. We wanted
                something real — created by women, for women — that&apos;s both functional and empowering.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="leading-relaxed"
                style={{ fontSize: "1.05rem", color: "#333336", lineHeight: 1.85 }}
              >
                Our formulas are developed together with nutrition experts and based on scientific
                research to align with women&apos;s physiological and emotional needs. Each shot —
                Power, Energy, Glow, and Calm — corresponds to a specific physical and emotional
                state, transforming supplements into an enjoyable, empowering daily ritual.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="leading-relaxed"
                style={{ fontSize: "1.05rem", color: "#333336", lineHeight: 1.85 }}
              >
                Our mission is simple: to empower women with delicious nutrient drinks that taste
                amazing, fit busy routines, and turn wellness into a daily moment of strength,
                science, and self-expression.
              </motion.p>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ── Stats bar ── */}
      <motion.section
        className="py-14 px-4"
        style={{ backgroundColor: "#111" }}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
      >
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="text-4xl font-extrabold mb-1" style={{ color: brand.pink }}>
                  {s.value}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </Container>
      </motion.section>

      {/* ── What we believe ── */}
      <section className="py-20 px-4" style={{ backgroundColor: brand.bg }}>
        <Container>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-widest mb-3 text-center"
              style={{ color: brand.pink }}
            >
              What we believe
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-bold text-center mb-14"
              style={{ fontSize: "clamp(1.7rem, 4vw, 2.4rem)", color: brand.ink }}
            >
              Four principles. Non-negotiable.
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[900px] mx-auto">
              {principles.map((p, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="rounded-2xl p-8"
                  style={{
                    background: "linear-gradient(155deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.78) 100%)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.8)",
                    boxShadow: "0 8px 24px rgba(133,89,109,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                  }}
                >
                  <span
                    className="block text-5xl font-extrabold mb-4"
                    style={{ color: brand.pink, opacity: 0.3, lineHeight: 1 }}
                  >
                    {p.number}
                  </span>
                  <h3 className="font-bold mb-3 text-lg" style={{ color: brand.ink }}>
                    {p.title}
                  </h3>
                  <p style={{ color: "#4b5563", lineHeight: 1.7, fontSize: "0.97rem" }}>
                    {p.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Science meets self-care ── */}
      <section className="py-20 px-4" style={{ backgroundColor: "#fff" }}>
        <Container>
          <motion.div
            className="max-w-[760px] mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: brand.pink }}
            >
              The approach
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-bold mb-8"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.2, color: brand.ink }}
            >
              Science that fits in your bag.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="leading-relaxed mb-6"
              style={{ fontSize: "1.05rem", color: "#333336", lineHeight: 1.85 }}
            >
              We don&apos;t believe wellness should be complicated, expensive, or require a
              nutrition degree to understand. We work closely with nutrition scientists to
              translate complex research into formulas that are easy to use and impossible
              to forget — because they actually taste good.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="leading-relaxed"
              style={{ fontSize: "1.05rem", color: "#333336", lineHeight: 1.85 }}
            >
              Based in Munich and embedded in one of Europe&apos;s strongest innovation
              ecosystems — TUM, UnternehmerTUM, and beyond — we combine academic rigor
              with a real understanding of what modern women need day to day.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* ── Affiliations ── */}
      <section className="py-16 px-4" style={{ backgroundColor: brand.bg }}>
        <Container>
          <motion.div
            className="max-w-[900px] mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.p
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-widest mb-3 text-center"
              style={{ color: brand.pink }}
            >
              Our network
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-bold text-center mb-3"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", color: brand.ink }}
            >
              Supported by people who believe in what we&apos;re building.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-center mb-10"
              style={{ color: "#666", fontSize: "1rem" }}
            >
              From Munich research labs to federal innovation programs.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="rounded-2xl p-8 bg-white"
              style={{
                border: "1px solid rgba(255,255,255,0.8)",
                boxShadow: "0 8px 24px rgba(133,89,109,0.07)",
              }}
            >
              <div className="flex flex-wrap gap-2.5">
                {affiliations.map((aff, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all cursor-default"
                    style={{
                      border: `1px solid ${brand.border}`,
                      backgroundColor: "#fff",
                      fontSize: "0.85rem",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = brand.pink;
                      e.currentTarget.style.borderColor = brand.pink;
                      e.currentTarget.style.color = "#fff";
                      const img = e.currentTarget.querySelector("img");
                      if (img) img.style.filter = "brightness(0) invert(1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#fff";
                      e.currentTarget.style.borderColor = brand.border;
                      e.currentTarget.style.color = "inherit";
                      const img = e.currentTarget.querySelector("img");
                      if (img) img.style.filter = "";
                    }}
                  >
                    <img
                      src={aff.logo}
                      alt={aff.name}
                      style={{ height: "18px", width: "auto", maxWidth: "68px", objectFit: "contain" }}
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                    {aff.name}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4" style={{ backgroundColor: "#fff" }}>
        <Container>
          <motion.div
            className="max-w-[800px] mx-auto text-center rounded-3xl px-10 py-14"
            style={{
              backgroundColor: "#111",
              boxShadow: "0 20px 48px rgba(0,0,0,0.18)",
            }}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.h3
              variants={fadeUp}
              className="font-extrabold mb-3"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", color: "#fff" }}
            >
              Be the first to know.
            </motion.h3>
            <motion.p variants={fadeUp} className="mb-7" style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem" }}>
              Launching October 1, 2026. Join the waitlist and get early access.
            </motion.p>

            <motion.form
              variants={fadeUp}
              onSubmit={handleSubmit}
              className="flex gap-3 justify-center flex-wrap"
            >
              <input
                type="email"
                name="email_address"
                placeholder="enter your email"
                required
                className="px-5 py-3.5 rounded-xl border border-gray-700 bg-white text-black text-sm"
                style={{ minWidth: "260px", maxWidth: "80vw" }}
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="px-6 py-3.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-60"
                style={{ backgroundColor: brand.pink, color: "#fff", border: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#ff6abf"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = brand.pink; }}
              >
                {status === "submitting" ? "Sending..." : "JOIN WAITLIST"}
              </button>
            </motion.form>

            {status === "success" && (
              <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                You&apos;re on the list. We&apos;ll be in touch.
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 text-sm text-red-400">
                Something went wrong — please try again.
              </p>
            )}
          </motion.div>
        </Container>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
