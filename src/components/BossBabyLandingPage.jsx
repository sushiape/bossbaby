import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const brand = {
  pink: "#FF89CC",
  bg: "#FAF5F6",
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

const drinks = [
  {
    name: "Power",
    description:
      "Hormone-balancing blend with adaptogenic herbs. For the days when you need your body to cooperate with your ambitions.",
  },
  {
    name: "Energy",
    description:
      "Mental clarity and sustained focus without the crash. Because your brain deserves premium fuel.",
  },
  {
    name: "Glow",
    description:
      "Skin-loving antioxidants and collagen support. Radiance that starts from the inside out.",
  },
  {
    name: "Calm",
    description:
      "Nervous system support for when you need to actually breathe. Calm without the drowsy.",
  },
];

const testimonials = [
  {
    name: "Sarah",
    quote:
      "Finally, a wellness brand that doesn't make me feel like I'm failing at life. These shots just... get it.",
    role: "Sarah, 29, Marketing Director",
  },
  {
    name: "Maya",
    quote:
      "The POWER shot is my secret weapon for those hormonal weeks when I usually want to hide under a blanket",
    role: "Maya, 34, Entrepreneur",
  },
  {
    name: "Jess",
    quote:
      "I've never been consistent with supplements, but this one feels like self-care, not homework.",
    role: "Jess, 26, Designer",
  },
  {
    name: "Julie",
    quote:
      "The energy shot is my go-to boost before training, it helps me push through tough sessions and recover with strength.",
    role: "Julie, 27, Fitness Coach",
  },
];

export default function BossbabyLandingPage({ currentPage, setCurrentPage }) {
  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mblqroob", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
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
      style={{ backgroundColor: brand.bg, fontFamily: "Poppins, sans-serif" }}
    >
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Hero Section */}
      <section
        className="text-center py-32 px-4"
        style={{ backgroundColor: brand.pink }}
      >
        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-[128px] font-extrabold text-white leading-tight mb-6"
          style={{ fontWeight: 800 }}
        >
          Nutrition drinks <br /> made for her.
        </h1>
        <p className="text-xl sm:text-2xl text-black mb-12">
          Empowering women with every sip.
        </p>

        {/* ===== START: WAITLIST-FORMULAR MIT FORMSPREE & SUCCESS-MESSAGE ===== */}
        <div className="mt-8">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2"
            style={{ fontSize: "42px" }}
          >
            Ready to feel unstoppable?
          </h2>
          <p className="text-xl sm:text-2xl text-white mb-4">
            Join the waitlist
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
                {status === "submitting" ? "SENDING..." : "JOIN"}
              </button>
            </div>

            <div className="flex items-center gap-2 max-w-md mt-2">
              <input
                type="checkbox"
                id="gdpr-consent"
                name="gdpr_consent"
                value="consented"
                required
                className="w-4 h-4 rounded"
              />
              <label
                htmlFor="gdpr-consent"
                className="text-xs text-white text-left"
              >
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
        </div>
        {/* ===== ENDE: WAITLIST-FORMULAR ===== */}
      </section>

      {/* About Section */}
      <section className="bg-white py-20 px-4 text-center">
        <Container>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg leading-relaxed text-black">
              We make nutritious drinks for women that taste amazing, fit busy
              routines, and turn wellness into a moment of empowerment and
              identity.
              <br />
              <br />
              We started Bossbaby because we couldn&apos;t find wellness
              products that truly reflect the way women live and feel. Most
              supplements are generic, masculine-default, or overly aesthetic
              without real function. We wanted something real, created by women,
              for women, that&apos;s both functional and emotionally resonant.
              <br />
              <br />
              Our formulas are developed together with nutrition experts and
              based on scientific research to align with women&apos;s
              physiological and emotional needs. Each shot, Power, Energy, Glow,
              and Calm, corresponds to a specific physical-emotional state,
              transforming supplements into an enjoyable, empowering daily
              ritual.
              <br />
              <br />
              Our mission is simple: to empower women with delicious nutrient
              drinks that taste amazing, fit busy routines, and turn wellness
              into a daily moment of strength, science, and self-expression.
            </p>
          </div>
        </Container>
      </section>

      {/* Drinks Section */}
      <section
        className="py-20 px-4 text-center"
        style={{ backgroundColor: "#FFF8F8" }}
      >
        <Container>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-light mb-4"
            style={{ fontSize: "40px" }}
          >
            Our Four Signature Formulas
          </h2>
          <p className="text-lg text-gray-700 mb-12">
            Each blend empowers a different side of life, from focus and
            vitality to confidence and calm.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {drinks.map((drink, index) => (
              <div
                key={index}
                className="relative rounded-2xl p-8 bg-white border transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{
                  borderColor: "#FFD1EB",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                }}
              >
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: brand.pink }}
                >
                  {drink.name}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-gray-700">
                  {drink.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Products Section */}
      <section className="py-20 px-4 text-center bg-white">
        <Container>
          <h3
            className="text-4xl sm:text-5xl md:text-6xl font-light mb-4"
            style={{ fontSize: "48px" }}
          >
            World&apos;s first AI-powered smoothie machine
          </h3>
          <p
            className="text-4xl sm:text-5xl md:text-6xl font-light"
            style={{ fontSize: "48px" }}
          >
            Stay tuned!
          </p>
        </Container>
      </section>

      {/* Community Section */}
      <section
        className="py-20 px-4"
        style={{ backgroundColor: brand.communityBg }}
      >
        <Container>
          <h4
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontSize: "37px", color: brand.communityText }}
          >
            Real women, real feelings
          </h4>
          <p
            className="text-xl sm:text-2xl mb-8"
            style={{ fontSize: "23px", color: brand.communityText }}
          >
            Because we&apos;re all just trying to feel like ourselves, but
            better.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-md"
                style={{
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  className="font-bold mb-2"
                  style={{ color: brand.communityText }}
                >
                  {testimonial.name}
                </div>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: brand.communityText }}
                >
                  &quot;{testimonial.quote}&quot;
                  <br />
                  <br />— {testimonial.role}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
