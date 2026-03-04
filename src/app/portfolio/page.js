import ProjectCard from "../../components/ProjectCard";

const projects = [
  {
    title: "Binghamton Rover Team",
    description:
      "Developed a YOLOv5-based object recognition system for autonomous rover navigation. Built real-time computer vision pipelines for obstacle detection and terrain classification as part of the university Mars rover competition team.",
    tags: ["Python", "YOLOv5", "OpenCV", "PyTorch", "ROS"],
    image: null,
    github: "https://github.com/TymurBondar",
  },
  {
    title: "Spelling Bee of Canada",
    description:
      "Built and deployed the official website for Spelling Bee of Canada. Implemented responsive design, SEO optimization, and content management workflows using modern web technologies.",
    tags: ["Next.js", "React", "Tailwind CSS", "Vercel", "SEO"],
    href: "https://spellingbeeofcanada.ca",
  },
  {
    title: "Personal Website",
    description:
      "This portfolio site, built from scratch with Next.js 15, React 19, and Tailwind v4. Features a solarpunk design system with liquid glass UI, motion animations, and Server Component architecture.",
    tags: ["Next.js 15", "React 19", "Tailwind v4", "motion", "Vercel"],
    github: "https://github.com/TymurBondar/personal-website",
  },
];

export default function PortfolioPage() {
  return (
    <main className="px-6 pt-(--spacing-section) pb-(--spacing-section) max-w-6xl mx-auto">
      <h1
        className="text-4xl sm:text-5xl text-cream-100 mb-4"
        style={{
          fontWeight: "var(--font-weight-display)",
          letterSpacing: "var(--tracking-display)",
        }}
      >
        Portfolio
      </h1>
      <p className="text-cream-200 text-lg mb-12">
        A selection of projects I have built and contributed to.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </main>
  );
}
