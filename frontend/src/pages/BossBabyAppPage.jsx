import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Header from "../shared/components/Header";
import Footer from "../shared/components/Footer";

const brand = {
  pink: "#FF89CC",
  bg: "#FFD6E9",
  ink: "#111",
  white: "#fff",
  border: "#f3e3ee",
  error: "#9f285f",
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const GENERIC_ERROR = "Invite not recognized.";

export default function BossBabyAppPage({ currentPage, setCurrentPage }) {
  const [invite, setInvite] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // Same-origin under hibossbaby.com via the /app/:path* rewrite, so the
      // httpOnly entry cookie on the response is actually stored. The server
      // normalizes case and whitespace, so the raw value goes as typed.
      const response = await fetch("/app/api/entry", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite }),
      });
      const body = await response.json().catch(() => ({}));

      if (response.ok) {
        // /app/login is a different deployment: a router push would never
        // leave this React app.
        window.location.assign(body.redirect ?? "/app/login");
        return;
      }

      // Printed verbatim. A rate limit (429) deliberately reuses the 400
      // wording so it cannot confirm a near-miss guess.
      setError(body.error ?? GENERIC_ERROR);
      inputRef.current?.select();
    } catch {
      setError("Something went wrong. Please try again.");
      inputRef.current?.select();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: brand.bg, fontFamily: "Poppins, sans-serif", color: brand.ink }}
    >
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="flex-1 py-20 sm:py-28 px-4">
        <motion.div
          className="max-w-[560px] mx-auto text-center"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: brand.pink }}
          >
            A new blend is brewing
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="font-extrabold mb-5"
            style={{
              fontSize: "clamp(2.2rem, 7vw, 3.6rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: brand.ink,
            }}
          >
            Our app is under construction.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mb-10"
            style={{ fontSize: "1.05rem", color: "#444", lineHeight: 1.75 }}
          >
            We&apos;re shaping a more personal way to discover what your body and mood need.
            The first version is currently available to the Bossbaby development team.
          </motion.p>

          <motion.form
            variants={fadeUp}
            onSubmit={handleSubmit}
            noValidate
            className="text-left rounded-3xl p-6 sm:p-8"
            style={{ backgroundColor: brand.white, border: `1px solid ${brand.border}` }}
          >
            <label htmlFor="invite" className="block mb-2 text-sm font-bold">
              Have an invite?
            </label>
            <input
              id="invite"
              name="invite"
              ref={inputRef}
              type="text"
              value={invite}
              onChange={(event) => setInvite(event.target.value)}
              autoComplete="off"
              maxLength={256}
              required
              aria-describedby="invite-status"
              aria-invalid={error ? true : undefined}
              className="w-full rounded-2xl px-4 outline-none transition-shadow focus:border-[#FF69B4] focus:shadow-[0_0_0_4px_rgba(255,105,180,0.16)]"
              style={{
                minHeight: 54,
                border: `1px solid ${brand.border}`,
                backgroundColor: brand.white,
                color: brand.ink,
                font: "inherit",
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-3 rounded-2xl font-extrabold uppercase tracking-wider text-white transition-colors disabled:opacity-60 disabled:cursor-wait"
              style={{ minHeight: 54, backgroundColor: "#171217", font: "inherit", fontWeight: 900 }}
            >
              {submitting ? "Checking…" : "Continue"}
            </button>
            <p
              id="invite-status"
              role="status"
              aria-live="polite"
              className="mt-3 mx-0.5 text-sm font-bold"
              style={{ minHeight: 22, color: brand.error }}
            >
              {error}
            </p>
          </motion.form>
        </motion.div>
      </main>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
