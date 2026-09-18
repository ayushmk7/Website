// src/lib/profile.ts
// Single source of truth for the main page (src/pages/index.astro).
// Everything here is re-exported or DERIVED from src/data/* — never duplicate data.

import { experience, hackathons } from '../data/v2';
import type { Experience, Hackathon } from '../data/v2';
import { projects } from '../data/projects';
import type { Project } from '../data/projects';
import { places } from '../data/places';
import type { Place } from '../data/places';
import resume from '../data/resume.json';

export type { Experience, Hackathon, Project, Place };

/** The comic ("fun") page. */
export const FUN_HREF = '/fun';

// ---------------------------------------------------------------------------
// Identity / copy
// ---------------------------------------------------------------------------

export interface ContactLink {
  key: 'email' | 'github' | 'linkedin' | 'x' | 'resume' | 'cv';
  label: string;   // "GitHub"
  handle: string;  // "ayushmk7" — short text to show next to the label
  href: string;
  external: boolean;
}

export const profile = {
  name: 'Ayush Madhav Kumar',
  headline: 'CS and Math @ University of Michigan',
  /** 2–3 sentence bio for hero/about. Grounded in v2.ts experience. */
  summary:
    'Computer Science and Mathematics undergraduate at the University of Michigan. I work on systems and AI infrastructure: fine-tuning a domain-specialized coding model at Jaseci Labs, ARM SIMD inference kernels at Cactus (YC S25), and NSF-funded open-source ecosystem research. Five hackathon placements in the last year.',
  location: 'Ann Arbor, MI',
  availability: 'Open to internships and collaborations. Email is fastest.',
  site: 'https://ayushmadhav.com',
  email: 'contactayushmadhav@gmail.com',
  resumeHref: '/AyushMadhavResume.pdf',
  cvHref: '/AyushMadhavCV.pdf',
  metaDescription:
    'Ayush Madhav Kumar. CS and Math @UMichigan. Systems programming, AI infrastructure, on-device inference, and hackathon wins.',
} as const;

export const contactLinks: ContactLink[] = [
  { key: 'email', label: 'Email', handle: profile.email, href: `mailto:${profile.email}`, external: false },
  { key: 'github', label: 'GitHub', handle: 'ayushmk7', href: 'https://github.com/ayushmk7', external: true },
  { key: 'linkedin', label: 'LinkedIn', handle: 'ayushmk', href: 'https://www.linkedin.com/in/ayushmk', external: true },
  { key: 'x', label: 'X', handle: '@ayushmk_007', href: 'https://x.com/ayushmk_007', external: true },
  { key: 'resume', label: 'Résumé', handle: 'PDF', href: profile.resumeHref, external: true },
  { key: 'cv', label: 'CV', handle: 'PDF', href: profile.cvHref, external: true },
];

// ---------------------------------------------------------------------------
// Experience / Hackathons / Places — straight re-exports (already curated & ordered)
// ---------------------------------------------------------------------------

export { experience, hackathons, places };

/** Hackathon + the matching project entry (for tags / extra links), when one exists. */
export interface HackathonWithProject extends Hackathon {
  projectEntry?: Project;
}
export const hackathonsWithProject: HackathonWithProject[] = hackathons.map((h) => ({
  ...h,
  projectEntry: projects.find((p) => p.title === h.project),
}));

// ---------------------------------------------------------------------------
// Projects — same curation as src/components/v2/ProjectLayouts.astro
// ---------------------------------------------------------------------------

/** Mirror of ProjectLayouts.featuredTitles (curation, not data). Keep in sync. */
const featuredProjectTitles = ['Jac ML Studio', 'NightShift', 'Domain Portfolio Manager', 'NASA SUITS Challenge'];

/** Projects minus the ones that are shown under Hackathons. Original order preserved. */
const visibleProjects: Project[] = projects.filter((p) => !hackathons.some((h) => h.project === p.title));

/** The 4 featured projects, in featuredProjectTitles order. Build fails on a typo. */
export const featuredProjects: Project[] = featuredProjectTitles.map((t) => {
  const p = visibleProjects.find((x) => x.title === t);
  if (!p) throw new Error(`profile.ts: featured project "${t}" not in projects.ts (or is a hackathon project)`);
  return p;
});

/** Everything visible that is not featured (the "show more" set). */
export const moreProjects: Project[] = visibleProjects.filter((p) => !featuredProjectTitles.includes(p.title));

// ---------------------------------------------------------------------------
// Skills — same labels + featured picks as src/components/v2/StackLayouts.astro
// ---------------------------------------------------------------------------

export type SkillCategoryKey =
  | 'programmingLanguages' | 'aiMl' | 'softwareDevelopment' | 'databases' | 'devOps' | 'cybersecurity' | 'coreCs';

const skillLabels: Record<SkillCategoryKey, string> = {
  programmingLanguages: 'Programming Languages',
  aiMl: 'AI and ML',
  softwareDevelopment: 'Software Development',
  databases: 'Databases and Data Engineering',
  devOps: 'DevOps and Cloud Infrastructure',
  cybersecurity: 'Cybersecurity',
  coreCs: 'Core Computer Science',
};

/** Mirror of StackLayouts.featured (curation, not data). Keep in sync. */
const featuredSkillPicks: Record<SkillCategoryKey, string[]> = {
  programmingLanguages: ['C', 'Go', 'Jac', 'Python', 'Rust', 'TypeScript'],
  aiMl: ['LLMs', 'LoRA/QLoRA fine tuning', 'PyTorch', 'Quantization', 'RAG', 'vLLM'],
  softwareDevelopment: ['FastAPI', 'GraphQL', 'Next.js', 'Node.js', 'React', 'WebSockets'],
  databases: ['ETL pipelines', 'MongoDB', 'PostgreSQL', 'Redis', 'Vector databases'],
  devOps: ['AWS Lambda', 'CI/CD pipelines', 'Docker', 'Kubernetes', 'Linux', 'Terraform'],
  cybersecurity: ['PCAP forensics', 'Reverse engineering', 'TLS protocol analysis', 'YARA based malware triage'],
  coreCs: ['Algorithms', 'Concurrency and Multithreading', 'Data Structures', 'Operating Systems Basics'],
};

export interface SkillGroup {
  key: SkillCategoryKey;
  label: string;
  /** Curated subset (what the comic site shows). */
  featured: string[];
  /** Every skill in the category, from resume.json, already A→Z. */
  all: string[];
}

const skillSource = resume.skills as Record<string, string[]>;
const categoryOrder = Object.keys(skillSource) as SkillCategoryKey[];

/** Ordered as in resume.json: languages, aiMl, software, databases, devOps, coreCs, cybersecurity. */
export const skillGroups: SkillGroup[] = categoryOrder.map((key) => {
  const all = skillSource[key] ?? [];
  const featured = featuredSkillPicks[key] ?? [];
  for (const s of featured)
    if (!all.includes(s)) throw new Error(`profile.ts: featured skill "${s}" not in resume.json skills.${key}`);
  return { key, label: skillLabels[key] ?? key, featured, all };
});
