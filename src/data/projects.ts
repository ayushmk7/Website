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
    title: "2d to 3d image modelling",
    description: "Uses NeRF to change 2d images to 3d models using AI and prediction modelling.",
    tags: ["Python", "AI/ML", "NeRF"],
    githubUrl: "https://github.com/ayushmk7/3DModelling.git"
  },
  {
    title: "COGnitiveStudy",
    description: "Cognitive study platform with backend API, frontend interface, and AI features.",
    tags: ["Hono", "Next.js", "React", "TypeScript", "Drizzle ORM", "LangChain", "OpenAI"],
    websiteUrl: "https://cog-nitive.vercel.app",
    githubUrl: "https://github.com/ayushmk7/COGnitiveStudy"
  },
  {
    title: "CompVis",
    description: "Face Mesh Detection app tracking 468 facial landmarks in real-time.",
    tags: ["Python", "OpenCV", "MediaPipe", "NumPy", "Next.js", "React", "TensorFlow.js"],
    githubUrl: "https://github.com/ayushmk7/FaceDetection"
  },
  {
    title: "SiteSense",
    description: "Browser extension that evaluates privacy policies and extension permissions using Claude-powered analysis.",
    tags: ["Astro", "TypeScript", "Vite", "WebExtension APIs"],
    websiteUrl: "https://your-site-sense.vercel.app",
    githubUrl: "https://github.com/ayushmk7/SiteSense"
  },
  {
    title: "ModelArchitectureTest",
    description: "Testing model ModelArchitecture.",
    tags: ["Python", "PyTorch", "Research"],
    githubUrl: "https://github.com/ayushmk7/NASA_ML_ModelArchitecture"
  },
  {
    title: "Taskpilot",
    description: "Comprehensive task management platform built with Django REST Framework and React.",
    tags: ["Django", "Python", "React", "TypeScript", "Material-UI", "Socket.io", "React Query"],
    githubUrl: "https://github.com/ayushmk7/TaskPilot"
  },
  {
    title: "MkLearns",
    description: "TurboLearn AI - Next.js app that transforms learning material into structured study content using AI.",
    tags: ["Next.js", "React", "TypeScript"],
    githubUrl: "https://github.com/ayushmk7/MkLearns"
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
    title: "instagram-unliker",
    description: "Script to remove Instagram likes, with 2FA support and automation for macOS.",
    tags: ["Python"],
    githubUrl: "https://github.com/ayushmk7/Unliker_Instagram.git"
  },
  {
    title: "Portfolio Website",
    description: "My current portfolio website.",
    tags: ["Astro", "React", "TypeScript", "TailwindCSS"],
    websiteUrl: "https://ayushmadhav.com",
    githubUrl: "https://github.com/ayushmk7/Website"
  }
];
