"use client";

import { motion } from "motion/react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 14, stiffness: 80 },
  },
};

const ctaContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.8,
    },
  },
};

function AnimatedWords({ text, className, style }) {
  const words = text.split(" ");
  return (
    <span className={className} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordVariants}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  return (
    <section className="flex items-center justify-center min-h-[80vh] px-6">
      <motion.div
        className="max-w-3xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Name */}
        <div className="overflow-hidden pb-2">
          <AnimatedWords
            text="Tymur Bondar"
            className="block text-5xl sm:text-6xl lg:text-7xl text-cream-100"
            style={{
              fontWeight: "var(--font-weight-display)",
              letterSpacing: "var(--tracking-display)",
            }}
          />
        </div>

        {/* Tagline */}
        <motion.div className="mt-4 overflow-hidden" variants={fadeUpVariants}>
          <span className="text-xl sm:text-2xl text-forest-400 font-semibold tracking-tight">
            Software Engineer & AI Enthusiast
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          className="mt-6 text-lg text-cream-200 leading-relaxed max-w-lg"
          variants={fadeUpVariants}
        >
          Developer based in Toronto. CS student at Purdue, passionate about
          building intelligent systems at the intersection of software
          engineering and artificial intelligence.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          variants={ctaContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUpVariants}>
            <Link
              href="/portfolio"
              className="inline-block bg-forest-600 hover:bg-forest-500 text-cream-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              View Portfolio
            </Link>
          </motion.div>
          <motion.div variants={fadeUpVariants}>
            <Link
              href="/contact"
              className="inline-block border border-cream-200 text-cream-200 hover:text-cream-100 hover:border-cream-100 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Get in Touch
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
