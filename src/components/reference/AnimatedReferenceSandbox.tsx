import { ExternalLink, Github, Mail, Moon, Sparkles, Sun } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { projects } from "../../data/projects";
import resumeData from "../../data/resume.json";
import { cn } from "../../lib/utils";

const featuredProjects = projects.slice(0, 6);
const skillGroups = Object.entries(resumeData.skills).slice(0, 4);
const skillLabels: Record<string, string> = {
  programmingLanguages: "Programming Languages",
  aiMl: "AI / ML",
  softwareDevelopment: "Software Development",
  databases: "Databases",
};
const navItems = [
  { href: "#reference-hero", label: "Home" },
  { href: "#reference-work", label: "Work" },
  { href: "#reference-projects", label: "Projects" },
  { href: "#reference-contact", label: "Contact" },
];

function useThemeMode() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("theme", nextTheme);
  };

  return { theme, toggleTheme };
}

function revealProps(shouldReduceMotion: boolean) {
  return {
    initial: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: shouldReduceMotion ? 0 : 0.65, ease: "easeOut" },
  };
}

function FloatingOrb({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
      animate={
        shouldReduceMotion
          ? undefined
          : {
              x: [0, 24, -16, 0],
              y: [0, -28, 18, 0],
              scale: [1, 1.12, 0.94, 1],
            }
      }
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function ReferenceNav() {
  const { theme, toggleTheme } = useThemeMode();

  return (
    <div className="fixed inset-x-0 bottom-3 z-50 mx-auto w-[min(calc(100%-1.5rem),32rem)] px-[env(safe-area-inset-left)]">
      <div className="rounded-full border border-white/30 bg-background/80 p-1.5 shadow-2xl shadow-blue-950/20 backdrop-blur-xl dark:border-white/15 dark:bg-background/70">
        <nav className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-center gap-1" aria-label="Reference sandbox sections">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-3 text-center text-xs font-semibold text-muted-foreground transition hover:bg-blue-600 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:text-sm"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:scale-95"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </nav>
      </div>
    </div>
  );
}

function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="reference-hero"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-4 pb-28 pt-12 sm:px-6 lg:px-8"
    >
      <FloatingOrb className="-left-20 top-20 h-72 w-72 bg-blue-500/35" />
      <FloatingOrb className="right-[-7rem] top-1/3 h-96 w-96 bg-cyan-400/25" delay={1.8} />
      <FloatingOrb className="bottom-12 left-1/4 h-64 w-64 bg-violet-500/25" delay={3.2} />

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_34%),linear-gradient(135deg,rgba(37,99,235,0.08),transparent_38%,rgba(14,165,233,0.08))]" />
      <div className="absolute inset-x-4 top-8 -z-10 h-48 rounded-[3rem] border border-white/30 bg-white/15 backdrop-blur-3xl dark:border-white/10 dark:bg-white/5" />

      <motion.div
        className="mx-auto grid w-full max-w-7xl gap-10 xl:grid-cols-[1.08fr_0.92fr] xl:items-center"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: "easeOut" }}
      >
        <div>
          <motion.div
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-700 shadow-lg shadow-blue-600/10 dark:text-blue-300"
            whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
          >
            <Sparkles className="h-4 w-4" />
            Ayush Madhav Kumar
          </motion.div>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.06em] text-foreground sm:text-6xl lg:text-7xl">
            Software developer building AI systems, mobile apps, and full-stack platforms.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
            Core contributor at Cactus (YC S25), AI engineer with NASA CLAWS, and builder of hackathon-winning tools across edge AI, cloud infrastructure, and developer platforms.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.a
              href="#reference-projects"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-blue-600/25 transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            >
              See my work
            </motion.a>
            <motion.a
              href="#reference-contact"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-foreground/80 bg-background/70 px-6 py-3 text-base font-semibold backdrop-blur transition hover:border-blue-600 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              whileHover={shouldReduceMotion ? undefined : { y: -3, scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            >
              Contact me
            </motion.a>
          </div>
        </div>

        <motion.div
          className="relative mx-auto hidden w-full max-w-md rounded-[2rem] border border-white/30 bg-background/70 p-4 shadow-2xl shadow-blue-950/20 backdrop-blur-xl dark:border-white/15 md:block"
          animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="rounded-[1.5rem] border-2 border-foreground/80 bg-background p-5">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">Portfolio signal</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">What I bring</h2>
            <div className="mt-5 space-y-3">
              {[
                "Edge AI and systems engineering",
                "React, Astro, and mobile-first interfaces",
                "Fast backend infrastructure for real users",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  className="rounded-2xl border border-foreground/15 bg-muted/40 p-4"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.2 + index * 0.12 }}
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function SectionShell({
  eyebrow,
  title,
  children,
  id,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  id: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section id={id} className="scroll-mt-6 px-4 py-10 sm:px-6 lg:px-8" {...revealProps(Boolean(shouldReduceMotion))}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">{eyebrow}</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          </div>
          <div className="h-1 w-24 rounded-full bg-blue-600" aria-hidden="true" />
        </div>
        {children}
      </div>
    </motion.section>
  );
}

function WorkSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionShell id="reference-work" eyebrow="Experience" title="Where I have shipped, researched, and led.">
      <div className="grid gap-4 lg:grid-cols-2">
        {resumeData.experience.map((job, index) => (
          <motion.article
            key={`${job.company}-${job.period}`}
            className="group rounded-[1.75rem] border-2 border-foreground/80 bg-background/80 p-5 shadow-lg shadow-blue-950/5 backdrop-blur transition hover:border-blue-600 sm:p-6"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={shouldReduceMotion ? undefined : { y: -6, rotate: index % 2 === 0 ? -0.4 : 0.4 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : index * 0.08 }}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold">{job.company}</h3>
                <p className="text-blue-600 dark:text-blue-400">{job.title}</p>
              </div>
              <p className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{job.period}</p>
            </div>
            <ul className="mt-4 space-y-2">
              {job.achievements.slice(0, 3).map((achievement) => (
                <li key={achievement} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}

function ProjectsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionShell id="reference-projects" eyebrow="Projects" title="Selected builds that show range and execution.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featuredProjects.map((project, index) => (
          <motion.article
            key={project.title}
            className="group flex min-h-[20rem] flex-col overflow-hidden rounded-[1.75rem] border-2 border-foreground/80 bg-background/85 p-5 shadow-lg shadow-blue-950/5 backdrop-blur transition hover:border-blue-600"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={shouldReduceMotion ? undefined : { y: -8, rotateX: 2, rotateY: index % 2 === 0 ? -2 : 2 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            viewport={{ once: true, margin: "-70px" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : index * 0.05 }}
          >
            <div className="mb-8 flex items-start justify-between gap-3">
              <h3 className="pr-2 text-2xl font-semibold tracking-tight">{project.title}</h3>
              <div className="flex shrink-0 gap-2">
                {project.websiteUrl && (
                  <a className="rounded-xl border border-foreground/50 p-2 transition hover:bg-blue-600 hover:text-white" href={project.websiteUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${project.title}`}>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                {project.githubUrl && (
                  <a className="rounded-xl border border-foreground/50 p-2 transition hover:bg-blue-600 hover:text-white" href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.title} on GitHub`}>
                    <Github className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            <p className="line-clamp-5 text-sm leading-6 text-muted-foreground">{project.description}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              {project.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </SectionShell>
  );
}

function SkillsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <SectionShell id="reference-skills" eyebrow="Stack" title="The tools I use to turn ideas into shipped systems.">
      <div className="grid gap-4 md:grid-cols-2">
        {skillGroups.map(([group, skills], index) => (
          <motion.div
            key={group}
            className="rounded-[1.75rem] border-2 border-foreground/80 bg-background/80 p-5 backdrop-blur"
            whileHover={shouldReduceMotion ? undefined : { y: -5 }}
            transition={{ delay: shouldReduceMotion ? 0 : index * 0.05 }}
          >
            <h3 className="mb-4 text-xl font-semibold">{skillLabels[group] ?? group.replace(/([A-Z])/g, " $1")}</h3>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 12).map((skill) => (
                <span key={skill} className="rounded-full border border-foreground/20 bg-muted/50 px-3 py-1.5 text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}

function ContactSection() {
  const shouldReduceMotion = useReducedMotion();
  const email = "contactayushmadhav@gmail.com";

  return (
    <SectionShell id="reference-contact" eyebrow="Contact" title="Work with me or follow what I build next.">
      <motion.div
        className="rounded-[2rem] border-2 border-foreground bg-foreground p-6 text-background shadow-2xl shadow-blue-950/20 sm:p-8"
        whileHover={shouldReduceMotion ? undefined : { y: -6 }}
      >
        <p className="max-w-2xl text-xl leading-8">
          I am interested in AI infrastructure, mobile developer tooling, full-stack engineering, and ambitious student or startup projects.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700" href={`mailto:${email}`}>
            <Mail className="h-5 w-5" />
            {email}
          </a>
          <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-background/40 px-5 py-3 font-semibold transition hover:bg-background hover:text-foreground" href="https://github.com/ayushmk7" target="_blank" rel="noreferrer">
            <Github className="h-5 w-5" />
            GitHub
          </a>
        </div>
      </motion.div>
    </SectionShell>
  );
}

export default function AnimatedReferenceSandbox() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background pb-28 text-foreground">
      <Hero />
      <WorkSection />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
      <ReferenceNav />
    </div>
  );
}
