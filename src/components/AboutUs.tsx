import React, { useState } from "react";
import { Compass, Target, Shield, Cpu, BookOpen, Clock, Award, CheckCircle, Users, Quote, Star, Linkedin, Github, Twitter } from "lucide-react";
import { motion } from "motion/react";
import { Testimonial, TeamMember, CustomizationSettings } from "../types";

interface AboutUsProps {
  testimonials?: Testimonial[];
  teamMembers?: TeamMember[];
  customization?: CustomizationSettings;
}

export default function AboutUs({ testimonials = [], teamMembers = [], customization }: AboutUsProps) {
  const [activeStackCategory, setActiveStackCategory] = useState<"All" | "Frontend" | "Backend" | "AI/KI" | "Design/Creative">("All");
  const [activeTeamCategory, setActiveTeamCategory] = useState<"All" | "Management Core" | "Development Team" | "Creative Node" | "Intelligence Node">("All");

  const techStack = [
    { name: "React 19 & Next.js", category: "Frontend", level: "Expert", desc: "Core tool for building context-rich interactive UI frames." },
    { name: "Tailwind CSS", category: "Frontend", level: "Expert", desc: "For dynamic atomic spacing grids and layout responsiveness." },
    { name: "Motion (framer)", category: "Frontend", level: "Expert", desc: "Physically compliant micro-interactions and transitions." },
    { name: "Express / Node.js", category: "Backend", level: "Expert", desc: "Lightweight scalable microservice routers." },
    { name: "PostgreSQL / Prisma", category: "Backend", level: "Advanced", desc: "Relational data structures with strictly typed schema logs." },
    { name: "Drizzle ORM", category: "Backend", level: "Advanced", desc: "High-speed SQL queries with modular alignment." },
    { name: "Google @google/genai SDK", category: "AI/KI", level: "Expert", desc: "Server-side integration with Gemini 3.5 systems." },
    { name: "Cognitive MCDA algos", category: "AI/KI", level: "Expert", desc: "Mathematical weighting engines for decision isolation." },
    { name: "Figma Studio", category: "Design/Creative", level: "Expert", desc: "For high-fidelity vector wireframing and prototyping." },
    { name: "Blender 3D", category: "Design/Creative", level: "Advanced", desc: "Cinematic lighting, motion paths, and asset renders." }
  ];

  const corePrinciples = [
    { title: "Architectural Honesty", desc: "No tech-larping or mock telemetry. We present only functional interfaces, real server routes, and human-valuable metrics." },
    { title: "Symmetrical Sensation", desc: "Design and code are one. A single pixel gap online is a critical technical compromise." },
    { title: "Local Autonomy, Global Ingress", desc: "Systems must scale locally in remote low-bandwidth environments while remaining globally sync'd." }
  ];

  const milestones = [
    { date: "2024", title: "Establishment of AfriWaid", desc: "Founded with the vision to bridge spatial motion graphics with full-stack cognitive systems." },
    { date: "2025", title: "Kortex MCDA Formulation", desc: "Released research paper and compliance modeling tool for aerospace audit pipelines." },
    { date: "2026", title: "Active AI Middleware Launch", desc: "Released WaidPulse AI connecting server-side SQL targets securely to LLM agents." }
  ];

  const achievements = [
    "Published research in joint Multi-Agent agritech safety blocks",
    "Secured enterprise alignment with AeroGlobal logistics consortium",
    "Engineered over 12 scalable custom SaaS platforms globally"
  ];

  const filteredStack = activeStackCategory === "All"
    ? techStack
    : techStack.filter(t => t.category === activeStackCategory);

  return (
    <div className="space-y-16 text-slate-800">
      {/* Cinematic Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-950 p-8 md:p-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_60%)]" />
        <div className="max-w-3xl space-y-4 relative z-10 text-left">
          <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-mono text-slate-300">
            {customization?.aboutTagline || "METRICS & CORE PRINCIPLES"}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight leading-none text-white">
            {customization?.aboutTitle || "Bridging Cognitive Engineering with Aesthetic Rigor"}
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-sans">
            {customization?.aboutDescription || "AfriWaid is a premium, multi-module digital studio. We do not build generic portfolio templates. We design, deploy, and verify mission-critical cloud applications, neural agent frameworks, and high-fidelity global branding structures."}
          </p>
        </div>
      </div>

      {/* Mission & Vision Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-4 shadow-xs hover:shadow-md transition">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-extrabold text-slate-950">{customization?.aboutMissionTitle || "Our Mission"}</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-sans">
            {customization?.aboutMissionDesc || "To build intelligent digital structures that allow organizations worldwide to seamlessly automate, audit, and display complex logistics pipelines and branding matrices without tech-debt decay."}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-4 shadow-xs hover:shadow-md transition">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-extrabold text-slate-950">{customization?.aboutVisionTitle || "Our Vision"}</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-sans">
            {customization?.aboutVisionDesc || "To grow into a global, institutional tech studio that acts as a living showcase of multi-agent safety engineering, pixel-perfect user frameworks, and elite publishing workflows."}
          </p>
        </div>
      </div>

      {/* Innovation Philosophy & Core Principles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        <div className="lg:col-span-4 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-display font-extrabold text-slate-950 tracking-tight">{customization?.aboutPhilosophyTitle || "Our Innovation Philosophy"}</h3>
          <p className="text-slate-600 text-sm leading-relaxed font-sans">
            {customization?.aboutPhilosophyDesc || "We believe that technology gains value only through absolute transparency. Unusable AI telemetry is a systematic pollutant. We focus on physical, human-verified loops, mathematical criteria weighting, and breathtaking visual controls."}
          </p>
        </div>

        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
          <h4 className="text-xs text-slate-400 tracking-wider uppercase font-mono font-bold">THE REWARD OF RIGOR: OUR LAWS</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            {corePrinciples.map((p, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-xs font-mono font-bold">L-{idx + 1}</span>
                  <h5 className="text-slate-900 font-bold text-sm">{p.title}</h5>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Technology Stack Section */}
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-2xl font-display font-extrabold text-slate-950">The AfriWaid Engine Stack</h3>
            <p className="text-xs text-slate-400 font-mono font-semibold">ACTIVE REQUISITE PROFICIENCY MATRIX</p>
          </div>
          {/* Controls */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 border border-slate-200 rounded-lg">
            {(["All", "Frontend", "Backend", "AI/KI", "Design/Creative"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveStackCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition duration-155 cursor-pointer ${activeStackCategory === cat ? "bg-slate-900 text-white font-bold shadow-xs" : "text-slate-600 hover:text-slate-900 font-semibold"}`}
                id={`tech-cat-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStack.map((tech, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2.5 flex flex-col justify-between hover:border-blue-400/30 transition">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-900 text-sm font-bold font-sans">{tech.name}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[10px] text-blue-700 font-mono font-bold">
                    {tech.level}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">{tech.desc}</p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block pt-2 border-t border-slate-100 font-bold">
                Category: {tech.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities & Methodology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="p-6 md:p-8 rounded-xl border border-slate-200 bg-white space-y-4 shadow-xs">
          <h3 className="text-xl font-display font-extrabold text-slate-950">Studio Capabilities</h3>
          <ul className="grid grid-cols-2 gap-3 text-xs text-slate-600 font-sans font-semibold">
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-600" /> Web Apps & SaaS</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-600" /> Intelligence Systems</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-600" /> Custom Dashboarding</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-600" /> Logo & Art Direction</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-600" /> Dynamic 3D Simulations</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-blue-600" /> Video & Copywriting</li>
          </ul>
        </div>

        <div className="p-6 md:p-8 rounded-xl border border-slate-200 bg-white space-y-4 shadow-xs">
          <h3 className="text-xl font-display font-extrabold text-slate-950">Proven Methodology</h3>
          <div className="space-y-3 font-sans">
            <div className="flex gap-3">
              <span className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md h-fit font-bold">01</span>
              <div>
                <h5 className="text-slate-900 text-sm font-bold">Deep Spec-Writing</h5>
                <p className="text-xs text-slate-500">We outline functional database keys and visual motion paths before writing any components.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md h-fit font-bold">02</span>
              <div>
                <h5 className="text-slate-900 text-sm font-bold">Full-Fidelity Seed</h5>
                <p className="text-xs text-slate-500">We never deliver layouts containing dummy lorem ipsum content. Every interface is preloaded with technical domain data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Team Node Matrix Section */}
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-2xl font-display font-extrabold text-slate-950 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> The AfriWaid Team Matrix
            </h3>
            <p className="text-xs text-slate-400 font-mono font-semibold">INTELLIGENCE, CREATION, DEVELOPMENT AND STRATEGIC CORE NODES</p>
          </div>
          {/* Controls */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 border border-slate-200 rounded-lg">
            {(["All", "Management Core", "Development Team", "Creative Node", "Intelligence Node"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTeamCategory(cat)}
                className={`px-3 py-1 rounded-md text-xs font-mono transition duration-150 cursor-pointer ${activeTeamCategory === cat ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:text-slate-900 font-semibold"}`}
                id={`team-cat-${cat.toLowerCase().replace(" ", "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {teamMembers && teamMembers.filter(member => activeTeamCategory === "All" || member.teamType === activeTeamCategory).length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl shadow-xs">
            <p className="text-xs text-slate-400 font-mono italic">No team specialists currently associated with this node classification.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers && teamMembers
              .filter(member => activeTeamCategory === "All" || member.teamType === activeTeamCategory)
              .map((member) => (
                <div key={member.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between group hover:border-blue-400/40 hover:shadow-md transition duration-300 animate-fadeIn shadow-xs" id={`team-card-${member.id}`}>
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 relative border border-slate-200">
                      <img
                        src={member.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80"}
                        alt={member.name}
                        className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition duration-500 animate-fade"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[8px] text-blue-300 font-mono font-bold uppercase tracking-widest scale-90">
                        {member.teamType}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-slate-900 text-base font-extrabold font-display tracking-tight">{member.name}</h4>
                      <p className="text-[10px] text-blue-600 uppercase tracking-widest font-mono font-bold">{member.role}</p>
                      
                      {member.expertiseTags && member.expertiseTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1.5 pb-0.5">
                          {member.expertiseTags.map((tag, tIdx) => (
                            <span key={tIdx} className="px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase font-mono bg-blue-50/80 text-blue-700 border border-blue-100 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-slate-500 leading-relaxed pt-1.5 font-sans min-h-[3.5rem]">{member.bio}</p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-end justify-between gap-2">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <p className="text-[8px] text-slate-400 font-mono uppercase tracking-wider font-extrabold">Primary Expertise</p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills && member.skills.map((skill, sIdx) => (
                          <span key={sIdx} className="px-2 py-0.5 text-[8px] tracking-wide text-slate-600 font-mono bg-slate-100 border border-slate-150 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {(member.linkedin || member.github || member.twitter) && (
                      <div className="flex items-center gap-1.5 shrink-0 pb-0.5">
                        {member.linkedin && (
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-100 hover:border-blue-200 transition duration-150 shadow-xs" title={`${member.name}'s LinkedIn`}>
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.github && (
                          <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-slate-50 hover:bg-zinc-100 text-slate-400 hover:text-black border border-slate-100 hover:border-zinc-300 transition duration-150 shadow-xs" title={`${member.name}'s GitHub`}>
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {member.twitter && (
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-slate-50 hover:bg-sky-50 text-slate-400 hover:text-sky-500 border border-slate-100 hover:border-sky-200 transition duration-150 shadow-xs" title={`${member.name}'s Twitter`}>
                            <Twitter className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Client Commendations & Testimonials Section */}
      <div className="space-y-6 text-left">
        <div>
          <h3 className="text-2xl font-display font-extrabold text-slate-950 flex items-center gap-2">
            <Quote className="w-5 h-5 text-blue-600" /> Client Commendations
          </h3>
          <p className="text-xs text-slate-400 font-mono font-semibold">HEAR DIRECTLY FROM THE ORGANIZATIONS ENERGETICALLY WIRED TO OUR COGNITIVE PIPELINES</p>
        </div>

        {testimonials && testimonials.filter(t => t.isPublished).length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl shadow-xs">
            <p className="text-xs text-slate-400 italic font-sans animate-pulse">No authenticated client commendations are published at this moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials && testimonials
              .filter(t => t.isPublished)
              .map((t) => (
                <div key={t.id} className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4 relative flex flex-col justify-between hover:border-blue-400/30 hover:shadow-md transition" id={`testimonial-card-${t.id}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating || 5 }).map((_, rIdx) => (
                          <Star key={rIdx} className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        ))}
                      </div>
                      {t.category && (
                        <span className="text-[8px] uppercase tracking-wider text-blue-700 font-mono bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/50 font-bold">
                          {t.category}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 text-xs leading-relaxed italic font-sans">
                      "{t.text}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-100">
                    <img
                      src={t.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                      alt={t.clientName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h5 className="text-slate-900 text-xs font-bold font-display truncate">{t.clientName}</h5>
                      <p className="text-[10px] text-slate-450 font-medium truncate font-sans">
                        {t.clientRole}, <span className="text-blue-600 font-mono text-[9px] font-bold">{t.clientCompany}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Horizontal Milestones Timeline */}
      <div className="space-y-6 text-left">
        <div>
          <h3 className="text-2xl font-display font-extrabold text-slate-950">Active Timeline Milestone</h3>
          <p className="text-xs text-slate-400 font-mono font-semibold">FROM CREATIVE ORIGINS TO ENTERPRISE SYSTEM</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {milestones.map((mil, idx) => (
            <div key={idx} className="relative p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
              <span className="text-xs text-blue-600 font-mono font-bold block">{mil.date}</span>
              <h5 className="text-slate-900 font-bold text-sm font-sans">{mil.title}</h5>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">{mil.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="p-6 rounded-xl border border-slate-200 bg-blue-50/50 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <h4 className="text-sm font-mono text-blue-700 tracking-wider uppercase flex items-center gap-1.5 font-bold">
            <Award className="w-4 h-4 text-blue-600" /> Studio Credentials
          </h4>
          <h3 className="text-xl font-display text-slate-900 font-bold">Decisions Made on Tracked Performance</h3>
        </div>
        <div className="space-y-2 text-xs text-slate-650 font-sans font-semibold">
          {achievements.map((ach, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>{ach}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
