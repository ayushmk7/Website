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
    "company": "Cactus",
    "role": "Core Contributor",
    "period": "January 2026 – Present",
    "location": "Ann Arbor, Michigan",
    "kind": "Work",
    "badge": "YC S25",
    "url": "https://cactuscompute.com/",
    "bullets": [
      "Contributing to an open source mobile AI inference engine optimized for smartphones and low power devices",
      "Implementing ARM specific SIMD kernels for matrix multiplication and attention mechanisms with KV cache quantization",
      "Developing zero copy computation graphs for efficient on device transformer inference with sub 50ms time to first token",
      "Building OpenAI compatible FFI APIs for cross platform SDK integration across Flutter, React Native, and Kotlin"
    ]
  },
  {
    "company": "NASA CLAWS",
    "role": "Artificial Intelligence Engineer",
    "period": "September 2025 – Present",
    "location": "Ann Arbor, Michigan",
    "kind": "Work",
    "url": "https://claws.engin.umich.edu/",
    "bullets": [
      "Engineering, a dual inference AI assistant for NASA SUITS and RASC AL challenges, integrating lightweight transformers (TinyBERT) on Jetson Orin Nano via ONNX Runtime for sub 350 ms inference, including troubleshooting deployments",
      "Designing an edge cloud architecture that routes inference based on query complexity, latency, and network state",
      "Implementing DSPy based orchestration and Pydantic validated NLP pipelines within Unity Inference Engine",
      "Integrating WebSockets and Whisper based preprocessing to synchronize telemetry in high noise environments"
    ]
  },
  {
    "company": "Patch",
    "role": "2025 Cohort Founder",
    "period": "June 2025 – August 2025",
    "location": "Dublin, Ireland",
    "kind": "Founder",
    "url": "https://www.joinpatch.org/",
    "bullets": [
      "Built a startup in 7 weeks as part of the Patch Summer Accelerator, leading end to end technical full stack development",
      "Offsited at Stripe Dublin and Developed the mobile frontend using React Native, optimizing UI responsiveness and UX",
      "Implemented a scalable backend with Django and PostgreSQL to manage health data, authentication, and notifications"
    ]
  },
  {
    "company": "GIIT Solutions",
    "role": "Associate Software Intern",
    "period": "June 2024 – July 2024, April 2025",
    "location": "Remote",
    "kind": "Work",
    "url": "https://giitsolutions.com/",
    "bullets": [
      "Maintained CI/CD pipelines on AWS, automating deployments across 12+ microservices and improving reliability by 28%",
      "Developed Python scripts to streamline backend processes, reducing manual overhead by 40% and saving 15+ hours weekly",
      "Collaborated with senior devs to optimize cloud infrastructure, achieving 35% cost reduction through resource management",
      "Deployed cloud native solutions with AWS CI/CD tools, improving system scalability and achieving 99.7% uptime"
    ]
  }
];
