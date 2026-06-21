// New-site data. Kept separate from resume.json/projects.ts so the live v1 site is untouched.
// College-only honors per request: hackathons only, no high-school olympiads.

export interface Hackathon {
  event: string;
  organizer: string;
  date: string;
  placement: string;          // headline result
  project: string;
  blurb: string;
  prize?: string;
  repoUrl?: string;
  siteUrl?: string;
}

// Most impressive / most recent first.
export const hackathons: Hackathon[] = [
  {
    event: "Red Bull Kappa Theta Pi Hackathon",
    organizer: "Kappa Theta Pi, University of Michigan",
    date: "Mar 2026",
    placement: "1st Overall, Education Track",
    project: "ConceptPilot",
    blurb:
      "Turns exam results and concept maps into readiness insights. It clusters struggling students, traces root-cause concepts, and gives instructors an interactive prerequisite graph that shows dependencies and gaps at a glance.",
    repoUrl: "https://github.com/ayushmk7/ConceptPilot",
  },
  {
    event: "MLH RevolutionUC",
    organizer: "Major League Hacking",
    date: "Mar 2026",
    placement: "Winner, ElevenLabs Track",
    project: "SaveSurance",
    blurb:
      "A multimodal medical-bill parser with a dual-path backend. It returns structured line items, savings signals, and financial-aid screening, generates editable PDF appeal packets, and runs a live call assistant over WebSocket.",
    repoUrl: "https://github.com/UAgarwal7/SaveSurance",
    siteUrl: "https://savesurance.tech",
  },
  {
    event: "Anthropic Claude Hackathon",
    organizer: "Anthropic, University of Michigan",
    date: "Nov 2025",
    placement: "Winner, Audited AI Track",
    project: "SiteSense",
    blurb:
      "A browser extension that reads privacy policies, cookie notices, and extension permissions, assigns a privacy-risk score with Claude, and surfaces the warnings that matter so users can see how their data is handled.",
    repoUrl: "https://github.com/ayushmk7/SiteSense",
    siteUrl: "https://your-site-sense.vercel.app",
  },
  {
    event: "Jaseci Hackathon",
    organizer: "Jaseci, University of Michigan",
    date: "Apr 2026",
    placement: "2nd Overall, Cash Prize",
    project: "GhostWatch",
    blurb:
      "Jac-powered security and PR review. Verified GitHub webhooks fire graph walkers that map the codebase, score dependency and blast-radius impact, and surface risk in a web control room. Built to advance open-source dev tooling.",
    prize: "Cash prize",
    repoUrl: "https://github.com/ayushmk7/GhostWatch",
  },
  {
    event: "24-Hour AI + Business Hackathon",
    organizer: "Ross School of Business and College of Engineering",
    date: "Feb 2026",
    placement: "Top 5 Finish",
    project: "PreReq",
    blurb:
      "An AI concept-readiness platform for instructors and students. Instructors upload exam scores and a concept graph and get a class heatmap with root-cause traces. Students get a personal report with a prerequisite-ordered study plan.",
    repoUrl: "https://github.com/ayushmk7/PreReq",
  },
];

export interface Experience {
  company: string;
  role: string;
  period: string;
  location?: string;
  kind: "Work" | "Research" | "Leadership" | "Founder";
  badge?: string;        // e.g. "YC S25", "NSF-backed"
  url?: string;
  bullets: string[];
}

