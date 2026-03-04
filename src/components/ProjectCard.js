"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function ProjectCard({ project, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: "spring",
        damping: 14,
        stiffness: 80,
        delay: index * 0.15,
      }}
      className="backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.03)]"
    >
      {/* Image section */}
      {project.image ? (
        <div className="relative aspect-video">
          <Image
            src={project.image}
            alt={project.title}
            width={600}
            height={338}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="aspect-video bg-bark-900 flex items-center justify-center">
          <span className="text-cream-200/40 text-sm">Image coming soon</span>
        </div>
      )}

      {/* Content section */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-cream-100">{project.title}</h3>
        <p className="text-cream-200 mt-2">{project.description}</p>

        {/* Tech tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-forest-700/30 text-forest-400 border border-forest-700/40"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Links section */}
        <div className="flex flex-wrap gap-4 mt-4">
          {project.href && (
            <Link
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-forest-400 hover:text-forest-300 font-medium transition-colors"
            >
              View Project &rarr;
            </Link>
          )}
          {project.github && (
            <Link
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-forest-400 hover:text-forest-300 font-medium transition-colors"
            >
              Source Code &rarr;
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
