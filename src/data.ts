import { Project, JournalEntry, Article, MediaItem, ServiceOffer, CV, ClientProfile, Inquiry, TrackedAnalytics, HomepageStats, TechStackItem, Testimonial, TeamMember, CustomizationSettings } from "./types";

export const INITIAL_CUSTOMIZATION: CustomizationSettings = {
  appName: "AFRIWAID STUDIO",
  appNickname: "AFRIWAID",
  tagline: "Empowering Digital Innovation",
  heroHeadline: "AFRIWAID STUDIO",
  heroSubtitle: "A world-class technology, portfolio, AI innovation, and client management node. We design high-scale Web applications, custom AI pipelines, and stunning cinematic visual experiences.",
  accentColor: "cyan",
  primaryCtaText: "Explore Showcase",
  secondaryCtaText: "Initiate AI Systems Lab",
  showAILab: true,
  showJournal: true,
  showMedia: true,
  showWriting: true,
  useMonochromeTerminalTheme: false,
  footerDescription: "Building robust software, decision intelligence MCDA models, and fine editorial papers globally.",
  logoType: "text",
  logoText: "A",
  logoUrl: "",
  statsSubtitle: "Enterprise Impact Metric Matrix",
  statsTitle: "AfriWaid Studio Performance Indication",
  techSubtitle: "TECHNOLOGY SPECIFICATION",
  techTitle: "Verified Hyper-engine Development Stack",
  techDescription: "Every product deployed by AfriWaid conforms to rigorous, type-safe paradigms. Here are our verified stack parameters:",
  aboutTagline: "METRICS & CORE PRINCIPLES",
  aboutTitle: "Bridging Cognitive Engineering with Aesthetic Rigor",
  aboutDescription: "AfriWaid is a premium, multi-module digital studio. We do not build generic portfolio templates. We design, deploy, and verify mission-critical cloud applications, neural agent frameworks, and high-fidelity global branding structures.",
  aboutMissionTitle: "Our Mission",
  aboutMissionDesc: "To build intelligent digital structures that allow organizations worldwide to seamlessly automate, audit, and display complex logistics pipelines and branding matrices without tech-debt decay.",
  aboutVisionTitle: "Our Vision",
  aboutVisionDesc: "To grow into a global, institutional tech studio that acts as a living showcase of multi-agent safety engineering, pixel-perfect user frameworks, and elite publishing workflows.",
  aboutPhilosophyTitle: "Our Innovation Philosophy",
  aboutPhilosophyDesc: "We believe that technology gains value only through absolute transparency. Unusable AI telemetry is a systematic pollutant. We focus on physical, human-verified loops, mathematical criteria weighting, and breathtaking visual controls.",
  servicesTagline: "Technical Capabilities & Service Matrix",
  servicesTitle: "Professional Digital Offerings",
  servicesDescription: "AfriWaid is built to handle enterprise projects. Explore our core engineering competencies, interactive knowledge disciplines, and pre-structured commercial execution models.",
  projectsTitle: "Technical Portfolio & Showcase",
  projectsSubtitle: "COMPLETE ARCHIVE OF INTELLECTUAL WORK",
  cvTitle: "Resume & CV Center",
  cvSubtitle: "OFFICIAL INSTANCE: CHOOSE PROFESSIONAL PATHWAY",
  aiLabTagline: "Neural Architecture & Design Lab",
  aiLabTitle: "Active AI & KI Innovation Playground",
  aiLabDescription: "Experiment directly with our server-side cognitive modules of AfriWaid. Consult our live systems analyst or tweak the decision criteria weight formulas dynamically.",
  writingTitle: "Writing & Analytics Hub",
  writingSubtitle: "Original research, deep technical deep-dives, and technical opinions",
  mediaTitle: "Media Production Hub",
  mediaSubtitle: "CINEMATIC DIGITAL ENG ENGAGEMENTS",
  journalTagline: "Active Developer Logs & System Milestones",
  journalTitle: "The AfriWaid Build Journal",
  journalDescription: "Follow our transparent engineering roadmap. We push frequent hot-fixes, core architectural developments, spatial animations, and machine learning structures to the active sandbox stack."
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "WaidPulse AI Engine",
    category: "AI",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
    description: "An advanced orchestration middleware that connects enterprise databases with autonomous LLM agents to automate cross-departmental operations.",
    longSummary: "WaidPulse AI Engine represents a landmark in enterprise agentic process automation. Operating as a secure pipeline conductor, it bridges high-capacity Google Gemini models with SQL metadata nodes and dynamic internal network streams. By mapping natural language actions into highly serialized executable jobs, the WaidPulse AI engine allows automated systems to securely query data lakes, resolve logistic mismatches, and compile real-time latency diagnostics. Designed with a custom node graph visualizer in D3, supervisors retain continuous human-in-the-loop oversight to ensure absolute deterministic output and zero-trust security alignments.",
    technologiesUsed: ["React", "Express", "@google/genai", "TypeScript", "Tailwind CSS", "D3.js"],
    problemSolved: "Enterprise companies struggle to allow AI agents to safely access, process, and perform actions across disparate database engines without custom, fragile API bridges.",
    features: [
      "Dynamic Multi-Agent Orchestration",
      "Secure SQL and vector database proxy filters",
      "Real-time operation latency dashboard built in D3",
      "Auto-generating diagnostic code sandboxes",
      "Custom system prompt injection safeguards"
    ],
    projectStatus: "Active",
    completionDate: "2026-04-18",
    tags: ["Agentic AI", "Enterprise", "Automation", "D3 Visualizer"],
    views: 412,
    screenshots: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
    ],
    videoDemo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    caseStudy: {
      challenge: "Enterprise logistic pipelines are notoriously rigid. Standard automation solutions fail because exceptional conditions (such as severe weather, border delays, or dynamic price adjustments) require human-like adaptable reasoning and multi-point coordination. This results in heavy operational overhead.",
      goal: "Design and implement an autonomous decision engine called WaidPulse AI to safely integrate internal operational data and allow self-correcting logistic triggers.",
      research: "We analyzed 15,000 operational delay logs. Over 78% of bottlenecks were resolved through simple cross-checking of inventory databases, email responses, and booking systems. We built an intent classifier utilizing server-side Gemini intelligence models to safely route actions.",
      designProcess: "To make the system trustworthy, we created visual execution graphs. We designed and built a node-based tracking interface utilizing glassmorphism styles, dark gridlines, and animated indicator states so human supervisors can audit agent thoughts.",
      developmentProcess: "The core system is implemented as an Express server-side controller integrating Gemini 3.5 models. We utilized standard tools and function calling to query external databases, returning structured JSON variables mapped directly to the interactive React interface.",
      results: "Launched as a private beta with 3 early-adopter retail-logistics groups, WaidPulse automated 45% of manual shipping rescheduling tasks, dropping dispatch friction times from 3.5 hours to 12 minutes.",
      lessonsLearned: "System reliability relies heavily on highly constrained output schemas. Unstructured model text triggers system errors; forcing robust strict JSON typing solves edge-case failures."
    }
  },
  {
    id: "proj-2",
    name: "KonsOSDecision Matrix",
    category: "KI",
    coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop",
    description: "A secure cognitive platform applying multi-criteria decision analysis (MCDA) algorithms paired with semantic memory indexes to evaluate risk vectors.",
    longSummary: "KonsOSDecision Matrix delivers a highly structured, audit-defensible decision ecosystem for enterprise portfolios and technology investments. Pairing classical Multi-Criteria Decision Analysis (MCDA) algorithms with rich semantic text index vectors, KonsOSallows executives to mathematically evaluate complex risks and evaluate alternative architectures. It extracts intelligence directly from dense regulatory and safety document backlogs, maps system dependencies as dynamic SVG nodes, and aggregates scores in real-time. This dual-engine approach guarantees that tactical investment decisions remain perfectly transparent, predictable, and mathematically sound.",
    technologiesUsed: ["TypeScript", "Recharts", "Node.js", "Vector DB", "React-Flow"],
    problemSolved: "Corporate boards and system architects require audit-proof, mathematical validation for technology investments, completely separate from conversational model guesswork.",
    features: [
      "Interactive Matrix scoring with real-time weights",
      "Semantic memory retrieval across legacy PDF reports",
      "Audit logs with dynamic SVG dependency graphs",
      "Exportable regulatory compliance checklists"
    ],
    projectStatus: "QA",
    completionDate: "2026-05-12",
    tags: ["Decision Science", "Risk Analytics", "KI Architecture"],
    views: 310,
    screenshots: [
      "https://images.unsplash.com/photo-1543286386-7a38167f334c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
    ],
    videoDemo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    caseStudy: {
      challenge: "A leading investment fund had to run 120-item regulatory and safety checks for spatial computing products, taking analysts up to a month per product.",
      goal: "Automate the preliminary screening and dependency tracing down to 24 hours while maintaining total legal consensus.",
      research: "We mapped risk compliance down to direct dependency models, building weighted decision loops backed by cognitive retrieval vectors.",
      designProcess: "Applied a high-contrast mono tech interface using JetBrains Mono typography, custom SVG dashboards, and precise risk dial controls.",
      developmentProcess: "Built using a highly optimized, state-first React architecture that updates weighted graphs in real time. Backed by an express endpoint mapping risk metrics.",
      results: "Reduced screening duration by 92% and flagged 14 hidden regulatory contradictions that would have otherwise triggered downstream license denials.",
      lessonsLearned: "Combining AI with classical MCDA algorithms provides the deterministic rigor that enterprises demand, where LLMs fail on pure math constraints."
    }
  },
  {
    id: "proj-3",
    name: "AfriWaid Brand Canvas",
    category: "Design",
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    description: "The complete visual identity, interactive guidelines, and premium motion system created for our own enterprise positioning and digital footprint.",
    longSummary: "The AfriWaid Brand Canvas represents the convergence of software engineering precision and digital cinematic art direction. As our flagship visual experience, it defines the premium design coordinates for the entire AfriWaid digital footprint. It establishes an absolute 'Cosmic Slate' aesthetic combining deep off-black backdrops with geometric gridlines, responsive micro-interactions, and typographic hierarchy utilizing Space Grotesk. Built for optimal cross-platform performance, the Brand Canvas serves as a responsive, interactive style guide showcasing the meticulous visual craftsmanship and UX design principles we deliver to our enterprise partners.",
    technologiesUsed: ["Figma", "Motion", "Tailwind CSS", "SVG Animation", "Blender"],
    problemSolved: "Tech firms struggle to bridge raw engineering precision with cinematic storytelling, resulting in generic SaaS templates or dry web experiences.",
    features: [
      "Custom generative vector particle background",
      "Dynamic typography pairing systems (Inter & Space Grotesk)",
      "High-fidelity motion transitions & premium micro-interactions",
      "Fully responsive corporate stylebook inspector"
    ],
    projectStatus: "In Development",
    completionDate: "2026-03-30",
    tags: ["Brand Identity", "Design System", "Art Direction"],
    views: 295,
    screenshots: [
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561070791-26c113006238?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
    ],
    videoDemo: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    caseStudy: {
      challenge: "Our agency needed to expand from local development assignments to high-value global enterprise consulting. Our old visual presentation felt average and freelance-focused.",
      goal: "Build a futuristic, highly polished cinematic design language expressing deep technological knowledge and institutional-grade engineering capability.",
      research: "We audited top technology organizations (Stripe, Vercel, Linear) which pair hyper-clean fonts, microscopic details, and absolute grid control.",
      designProcess: "We established the 'Cosmic Slate' color theme: absolute off-blacks, deep cosmic slate backdrops, sharp geometric lines, and warm soft amber glows.",
      developmentProcess: "Coded custom CSS grid lines directly into standard Tailwind layouts, coupled with modular react animation components powered by motion to simulate immersive physical panels.",
      results: "Resulted in immediate visual elevation, driving inbound client size from modest five-figure projects to global technology transformation inquiries.",
      lessonsLearned: "Design is a direct indicator of product rigor. If your own digital footprint contains alignment issues, clients assume your enterprise software code has bugs too."
    }
  },
  {
    id: "proj-4",
    name: "Lumina Research Matrix",
    category: "Research",
    coverImage: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
    description: "An open, searchable index containing peer-reviewed methodologies and dynamic architectural canvases mapping out multi-agent safety systems.",
    longSummary: "Lumina Research Matrix acts as an interactive, open-access repository of peer-reviewed safety frameworks and structured schemas. Aimed at providing developers and safety researchers with clear, operational structures, Lumina bridges the gap between high-level academic theory and actual production environments. It houses a searchable library of markdown research articles accompanied by an interactive network graph of conceptual dependencies built with D3. By translating dense scientific safety methodologies into downloadable deployment templates, Lumina empowers engineers to establish certifiable system boundaries around complex multi-agent models.",
    technologiesUsed: ["React-Markdown", "Tailwind", "D3 Hierarchy", "Express"],
    problemSolved: "Disseminated academic research on AI safety is highly fragmented and difficult for product developers to implement inside daily workflows.",
    features: [
      "Highly interactive semantic knowledge ontology using D3 force graphs",
      "Fully searchable markdown academic articles",
      "Direct code blueprint generators for safe framework setups"
    ],
    projectStatus: "Planning",
    completionDate: "2026-06-01",
    tags: ["AI Safety", "Academic", "Knowledge Base"],
    views: 184,
    screenshots: [
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop"
    ],
    videoDemo: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];

