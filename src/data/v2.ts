
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
      "Turned the ESP32-S3 Solana badge into a hardware wallet with custom firmware. The wallet checks payees and requires approval on a screen apps cannot control before it signs.",
    repoUrl: "https://github.com/ayushmk7/NoBadgeActors",
  },
  {
    event: "Red Bull Kappa Theta Pi Hackathon",
    organizer: "Kappa Theta Pi, University of Michigan",
    date: "Mar 2026",
    placement: "1st Overall, Education Track",
    project: "ConceptPilot",
    blurb:
      "Turns exam results and a prerequisite graph into a clear view of which concepts students are missing and what instructors should reteach.",
    repoUrl: "https://github.com/ayushmk7/ConceptPilot",
  },
  {
    event: "MLH RevolutionUC",
    organizer: "Major League Hacking",
    date: "Mar 2026",
    placement: "Winner, ElevenLabs Track",
    project: "SaveSurance",
    blurb:
      "Breaks medical bills into line items, flags potential savings, drafts editable appeals, and helps patients follow up with a live call assistant.",
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
      "Checks privacy policies, cookie notices, and extension permissions, then surfaces the findings most likely to affect a user's data.",
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
      "Runs security reviews from verified GitHub webhooks, mapping dependencies and flagging changes with a large blast radius.",
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
      "Uses exam scores and a concept graph to build class heatmaps for instructors and personal study plans for students.",
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
      "Fine-tuned Qwen3-Coder 30B into a coding agent for the Jac language, reaching 94% compile-pass on a held-out benchmark, using Unsloth and 4-bit QLoRA.",
      "Generated 300k+ training examples through a synthetic data pipeline, each gated on a compiler and unit tests.",
      "Cut the model's fallback to Python patterns 82% with a four-stage SFT, debugging, DPO, and agentic curriculum.",
    ],
  },
  {
    company: "University of Michigan, College of Engineering",
    role: "Undergraduate Researcher (NSF POSE)",
    period: "May 2026 to Present",
    location: "Ann Arbor, MI",
    kind: "Research",
    badge: "NSF, $300K",
    url: "https://jaseci.engin.umich.edu/",
    bullets: [
      "Researching how to run Jac's graph-native walker programs on NVIDIA GPUs, lowering them through LLVM IR and NVPTX into PTX with one walker per GPU thread.",
      "Testing whether Jac's traversal order can guide where graph nodes sit in memory, while keeping exact int64 results, overflow checks, and failure behavior intact.",
      "Access-order layout gave a 1.75x kernel speedup on 256-cubed matmul, and generated kernels matched checked handwritten CUDA on 17 subtree workloads.",
      "Also built Marketing Agent Studio, a 55-module Jac agent, and NightShift, which audits the Jac compiler nightly and opens draft PRs.",
    ],
  },
  {
    company: "WolvSec, University of Michigan Cybersecurity Club",
    role: "Vice President; previously Developer and Member",
    period: "Aug 2025 to Present",
    location: "Ann Arbor, MI",
    kind: "Leadership",
    bullets: [
      "Elected Vice President in Mar 2026 after serving as Developer; lead weekly training and competition preparation.",
      "Represented Michigan in 12 CTFs, with two first-place finishes and 50+ solved challenges across web and API exploitation, reverse engineering, packet forensics, and cryptography.",
      "Authored 12 WolvCTF 2026 challenge submissions from beginner to hard: 5 binary exploitation, 5 web and application security, 1 cryptography, and 1 forensics.",
      "Built player handouts and author solutions or writeups; hosted submissions include jailed KCTF services and solver-backed healthchecks, with local solves and selected blind playtests reported in the PRs.",
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
      "Fixed image completions hanging on Metal and CPU: a shape bug split a 1,043-token prompt into 1,000 chunks.",
      "Fixed two C++ tokenizer bugs: byte-fallback pieces decoded as literal text, and vocab lines mis-split on tabs.",
      "Documented custom vocabulary and boost options for transcription across four SDKs: Python, Swift, Kotlin, Flutter.",
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
      "Automated deployments across 12+ AWS microservices and improved reliability by 28%.",
      "Wrote Python scripts that removed 15+ hours of manual work each week.",
      "Helped reduce cloud costs by 35%; services reached 99.7% uptime.",
    ],
  },
];
