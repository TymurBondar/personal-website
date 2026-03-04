"use client";

import { motion } from "motion/react";

const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (delay) => ({
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      damping: 14,
      stiffness: 80,
      delay,
    },
  }),
};

export default function Timeline({ entries }) {
  return (
    <ol className="relative border-s border-forest-700/50">
      {entries.map((entry, index) => (
        <motion.li
          key={index}
          className="mb-10 ms-6"
          variants={slideInVariants}
          custom={index * 0.1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Timeline dot */}
          <div className="absolute -start-2 w-4 h-4 rounded-full bg-forest-600 border-2 border-bark-950" />

          {/* Content card */}
          <div className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-xl p-5 shadow-[0_0_20px_rgba(255,255,255,0.03)]">
            <time className="block text-sm text-cream-200 mb-1">{entry.date}</time>
            <h3 className="text-xl font-semibold text-cream-100 mb-1">
              {entry.title}
            </h3>
            <p className="text-forest-400 font-medium mb-3">{entry.org}</p>
            <p className="text-cream-200 mb-4 leading-relaxed">
              {entry.description}
            </p>
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs px-2.5 py-1 rounded-full bg-forest-700/30 text-forest-400 border border-forest-700/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