export const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: "j-1",
    title: "Deployed AfriWaid Studio Core v1.0",
    description: "Launched the primary platform framework integrating the Portfolio Showcase, Service Matrix, and CV Publish Center. Engineered on modern React 19.",
    date: "2026-06-10",
    category: "deployment",
    images: ["/src/assets/images/afriwaid_studio_v1_1781535074936.jpg"],
    links: [
      { label: "Live Projects Showcase", url: "#Projects" },
      { label: "Live Service Matrix", url: "#Services" }
    ]
  },
  {
    id: "j-2",
    title: "Released WaidPulse AI Client Beta",
    description: "Seeded the secure progress monitor in the Client Portal enabling live progress tracking, downloadable deliverables, and automatic invoice audits.",
    date: "2026-06-11",
    category: "update",
    images: ["/src/assets/images/waidpulse_client_portal_1781535095143.jpg"],
    links: [
      { label: "Preview Client Portal", url: "#Client Access" }
    ]
  },
  {
    id: "j-3",
    title: "Integrated Server-Side Gemini Intelligence Matrix",
    description: "Completed API proxy routes leveraging `@google/genai` allowing users to consult an intelligent system analyst live in our AI Innovation Lab.",
    date: "2026-06-12",
    category: "ai",
    images: ["/src/assets/images/gemini_intelligence_1781535115050.jpg"],
    links: [
      { label: "Consult Gemini AI Lab", url: "#AI Lab" }
    ]
  },
  {
    id: "j-4",
    title: "Finished Brand Canvas & Cinematic Visuals",
    description: "Achieved pixel-perfect cosmic theme styling, dark grid aesthetics, and high-fidelity sliding transitions using motion/react.",
    date: "2026-06-13",
    category: "design",
    images: ["/src/assets/images/cosmic_design_1781535133337.jpg"],
    links: [
      { label: "Explore Media Hub", url: "#Media" }
    ]
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "The Rise of Orchestrated Agents in African Agritech",
    slug: "orchestrated-agents-african-agritech",
    description: "How decoupled multi-agent architectures are overcoming low-bandwidth constraints to optimize supply-distribution pipelines across Sub-Saharan networks.",
    content: `## The Agritech Supply Problem

Sub-Saharan supply lines suffer from severe information asymmetry. Smallholders struggle to reach wholesalers due to dynamic price fluctuations, sudden road disruptions, and siloed communication.

Classical mobile applications fail because they demand constant, high-speed internet connections and require agricultural managers to constantly input tabular inventory metrics.

### Enter Decentralized Agent Frameworks

By decoupling logic into a multi-agent framework on the backend (using systems like our **KonsOSCognitive Matrix**), small queries can be processed offline. Compact SMS/USSD packets are sent to a cloud-based orchestrator, triggering a cascading system of micro-agents:

1. **Procurement Agent**: Constantly monitors wholesaler pricing signals using semantic search.
2. **Logistics Agent**: Audits local telemetry to establish route safety.
3. **Financial Agent**: Dynamically generates forward contract agreements.

These agents collaborate to deliver a single simple action notification to the smallholder. No heavy assets, no complex dashboard downloads—just deterministic, intelligent automation.`,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop",
    category: "Research",
    tags: ["Agritech", "Agentic AI", "Decoupled Architecture"],
    readingTime: "5 min read",
    date: "2026-06-08",
    metaTitle: "Decoupled Multi-Agent Systems in African Agritech | AfriWaid",
    metaDescription: "Explore how decentralized backend agent systems optimize agricultural logistics in low-bandwidth regions and remote farmlands.",
    keywords: ["Agritech", "AI Agents", "Decoupled Logic", "Logistics", "African Tech"],
    views: 145
  },
  {
    id: "art-2",
    title: "Constructing Resilient UI: Design Systems for Deep Enterprise Apps",
    slug: "resilient-ui-enterprise-design-systems",
    description: "A developer guide on building digital dashboards that balance density, micro-interactions, dark environments, and responsive layout guidelines.",
    content: `## The Illusion of Simplification

Many modern design systems focus on stripping away technical density. They replace core developer coordinates, database telemetry, and granular charts with massive, friendly cards.

While this works for standard consumer applications, it **completely fails** for enterprise platforms. Technicians, risk managers, and operations leads need *control*. Stripping details is a critical failure.

### Principles of 'Information Density with Elegance'

1. **Aesthetic Consistency & Monospacing**: Use high-contrast font weights paired with crisp mono fonts (like JetBrains Mono) for status lines, coordinates, and statistics.
2. **Acoustic and Visual Snapping**: Apply swift 150ms transitions (spring or linear) to make interfaces feel physically kinetic.
3. **Architectural Gridlines**: Outline borders with subtle divider lines (\`border-white/[0.06]\`) to create structural order without visible clutter.

This creates 'cinematic control decks' that are deeply functional, fast, and gorgeous to work inside.`,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
    category: "Guides",
    tags: ["UI/UX", "Design Systems", "Web Engineering"],
    readingTime: "4 min read",
    date: "2026-06-11",
    metaTitle: "Enterprise Dark UI Design Systems | AfriWaid Studio",
    metaDescription: "Learn key strategies to balance layout density with beautiful, ergonomic dark UI components for professional tech applications.",
    keywords: ["UI Design", "Enterprise UI", "Tailwind CSS", "Design Systems"],
    views: 98
  },
  {
    id: "art-3",
    title: "Harmonizing Design & Logic: The AfriWaid Creative Flow",
    slug: "harmonizing-design-logic-creative-flow",
    description: "An inside look at our development philosophy where designers write clean CSS and software architects understand typography rhythm.",
    content: `## Bridging the Digital Divide

In traditional agencies, designers throw static Figma files over the wall, and engineers implement whatever is easiest. The product is compromised.

At **AfriWaid**, we treat design and code as the exact same system:

- **Typography as Code**: Every font style is a systematic token mapped across our layouts.
- **Motion as Physics**: We do not use arbitrary fade values. We define specific springs, dampening rates, and staggering scales.
- **Layout Integrity**: The interface must adjust gracefully from mobile phone touches to massive dual-head command dashboards.

This approach guarantees that what is approved in the blueprint stage is exactly what is delivered to the production environment, every single time.`,
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    category: "Opinions",
    tags: ["Agency Culture", "Methodology", "Software Engineering"],
    readingTime: "3 min read",
    date: "2026-06-12",
    metaTitle: "The AfriWaid Creative Flow | Engineering + Art",
    metaDescription: "Bridging the gap between pure code and high-end design. Read about our cohesive collaborative pipeline.",
    keywords: ["Agency Philosophy", "UI Engineering", "Figma to React", "Modern Agency"],
    views: 82
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: "med-1",
    title: "WaidPulse Launch Cinematic Video",
    description: "High-energy procedural cinematic rendering explaining the multi-agent middleware structure and developer interface.",
    category: "Videos",
    duration: "2:40",
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop",
    externalLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Template placeholder link
    views: 125
  },
  {
    id: "med-2",
    title: "Enterprise Multi-Agent Systems Deep Dive",
    description: "A comprehensive technical seminar mapping out database safeguard layers and runtime validation blocks.",
    category: "Interviews",
    duration: "15:10",
    thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    externalLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    views: 240
  },
  {
    id: "med-3",
    title: "Crafting Spatial Motion Graphics",
    description: "Behind the scenes rendering loops showing our creative asset workflow in Blender and custom SVG code.",
    category: "Motion Graphics",
    duration: "1:12",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop",
    externalLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    views: 110
  }
];