// Full picture from the LinkedIn profile. The v1 site only showed a fraction of this.
export const experience: Experience[] = [
  {
    company: "Jaseci Labs",
    role: "Software Engineering Intern",
    period: "May 2026 to Present",
    location: "Ann Arbor, MI",
    kind: "Work",
    bullets: [
      "Engineering a domain-specialized coding agent for the Jac language, fine-tuning Gemma 4 26B with Unsloth and 4-bit QLoRA on an object-spatial superset of Python where general-purpose models have no usable priors.",
      "Architecting a multi-recipe synthetic-data pipeline (Python to Jac translation, adversarial DPO negatives, evol-instruct, self-distillation) targeting 300k+ examples behind a compiler and unit-test hard-gate.",
      "Designing a four-stage training curriculum across core SFT, debugging and reasoning, DPO alignment, and multi-turn agentic data to lock in idiomatic walker, node, and edge constructs and prevent Python-pattern fallback.",
    ],
  },
  {
    company: "University of Michigan, College of Engineering",
    role: "Student Researcher (POSE)",
    period: "May 2026 to Present",
    location: "Ann Arbor, MI",
    kind: "Research",
    badge: "NSF, $300K",
    bullets: [
      "PhD-level research as an undergrad on NSF Phase I POSE, growing an open-source ecosystem around the data-spatial Jac language.",
      "Building the project's digital infrastructure, docs site, CI, and contributor onboarding tooling to lower the barrier to entry and grow a distributed contributor community.",
      "Authoring tutorials and educational materials, and analyzing developer feedback and usage telemetry to refine onboarding and inform long-term governance models.",
    ],
  },
  {
    company: "CLAWS UM",
    role: "AI Lead, formerly AI Software Developer",
    period: "Aug 2025 to Present",
    location: "Ann Arbor, MI",
    kind: "Leadership",
    badge: "NASA SUITS / RASC-AL",
    bullets: [
      "Lead the CLAWS AI team across the NASA SUITS and RASC-AL challenges.",
      "Designed CORVUS, a dual-inference AI architecture for Project GEMINI, with edge transformers (TinyBERT, DistilBERT) on a Jetson Orin Nano via ONNX Runtime hitting sub-350ms deterministic responses.",
      "Integrated DSPy for multi-step reasoning, Instructor and Pydantic for type-safe validation, and MongoDB/WebSocket sync for real-time telemetry, with command-routing microservices and fail-safe fallbacks for any network condition.",
      "Led rover self-driving and sample-detection ML for the RASC-AL challenge.",
    ],
  },
  {
    company: "WolvSec",
    role: "Vice President and Cybersecurity Engineer",
    period: "Aug 2025 to Present",
    location: "Ann Arbor, MI",
    kind: "Leadership",
    bullets: [
      "Vice President of WolvSec, the University of Michigan's cybersecurity club.",
      "Developer role authoring internal CTFs for the university and representing Michigan at national and international CTF competitions.",
      "Weekly CTFs, hands-on offensive and defensive security, and exposure to industry security experts.",
    ],
  },
  {
    company: "Cactus",
    role: "Core Contributor",
    period: "Jan 2026 to Present",
    location: "Ann Arbor, MI",
    kind: "Work",
    badge: "YC S25",
    url: "https://cactuscompute.com/",
    bullets: [
      "Core contributor on an open-source mobile AI inference engine for smartphones and low-power devices.",
      "Implementing ARM SIMD kernels for matmul and attention with KV-cache quantization, and zero-copy computation graphs for on-device transformer inference at sub-50ms time-to-first-token.",
      "Integrating NPU acceleration and INT4 quantization, plus streaming inference and cloud-handoff logic, and building OpenAI-compatible FFI APIs for Flutter, React Native, and Kotlin.",
    ],
  },
  {
    company: "MSAIL",
    role: "AI Developer",
    period: "Sep 2025 to Present",
    location: "Ann Arbor, MI",
    kind: "Leadership",
    bullets: [
      "AI developer at MSAIL, building low-level inference tooling and running AI on mobile devices alongside a YC company.",
    ],
  },
  {
    company: "CareTether",
    role: "Co-Founder, Frontend and Outreach",
    period: "Jul to Aug 2025",
    location: "Dublin, Ireland",
    kind: "Founder",
    badge: "Patch accelerator",
    bullets: [
      "Co-founded a wearable and app system for seniors with cognitive difficulties, built on-site at the Patch entrepreneurship accelerator.",
      "Piloted with 5+ families and reached 20,000+ people on social media, and pitched venture possibilities to NGOs and care homes.",
    ],
  },
  {
    company: "GIIT Solutions",
    role: "Associate Software Intern",
    period: "2024 to 2025",
    location: "Cork, Ireland",
    kind: "Work",
    url: "https://giitsolutions.com/",
    bullets: [
      "Built and maintained CI/CD-based deployments on AWS.",
      "Wrote Python tooling scripts to automate backend processes and reduce manual overhead.",
    ],
  },
];

// Trimmed from the 90-item wall. Kept the signal, dropped HTML/CSS/Git/APIs-type filler.
export const skills: { label: string; items: string[] }[] = [
  {
    label: "AI / ML",
    items: ["PyTorch", "Unsloth", "QLoRA / LoRA", "RLHF / DPO", "ONNX Runtime", "vLLM", "Quantization", "Edge AI", "Mixture of Experts", "RAG", "Agentic systems / MCP", "Computer Vision"],
  },
  {
    label: "Systems and Languages",
    items: ["C / C++", "Rust", "Go", "Python", "TypeScript", "Jac", "ARM SIMD kernels", "Low-level optimization"],
  },
  {
    label: "Software and Web",
    items: ["React / Next.js", "React Native / Flutter", "Node.js", "FastAPI / Flask / Django", "WebSockets", "gRPC / GraphQL", "Tailwind CSS"],
  },
  {
    label: "Infra and Data",
    items: ["Docker", "Kubernetes", "AWS", "GCP", "Terraform", "RabbitMQ", "PostgreSQL", "MongoDB", "Redis", "Vector DBs"],
  },
  {
    label: "Security",
    items: ["CTF (national / international)", "Static analysis", "Dependency / blast-radius scoring", "Privacy auditing"],
  },
];

// Project titles (from projects.ts) to spotlight as "featured" later.
export const featuredTitles = ["GhostWatch", "SaveSurance", "Domain Portfolio Manager"];
