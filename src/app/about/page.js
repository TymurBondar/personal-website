import Timeline from "../../components/Timeline";

const timelineData = [
  {
    date: "2024 - Present",
    title: "IT & Digital Marketing Specialist",
    org: "Spelling Bee of Canada",
    description:
      "Developing and maintaining web infrastructure, implementing SEO strategies, and building automated marketing tools using modern web technologies.",
    tags: ["Next.js", "React", "SEO", "Google Ads", "Analytics"],
  },
  {
    date: "2024",
    title: "Software Engineering Intern",
    org: "Spelling Bee of Canada",
    description:
      "Built and deployed the organization's website using Next.js and React. Implemented responsive design, optimized performance, and integrated content management workflows.",
    tags: ["Next.js", "React", "Tailwind CSS", "Vercel"],
  },
  {
    date: "2023 - 2024",
    title: "Software Team Member",
    org: "Binghamton Rover Team",
    description:
      "Developed YOLOv5 object recognition system for autonomous rover navigation. Built computer vision pipelines for real-time obstacle detection and terrain classification.",
    tags: ["Python", "YOLOv5", "OpenCV", "PyTorch", "ROS"],
  },
  {
    date: "2022 - Present",
    title: "Computer Science Student",
    org: "Purdue University",
    description:
      "Pursuing a Bachelor's degree in Computer Science with focus on artificial intelligence and software engineering.",
    tags: ["Java", "Python", "C", "Data Structures", "Algorithms"],
  },
];

export default function AboutPage() {
  return (
    <main className="px-6 pt-(--spacing-section) pb-(--spacing-section) max-w-4xl mx-auto">
      <h1
        className="text-4xl sm:text-5xl text-cream-100 mb-6"
        style={{
          fontWeight: "var(--font-weight-display)",
          letterSpacing: "var(--tracking-display)",
        }}
      >
        About Me
      </h1>
      <p className="text-cream-200 text-lg mb-12">
        My journey through computer science, from university to building
        real-world applications.
      </p>
      <Timeline entries={timelineData} />
    </main>
  );
}