export const INITIAL_SERVICES: ServiceOffer[] = [
  {
    id: "srv-1",
    name: "Software Development",
    description: "We design, write, and audit high-performance software systems. From elegant SaaS applications to absolute-precision financial dashboards.",
    category: "Software Development",
    deliverables: [
      "Custom React & Next.js SaaS Web Applications",
      "Robust Express/Node.js Server Architectures",
      "Interactive analytics consoles styled with Recharts or D3.js",
      "Complete system audits & mobile-first UI scaling updates"
    ],
    process: [
      "Discovery & Technical Blueprinting",
      "Modular Architecture Design & Schema Mockups",
      "Agile Development with Weekly Client Deliverables",
      "Rigorous Verification, Load Testing, and Production Launch"
    ],
    estimatedTimeline: "4 to 12 weeks",
    portfolioExamples: [
      { name: "WaidPulse AI Engine", projectId: "proj-1" },
      { name: "KonsOSDecision Matrix", projectId: "proj-2" }
    ]
  },
  {
    id: "srv-2",
    name: "AI Solutions & Automation",
    description: "Integrate server-side agentic capabilities directly into your legacy software workflows. We construct reliable context retrievers and action controllers.",
    category: "AI Solutions",
    deliverables: [
      "Custom semantic search vectors & RAG databases",
      "Automated chat agents with safety-guard boundaries",
      "Document categorizers utilizing enterprise intelligence",
      "Developer-ready SDK microservice integration"
    ],
    process: [
      "Operational bottleneck auditing and feasibility check",
      "Safety safeguarding and data privacy design",
      "Agent training & strictly typed output schema design",
      "Vite/React integrated control dashboard deploy"
    ],
    estimatedTimeline: "6 to 8 weeks",
    portfolioExamples: [
      { name: "WaidPulse AI Engine", projectId: "proj-1" }
    ]
  },
  {
    id: "srv-3",
    name: "Decision Intelligence Systems (KI)",
    description: "Construct scientific decision loops separate from model unpredictability. We specialize in Multi-Criteria Decision Analysis (MCDA) dashboards.",
    category: "KI Systems",
    deliverables: [
      "Risk calculation models incorporating mathematical weighting",
      "Interactive SVG node dependency flowcharts",
      "Structured boardroom diagnostic report generators"
    ],
    process: [
      "Mapping risk taxonomy & scoring standards",
      "Coding rigorous verification and matrix calculators",
      "Injecting semantic context storage",
      "Deploying interactive control matrix panels"
    ],
    estimatedTimeline: "8 to 10 weeks",
    portfolioExamples: [
      { name: "KonsOSDecision Matrix", projectId: "proj-2" }
    ]
  },
  {
    id: "srv-4",
    name: "Logo Design & Brand Identity Studio",
    description: "For organizations seeking a premium, corporate aesthetic. We shape identity parameters, kinetic icons, and digital style guides.",
    category: "Logo Design",
    deliverables: [
      "Cinematic Logo Mark & Type pairing guidelines",
      "Corporate interactive stylebook built as a responsive web tool",
      "Custom vector assets (SVG) and motion asset codes",
      "Standard vector layout packages (Print & Web)"
    ],
    process: [
      "Brand positioning & visual moodboard workshop",
      "Custom vector draft iterations",
      "Motion prototype simulations",
      "Packaging and custom web canvas stylebook"
    ],
    estimatedTimeline: "3 to 5 weeks",
    portfolioExamples: [
      { name: "AfriWaid Brand Canvas", projectId: "proj-3" }
    ]
  }
];

