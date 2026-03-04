"use client";

import { motion } from "motion/react";
import Image from "next/image";
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
      <div className="max-w-5xl w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Text content */}
        <motion.div
          className="flex-1"
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

          {/* Tagline — glass pill */}
          <motion.div className="mt-5" variants={fadeUpVariants}>
            <span className="inline-block text-xl sm:text-2xl text-forest-400 font-semibold tracking-tight backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-2 shadow-[0_0_20px_rgba(255,255,255,0.03)]">
              Software Engineer & AI Enthusiast
            </span>
          </motion.div>

          {/* Description — glass card */}
          <motion.div
            className="mt-6 backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 max-w-lg shadow-[0_0_20px_rgba(255,255,255,0.03)]"
            variants={fadeUpVariants}
          >
            <p className="text-lg text-cream-200 leading-relaxed">
              Developer based in Toronto. CS student at Purdue, passionate about
              building intelligent systems at the intersection of software
              engineering and artificial intelligence.
            </p>
          </motion.div>

          {/* CTA Buttons — glass */}
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            variants={ctaContainerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUpVariants}>
              <Link
                href="/portfolio"
                className="inline-block backdrop-blur-xl bg-forest-600/60 border border-forest-400/20 hover:bg-forest-500/70 hover:border-forest-400/30 text-cream-100 px-6 py-3 rounded-xl font-semibold transition-all shadow-[0_0_24px_rgba(98,160,100,0.15)] hover:shadow-[0_0_32px_rgba(98,160,100,0.25)]"
              >
                View Portfolio
              </Link>
            </motion.div>
            <motion.div variants={fadeUpVariants}>
              <Link
                href="/contact"
                className="inline-block backdrop-blur-xl bg-white/[0.04] border border-white/[0.12] hover:bg-white/[0.08] hover:border-white/[0.2] text-cream-200 hover:text-cream-100 px-6 py-3 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.03)] hover:shadow-[0_0_24px_rgba(255,255,255,0.06)]"
              >
                Get in Touch
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Photo — glass frame */}
        <motion.div
          className="flex-shrink-0 backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3 shadow-[0_0_30px_rgba(255,255,255,0.04)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 80, delay: 0.3 }}
        >
          <Image
            src="/hero-photo.jpg"
            alt="Tymur Bondar"
            width={340}
            height={420}
            priority
            className="rounded-xl object-cover w-[254px] h-[314px] sm:w-[294px] sm:h-[364px] lg:w-[334px] lg:h-[414px]"
          />
        </motion.div>
      </div>
    </section>
  );
}
