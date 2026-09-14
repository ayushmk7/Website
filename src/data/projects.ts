export interface Project {
  title: string;
  description: string;
  tags: string[];
  websiteUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    title: "Inferno",
    description: "Scalable backend service for hosting and serving ML models via REST APIs using Flask, RabbitMQ, MongoDB, and Docker.",
    tags: ["Python", "Flask", "TensorFlow", "PyTorch", "Celery", "Redis", "MongoDB", "Kubernetes"],
    githubUrl: "https://github.com/ayushmk7/Inferno"
  },

  {
    title: "Domain Portfolio Manager",
    description: "An AI chat agent that manages your domain portfolio and DNS through natural language. Add domains, run bulk DNS updates, and query history—powered by Cloudflare Workers, Durable Objects, and Workflows.",
    tags: ["React", "TypeScript", "Vite", "TailwindCSS", "Cloudflare Workers", "Durable Objects", "Workflows", "Workers AI", "PostgreSQL", "Vercel", "Firebase", "Vectorize"],
    websiteUrl: "https://domain-portfolio-manager-eta.vercel.app",
    githubUrl: "https://github.com/ayushmk7/cf_ai_DomainPortfolioManager"
  },
  {
    title: "2D to 3D Image Modelling",
    description: "A NeRF-based 3D reconstruction tool that trains a model on multi-view images and renders novel views of the scene.",
    tags: ["Python", "AI/ML", "Neural Radiance Fields (NeRF)"],
    githubUrl: "https://github.com/ayushmk7/3DModelling.git"
  },
  {
    title: "PreReq",
    description: "[Top 5 at Oracle's Michigan AI+Business Hackathon] AI-powered concept readiness platform that lets instructors upload course data and see how well students understand prerequisites via interactive dashboards and DAGs, with personalized student reports and an AI chat.",
    tags: ["React", "FastAPI", "PostgreSQL", "OpenAI"],
    githubUrl: "https://github.com/ayushmk7/PreReq"
  },
  {
    title: "GhostWatch",
    description:
      "2nd Prize at the Jaseci Hackathon for Jac-powered security and PR review: verified GitHub webhooks run graph walkers to map the codebase, score dependency and blast-radius impact, and surface risk in a web control room.",
    tags: ["Jac", "GitHub", "Security", "Graph Analysis", "Static Analysis"],
    githubUrl: "https://github.com/ayushmk7/GhostWatch",
  },
  
  {
    title: "SaveSurance",
    description: "[Winner at MLH Revolution UC Hackathon for best use of ElevenLabs] SaveSurance is a full-stack app that runs multimodal bill parsing and a dual-path backend pipeline so patients get structured line items, savings signals, financial-aid screening, and editable PDF appeal packets with SSE status and a WebSocket call assistant—not a generic LLM chat.",
    tags: ["React", "FastAPI", "PostgreSQL", "Redis", "Gemini API", "ElevenLabs", "Deepgram", "AI Workflows", "Firebase"],
    githubUrl: "https://github.com/UAgarwal7/SaveSurance",
    websiteUrl: "https://savesurance.tech",
  },
  {
    title: "ConceptPilot",
    description: "[Overall 1st Prize at Red Bull Kappa Theta Pi Hackathon for Education track] ConceptPilot turns exam results and concept maps into readiness insights: it maps how students stand on each concept, groups strugglers, and gives instructors dashboards, traces, and suggestions with an interactive concept graph so you can see dependencies and gaps at a glance.",
    tags: ["FastAPI", "Next.js", "PostgreSQL", "Alembic", "Anthropic API", "NetworkX"],
    githubUrl: "https://github.com/ayushmk7/ConceptPilot",
  },
  {
    title: "SiteSense",
    description: "[ Winner at Anthropic Claude Hackathon UMich ]Browser extension that evaluates privacy policies and extension permissions using Claude-powered analysis.",
    tags: ["Astro", "TypeScript", "Vite", "WebExtension APIs"],
    websiteUrl: "https://your-site-sense.vercel.app",
    githubUrl: "https://github.com/ayushmk7/SiteSense"
  },
  {
    title: "ML Reads",
    description: "A minimal Next.js website that recommends five machine learning papers from arXiv each day. Browse deterministic daily reads with paper titles, authors, summaries, categories, published dates, abstract links, and PDF links.",
    tags: ["Next.js", "React", "TypeScript", "arXiv", "fast-xml-parser", "ESLint", "Vitest"],
    websiteUrl: "https://mlreads.vercel.app",
    githubUrl: "https://github.com/ayushmk7/MLReads"
  },
  {
    title: "COGnitiveStudy",
    description: "A study platform that records your lectures and gives you a summary of the lecture with notes with backend API, frontend interface, and AI features.",
    tags: ["Hono", "Next.js", "React", "TypeScript", "Drizzle ORM", "LangChain", "OpenAI"],
    websiteUrl: "https://cog-nitive.vercel.app"
  },
  {
    title: "CompVis",
    description: "Face Mesh Detection app tracking 468 facial landmarks in real-time.",
    tags: ["Python", "OpenCV", "MediaPipe", "NumPy", "Next.js", "React", "TensorFlow.js"],
    githubUrl: "https://github.com/ayushmk7/FaceDetection"
  },
 
  {
    title: "Taskpilot",
    description: "Comprehensive task management platform built with Django REST Framework and React.",
    tags: ["Django", "Python", "React", "TypeScript", "Material-UI", "Socket.io", "React Query"],
    githubUrl: "https://github.com/ayushmk7/TaskPilot"
  },
  {
    title: "SMS_Classifier_Ayush",
    description: "SMS spam detection model using PyTorch and Unity Sentis integration.",
    tags: ["Python", "PyTorch", "Pandas", "scikit-learn"],
    githubUrl: "https://github.com/ayushmk7/SMSClassifier"
  },
  {
    title: "Instagram-CLI",
    description: "CLI version for instagram where it shows ur chats without the distraction of stories and reels.",
    tags: ["TypeScript", "React", "Ink", "Node.js"],
    githubUrl: "https://github.com/ayushmk7/CLI_Instagram.git"
  },
  {
    title: "ClassicFocus",
    description: "A retro Macintosh System 6/7-themed Pomodoro timer.",
    tags: ["React", "TypeScript", "Vite", "TailwindCSS", "Zustand"],
    websiteUrl: "https://classicfocus.vercel.app",
    githubUrl: "https://github.com/ayushmk7/ClassicFocus"
  },
  {
    title: "mkrl",
    description: "TinyURL clone with React frontend and FastAPI backend, horizontally scaled and open sourced.",
    tags: ["FastAPI", "Python", "React", "TypeScript", "Vite", "Radix UI"],
    websiteUrl: "https://mkrl.vercel.app",
    githubUrl: "https://github.com/ayushmk7/mkrl"
  },
  {
    title: "Photos_Tin",
    description: "React Native / Expo application for photo management and display following the actions of tinder.",
    tags: ["React Native", "Expo"],
    githubUrl: "https://github.com/ayushmk7/Photos_Tin"
  },
  {
    title: "Scrape_for_Sponsor",
    description: "Scrapes restaurant data from annarbor.org for CLAWS club sponsorship committee.",
    tags: ["Python", "AgentQL", "Playwright"],
    githubUrl: "https://github.com/ayushmk7/SponsorScrape"
  },
  {
    title: "Portfolio Website",
    description: "My current portfolio website.",
    tags: ["Astro", "React", "TypeScript", "TailwindCSS"],
    websiteUrl: "https://ayushmadhav.com",
    githubUrl: "https://github.com/ayushmk7/Website"
  },
  {
    title: "ScreenCleanLock",
    description: "A tiny static web app that locks your screen and keyboard so you can wipe your monitor without triggering clicks, scrolls, or keystrokes. Hold Space to unlock, with fullscreen sync so Escape can't desync the lock state.",
    tags: ["HTML", "CSS", "JavaScript", "Node.js"],
    websiteUrl: "https://screencleanlock.vercel.app",
    githubUrl: "https://github.com/ayushmk7/ScreenCleanLock"
  },
  {
    title: "NightShift",
    description: "An unattended nightly automation harness that syncs a Jaseci fork, runs deterministic lint/format passes, then dispatches Claude agent sessions to audit and apply small verified fixes/refactors before opening PRs, orchestrated via bash, launchd, and native Jac scripts.",
    tags: ["Bash", "Jac", "Zig", "Claude Agent SDK", "launchd", "GitHub CLI", "pre-commit", "JSONL"],
    githubUrl: "https://github.com/ayushmk7/NightShift"
  },
  {
    title: "SessionSwitch",
    description: "A macOS app for managing Claude Code CLI sessions across terminals and IDEs — switch models/effort without touching the terminal, built with pure Swift 6, SwiftUI, and AppKit overlay badges.",
    tags: ["Swift 6", "SwiftUI", "AppKit", "Carbon", "SwiftPM", "AXBackend", "AppleScript"],
    githubUrl: "https://github.com/ayushmk7/SessionSwitch"
  },
  {
    title: "Jac ML Studio",
    description: "A full-stack local ML workbench and research pipeline for finetuning LLMs on Jac (Jaseci Labs' object-spatial programming language), pairing a synthetic-data SFT/DPO/GRPO training pipeline (MLX, LoRA, Qwen3-Coder-30B) with a pure-Jac web app — server endpoints and a React-in-Jac client from one codebase — for chatting with trained models, running training jobs, and tracking evals.",
    tags: ["Jac", "Python", "MLX", "LoRA", "React", "TypeScript", "Vite", "TailwindCSS", "React Router", "React Hook Form", "Zod", "Recharts"],
    githubUrl: "https://github.com/jaseci-labs/jac_ml_studio"
  },
  {
    title: "NASA SUITS Challenge",
    description: "AI Lead for CLAWS UM's NASA SUITS entry. Autonomous lunar-EVA navigation with A*/Jump Point Search over a 3-layer occupancy grid, 17-ray LiDAR fusion, and RSSI trilateration; PyTorch obstacle detection (temporal ResidualBeamCNN, BEV cross-attention transformer) behind a hot-swappable inference framework; and a voice pipeline streaming 16 kHz audio over WebSocket to faster-whisper and a neural intent classifier.",
    tags: ["Python", "PyTorch", "A*/JPS", "LiDAR Fusion", "faster-whisper", "WebSockets", "Unity"],
    websiteUrl: "https://www.nasa.gov/learning-resources/spacesuit-user-interface-technologies-for-students/",
    githubUrl: "https://github.com/ayushmk7/NASA_ML_ModelArchitecture"
  }
];
