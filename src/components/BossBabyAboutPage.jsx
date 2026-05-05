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
      <section className="py-28 px-4 text-center" style={{ backgroundColor: brand.bg }}>
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
              color: brand.ink,
            }}
          >
            Our why is simple.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            style={{ fontSize: "1.2rem", color: "#444", lineHeight: 1.7 }}
          >
            Nutrition that fits real life. Backed by science. Made by women, for women.
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
              We just wanted something tasty and healthy.
            </motion.h2>

            <motion.div variants={stagger} className="space-y-6">
              <motion.p
                variants={fadeUp}
                className="leading-relaxed"
                style={{ fontSize: "1.05rem", color: "#333336", lineHeight: 1.85 }}
              >
                We are a team of women engineers and scientists who are passionate about making
                women&apos;s health a little bit more enjoyable.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="leading-relaxed"
                style={{ fontSize: "1.05rem", color: "#333336", lineHeight: 1.85 }}
              >
                We kept looking for nutrition supplements that actually made sense for the way
                we live. Something that fits in a purse, tastes good, and does not feel like a
                chore. We could not find it. So we made it ourselves.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="leading-relaxed"
                style={{ fontSize: "1.05rem", color: "#333336", lineHeight: 1.85 }}
              >
                We work with nutrition experts and built four formulas around the moods we
                actually experience: Power when your energy is flat, Energy when you need to
                lock in, Glow when you want to feel radiant, Calm when everything is just a
                bit too much. Each one is grounded in research and designed to be something
                you look forward to taking, not something you feel guilty skipping.
              </motion.p>
              <motion.p
                variants={fadeUp}
                className="leading-relaxed"
                style={{ fontSize: "1.05rem", color: "#333336", lineHeight: 1.85 }}
              >
                We want women to have nutrition that feels like it was made for them. Because
                for a long time, it really was not.
              </motion.p>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* ── The approach ── */}
      <section className="py-20 px-4" style={{ backgroundColor: brand.bg }}>
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
              Science that actually fits in your bag.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="leading-relaxed mb-6"
              style={{ fontSize: "1.05rem", color: "#333336", lineHeight: 1.85 }}
            >
              Wellness should not feel like homework. We really believe that. So everything we
              build is designed to be simple, tasty, and actually fit into a real day. We work
              with nutrition scientists and food technologists to make sure the science is solid, and we obsess over
              the taste so that it's enjoyable.
            </motion.p>
            <motion.p
              variants={fadeUp}
              className="leading-relaxed"
              style={{ fontSize: "1.05rem", color: "#333336", lineHeight: 1.85 }}
            >
              We are based in Munich and surrounded by a network of researchers, scientists,
              and fellow founders who push us to keep getting it right. We are grateful for
              that. And we are just getting started.
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
                Something went wrong. Please try again.
              </p>
            )}
          </motion.div>
        </Container>
      </section>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
