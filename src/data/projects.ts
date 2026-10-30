export interface Project {
  title: string;
  description: string;
  tags: string[];
  websiteUrl?: string;
  githubUrl?: string;
}

export const projects: Project[] = [
  {
    title: "MK-OSINT",
    description: "I mapped public aircraft, earthquake, radiation, and ISS feeds on a live 3D globe. A YAML-driven service makes new sources easy to add. I also fixed a bug that had created 372,000 duplicate rows and batched marker updates so tens of thousands of points stay interactive.",
    tags: ["TypeScript", "CesiumJS", "React", "Redux Toolkit", "Material UI", "SQLite", "WebSockets", "OpenAPI", "YAML", "GitHub Actions"],
    githubUrl: "https://github.com/ayushmk7/mk-osint"
  },
  {
    title: "Inferno",
    description: "A Flask service that queues model inference with RabbitMQ and stores results in MongoDB.",
    tags: ["Python", "Flask", "TensorFlow", "PyTorch", "Celery", "Redis", "MongoDB", "Kubernetes"],
    githubUrl: "https://github.com/ayushmk7/Inferno"
  },

  {
    title: "Domain Portfolio Manager",
    description: "I made DNS changes conversational: add domains, apply bulk updates, and check change history through a Cloudflare Workers backend.",
    tags: ["React", "TypeScript", "Vite", "TailwindCSS", "Cloudflare Workers", "Durable Objects", "Workflows", "Workers AI", "PostgreSQL", "Vercel", "Firebase", "Vectorize"],
    websiteUrl: "https://domain-portfolio-manager-eta.vercel.app",
    githubUrl: "https://github.com/ayushmk7/cf_ai_DomainPortfolioManager"
  },
  {
    title: "2D to 3D Image Modelling",
    description: "Reconstructs 3D scenes from photos taken at multiple angles, then renders new viewpoints with NeRF.",
    tags: ["Python", "AI/ML", "Neural Radiance Fields (NeRF)"],
    githubUrl: "https://github.com/ayushmk7/3DModelling.git"
  },
  {
    title: "PreReq",
    description: "Exam scores and a concept graph become instructor heatmaps and student study plans. The project finished in the top five at Michigan's AI + Business Hackathon.",
    tags: ["React", "FastAPI", "PostgreSQL", "OpenAI"],
    githubUrl: "https://github.com/ayushmk7/PreReq"
  },
  {
    title: "GhostWatch",
    description:
      "GitHub webhooks trigger a security review that maps dependencies and flags high-impact changes. It took second place at the Jaseci Hackathon.",
    tags: ["Jac", "GitHub", "Security", "Graph Analysis", "Static Analysis"],
    githubUrl: "https://github.com/ayushmk7/GhostWatch",
  },
  
  {
    title: "SaveSurance",
    description: "Medical bills become readable line items, savings leads, and editable appeal letters. The app also includes a live call assistant. It won the ElevenLabs track at MLH Revolution UC.",
    tags: ["React", "FastAPI", "PostgreSQL", "Redis", "Gemini API", "ElevenLabs", "Deepgram", "AI Workflows", "Firebase"],
    githubUrl: "https://github.com/UAgarwal7/SaveSurance",
    websiteUrl: "https://savesurance.tech",
  },
  {
    title: "ConceptPilot",
    description: "Instructors upload exam results and a prerequisite graph to see which concepts need reteaching. It won the education track at the Red Bull KTP Hackathon.",
    tags: ["FastAPI", "Next.js", "PostgreSQL", "Alembic", "Anthropic API", "NetworkX"],
    githubUrl: "https://github.com/ayushmk7/ConceptPilot",
  },
  {
    title: "SiteSense",
    description: "Checks privacy policies, cookie notices, and extension permissions, then highlights the findings worth reading. It won the audited AI track at Michigan's Anthropic Claude Hackathon.",
    tags: ["Astro", "TypeScript", "Vite", "WebExtension APIs"],
    websiteUrl: "https://your-site-sense.vercel.app",
    githubUrl: "https://github.com/ayushmk7/SiteSense"
  },
  {
    title: "ML Reads",
    description: "Every day, this site picks five machine learning papers from arXiv and links to their abstracts and PDFs.",
    tags: ["Next.js", "React", "TypeScript", "arXiv", "fast-xml-parser", "ESLint", "Vitest"],
    websiteUrl: "https://mlreads.vercel.app",
    githubUrl: "https://github.com/ayushmk7/MLReads"
  },
  {
    title: "COGnitiveStudy",
    description: "Records lectures and turns them into notes and summaries you can review later.",
    tags: ["Hono", "Next.js", "React", "TypeScript", "Drizzle ORM", "LangChain", "OpenAI"],
    websiteUrl: "https://cog-nitive.vercel.app"
  },
  {
    title: "CompVis",
    description: "Tracks 468 facial landmarks in real time with MediaPipe and OpenCV.",
    tags: ["Python", "OpenCV", "MediaPipe", "NumPy", "Next.js", "React", "TensorFlow.js"],
    githubUrl: "https://github.com/ayushmk7/FaceDetection"
  },
 
  {
    title: "Taskpilot",
    description: "A task manager with a Django REST API and React frontend.",
    tags: ["Django", "Python", "React", "TypeScript", "Material-UI", "Socket.io", "React Query"],
    githubUrl: "https://github.com/ayushmk7/TaskPilot"
  },
  {
    title: "SMS_Classifier_Ayush",
    description: "Classifies SMS spam with PyTorch and runs the model in Unity through Sentis.",
    tags: ["Python", "PyTorch", "Pandas", "scikit-learn"],
    githubUrl: "https://github.com/ayushmk7/SMSClassifier"
  },
  {
    title: "Instagram-CLI",
    description: "Read Instagram chats in the terminal without getting pulled into stories or reels.",
    tags: ["TypeScript", "React", "Ink", "Node.js"],
    githubUrl: "https://github.com/ayushmk7/CLI_Instagram.git"
  },
  {
    title: "ClassicFocus",
    description: "A Pomodoro timer styled after Macintosh System 6 and 7.",
    tags: ["React", "TypeScript", "Vite", "TailwindCSS", "Zustand"],
    websiteUrl: "https://classicfocus.vercel.app",
    githubUrl: "https://github.com/ayushmk7/ClassicFocus"
  },
  {
    title: "mkrl",
    description: "An open source URL shortener built with FastAPI and React, designed to scale horizontally.",
    tags: ["FastAPI", "Python", "React", "TypeScript", "Vite", "Radix UI"],
    websiteUrl: "https://mkrl.vercel.app",
    githubUrl: "https://github.com/ayushmk7/mkrl"
  },
  {
    title: "Photos_Tin",
    description: "A swipe-based photo organizer for React Native and Expo.",
    tags: ["React Native", "Expo"],
    githubUrl: "https://github.com/ayushmk7/Photos_Tin"
  },
  {
    title: "Scrape_for_Sponsor",
    description: "Collects Ann Arbor restaurant leads for CLAWS club sponsorship outreach.",
    tags: ["Python", "AgentQL", "Playwright"],
    githubUrl: "https://github.com/ayushmk7/SponsorScrape"
  },
  {
    title: "Portfolio Website",
    description: "The site you're reading, built with Astro and React.",
    tags: ["Astro", "React", "TypeScript", "TailwindCSS"],
    websiteUrl: "https://ayushmadhav.com",
    githubUrl: "https://github.com/ayushmk7/Website"
  },
  {
    title: "ScreenCleanLock",
    description: "Locks the keyboard and screen while you clean a monitor. Hold Space to unlock; fullscreen stays in sync even if you press Escape.",
    tags: ["HTML", "CSS", "JavaScript", "Node.js"],
    websiteUrl: "https://screencleanlock.vercel.app",
    githubUrl: "https://github.com/ayushmk7/ScreenCleanLock"
  },
  {
    title: "NightShift",
    description: "Each night, NightShift audits a repository, runs deterministic checks, asks Claude to fix small issues, and opens draft PRs under a spend cap.",
    tags: ["Bash", "Jac", "Zig", "Claude Agent SDK", "launchd", "GitHub CLI", "pre-commit", "JSONL"],
    githubUrl: "https://github.com/ayushmk7/NightShift"
  },
  {
    title: "SessionSwitch",
    description: "A macOS app for switching Claude Code models and effort levels across terminals and IDEs without going back to the command line.",
    tags: ["Swift 6", "SwiftUI", "AppKit", "Carbon", "SwiftPM", "AXBackend", "AppleScript"],
    githubUrl: "https://github.com/ayushmk7/SessionSwitch"
  },
  {
    title: "Jac ML Studio",
    description: "Train, test, and chat with Jac coding models locally. The MLX training pipeline and Jac web app live in one codebase.",
    tags: ["Jac", "Python", "MLX", "LoRA", "React", "TypeScript", "Vite", "TailwindCSS", "React Router", "React Hook Form", "Zod", "Recharts"],
    githubUrl: "https://github.com/jaseci-labs/jac_ml_studio"
  },
  {
    title: "NASA SUITS Challenge",
    description: "I led AI development for a 6-person NASA SUITS team. Our lunar navigation system reached 96.8% waypoint accuracy; I also built obstacle detection and voice command pipelines.",
    tags: ["Python", "PyTorch", "A*/JPS", "LiDAR Fusion", "faster-whisper", "WebSockets", "Unity"],
    websiteUrl: "https://www.nasa.gov/learning-resources/spacesuit-user-interface-technologies-for-students/",
    githubUrl: "https://github.com/ayushmk7/NASA_ML_ModelArchitecture"
  },
  {
    title: "Internship Tracker",
    description: "I built this to find Summer 2027 internships that fit my sponsorship needs. It checks job feeds and ATS APIs, tracks applications after I click Apply, and updates statuses from forwarded recruiter emails. It runs on one EC2 Graviton instance and tracks about 1,460 live listings.",
    tags: ["Python", "FastAPI", "PostgreSQL", "React", "Vite", "Amazon Bedrock", "AWS EC2", "CloudFormation", "S3", "Docker", "Caddy", "AgentMail"]
  },
  {
    title: "Marketing Agent Studio",
    description: "Built a content agent for Jaseci under an NSF POSE grant. Nine trend pollers suggest topics, and a human approves every piece before it ships.",
    tags: ["Jac", "Python", "LLMs", "Agentic systems"],
    githubUrl: "https://github.com/jaseci-labs/Jaseci-Marketing-Agent-Studio"
  }
];
