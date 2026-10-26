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
    event: "MHacks 2026",
    organizer: "MHacks, Major League Hacking",
    date: "Oct 2026",
    placement: "Winner, MLH Best Use of Solana + Judged by an LLM",
    project: "NoBadgeActors",
    blurb:
      "BadgeOS, custom C++ and Lua firmware that turns the ESP32-S3 Solana badge into a hardware wallet. It has its own shell, a permissioned app platform, and a wallet core that checks payees against on-chain attestations, proves presence over ESP-NOW, and signs only on a screen apps can't touch.",
    repoUrl: "https://github.com/ayushmk7/NoBadgeActors",
  },
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
    placement: "2nd Overall",
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
    period: "May 2026 to Aug 2026",
    location: "Ann Arbor, MI",
    kind: "Work",
    url: "https://www.jasecilabs.com/",
    bullets: [
      "Fixed image completions hanging on Metal and CPU: a shape bug split a 1,043-token prompt into 1,000 chunks.",
      "Fixed two C++ tokenizer bugs: byte-fallback pieces decoded as literal text, and vocab lines mis-split on tabs.",
      "Documented custom vocabulary and boost options for transcription across four SDKs: Python, Swift, Kotlin, Flutter.",
    ],
  },
  {
    company: "University of Michigan, College of Engineering",
    role: "Undergraduate Researcher, PhD Level (NSF POSE)",
    period: "May 2026 to Present",
    location: "Ann Arbor, MI",
    kind: "Research",
    badge: "NSF, $300K",
    url: "https://jaseci.engin.umich.edu/",
    bullets: [
      "Built Marketing Agent Studio, an autonomous content agent under a $300K NSF Phase I POSE grant: 55 Jac modules, 18.8K lines, 166 tests, 9 trend pollers, and a human approval queue.",
      "Shipped NightShift, an unattended harness that audits repos nightly and opens draft PRs under a spend cap.",
      "Traced 13+ bugs where a check exited clean without running, then gated every change behind a fail-closed CI mirror and mutation-tested all 41 tripwires.",
    ],
  },
  {
    company: "Cactus",
    role: "Open Source Contributor",
    period: "Jan 2026 to Present",
    location: "Remote",
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
    company: "CareTether",
    role: "Co-Founder",
    period: "Jul to Aug 2025",
    location: "Dublin, Ireland",
    kind: "Founder",
    badge: "Patch '25",
    url: "https://www.joinpatch.org/",
    bullets: [
      "Built the app front end for a senior-care wearable and ran a pilot with 5+ families over 8 weeks.",
      "Reached 20,000+ people through social campaigns and pitched NGOs and care homes on distribution.",
    ],
  },
  {
    company: "GIIT Solutions",
    role: "Associate Software Intern",
    period: "Jun 2024 to Jul 2024, Apr 2025",
    location: "Remote",
    kind: "Work",
    url: "https://giitsolutions.com/",
    bullets: [
      "Maintained CI/CD pipelines on AWS, automating deployments across 12+ microservices and improving reliability by 28%.",
      "Developed Python scripts to streamline backend processes, reducing manual overhead by 40% and saving 15+ hours weekly.",
      "Optimized cloud infrastructure with senior devs, achieving a 35% cost reduction through resource management.",
      "Deployed cloud-native solutions with AWS CI/CD tools, improving scalability and achieving 99.7% uptime.",
    ],
  },
];
