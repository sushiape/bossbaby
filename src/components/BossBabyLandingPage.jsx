import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import Footer from "./Footer";

const brand = {
  pink: "#FF89CC",
  bg: "#FFD2E9",
  white: "#fff",
  text: "#000",
  communityBg: "#EAEDDC",
  communityText: "#002B26",
};

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

// ── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const viewportOpts = { once: true, margin: "-80px" };

// ── Data ────────────────────────────────────────────────────────────────────
const drinks = [
  {
    name: "Power",
    description:
      "Your ambition doesn't run on empty. Built for the days your goals are big and your energy feels small — hormone-balancing, mood-lifting, made to match your drive.",
  },
  {
    name: "WaKe Up!",
    description:
      "10 tabs open, 2 hours of focus left. Natural caffeine meets brain-loving adaptogens for clarity that holds through the whole meeting — not just the first sip.",
  },
  {
    name: "Glow",
    description:
      "Skin that remembers to show up. Antioxidants and collagen boosters work quietly while you move loudly — because looking like yourself, at your best, shouldn't need an extra hour.",
  },
  {
    name: "lazy juice",
    description:
      "Not every day needs to be productive. Calming botanicals and stress-ease nutrients for when you just need to exhale, reset, and feel like yourself again. No apologies.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Pick your mood",
    description:
      "Feeling scattered? Depleted? Want to glow? Each formula is built around a specific state you want to move toward — choose the one that fits your day.",
  },
  {
    step: "02",
    title: "Take your shot",
    description:
      "Delicious, convenient, no prep. Each formula is designed to be the one supplement you actually look forward to — not the one you forget in a drawer.",
  },
  {
    step: "03",
    title: "Feel the difference",
    description:
      "Science-backed ingredients formulated with nutrition experts, designed to work with your body's natural rhythms — not against them.",
  },
];

const stats = [
  { value: "4", label: "mood-based formulas" },
  { value: "100%", label: "science-backed" },
  { value: "Women", label: "founded & built" },
  { value: "Munich", label: "born and brewing" },
];

const testimonials = [
  {
    name: "Valentina",
    quote:
      "I want nutrition that feels like a reward, not a chore. And Bossbaby just gets it.",
    role: "Valentina, 27, Design Freelancer",
  },
  {
    name: "Jun",
    quote:
      "I would 100% recommend it, because niche products that support women's inner peace and outer energy are very rare.",
    role: "Jun, 26, Marketing Analyst",
  },
  {
    name: "Charlie",
    quote:
      "I'm a busy working girl, so I've never been consistent with supplements, but this one feels like self-care, not homework.",
    role: "Charlie, 32, Entrepreneur",
  },
  {
    name: "Cassandra",
    quote:
      "My friends and I group-chatted about this before it even launched. Some things are just better shared.",
    role: "Cassandra, 29, Aerospace Engineer",
  },
];

// Duplicate for seamless marquee loop
const row1 = [...testimonials, ...testimonials];
const row2 = [...testimonials, ...testimonials];

const affiliations = [
  {
    name: "Growth Alliance Accelerator",
    logo: "https://framerusercontent.com/images/NSMdvir5eKfM69KzEdpQZYBBFNY.svg",
  },
  {
    name: "Federal Ministry of Agriculture",
    logo: "https://www.bmleh.de/SiteGlobals/Frontend/Images/logo.svg?__blob=normal&v=8",
  },
  {
    name: "Rentenbank",
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Rentenbank_logo.svg",
  },
  {
    name: "TechQuartier",
    logo: "https://framerusercontent.com/images/ofOJUgFa83WGUnL2bf4V8anqOeQ.svg",
  },
  {
    name: "TUM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/c/c8/Logo_of_the_Technical_University_of_Munich.svg",
  },
  {
    name: "LMU Munich",
    logo: "https://cms-cdn.lmu.de/assets/img/Logo_LMU.svg",
  },
  {
    name: "UnternehmerTUM",
    logo: "https://ut-um.files.svdcdn.com/production/media/logos/logo-unternehmertum.svg",
  },
  {
    name: "TUM Venture Labs",
    logo: "https://ut-um.files.svdcdn.com/production/media/images/venture-labs/TUM-UTUM-Logos.svg",
  },
  {
    name: "TUM Venture Lab FAB",
    logo: "https://www.tum-venture-labs.de/media/images/lab-logos/tum-venture-labs-food-agro-biotech.svg",
  },
  {
    name: "KfW Stiftung",
    logo: "https://kfw-stiftung.de/fileadmin/logo/Logo_KfW_Stiftung_rgb.svg",
  },
  {
    name: "Social Business Women e.V.",
    logo: "https://www.social-business-women.com/wp-content/uploads/2026/01/BerufsWege-fuer-Frauen-und-Social-Business-Women-eV_Logo_klein-1.png",
  },
  {
    name: "CoCo – Female Founders",
    logo: "https://coco-frauen-gruenden.de/wp-content/uploads/2025/02/Coco_logo_dunkel.svg",
  },
];