export const INITIAL_CVS: CV[] = [
  {
    id: "cv-1",
    slug: "software-engineer",
    name: "Waid Soko",
    title: "Senior Full-Stack & AI Systems Engineer",
    summary: "Veteran technology architect with over 8 years of engineering experience. Specializes in building dense Express/React control dashboards, high-reliability server-side AI agent workflows using Gemini, and database schema controllers.",
    skills: [
      { category: "Languages", list: ["TypeScript", "JavaScript", "Python", "Go", "SQL", "HTML/CSS"] },
      { category: "Frameworks & Libraries", list: ["React", "Express", "Node.js", "Vite", "Tailwind CSS", "D3.js", "Recharts", "Motion"] },
      { category: "AI & KI Eng", list: ["@google/genai", "Multi-Agent safety models", "MCDA Risk algorithms", "Vector DB embeddings"] },
      { category: "Cloud & Ops", list: ["GCP Cloud Run", "Docker", "Database schema migration", "Nginx web proxies"] }
    ],
    experience: [
      {
        company: "AfriWaid Studio",
        role: "Lead Systems Architect & Co-Founder",
        period: "2024 - Present",
        description: [
          "Spec'd and built the WaidPulse autonomous agentic middleware, decreasing client manual operations by 90%.",
          "Engineered high-performance real-time visualization frameworks in React 19.",
          "Consulted international logistics firms on implementing secure AI safety guards."
        ]
      },
      {
        company: "Vanguard Tech Laboratories",
        role: "Senior Full-Stack Engineer",
        period: "2021 - 2024",
        description: [
          "Developed complex asset tracking platforms serving over 40,000 active daily users.",
          "Led a team of 4 front-end engineers in designing a highly responsive custom React design system.",
          "Refactored heavy search modules, achieving a 400ms speed-load optimization."
        ]
      }
    ],
    education: [
      { institution: "African Institute of Science & Technology", degree: "M.S. in Software Systems Architecture", period: "2019 - 2021" },
      { institution: "Global Tech University", degree: "B.S. in Computer Science", period: "2015 - 2019" }
    ],
    certifications: [
      "Google Cloud Certified Professional Cloud Developer",
      "Enterprise Multi-Agent Safety Specialist Token"
    ],
    portfolioLinks: [
      { label: "Studio Website", url: "/" },
      { label: "WaidPulse Engine", url: "#" }
    ],
    isPublished: true,
    downloads: 142
  },
  {
    id: "cv-2",
    slug: "innovation-lead",
    name: "Waid Soko",
    title: "Digital Product & Innovation Strategist",
    summary: "Creative product specialist and technology director. Helps organizations worldwide design cinematic brand identities, optimize system architectures, and translate raw engineering capabilities into compelling digital presence.",
    skills: [
      { category: "Strategy", list: ["Product Positioning", "Corporate Innovation", "MCDA Risk audits", "Agile Roadmap design"] },
      { category: "Design Creative", list: ["Brand Strategy & Identity", "Art Direction", "UI/UX Architecture", "Motion Graphics in Blender"] },
      { category: "Frameworks Tools", list: ["Figma", "Tailwind CSS", "Motion", "Vite/React structure"] },
      { category: "Coordination", list: ["Enterprise Client Alignment", "Multi-team execution", "Technical Writing"] }
    ],
    experience: [
      {
        company: "AfriWaid Studio",
        role: "Product & Art Director",
        period: "2024 - Present",
        description: [
          "Helped tech startups re-contextualize their platforms, doubling inbound enterprise inquiry conversion rates.",
          "Authored comprehensive digital style guides and designed immersive kinetic vector animations.",
          "Orchestrated cross-functional developer and designer pipelines to ensure layout fidelity."
        ]
      },
      {
        company: "Nexus Digital Agency",
        role: "Creative Director",
        period: "2022 - 2024",
        description: [
          "Supervised visual development of 35 dynamic client marketing campaigns, generating over $4M in calculated sales.",
          "Pioneered in-house responsive web style systems, reducing designer-to-developer mockup times by 30%."
        ]
      }
    ],
    education: [
      { institution: "Creative Arts College of Design", degree: "B.A. in Digital Media & Art Direction", period: "2016 - 2020" }
    ],
    certifications: [
      "Agile Product Management Professional",
      "Human-Centered Spatial Design Specialization"
    ],
    portfolioLinks: [
      { label: "AfriWaid Portfolio", url: "/" }
    ],
    isPublished: true,
    downloads: 87
  }
];

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: "cl-1",
    name: "AeroGlobal Logistics",
    company: "AeroGlobal Inc.",
    email: "logistics@aeroglobal.com",
    assignedProjectName: "WaidPulse AI Integrations",
    projectProgress: 65,
    progressLog: [
      { date: "2026-06-01", title: "Technical Discovery Completed", phase: "Research", status: "completed" },
      { date: "2026-06-05", title: "API Safe Guard Architecture Draft", phase: "Design", status: "completed" },
      { date: "2026-06-10", title: "Middleware Core Module Integration", phase: "Development", status: "active" },
      { date: "2026-06-25", title: "Staging Pipeline Load Testing", phase: "Testing", status: "planned" },
      { date: "2026-07-05", title: "System Hot-Deploy Deployment", phase: "Launch", status: "planned" }
    ],
    deliverables: [
      { id: "del-1", name: "System Requirements Blueprint.pdf", description: "Comprehensive analysis of AeroGlobal data structures and security safeguards.", status: "approved", fileName: "Requirements_Blueprint.pdf", fileSize: "2.4 MB" },
      { id: "del-2", name: "UX Design Interactive Map.sketch", description: "Interactive figma layout maps showing human visual monitoring dashboard.", status: "completed", fileName: "UX_Interactive_Map.fig", fileSize: "15.8 MB" },
      { id: "del-3", name: "Middleware Alpha Source Code.zip", description: "Initial module structure linking database adapters to Gemini function endpoints.", status: "pending", fileName: "WaidPulse_Alpha_Core.zip", fileSize: "4.1 MB" }
    ],
    proposals: [
      { id: "prop-1", title: "Phase 2 AI Integration Operations", date: "2026-06-02", value: "$45,000 USD", status: "Accepted" }
    ],
    invoices: [
      { id: "inv-1", invoiceNumber: "INV-2026-042", issueDate: "2026-06-02", dueDate: "2026-06-17", amount: "$15,000 USD", status: "Paid" },
      { id: "inv-2", invoiceNumber: "INV-2026-088", issueDate: "2026-06-12", dueDate: "2026-06-27", amount: "$30,000 USD", status: "Unpaid" }
    ],
    feedback: [
      "The node tracking mockups look extremely clear. Our compliance directors immediately understood how the model filters run."
    ]
  }
];

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: "inq-1",
    name: "Sarah Jenkins",
    email: "sjenkins@kenyatechgroup.co.ke",
    organization: "Kenya Tech Group",
    message: "We are building an intra-day supply catalog for regional micro-vendors and want to implement an automated USSD-to-AI SMS routing scheduler using KonsOSMCDA algorithms. Please schedule an architecture review.",
    type: "service",
    serviceCategory: "Software Development",
    date: "2026-06-12",
    status: "new"
  },
  {
    id: "inq-2",
    name: "Dr. Amara Alao",
    email: "a.alao@pan-african-ai.org",
    organization: "Pan-African AI Council",
    message: "We would love to extend a partnership request to include AfriWaid's Lumina Research Matrix in our upcoming technology governance panel discussion in Cape Town.",
    type: "partnership",
    date: "2026-06-13",
    status: "new"
  }
];

