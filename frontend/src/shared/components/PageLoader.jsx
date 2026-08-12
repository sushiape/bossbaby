import { useEffect } from "react";
import { motion } from "framer-motion";

const letters = "bossbaby".split("");

const letterVariants = {
  hidden: { y: 70, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function PageLoader({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0f0f0f" }}
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="flex overflow-hidden">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate="visible"
            style={{
              color: "#FF89CC",
              display: "inline-block",
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(3rem, 10vw, 7rem)",
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        style={{
          color: "rgba(255,137,204,0.5)",
          fontFamily: "Poppins, sans-serif",
          fontSize: "0.7rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          marginTop: "1.25rem",
        }}
      >
        nutrition for her
      </motion.p>
    </motion.div>
  );
}
