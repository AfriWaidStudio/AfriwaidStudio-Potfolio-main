import React, { useState } from "react";
import { 
  Check, 
  ClipboardList, 
  Clock, 
  ArrowRight, 
  ArrowDown, 
  HelpCircle, 
  Cpu, 
  Sparkles, 
  Compass, 
  Palette, 
  Video, 
  BookOpen, 
  Search, 
  Layers, 
  ChevronRight, 
  Terminal, 
  Info,
  Layers2
} from "lucide-react";
import { ServiceOffer, CustomizationSettings } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ServicesPageProps {
  services: ServiceOffer[];
  onSelectInquiryCategory: (category: string) => void;
  onNavigateToTab: (tabName: string) => void;
  customization?: CustomizationSettings;
}

export default function ServicesPage({ services, onSelectInquiryCategory, onNavigateToTab, customization }: ServicesPageProps) {
  const [activeCapId, setActiveCapId] = useState<string>("software-dev");

  const handleInquireService = (category: string) => {
    onSelectInquiryCategory(category);
    onNavigateToTab("Contact");
  };

  const capabilities = [
    {
      id: "software-dev",
      name: "Software Development",
      icon: Cpu,
      accentColor: "indigo",
      colorClasses: {
        text: "text-indigo-700",
        bg: "bg-indigo-50/75",
        border: "border-indigo-200/60",
        bulletBg: "bg-indigo-100/70 text-indigo-700",
        badge: "bg-indigo-50 border-indigo-150 text-indigo-700",
        grad: "from-indigo-500 to-blue-650",
        ring: "ring-indigo-100"
      },
      expertise: ["Web Apps", "SaaS Platforms", "Dashboards", "Enterprise Systems", "Full Stack Development"],
      description: "Engineering robust, scalable, and high-performance digital infrastructure. From clean SaaS frontends to mission-critical backend microservices, we build software that drives enterprise-grade institutional value.",
      deliverables: [
        "Custom React & Next.js SaaS Web Applications",
        "Robust Express/Node.js Server Architectures",
        "Interactive Analytics Consoles & Enterprise Dashboards",
        "Database Modeling, API Design & Scalability Audits"
      ],
      techStack: ["React", "TypeScript", "Node.js", "Express", "Vite", "Tailwind CSS", "D3.js", "PostgreSQL"]
    },
    {
      id: "ai-solutions",
      name: "Artificial Intelligence",
      icon: Sparkles,
      accentColor: "purple",
      colorClasses: {
        text: "text-purple-700",
        bg: "bg-purple-50/75",
        border: "border-purple-200/60",
        bulletBg: "bg-purple-100/70 text-purple-700",
        badge: "bg-purple-50 border-purple-150 text-purple-700",
        grad: "from-purple-500 to-indigo-750",
        ring: "ring-purple-100"
      },
      expertise: ["AI Assistants", "AI Agents", "Knowledge Systems", "Automation"],
      description: "Harnessing agentic workflows and retrieval-augmented generation (RAG) to automate complex cognitive operations. We construct autonomous agent systems equipped with strict safety constraints and real-time custom memory indexing.",
      deliverables: [
        "Context-Aware RAG Solutions (Knowledge Bases)",
        "Automated Interactive Voice & Text AI Assistants",
        "Multi-Agent Workflow Orchestration Networks",
        "Robotic Action Controllers & Smart Middleware"
      ],
      techStack: ["@google/genai", "Vector Databases", "LangChain / LangGraph", "Python", "Semantic Embeddings", "Security Filters"]
    },
    {
      id: "ki-systems",
      name: "KI (Konsmik Intelligence) Systems",
      icon: Compass,
      accentColor: "cyan",
      colorClasses: {
        text: "text-cyan-750",
        bg: "bg-cyan-50/75",
        border: "border-cyan-200/60",
        bulletBg: "bg-cyan-100/70 text-cyan-750",
        badge: "bg-cyan-50 border-cyan-150 text-cyan-750",
        grad: "from-cyan-500 to-blue-600",
        ring: "ring-cyan-100"
      },
      expertise: ["Intelligence Architecture", "Decision Systems", "Multi-Agent Frameworks", "Konsmik Entities"],
      description: "Pioneering high-order cognitive computing environments. Konsmik Intelligence designs mathematical decision models, nested scoring frameworks, and secure multi-agent consensus topologies designed to bypass model hallucinations.",
      deliverables: [
        "Rigorous Multi-Criteria Decision Analysis (MCDA) Matrices",
        "Sovereign Multi-Agent Verification Frameworks",
        "Konsmik Intelligent Entities & Autonomous Agent Nodes",
        "Diagnostic System Logs & Infinite-Loop Reasoning Checks"
      ],
      techStack: ["MCDA Algorithms", "Diagnostic Node Graphs", "Custom Logic Engines", "Secure State Machines", "D3 Node Flowcharts"]
    },
    {
      id: "design-studio",
      name: "Design",
      icon: Palette,
      accentColor: "pink",
      colorClasses: {
        text: "text-pink-700",
        bg: "bg-pink-50/75",
        border: "border-pink-200/60",
        bulletBg: "bg-pink-100/70 text-pink-700",
        badge: "bg-pink-50 border-pink-150 text-pink-700",
        grad: "from-pink-500 to-rose-600",
        ring: "ring-pink-100"
      },
      expertise: ["Logo Design", "Brand Identity", "UI Design", "Product Design"],
      description: "Fusing pixel-perfect precision and high aesthetics to draft stunning digital landscapes. We formulate custom typography architectures, cohesive branding layouts, and highly interactive user components designed to maximize conversions.",
      deliverables: [
        "Futuristic Logo Marks & Premium Typography Pairing",
        "Comprehensive Interactive Brand Stylebook Web-Tools",
        "High-Fidelity Figma UI Prototypes with Fluid Micro-interactions",
        "Complete Vector System Assets (SVG, High-Res Exports)"
      ],
      techStack: ["Figma", "Tailwind styling", "Motion layout engine", "SVG animations", "Adobe Suite", "Responsive Layouts"]
    },
    {
      id: "media-production",
      name: "Media",
      icon: Video,
      accentColor: "rose",
      colorClasses: {
        text: "text-rose-700",
        bg: "bg-rose-50/75",
        border: "border-rose-250/60",
        bulletBg: "bg-rose-100/70 text-rose-700",
        badge: "bg-rose-50 border-rose-150 text-rose-700",
        grad: "from-rose-500 to-orange-500",
        ring: "ring-rose-100"
      },
      expertise: ["Video Production", "Video Editing", "Motion Graphics"],
      description: "Architecting cinematic visual storytelling to amplify systemic technology solutions. We deliver complete post-production editing pipelines, professional voiceovers, and fluid animated explainers demonstrating technical concepts.",
      deliverables: [
        "High-Impact Product Showcase & Walkthrough Videos",
        "Modular Motion Graphics Packages & Kinetic Logo Marks",
        "Enterprise Tech Explainer Videos & Script Formulation",
        "Cinematic Video Post-Production & Color Grading Loops"
      ],
      techStack: ["Premiere Pro", "After Effects", "Kinetic motion vectors", "Subtitling, Audio scoring", "Lottie animations"]
    },
    {
      id: "writing-hub",
      name: "Writing",
      icon: BookOpen,
      accentColor: "amber",
      colorClasses: {
        text: "text-amber-850",
        bg: "bg-amber-50/75",
        border: "border-amber-250/60",
        bulletBg: "bg-amber-100/70 text-amber-850",
        badge: "bg-amber-50 border-amber-150 text-amber-850",
        grad: "from-amber-500 to-amber-700",
        ring: "ring-amber-100"
      },
      expertise: ["Copywriting", "News Writing", "SEO Content", "Technical Writing"],
      description: "Composing authoritative text assets designed to establish industry competence. From highly complex technical whitepapers to strategic search engine optimized resources and institutional press columns.",
      deliverables: [
        "Developer API Documentation & System Guides",
        "Optimized Strategic Industry SEO Knowledge Guides",
        "High-Conversion Website Copy & Persuasive Email Sequences",
        "Consmik Academic Papers & Regulatory Technical Dispatches"
      ],
      techStack: ["Markdown formatting", "Ahrefs & SEMrush SEO strategies", "Technical audit prose", "Persuasive copy formulas"]
    },
    {
      id: "research-hub",
      name: "Research",
      icon: Search,
      accentColor: "teal",
      colorClasses: {
        text: "text-teal-750",
        bg: "bg-teal-50/75",
        border: "border-teal-200/60",
        bulletBg: "bg-teal-100/70 text-teal-750",
        badge: "bg-teal-50 border-teal-150 text-teal-750",
        grad: "from-teal-500 to-emerald-600",
        ring: "ring-teal-100"
      },
      expertise: ["Product Research", "Innovation Research", "System Architecture"],
      description: "Drafting bulletproof technical hypotheses and mapping logical component architectures. We perform rigorous feasibility checks and competitive gaps analysis to secure maximum project safety.",
      deliverables: [
        "In-Depth Commercial Feasibility Reports",
        "Comprehensive System Architecture Blueprint Schemas",
        "Advanced Competitive Tech-Stack Gap Auditing",
        "Product-Market Validation Checklists & UX Audits"
      ],
      techStack: ["Architecture Blueprints", "Feasibility frameworks", "Competitive maps", "Information Topology graphs"]
    }
  ];

  const activeCap = capabilities.find(c => c.id === activeCapId) || capabilities[0];
  const ActiveIcon = activeCap.icon;

  return (
    <div className="space-y-16 text-left">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-mono tracking-widest uppercase font-bold">
          <ClipboardList className="w-3.5 h-3.5 animate-pulse text-blue-600" />
          {customization?.servicesTagline || "Technical Capabilities & Service Matrix"}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-950 tracking-tight leading-none animate-fadeIn">
          {customization?.servicesTitle || "Professional Digital Offerings"}
        </h1>
        <p className="text-slate-650 text-sm md:text-base leading-relaxed text-center font-sans">
          {customization?.servicesDescription || "AfriWaid is built to handle enterprise projects. Explore our core engineering competencies, interactive knowledge disciplines, and pre-structured commercial execution models."}
        </p>
      </div>

      {/* NEW: Interactive Capabilities explorer Section */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Layers2 className="w-5 h-5 text-indigo-600" /> Interactive Capabilities Hub
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-1">// INTERACTIVE INDEX OF MASTER DISCIPLINARY COMPETENCIES</p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-slate-50 border border-slate-205 text-slate-500 rounded px-2 py-1 uppercase hidden md:inline-block">
            7 Expert Nodes Available
          </span>
        </div>

        {/* Browser Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column - Category Selector Selector (Span 5) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Select Core Discipline:</span>
            <div className="space-y-2.5">
              {capabilities.map((cap) => {
                const CapIcon = cap.icon;
                const isSelected = cap.id === activeCapId;
                return (
                  <button
                    key={cap.id}
                    onClick={() => setActiveCapId(cap.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-start gap-4 cursor-pointer relative group ${
                      isSelected
                        ? `bg-white border-slate-200 shadow-md ring-2 ring-offset-2 ${cap.colorClasses.ring}`
                        : "bg-slate-50/50 hover:bg-slate-50 border-slate-200/70"
                    }`}
                    id={`cap-select-btn-${cap.id}`}
                  >
                    {/* Selected state accent line indicator */}
                    {isSelected && (
                      <div className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-lg bg-gradient-to-b ${cap.colorClasses.grad}`} />
                    )}

                    {/* Icon frame */}
                    <div className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                      isSelected ? cap.colorClasses.bg : "bg-slate-100 group-hover:bg-slate-200/70 text-slate-500"
                    }`}>
                      <CapIcon className={`w-5 h-5 ${isSelected ? cap.colorClasses.text : "text-slate-500"}`} />
                    </div>

                    {/* Meta-text */}
                    <div className="space-y-1 select-none">
                      <h4 className={`text-sm md:text-base font-display font-extrabold transition-colors duration-150 ${
                        isSelected ? "text-slate-900" : "text-slate-700 font-semibold group-hover:text-slate-900"
                      }`}>
                        {cap.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-sans leading-normal line-clamp-1">
                        {cap.expertise.join(" • ")}
                      </p>
                    </div>

                    {/* Arrow sign-sheet */}
                    <div className="ml-auto flex items-center justify-center self-center h-full text-slate-350 pr-1 group-hover:text-slate-500">
                      <ChevronRight className={`w-4 h-4 transition-transform duration-150 ${isSelected ? "translate-x-1 text-slate-600" : ""}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column - Deep Info View Panel (Span 7) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCap.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden"
              >
                {/* Visual Top Decorative Accent Strip */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${activeCap.colorClasses.grad}`} />

                {/* Header Title with animated background */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">// LEVEL-1 SYSTEM COMPETENCE INTERFACES</span>
                    <h3 className="text-2xl md:text-3xl font-display font-black text-slate-900 tracking-tight leading-tight">
                      {activeCap.name}
                    </h3>
                  </div>
                  <div className={`p-3.5 rounded-xl ${activeCap.colorClasses.bg} shrink-0`}>
                    <ActiveIcon className={`w-6 h-6 ${activeCap.colorClasses.text}`} />
                  </div>
                </div>

                {/* Sub-areas of expertise visual chips */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">Sub-Domains Covered:</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCap.expertise.map((exp, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-3 py-1 font-sans font-bold rounded-full border bg-white ${activeCap.colorClasses.badge}`}
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Analytical Prose Description */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">Operational Mandate:</h5>
                  <p className="text-slate-650 text-sm md:text-base font-sans font-medium leading-relaxed">
                    {activeCap.description}
                  </p>
                </div>

                {/* Comprehensive Deliverables checklist */}
                <div className="space-y-3 pt-2">
                  <h5 className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">Deliverables Checklist:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-slate-700">
                    {activeCap.deliverables.map((del, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border ${activeCap.colorClasses.bulletBg} ${activeCap.colorClasses.border}`}>
                          <Check className="w-3.5 h-3.5 stroke-[2.5px]" />
                        </span>
                        <span className="font-sans leading-normal">{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specific Tech Stack Badge Bar */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Standard Technology Toolset & Frameworks:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCap.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 rounded-md font-bold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom interactive action triggers */}
                <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <Info className="w-3.5 h-3.5" />
                    <span>Inquire for customized solutions.</span>
                  </div>
                  <button
                    onClick={() => handleInquireService(activeCap.name)}
                    className="w-full md:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition duration-150 flex items-center justify-center gap-2 font-mono cursor-pointer"
                    id={`contact-us-cap-${activeCap.id}`}
                  >
                    <span>Inquire {activeCap.name} Suite</span> <ArrowRight className="w-4 h-4 text-indigo-400" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Commercially Bundled Packages Section */}
      <div className="space-y-6 pt-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-600" /> Standard Production Workflows & Packages
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">// CHOOSE PRE-STRUCTURED ESTIMATION SCHEMAS FOR FASTER ONBOARDING</p>
        </div>

        {/* Services Grid */}
        <div className="space-y-12">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="group rounded-xl border border-slate-200 bg-white p-6 md:p-8 space-y-8 hover:border-blue-400/40 hover:shadow-lg transition duration-300 shadow-xs"
            >
              {/* Top row */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                
                {/* Title & Desc */}
                <div className="space-y-3 lg:max-w-2xl text-left">
                  <span className="px-2.5 py-1 bg-blue-50 border border-blue-205 text-[10px] text-blue-700 font-mono uppercase tracking-wider rounded font-bold inline-block">
                    {srv.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 group-hover:text-blue-600 transition duration-150">
                    {srv.name}
                  </h3>
                  <p className="text-sm text-slate-610 leading-relaxed font-sans">
                    {srv.description}
                  </p>

                  {/* Timeline and CTA */}
                  <div className="flex flex-wrap items-center gap-4 pt-3 text-xs">
                    <div className="flex items-center gap-1.5 font-mono text-slate-500 font-semibold">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>ESTIMATED TIMELINE: <strong className="text-slate-800">{srv.estimatedTimeline}</strong></span>
                    </div>
                    
                    <button
                      onClick={() => handleInquireService(srv.category)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition duration-150 flex items-center gap-1.5 font-mono shadow-sm cursor-pointer"
                      id={`inquire-srv-${srv.id}`}
                    >
                      Inquire Service <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Deliverables Checklist (Right col) */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 lg:w-[350px] shrink-0 text-left space-y-3">
                  <h4 className="text-xs text-slate-500 font-mono tracking-wider uppercase font-extrabold border-b border-slate-200 pb-2">
                    Required Deliverables
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 font-sans">
                    {srv.deliverables.map((del, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-sm bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5 font-extrabold">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Bottom Row - Flow process steps */}
              <div className="pt-6 border-t border-slate-100 text-left space-y-4">
                <h4 className="text-xs text-slate-400 tracking-wider uppercase font-mono font-bold">
                  Agile Milestones Delivery Flow
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  {srv.process.map((step, idx) => (
                    <div key={idx} className="relative p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 hover:bg-white hover:shadow-xs transition">
                      {/* Flow arrow indicators (print/hidden in vertical mobile) */}
                      {idx < 3 && (
                        <div className="hidden md:block absolute top-1/2 -right-2.5 transform -translate-y-1/2 z-10">
                          <ArrowRight className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 border border-blue-200 text-[10px] text-blue-700 font-mono flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <h5 className="text-xs text-slate-800 uppercase font-mono tracking-wider font-bold">Phase {idx + 1}</h5>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed pr-1 font-sans">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row - Portfolio connections */}
              {srv.portfolioExamples && srv.portfolioExamples.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-3 text-xs pl-1">
                  <span className="text-slate-400 font-mono font-bold uppercase tracking-wider text-[10px]">RELATED PORTFOLIO TRACKS:</span>
                  {srv.portfolioExamples.map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => onNavigateToTab("Projects")}
                      className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-250 text-[10px] text-slate-600 font-sans hover:text-slate-900 hover:bg-slate-100 transition duration-150 flex items-center gap-1 uppercase font-bold cursor-pointer"
                      id={`srv-portfolio-ref-${idx}`}
                    >
                      <span>{ex.name}</span>
                      <ArrowDown className="w-3 h-3 rotate-[225deg]" />
                    </button>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