export const INITIAL_ANALYTICS: TrackedAnalytics = {
  visitorsLast30Days: 1840,
  totalViews: 412 + 310 + 295 + 184,
  projectDownloads: 142 + 87,
  contactCount: 2,
  pageViews: [
    { path: "/", count: 854 },
    { path: "/projects", count: 489 },
    { path: "/services", count: 245 },
    { path: "/cv", count: 229 },
    { path: "/journal", count: 120 }
  ],
  topProjects: [
    { name: "WaidPulse AI Engine", views: 412 },
    { name: "KonsOSDecision Matrix", views: 310 },
    { name: "AfriWaid Brand Canvas", views: 295 }
  ],
  topArticles: [
    { title: "The Rise of Orchestrated Agents in African Agritech", views: 145 },
    { title: "Constructing Resilient UI: Design Systems for Deep Enterprise Apps", views: 98 }
  ]
};

// Local storage management utilities
export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`afriwaid_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Local storage read failed for key ${key}`, e);
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`afriwaid_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn(`Local storage write failed for key ${key}`, e);
  }
}

export const INITIAL_HOMEPAGE_STATS: HomepageStats = {
  projectsCompleted: 24,
  applicationsBuilt: 18,
  aiSystemsDeveloped: 12,
  articlesPublished: 8,
  brandsCreated: 6,
  videosProduced: 15,
  clientsServed: 30
};

export const INITIAL_TECH_STACK: TechStackItem[] = [
  {
    id: "tech-1",
    badge: "TS",
    name: "TypeScript 5.8",
    description: "Rigorous static analysis"
  },
  {
    id: "tech-2",
    badge: "RE",
    name: "React 19 & Vite",
    description: "Atomic virtual layout rendering"
  },
  {
    id: "tech-3",
    badge: "PG",
    name: "PostgreSQL 17",
    description: "Durable relational database model"
  },
  {
    id: "tech-4",
    badge: "DO",
    name: "Docker Containers",
    description: "Hermetic multi-platform deployments"
  },
  {
    id: "tech-5",
    badge: "NX",
    name: "Node & Express",
    description: "Backend database pipeline"
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    clientName: "Amara Okonkwo",
    clientCompany: "Vanguard Agritech Systems",
    clientRole: "Managing Director",
    rating: 5,
    text: "AfriWaid completely re-architected our local supply allocation pipeline. Their strict attention to network resilience and gorgeous, functional dashboards made the tool an instant hit with our ground managers.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    category: "Software Development",
    isPublished: true
  },
  {
    id: "test-2",
    clientName: "David Mensah",
    clientCompany: "AeroGlobal Logistics",
    clientRole: "VP of Product",
    rating: 5,
    text: "The motion graphics and custom interactive guidebooks produced by AfriWaid's creative node elevated our platform's global launch. It bridged complex engineering with cinematic luxury narrative.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    category: "Video Production",
    isPublished: true
  },
  {
    id: "test-3",
    clientName: "Elise Dubois",
    clientCompany: "Alpha Cognitive Capital",
    clientRole: "Head of Risk Analysis",
    rating: 5,
    text: "Implementing AfriWaid's KonsOSMCDA algorithms reduced our regulatory compliance auditing time from 20 business days to under six hours. Symmetrical, clean, and mathematically rigorous.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    category: "AI Solutions",
    isPublished: true
  }
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-1",
    name: "Alasiri Waid",
    role: "Founder & Lead Architect",
    teamType: "Management Core",
    bio: "Pioneering the intersection of server-side intelligence flows and rich cinematic interfaces.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    skills: ["AI Systems", "Multi-criteria Decision Analysis", "React & Node.js"],
    expertiseTags: ["Founder", "Architect", "Systems Director"],
    linkedin: "https://linkedin.com/in/alasiri-waid",
    github: "https://github.com/alasiriwaid",
    twitter: "https://twitter.com/alasiriwaid"
  },
  {
    id: "team-2",
    name: "Kofi Boateng",
    role: "Senior Systems Engineer",
    teamType: "Development Team",
    bio: "Specialist in robust real-time synchronizations, scalable local databases, and PostgreSQL query architectures.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    skills: ["PostgreSQL", "Hermetic Docker", "Prisma ORM", "TypeScript"],
    expertiseTags: ["Engineering", "Infrastructure", "Query Architect"],
    linkedin: "https://linkedin.com/in/kofi-boateng",
    github: "https://github.com/kofiboateng"
  },
  {
    id: "team-3",
    name: "Sade Adebayo",
    role: "Cinematic Visuals Lead",
    teamType: "Creative Node",
    bio: "Translates high-tech architecture into luxury narratives, dynamic motion graphics, and portrait social media reels.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
    skills: ["After Effects", "Blender 3D", "Davinci Resolve", "Brand Identity"],
    expertiseTags: ["Luxury Media", "Luxury UI", "Art Direction"],
    linkedin: "https://linkedin.com/in/sade-adebayo",
    twitter: "https://twitter.com/sadevisuals"
  },
  {
    id: "team-4",
    name: "Dr. Kenji Tanaka",
    role: "AI Safety Researcher",
    teamType: "Intelligence Node",
    bio: "Focuses on cognitive verification constraints, token conservation systems, and strict structured JSON routing validation.",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
    skills: ["Google GenAI", "Cognitive Systems", "JSON Verification Graphs"],
    expertiseTags: ["Ethics & Safety", "Research Science", "Verification Algos"],
    github: "https://github.com/drkenjitantaka"
  }
];

export interface AfriWaidDB {
  projects: Project[];
  articles: Article[];
  journal: JournalEntry[];
  cvs: CV[];
  clients: ClientProfile[];
  inquiries: Inquiry[];
  analytics: TrackedAnalytics;
  services: ServiceOffer[];
  media: MediaItem[];
  homepageStats: HomepageStats;
  techStack: TechStackItem[];
  testimonials: Testimonial[];
  teamMembers: TeamMember[];
  customization: CustomizationSettings;
}

export function loadInitialData(): AfriWaidDB {
  const projects = getStoredData<Project[]>("projects", INITIAL_PROJECTS);
  const articles = getStoredData<Article[]>("articles", INITIAL_ARTICLES);
  let journal = getStoredData<JournalEntry[]>("journal", INITIAL_JOURNAL);
  
  // Dynamic update of default entries to use newly generated high-precision images and preview links
  journal = journal.map(entry => {
    const defaultMatch = INITIAL_JOURNAL.find(df => df.id === entry.id);
    if (defaultMatch) {
      const updated = { ...entry };
      if (!entry.images || entry.images.length === 0 || entry.images.some(img => img.includes("unsplash.com"))) {
        updated.images = defaultMatch.images;
      }
      if (!entry.links || entry.links.length === 0 || entry.links.length < defaultMatch.links!.length) {
        updated.links = defaultMatch.links;
      }
      return updated;
    }
    return entry;
  });

  const cvs = getStoredData<CV[]>("cvs", INITIAL_CVS);
  const clients = getStoredData<ClientProfile[]>("clients", INITIAL_CLIENTS);
  const inquiries = getStoredData<Inquiry[]>("inquiries", INITIAL_INQUIRIES);
  const analytics = getStoredData<TrackedAnalytics>("analytics", INITIAL_ANALYTICS);
  const services = getStoredData<ServiceOffer[]>("services", INITIAL_SERVICES);
  const media = getStoredData<MediaItem[]>("media", INITIAL_MEDIA);
  const homepageStats = getStoredData<HomepageStats>("homepageStats", INITIAL_HOMEPAGE_STATS);
  const techStack = getStoredData<TechStackItem[]>("techStack", INITIAL_TECH_STACK);
  const testimonials = getStoredData<Testimonial[]>("testimonials", INITIAL_TESTIMONIALS);
  const teamMembers = getStoredData<TeamMember[]>("teamMembers", INITIAL_TEAM_MEMBERS);
  const customization = getStoredData<CustomizationSettings>("customization", INITIAL_CUSTOMIZATION);

  return {
    projects,
    articles,
    journal,
    cvs,
    clients,
    inquiries,
    analytics,
    services,
    media,
    homepageStats,
    techStack,
    testimonials,
    teamMembers,
    customization
  };
}

export function saveInitialData(db: AfriWaidDB): void {
  setStoredData("projects", db.projects);
  setStoredData("articles", db.articles);
  setStoredData("journal", db.journal);
  setStoredData("cvs", db.cvs);
  setStoredData("clients", db.clients);
  setStoredData("inquiries", db.inquiries);
  setStoredData("analytics", db.analytics);
  setStoredData("services", db.services);
  setStoredData("media", db.media);
  setStoredData("homepageStats", db.homepageStats);
  setStoredData("techStack", db.techStack);
  setStoredData("testimonials", db.testimonials);
  setStoredData("teamMembers", db.teamMembers);
  setStoredData("customization", db.customization);
}
