import React, { useState } from "react";
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

const drinks = [
  {
    name: "Power",
    description:
      "For the days when your body needs to catch up with your ambition. Helps balance hormones, boost mood, and improve your energy so your body can keep up with your goals.",
  },
  {
    name: "WaKe Up!",
    description:
      "When you’ve got 10 tabs open and 2 hours of focus left. A clean boost powered by natural caffeine and brain-loving nutrients for steady energy, sharp focus, and no burnout.",
  },
  {
    name: "Glow",
    description:
      "Glow, confidence, and shine from within. Antioxidants and collagen boosters light you up from the inside out, giving your skin, hair, and day a front-row seat to that unmistakable Bossbaby glow.",
  },
  {
    name: "lazy juice",
    description:
      "For days where you just want to turn off the world. A calming blend that eases stress and supports relaxation so you can breathe, reset, and feel like yourself again.",
  },
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
      "I would 100% recommend it, because niche products that support women’s inner peace and outer energy are very rare.",
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
      "Best friends should get beautiful together ;p",
    role: "Cassandra, 29, Aerospace Engineer",
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
      const response = await fetch("https://formspree.io/f/xgvrwpyr", {
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

     {/* Affiliations Bar */}
<section className="py-10 bg-white overflow-hidden w-full">
  {/* Centered header text stays in a contained width */}
  <div className="max-w-4xl mx-auto px-4">
    <p className="text-gray-600 text-center mb-8 text-lg font-medium">
      We build inside a strong innovation network.
    </p>
  </div>

  {/* Full-width scrolling section */}
  <div className="relative w-full overflow-hidden group">
    <div
      className="flex gap-6 whitespace-nowrap animate-scroll group-hover:[animation-play-state:paused]"
      style={{
        animation: "scroll 20s linear infinite",
      }}
    >
      {[
      "Growth Alliance Accelerator",    
      "German Federal Ministry of Agriculture, Food and Regional Identity",
        "Rentenbank",
        "TechQuartier",
        "Technical University of Munich (TUM)",
       "Ludwig Maximilian University of Munich (LMU)",
        "UnternehmerTUM",
        "TUM Venture Labs",
        "TUM Venture Lab - Food, Agro, and Biotech (FAB)",
        "KfW Stiftung",
        "Social Business Women e.V.",
        "CoCo - Female Founders",
      ].map((affiliation, i) => (
        <span
          key={i}
          className="px-6 py-3 rounded-full border text-sm font-medium bg-white text-gray-800 shadow-sm"
        >
          {affiliation}
        </span>
      ))}

      {/* Duplicate list for seamless loop */}
      {[
      "Growth Alliance Accelerator",  
      "German Federal Ministry of Agriculture, Food and Regional Identity",
        "Rentenbank",
        "TechQuartier",
        "Technical University of Munich (TUM)",
        "Ludwig Maximilian University of Munich (LMU)",
        "UnternehmerTUM",
        "TUM Venture Labs",
        "TUM Venture Lab - Food, Agro, and Biotech (FAB)",
        "KfW Stiftung",
        "Social Business Women e.V.",
        "CoCo - Female Founders",
      ].map((affiliation, i) => (
        <span
          key={`dup-${i}`}
          className="px-6 py-3 rounded-full border text-sm font-medium bg-white text-gray-800 shadow-sm"
        >
          {affiliation}
        </span>
      ))}
    </div>
  </div>

  {/* Scroll animation */}
  <style>{`
    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `}</style>
</section>
      
      
      {/* About Section */}
<section className="bg-white py-20 px-4 text-center">
  <Container>
    <div className="max-w-5xl mx-auto space-y-10">
      <h2 className="text-2xl font-semibold text-brand-black mb-6 text-center">
        We make nutritious drinks for women that taste amazing, fit busy routines,
        and turn wellness into a moment of empowerment and identity.
      </h2>

      <p className="text-base text-gray-700 leading-relaxed max-w-5xl mx-auto">
        We started Bossbaby because we couldn’t find nutrition supplements that truly reflect
        the way women live and feel. Most supplements are inconvenient, overly masculine, and not
        designed with women's unique health needs in mind. We wanted something that’s convenient, delicious, and functional, created by
        women, for women.
      </p>

      <p className="text-base text-gray-700 leading-relaxed max-w-5xl mx-auto">
        Our formulas are developed together with nutrition scientists and experts
        to align with women's physiological and emotional needs. Each shot — Power, WaKe Up! (Energy),
        Glow, and Lazy Juice (Calm) — corresponds to a specific mood, transforming
        supplements into an enjoyable, empowering daily ritual.
      </p>

      <p className="text-base text-gray-700 leading-relaxed max-w-5xl mx-auto">
        Our mission is simple: to empower women with delicious nutrient drinks that taste amazing,
        fit busy routines, and turn wellness into a daily moment of strength, science, and self-expression.
      </p>
    </div>
  </Container>
</section>

    
      
      {/* Drinks Section */}
      <section
        className="py-20 px-4 text-center"
        style={{ backgroundColor: "brand.pink2" }}
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
                  boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                }}
              >
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: brand.text }}
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
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
            style={{ fontSize: "24px" }}
          >
            Coming soon! Stay tuned!
          </h3>
          <p
            className="text-4xl sm:text-5xl md:text-6xl font-light"
            style={{ fontSize: "48px" }}
          >
            World&apos;s first AI-powered smoothie machine
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
            100% would recommend Bossbaby.
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
