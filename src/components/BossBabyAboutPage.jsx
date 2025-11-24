import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

const brand = {
  pink: "#FF89CC",
  bg: "#FFD2E9",
  ink: "#1f1f1f",
  muted: "#6b7280",
  white: "#fff",
  border: "#f3e3ee",
};

const Container = ({ children, className = "" }) => (
  <div className={`max-w-[1120px] mx-auto px-4 ${className}`}>{children}</div>
);

const Wrap = ({ children, className = "" }) => (
  <div className={`max-w-[900px] mx-auto ${className}`}>{children}</div>
);

const affiliations = [
  "Growth Alliance Accelerator",
  "German Federal Ministry of Agriculture, Food and Regional Identity",
  "Rentenbank",
  "TechQuartier",
  "Technical University of Munich (TUM)",
  "Ludwig Maximilian University of Munich (LMU)"
  "UnternehmerTUM",
  "TUM Venture Labs",
  "KfW Stiftung",
  "Social Business Women e.V.",
  "TUM Venture Lab - Food, Agro, and Biotech (FAB)",
  "CoCo - Female Founders"
];

const values = [
  {
    title: "What we make",
    description: "Targeted drinks for daily use. Each formula focuses on balance, focus, radiance, or calm."
  },
  {
    title: "How we create",
    description: "We iterate with small batches and real feedback from our community to build what truly supports modern wellness."
  },
  {
    title: "Where we work",
    description: "Based in Munich, collaborating with partners across the EU and North America."
  }
];

export default function BossBabyAboutPage({ currentPage, setCurrentPage }) {
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const formData = new FormData(e.target);

      const response = await fetch("https://formspree.io/f/xgvrwpyr", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        e.target.reset();
      } else {
        setStatus("error");
      }
    } catch (err) {
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
        scrollBehavior: "smooth",
      }}
    >
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <Wrap>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-5"
            style={{
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#111",
              fontSize: "clamp(40px, 5vw, 64px)",
            }}
          >
            Our why is simple.
          </h1>
          <h2
            className="text-xl sm:text-2xl font-medium mb-5"
            style={{ color: "#444", lineHeight: 1.6 }}
          >
            Nutrition that fits real life, backed by science, designed for women.
          </h2>
          <p
            className="text-base text-gray-600 max-w-[760px] mx-auto leading-relaxed"
            style={{ fontSize: "1.05rem", lineHeight: 1.8 }}
          >
            Born in Munich, shaped at Stanford and Palo Alto. We are a team of
            engineers and nutrition scientists passionate about making daily
            nutrition easier and more enjoyable.
          </p>
        </Wrap>
      </section>

      {/* Affiliations Section */}
      <section className="py-12 px-4">
        <Container>
          <Wrap>
            <div
              className="bg-white border rounded-2xl p-8 shadow-md"
              style={{
                borderColor: brand.border,
                boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
              }}
            >
              <h3
                className="text-xl font-bold mb-3"
                style={{ fontWeight: 700, color: "#111" }}
              >
                Affiliations
              </h3>
              <p className="text-base text-gray-600 mb-4">
                We build inside a strong innovation network.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {affiliations.map((aff, index) => (
                  <span
                    key={index}
                    className="bg-white border rounded-full px-4 py-2 text-sm transition-all hover:text-white hover:border-pink-500"
                    style={{
                      borderColor: brand.border,
                      fontSize: "0.85rem",
                      backgroundColor: "white",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = brand.pink;
                      e.target.style.borderColor = brand.pink;
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "white";
                      e.target.style.borderColor = brand.border;
                      e.target.style.color = "inherit";
                    }}
                  >
                    {aff}
                  </span>
                ))}
              </div>
            </div>
          </Wrap>
        </Container>
      </section>

      {/* Values Section */}
      <section className="py-12 px-4">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white border rounded-2xl p-8 shadow-md hover:-translate-y-1 transition-all"
                style={{
                  borderColor: brand.border,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                }}
              >
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontWeight: 700, color: "#111" }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-base text-gray-600 leading-relaxed"
                  style={{ fontSize: "0.98rem", lineHeight: 1.6 }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4">
        <Container>
          <div
            className="max-w-[840px] mx-auto text-center bg-black text-white rounded-3xl p-10 shadow-md"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}
          >
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">
              Want updates from the lab?
            </h3>
            <p className="text-gray-300 mb-5">
              Get notes on new batches, ingredient deep dives, and early drops.
            </p>

            {/* CUSTOM FORMSPREE FORM WITH CUSTOM SUCCESS MESSAGE */}
            <form
              onSubmit={handleSubmit}
              className="flex gap-3 justify-center flex-wrap mt-5"
            >
              <input
                type="email"
                name="email"
                placeholder="enter your email"
                required
                autoComplete="email"
                className="px-4 py-4 rounded-2xl border border-gray-700 bg-white text-black text-base min-w-[260px] max-w-[80vw]"
                style={{ fontSize: "15px" }}
              />

              <button
                type="submit"
                disabled={status === "submitting"}
                className="px-5 py-4 rounded-2xl border-none bg-white text-black font-extrabold text-base transition-all"
                style={{
                  fontWeight: 800,
                  fontSize: "15px",
                  backgroundColor: "white",
                  color: "#111",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = brand.pink;
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "white";
                  e.target.style.color = "#111";
                }}
              >
                {status === "submitting" ? "Sending..." : "Join"}
              </button>
            </form>

            {/* SUCCESS + ERROR MESSAGES */}
            {status === "success" && (
              <p className="mt-3 text-white text-sm font-medium">
                Thanks for joining! 💖
              </p>
            )}

            {status === "error" && (
              <p className="mt-3 text-red-300 text-sm font-medium">
                Oops! Something went wrong — try again?
              </p>
            )}
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