// ── Testimonial card ────────────────────────────────────────────────────────
function TestimonialCard({ testimonial }) {
  return (
    <div
      style={{
        display: "inline-block",
        flexShrink: 0,
        width: "300px",
        padding: "1.5rem",
        background: "#ffffff",
        borderRadius: "1rem",
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        border: "1px solid #ffeaf4",
      }}
    >
      <p
        style={{
          fontStyle: "italic",
          color: "#374151",
          lineHeight: "1.65",
          marginBottom: "1rem",
          whiteSpace: "normal",
          fontSize: "0.9rem",
        }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <span
        style={{
          fontWeight: 700,
          color: brand.pink,
          fontSize: "0.8rem",
          whiteSpace: "normal",
        }}
      >
        — {testimonial.role}
      </span>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function BossbabyLandingPage({ currentPage, setCurrentPage }) {
  const [status, setStatus] = useState("idle");

  // Scroll to hero section after animations complete
  React.useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200); // Wait for animations to complete (1.2 seconds)

    return () => clearTimeout(timer);
  }, []);

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
    } catch {
      setStatus("error");
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: brand.bg, fontFamily: "Poppins, sans-serif" }}
    >
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* ── 1. Hero ── */}
      <section
        className="text-center py-32 px-4"
        style={{ backgroundColor: brand.pink }}
      >
        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[128px] font-extrabold text-white leading-tight mb-6"
          style={{ fontWeight: 800 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          Nutrition drinks <br /> made for her.
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl text-black mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.25, ease: "easeOut" }}
        >
          Four science-backed formulas. One for every mood.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.45, ease: "easeOut" }}
        >
          <p className="text-lg text-white mb-4 font-medium">
            Be first to know when we launch.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 items-center max-w-2xl mx-auto"
          >
            <div className="flex gap-3 justify-center flex-wrap">
              <input
                type="email"
                name="email_address"
                placeholder="enter your email"
                required
                className="px-4 py-3 rounded-lg border border-white bg-white text-black text-base"
                style={{ width: "300px", maxWidth: "80vw" }}
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="px-6 py-3 rounded-lg border border-white bg-white font-bold text-base hover:bg-pink-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ color: brand.pink }}
              >
                {status === "submitting" ? "SENDING..." : "JOIN WAITLIST"}
              </button>
            </div>
            {status === "success" && (
              <p className="text-sm text-green-100 mt-1">
                You&apos;re on the waitlist ✨ We&apos;ll email you when Bossbaby launches.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-100 mt-1">
                Something went wrong. Please try again in a moment.
              </p>
            )}
          </form>
        </motion.div>
      </section>

      {/* ── 2. Affiliations bar ── */}
      <section className="py-10 bg-white overflow-hidden w-full">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-gray-600 text-center mb-8 text-lg font-medium">
            We build inside a strong innovation network.
          </p>
        </div>
        <div className="relative w-full overflow-hidden group">
          <div
            className="flex gap-4 whitespace-nowrap group-hover:[animation-play-state:paused]"
            style={{ animation: "scroll 30s linear infinite" }}
          >
            {[...affiliations, ...affiliations].map((affiliation, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border text-sm font-medium bg-white text-gray-800 shadow-sm"
                style={{ flexShrink: 0 }}
              >
                <img
                  src={affiliation.logo}
                  alt={affiliation.name}
                  style={{ height: "20px", width: "auto", maxWidth: "72px", objectFit: "contain" }}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                {affiliation.name}
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </section>

      {/* ── 3. Drinks ── */}
      <section className="py-20 px-4 text-center" style={{ backgroundColor: brand.bg }}>
        <Container>
          <motion.h2
            className="font-bold mb-4"
            style={{ fontSize: "40px", color: "#000" }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOpts}
          >
            Four formulas. Every mood covered.
          </motion.h2>
          <motion.p
            className="text-lg mb-12"
            style={{ color: "#111" }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOpts}
          >
            From drive to calm, from glow to focus — there&apos;s one for today.
          </motion.p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOpts}
          >
            {drinks.map((drink, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="relative rounded-2xl p-8 text-left"
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                  cursor: "default",
                }}
                whileHover={{
                  y: -6,
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.15)",
                  transition: { duration: 0.22 },
                }}
              >
                <h3 className="text-2xl font-bold mb-4" style={{ color: brand.pink }}>
                  {drink.name}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: "#444" }}>
                  {drink.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ── 3. How it works ── */}
      <section className="py-20 px-4 bg-white">
        <Container>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOpts}
          >
            <motion.h2
              variants={fadeUp}
              className="text-center font-bold mb-2"
              style={{ fontSize: "36px" }}
            >
              How it works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-center text-gray-500 mb-14 text-lg"
            >
              Wellness that fits around your life, not the other way around.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {howItWorks.map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="text-center">
                  <div
                    className="text-5xl font-extrabold mb-4"
                    style={{ color: brand.pink, opacity: 0.35 }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#111" }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── 4. Stats bar ── */}
      <motion.section
        className="py-14 px-4"
        style={{ backgroundColor: "#111" }}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOpts}
      >
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div
                  className="text-4xl font-extrabold mb-1"
                  style={{ color: brand.pink }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </motion.section>

      {/* ── 5. About ── */}
      <section className="bg-white py-20 px-4 text-center">
        <Container>
          <motion.div
            className="max-w-3xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOpts}
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl font-bold mb-6"
              style={{ fontSize: "32px", lineHeight: 1.3 }}
            >
              Built because the supplement aisle wasn&apos;t built for us.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-base text-gray-700 leading-relaxed"
              style={{ fontSize: "17px" }}
            >
              Most supplements ignore the way women actually live — the mood shifts,
              the demanding schedules, the need for something that feels like self-care,
              not medicine. We built Bossbaby to fix that. Four science-backed formulas,
              each tied to a mood and developed with nutrition experts, designed to be
              the wellness ritual you actually keep.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* ── 6. AI machine teaser ── */}
      <section
        className="py-20 px-4 text-center"
        style={{ backgroundColor: brand.bg }}
      >
        <Container>
          <motion.div
            className="max-w-3xl mx-auto"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOpts}
          >
            <motion.p
              variants={fadeUp}
              className="text-sm font-semibold uppercase tracking-widest mb-4"
              style={{ color: brand.pink }}
            >
              Coming soon
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-bold mb-6"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", lineHeight: 1.2 }}
            >
              AI-powered mood-based nutrition machine
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-700 leading-relaxed"
              style={{ fontSize: "17px" }}
            >
              We&apos;re building a smart dispenser that reads your mood in real time
              and delivers a personalized formula on the spot. No tracking, no guesswork —
              just the right nutrients at the right moment, every time.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      {/* ── 7. Testimonials marquee ── */}
      <section
        className="py-20 overflow-hidden"
        style={{ backgroundColor: brand.communityBg }}
      >
        <Container>
          <motion.h2
            className="font-bold mb-3"
            style={{ fontSize: "37px", color: brand.communityText }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOpts}
          >
            Why we love Bossbaby.
          </motion.h2>
          <motion.p
            className="mb-12"
            style={{ fontSize: "20px", color: brand.communityText, opacity: 0.7 }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOpts}
          >
            Because we&apos;re all just trying to feel like ourselves, but better.
          </motion.p>
        </Container>

        {/* Row 1 — scrolls left */}
        <div className="relative w-full overflow-hidden group mb-5">
          <div
            className="flex gap-5 whitespace-nowrap group-hover:[animation-play-state:paused]"
            style={{ animation: "scroll-left 28s linear infinite" }}
          >
            {[...row1, ...row1].map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="relative w-full overflow-hidden group">
          <div
            className="flex gap-5 whitespace-nowrap group-hover:[animation-play-state:paused]"
            style={{ animation: "scroll-right 28s linear infinite" }}
          >
            {[...row2, ...row2].map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
