import { ExternalLink, Github } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "Project One",
      description:
        "A comprehensive web application built with React and TypeScript. Features real-time data updates and responsive design.",
      tags: ["React", "TypeScript", "Tailwind"],
      websiteUrl: "https://project-one.com",
      githubUrl: "https://github.com/yourusername/project-one",
      featured: true,
    },
    {
      title: "Project Two",
      description:
        "Machine learning model for predictive analytics using TensorFlow. Achieved 95% accuracy on test dataset.",
      tags: ["Python", "Machine Learning", "TensorFlow"],
      websiteUrl: "https://project-two.com",
      githubUrl: "https://github.com/yourusername/project-two",
      featured: true,
    },
    {
      title: "Project Three",
      description:
        "RESTful API backend service with Node.js and MongoDB. Handles 10k+ requests per minute.",
      tags: ["Node.js", "MongoDB", "Express"],
      websiteUrl: "https://project-three.com",
      githubUrl:
        "https://github.com/yourusername/project-three",
      featured: false,
    },
    {
      title: "Project Four",
      description:
        "Cybersecurity tool for vulnerability scanning and threat detection in web applications.",
      tags: ["Python", "Security", "Docker"],
      websiteUrl: "https://project-four.com",
      githubUrl: "https://github.com/yourusername/project-four",
      featured: false,
    },
    {
      title: "Project Five",
      description:
        "Mobile-first progressive web app with offline capabilities and push notifications.",
      tags: ["React", "PWA", "Firebase"],
      websiteUrl: "https://project-five.com",
      githubUrl: "https://github.com/yourusername/project-five",
      featured: false,
    },
    {
      title: "Project Six",
      description:
        "AI-powered chatbot using natural language processing for customer service automation.",
      tags: ["NLP", "Python", "AI"],
      websiteUrl: "https://project-six.com",
      githubUrl: "https://github.com/yourusername/project-six",
      featured: false,
    },
  ];

  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-1 bg-blue-600 mx-auto mb-4 rounded-full"></div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3">
          Projects
        </h1>
        <p className="text-lg text-muted-foreground">
          A showcase of my work and contributions
        </p>
      </div>

      {/* Featured Projects */}
      <section className="mb-10">
        <h2 className="text-2xl md:text-3xl mb-6">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredProjects.map((project, index) => (
            <div
              key={index}
              className="bg-background border-4 border-black dark:border-white rounded-3xl p-7 md:p-8 hover:border-blue-600 hover:shadow-xl transition-all duration-300 relative group"
            >
              {/* Project Links - Top Right */}
              <div className="absolute top-6 right-6 flex gap-2">
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 border-2 border-black dark:border-white rounded-xl hover:bg-foreground hover:text-background transition-all duration-300"
                  aria-label="Visit website"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 border-2 border-black dark:border-white rounded-xl hover:bg-foreground hover:text-background transition-all duration-300"
                  aria-label="View on GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>

              <div className="pr-24">
                <div className="w-10 h-1 bg-blue-600 mb-4 rounded-full"></div>
                <h3 className="text-2xl mb-4">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-5 leading-relaxed text-lg">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-4 py-2 text-sm border-2 border-black dark:border-white bg-background rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Projects */}
      <section>
        <h2 className="text-2xl md:text-3xl mb-6">
          More Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherProjects.map((project, index) => (
            <div
              key={index}
              className="border-2 border-black dark:border-white rounded-2xl p-6 hover:border-blue-600 hover:shadow-lg transition-all duration-300 relative bg-background"
            >
              {/* Project Links - Top Right */}
              <div className="absolute top-4 right-4 flex gap-2">
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-black dark:border-white rounded-xl hover:bg-foreground hover:text-background transition-all duration-300"
                  aria-label="Visit website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-black dark:border-white rounded-xl hover:bg-foreground hover:text-background transition-all duration-300"
                  aria-label="View on GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>

              <h3 className="text-xl mb-3 pr-20">
                {project.title}
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 text-sm border border-black dark:border-white bg-background rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}