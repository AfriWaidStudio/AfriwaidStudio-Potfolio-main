import React, { useState } from "react";
import { Search, Filter, ExternalLink, GitBranch, Calendar, AlertCircle, X, ChevronRight, BookOpen, Layers, RotateCcw, Check, Play, Video, Image, Monitor } from "lucide-react";
import { Project, CustomizationSettings } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ProjectsPageProps {
  projects: Project[];
  onViewIncrement: (id: string) => void;
  customization?: CustomizationSettings;
}

export default function ProjectsPage({ projects, onViewIncrement, customization }: ProjectsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Websites" | "SaaS" | "AI" | "KI" | "Mobile Apps" | "Design" | "Writing" | "Media" | "Research" >("All");
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeCaseStudy, setActiveCaseStudy] = useState<Project | null>(null);
  const [activeDetails, setActiveDetails] = useState<Project | null>(null);
  const [selectedMediaIdx, setSelectedMediaIdx] = useState<number>(0);

  // Dynamic media list & timeline compiler from selected project details
  const mediaItems: { type: "image" | "video"; url: string; title: string }[] = [];
  let currentStageIndex = 0;
  const stages = [
    { label: "Planning", desc: "Requirements & Scope" },
    { label: "Development", desc: "Core Development" },
    { label: "QA", desc: "Integration & Testing" },
    { label: "Deployed", desc: "Production Node Release" }
  ];

  if (activeDetails) {
    if (activeDetails.screenshots && activeDetails.screenshots.length > 0) {
      activeDetails.screenshots.forEach((img, idx) => {
        mediaItems.push({ type: "image", url: img, title: `Screenshot ${idx + 1}` });
      });
    }
    if (activeDetails.videoDemo) {
      mediaItems.push({ type: "video", url: activeDetails.videoDemo, title: "System Workflow Demo" });
    }
    if (mediaItems.length === 0) {
      mediaItems.push({ type: "image", url: activeDetails.coverImage, title: "Archive Cover image" });
    }

    const s = activeDetails.projectStatus;
    if (s === "Planning") currentStageIndex = 0;
    else if (s === "In Development") currentStageIndex = 1;
    else if (s === "QA") currentStageIndex = 2;
    else if (s === "Active" || s === "Completed" || s === "Maintained") currentStageIndex = 3;
  }

  const handleOpenDetails = (p: Project) => {
    setActiveDetails(p);
    setSelectedMediaIdx(0);
    onViewIncrement(p.id);
  };

  const categories = [
    "All", "Websites", "SaaS", "AI", "KI", "Mobile Apps", "Design", "Writing", "Media", "Research"
  ] as const;

  // Gather unique available filters dynamically
  const availableTechs = Array.from(
    new Set(projects.flatMap((p) => p.technologiesUsed || []))
  ).sort();

  const availableTags = Array.from(
    new Set(projects.flatMap((p) => p.tags || []))
  ).sort();

  const handleToggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((td) => td !== tag) : [...prev, tag]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedTechs([]);
    setSelectedTags([]);
    setSelectedCategory("All");
    setSearchTerm("");
  };

  // Filter list
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          p.technologiesUsed.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;

    const matchesTech = selectedTechs.length === 0 ||
                        p.technologiesUsed.some(tech => selectedTechs.includes(tech));

    const matchesTags = selectedTags.length === 0 ||
                        p.tags.some(tag => selectedTags.includes(tag));

    return matchesSearch && matchesCategory && matchesTech && matchesTags;
  });

  const handleOpenCaseStudy = (p: Project) => {
    setActiveCaseStudy(p);
    onViewIncrement(p.id);
  };

  return (
    <div className="space-y-8 text-left text-slate-800">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-extrabold text-slate-950 tracking-tight">
          {customization?.projectsTitle || "Technical Portfolio & Showcase"}
        </h1>
        <p className="text-xs text-slate-400 font-mono font-semibold">
          {customization?.projectsSubtitle || "COMPLETE ARCHIVE OF INTELLECTUAL WORK"}
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-4 border-b border-slate-205 pb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search input */}
          <div className="relative flex-1 max-w-md font-sans">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, technologies, or tags..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-450 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 transition duration-150"
              id="portfolio-search-input"
            />
          </div>

          {/* Categories selector */}
          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 border border-slate-200 rounded-lg overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-mono whitespace-nowrap transition duration-150 uppercase tracking-wider cursor-pointer font-bold ${selectedCategory === cat ? "bg-slate-900 text-white font-bold" : "text-slate-650 hover:text-slate-950"}`}
                id={`project-cat-${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Trigger and Active Parameter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-150 font-mono font-bold">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-350 transition duration-150 text-[10px] flex items-center gap-1.5 uppercase cursor-pointer ${
                showAdvanced || selectedTechs.length > 0 || selectedTags.length > 0 ? "border-blue-300 text-blue-700 bg-blue-50/50" : "shadow-xs"
              }`}
              id="advanced-filters-trigger"
            >
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Advanced Segment Filters</span>
              {(selectedTechs.length > 0 || selectedTags.length > 0) && (
                <span className="px-1.5 py-0.2 bg-blue-100 text-blue-700 text-[9px] rounded-full font-bold ml-1">
                  {selectedTechs.length + selectedTags.length}
                </span>
              )}
            </button>

            {/* Active Tech badging */}
            {selectedTechs.map((tech) => (
              <span
                key={tech}
                onClick={() => handleToggleTech(tech)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-red-50 border border-blue-200 hover:border-red-200 text-blue-700 hover:text-red-700 text-[10px] rounded-md cursor-pointer transition duration-150 group"
              >
                <span>tech:{tech}</span>
                <X className="w-3 h-3 text-blue-500 group-hover:text-red-500 transition animate-pulse" />
              </span>
            ))}

            {/* Active Tag badging */}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                onClick={() => handleToggleTag(tag)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 hover:bg-red-50 border border-purple-205 hover:border-red-200 text-purple-700 hover:text-red-700 text-[10px] rounded-md cursor-pointer transition duration-150 group"
              >
                <span>tag:{tag}</span>
                <X className="w-3 h-3 text-purple-500 group-hover:text-red-500 transition animate-pulse" />
              </span>
            ))}
          </div>

          {(selectedCategory !== "All" || searchTerm || selectedTechs.length > 0 || selectedTags.length > 0) && (
            <button
              onClick={handleClearAllFilters}
              className="text-slate-400 hover:text-slate-700 transition duration-150 flex items-center gap-1 text-[10px] uppercase cursor-pointer"
              id="clear-all-filters-btn"
            >
              <RotateCcw className="w-3 h-3 text-slate-405" />
              <span>Reset parameters</span>
            </button>
          )}
        </div>

        {/* Animated Advanced panel choosing */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden bg-white p-4 border border-slate-200 rounded-xl space-y-4 shadow-inner"
              id="advanced-filters-panel"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Technologies used multi selection */}
                <div className="space-y-2 text-left animate-fadeIn">
                  <h4 className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-slate-100">
                    <Layers className="w-3.5 h-3.5 text-blue-600" /> Filter by Technologies Used
                  </h4>
                  {availableTechs.length === 0 ? (
                    <p className="text-[10px] text-slate-400 font-mono italic">No technologies defined.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {availableTechs.map((tech) => {
                        const isSelected = selectedTechs.includes(tech);
                        return (
                          <button
                            key={tech}
                            onClick={() => handleToggleTech(tech)}
                            className={`px-2 py-1 rounded-md text-[10px] font-mono transition duration-155 uppercase tracking-tight text-left cursor-pointer font-bold ${
                              isSelected
                                ? "bg-blue-600 text-white font-extrabold border border-blue-500"
                                : "bg-slate-55 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                          >
                            <span>{tech}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Tags multi selection */}
                <div className="space-y-2 text-left animate-fadeIn">
                  <h4 className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1 pb-1 border-b border-slate-100">
                    <Layers className="w-3.5 h-3.5 text-purple-600" /> Filter by Custom Tags
                  </h4>
                  {availableTags.length === 0 ? (
                    <p className="text-[10px] text-slate-400 font-mono italic">No tags defined.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {availableTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            onClick={() => handleToggleTag(tag)}
                            className={`px-2 py-1 rounded-md text-[10px] font-mono transition duration-155 uppercase tracking-tight text-left cursor-pointer font-bold ${
                              isSelected
                                ? "bg-purple-600 text-white font-extrabold border border-purple-500"
                                : "bg-slate-55 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                          >
                            <span>{tag}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid rendering */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 p-6 rounded-xl border border-slate-200 bg-white shadow-xs">
          <p className="text-sm text-slate-400 font-mono">No matching projects located in active index. Tweak search triggers.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="group rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-400/40 hover:shadow-lg transition duration-300 flex flex-col justify-between space-y-6 shadow-xs"
            >
              <div className="space-y-4">
                {/* Cover Asset */}
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 relative border border-slate-200">
                  <img
                    src={proj.coverImage}
                    alt={proj.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />

                  {/* Top indicators */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/95 text-[9px] text-blue-300 font-mono uppercase tracking-wider rounded font-bold">
                    {proj.category}
                  </span>

                  <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-slate-900/85 text-[9px] text-slate-100 font-mono rounded flex items-center gap-1 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {proj.completionDate}
                  </span>

                  {/* Status */}
                  <span className={`absolute top-3 right-3 px-2 py-0.5 text-[9px] font-mono rounded border ${
                    proj.projectStatus === "Completed" ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-extrabold" :
                    proj.projectStatus === "Active" ? "bg-blue-50 border-blue-205 text-blue-700 font-extrabold" :
                    "bg-amber-50 border-amber-205 text-amber-700 font-extrabold"
                  }`}>
                    {proj.projectStatus}
                  </span>
                </div>

                {/* Info Block */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-display text-slate-900 font-extrabold group-hover:text-blue-600 transition duration-150">
                      {proj.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">VIEWS: {proj.views}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans max-w-full text-left">
                    {proj.description}
                  </p>
                </div>

                {/* Problem solved */}
                <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-100 space-y-1">
                  <span className="text-[10px] text-blue-700 font-mono uppercase tracking-wider font-extrabold flex items-center gap-1.5 align-middle">
                    <AlertCircle className="w-3.5 h-3.5 text-blue-600" /> Problem Tackled
                  </span>
                  <p className="text-[11px] text-slate-650 leading-relaxed pr-1 text-left font-sans font-medium">
                    {proj.problemSolved}
                  </p>
                </div>

                {/* Feature bullets */}
                <div className="space-y-1.5 text-xs text-slate-550">
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block text-left font-bold">Key System Assets</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pl-1 font-sans font-medium">
                    {proj.features.slice(0, 4).map((f, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px] text-left">
                        <span className="w-1.5 h-1.5 rounded-sm bg-blue-600" />
                        <span className="line-clamp-1">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.technologiesUsed.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-mono rounded font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 font-mono text-[10px]">
                <button
                  onClick={() => handleOpenDetails(proj)}
                  className="flex-1 py-2 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 font-bold transition duration-150 flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  id={`view-details-btn-${proj.id}`}
                >
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Details</span>
                </button>

                {proj.caseStudy ? (
                  <button
                    onClick={() => handleOpenCaseStudy(proj)}
                    className="flex-1 py-2 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 font-bold transition duration-150 flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                    id={`case-study-btn-${proj.id}`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Case Study</span>
                  </button>
                ) : (
                  <div className="flex-1 text-center py-2 text-slate-400 border border-slate-100 bg-slate-50 rounded-md font-bold">
                    No Case Study
                  </div>
                )}

                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-350 hover:bg-slate-55 flex items-center justify-center"
                    id={`live-btn-${proj.id}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  </a>
                )}

                {proj.gitHubUrl && (
                  <a
                    href={proj.gitHubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-950 hover:border-slate-350 hover:bg-slate-55 flex items-center justify-center"
                    id={`github-btn-${proj.id}`}
                  >
                    <GitBranch className="w-3.5 h-3.5 text-blue-600" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Study Slide-over Panel standard overlay */}
      {activeCaseStudy && activeCaseStudy.caseStudy && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-md p-0 select-none animate-fadeIn">
          <div
            className="w-full max-w-2xl bg-white border-l border-slate-200 h-full overflow-y-auto p-6 md:p-8 space-y-8 flex flex-col justify-between text-left shadow-2xl animate-slideOver"
            id="case-study-overlay-panel"
          >
            <div className="space-y-6">
              {/* Header block */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-1 border border-blue-200 rounded uppercase">CASE REPORT</span>
                  <span className="text-xs font-mono text-slate-400 font-bold">//ID-{activeCaseStudy.id}</span>
                </div>
                <button
                  onClick={() => setActiveCaseStudy(null)}
                  className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition duration-150 cursor-pointer"
                  id="close-case-study-btn"
                >
                  <X className="w-4 h-4 text-blue-600 font-black" />
                </button>
              </div>

              {/* Title group */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 font-bold">{activeCaseStudy.category.toUpperCase()} / COMPLETED {activeCaseStudy.completionDate}</span>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight leading-none">
                  {activeCaseStudy.name}
                </h2>
                <div className="flex flex-wrap gap-1 pt-1">
                  {activeCaseStudy.technologiesUsed.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-mono rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline list of case studies items */}
              <div className="space-y-6 pt-4 border-t border-slate-200 text-sm leading-relaxed text-slate-700">
                
                {/* 1. Challenge */}
                <div className="space-y-1.5 pl-4 border-l-2 border-blue-500 font-sans">
                  <h4 className="text-xs font-mono text-blue-700 font-bold uppercase tracking-wider">The Business Challenge</h4>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{activeCaseStudy.caseStudy.challenge}</p>
                </div>

                {/* 2. Goal */}
                <div className="space-y-1.5 pl-4 border-l border-slate-200 font-sans">
                  <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">Primary System Objectives</h4>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{activeCaseStudy.caseStudy.goal}</p>
                </div>

                {/* 3. Research */}
                <div className="space-y-1.5 pl-4 border-l border-slate-200 font-sans">
                  <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">Operational Discovery & Auditing</h4>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{activeCaseStudy.caseStudy.research}</p>
                </div>

                {/* 4. Design */}
                <div className="space-y-1.5 pl-4 border-l border-slate-200 font-sans">
                  <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">Grid Aesthetics & High-Fidelity Mockups</h4>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{activeCaseStudy.caseStudy.designProcess}</p>
                </div>

                {/* 5. Development */}
                <div className="space-y-1.5 pl-4 border-l border-slate-200 font-sans">
                  <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">System Integration & Coding</h4>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{activeCaseStudy.caseStudy.developmentProcess}</p>
                </div>

                {/* 6. Results */}
                <div className="space-y-1.5 pl-4 border-l-2 border-emerald-500 font-sans">
                  <h4 className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">Measurable Performance Outcomes</h4>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{activeCaseStudy.caseStudy.results}</p>
                </div>

                {/* 7. Lessons */}
                <div className="space-y-1.5 pl-4 border-l border-slate-200 font-sans">
                  <h4 className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">Critical Architectural Learnings</h4>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{activeCaseStudy.caseStudy.lessonsLearned}</p>
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold">ENGINE COMPILED // OK</span>
              <button
                onClick={() => setActiveCaseStudy(null)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase rounded-lg cursor-pointer"
                id="close-overlay-bottom-btn"
              >
                Conclude Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Slide-over Drawer Panel */}
      {activeDetails && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/45 dark:bg-black/60 backdrop-blur-md p-0 select-none animate-fadeIn">
          {/* Backdrop click to dismiss */}
          <div className="absolute inset-0 cursor-default" onClick={() => setActiveDetails(null)} />
          
          <div
            className="relative w-full max-w-xl bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-neutral-800 h-full overflow-y-auto p-6 md:p-8 space-y-7 flex flex-col justify-between text-left shadow-2xl animate-slideOver text-slate-900 dark:text-slate-100"
            id="project-details-drawer"
          >
            <div className="space-y-6">
              {/* Header block */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-indigo-750 dark:text-indigo-305 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 border border-indigo-200 dark:border-indigo-805 rounded uppercase">PROJECT ARCHIVE DETAILED METADATA</span>
                  <span className="text-xs font-mono text-slate-400 dark:text-neutral-500 font-bold">//ID-{activeDetails.id}</span>
                </div>
                <button
                  onClick={() => setActiveDetails(null)}
                  className="p-2 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-zinc-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition duration-150 cursor-pointer"
                  id="close-details-drawer-btn"
                >
                  <X className="w-4 h-4 text-indigo-650 dark:text-indigo-400 font-black" />
                </button>
              </div>

              {/* Title group */}
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">{activeDetails.category} / Completed {activeDetails.completionDate}</span>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                  {activeDetails.name}
                </h2>
              </div>

              {/* 1. Visual Project Lifecycle Timeline & Progress Bar */}
              <div className="bg-slate-50 dark:bg-zinc-900/40 border border-slate-200/90 dark:border-neutral-800/80 rounded-xl p-4 md:p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-indigo-650 dark:text-indigo-400" /> Lifecycle Milestone Tracker
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/45 text-indigo-800 dark:text-indigo-300 rounded-full border border-indigo-200/40 dark:border-indigo-800/30">
                    Stage: {activeDetails.projectStatus}
                  </span>
                </div>
                
                {/* Visual Roadmap track */}
                <div className="relative pt-2 pb-1.5 px-4 select-none">
                  {/* Background track line and child color filled active segment */}
                  <div className="absolute top-[21px] left-8 right-8 h-1 bg-slate-205 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500" 
                      style={{ width: `${(Math.min(currentStageIndex, 3) / 3) * 100}%` }}
                    />
                  </div>

                  {/* 4 Stage Nodes */}
                  <div className="flex justify-between items-center relative z-10">
                    {stages.map((stg, sIdx) => {
                      const isCompleted = sIdx < currentStageIndex;
                      const isActive = sIdx === currentStageIndex;
                      return (
                        <div key={sIdx} className="flex flex-col items-center group relative">
                          {/* Round progress indicator node */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono transition-all duration-300 border ${
                              isCompleted
                                ? "bg-indigo-600 dark:bg-indigo-505 border-indigo-700 dark:border-indigo-600 text-white shadow-sm"
                                : isActive
                                ? "bg-white dark:bg-zinc-950 border-indigo-600 dark:border-indigo-500 text-indigo-700 dark:text-indigo-400 ring-4 ring-indigo-100 dark:ring-indigo-950 shadow-md scale-110 font-bold"
                                : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-neutral-800 text-slate-400 dark:text-neutral-500 hover:border-slate-350 dark:hover:border-neutral-700"
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5 stroke-[3px]" />
                            ) : (
                              <span>{sIdx + 1}</span>
                            )}
                          </div>

                          {/* Node label text */}
                          <div className="text-center mt-2.5">
                            <span
                              className={`block text-[10px] font-bold tracking-tight transition duration-150 ${
                                isActive ? "text-indigo-955 dark:text-indigo-300 font-extrabold" : "text-slate-500 dark:text-neutral-450"
                              }`}
                            >
                              {stg.label}
                            </span>
                            <span className="hidden sm:block text-[8px] font-mono text-slate-400 dark:text-neutral-500 mt-0.5 whitespace-nowrap">
                              {stg.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Interactive Media Showcase Gallery (Screenshots, Diagrams, and Videos) */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-neutral-850 pb-1.5">
                  <Image className="w-3.5 h-3.5 text-indigo-650 dark:text-indigo-455" /> System Interactive Media Showcase
                </h3>
                
                {mediaItems.length > 0 && (
                  <div className="space-y-2.5">
                    {/* Main Frame Container */}
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-250 dark:border-neutral-800 shadow-md relative group">
                      {mediaItems[selectedMediaIdx]?.type === "video" ? (
                        <div className="w-full h-full relative bg-black">
                          <iframe
                            src={mediaItems[selectedMediaIdx].url}
                            title="Interactive Video Demo"
                            referrerPolicy="no-referrer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0 absolute inset-0"
                          />
                        </div>
                      ) : (
                        <img
                          src={mediaItems[selectedMediaIdx]?.url}
                          alt={mediaItems[selectedMediaIdx]?.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
                        />
                      )}
                      
                      {/* Media caption overlay tag */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-slate-900/85 backdrop-blur-sm rounded-lg text-[9px] text-white font-mono border border-white/10 flex items-center gap-1.5">
                        {mediaItems[selectedMediaIdx]?.type === "video" ? (
                          <Video className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        ) : (
                          <Image className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                        <span>{mediaItems[selectedMediaIdx]?.title || "Active Asset View"}</span>
                        <span className="text-slate-400">// {selectedMediaIdx + 1} of {mediaItems.length}</span>
                      </div>
                    </div>

                    {/* Miniature thumbnail stripe */}
                    {mediaItems.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {mediaItems.map((item, mIdx) => {
                          const isActive = mIdx === selectedMediaIdx;
                          return (
                            <button
                              key={mIdx}
                              onClick={() => setSelectedMediaIdx(mIdx)}
                              className={`relative aspect-video rounded-lg overflow-hidden bg-slate-900 border transition-all duration-150 cursor-pointer ${
                                isActive 
                                  ? "border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-150 dark:ring-indigo-950 scale-[1.025]" 
                                  : "border-slate-200 dark:border-neutral-800 opacity-80 hover:opacity-100 hover:border-slate-350 dark:hover:border-neutral-705 hover:scale-[1.01]"
                              }`}
                            >
                              <img
                                src={item.type === "video" ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop" : item.url}
                                alt={item.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                              {/* Overlay Indicator Icon */}
                              <div className="absolute inset-0 bg-slate-950/20 hover:bg-transparent flex items-center justify-center transition">
                                {item.type === "video" ? (
                                  <div className="p-1 rounded bg-rose-650 text-white shadow-xs">
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                  </div>
                                ) : (
                                  <div className="p-1 rounded bg-slate-900/50 text-white shadow-xs">
                                    <Image className="w-3.5 h-3.5" />
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Long-Form Summary Section */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-mono text-indigo-655 dark:text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-neutral-850 pb-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Executive Project Summary
                </h3>
                <p className="text-sm text-slate-650 dark:text-neutral-400 leading-relaxed font-sans font-medium text-left">
                  {activeDetails.longSummary || activeDetails.description}
                </p>
              </div>

              {/* Core Challenge */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-mono text-slate-505 dark:text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-neutral-850 pb-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Core Challenge Resolved
                </h3>
                <p className="text-sm text-slate-650 dark:text-neutral-400 leading-relaxed font-sans text-left">
                  {activeDetails.problemSolved}
                </p>
              </div>

              {/* Technologies Used Grid */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-slate-505 dark:text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-neutral-850 pb-1.5">
                  <span>System Architecture Stack</span>
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeDetails.technologiesUsed.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-850 border border-slate-200 dark:border-neutral-800 text-xs text-slate-700 dark:text-neutral-300 font-mono rounded-lg font-bold transition duration-150 cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Custom Classification Tags */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-slate-550 dark:text-neutral-405 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-neutral-850 pb-1.5">
                  <span>Metatags & Categorizations</span>
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeDetails.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-155 dark:border-indigo-900/30 text-xs text-indigo-750 dark:text-indigo-300 font-mono rounded-lg font-bold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono text-slate-505 dark:text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-neutral-850 pb-1.5">
                  <span>Primary Deliverables & Features</span>
                </h3>
                <ul className="space-y-2 text-xs md:text-sm text-slate-650 dark:text-neutral-400">
                  {activeDetails.features.map((feat, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-left">
                      <span className="w-2 h-2 mt-1.5 rounded-full bg-indigo-600 dark:bg-indigo-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="pt-6 border-t border-slate-200 dark:border-neutral-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-3">
                {activeDetails.liveUrl && (
                  <a
                    href={activeDetails.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-101 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-600 dark:text-neutral-405 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 font-bold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live URL</span>
                  </a>
                )}
                {activeDetails.gitHubUrl && (
                  <a
                    href={activeDetails.gitHubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-neutral-800 rounded-lg text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 font-bold"
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
              <button
                onClick={() => setActiveDetails(null)}
                className="px-5 py-2.5 bg-slate-900 dark:bg-zinc-900 hover:bg-slate-800 dark:hover:bg-zinc-800 text-white font-bold text-[10px] uppercase rounded-lg cursor-pointer transition duration-150 text-center"
                id="close-details-drawer-bottom-btn"
              >
                Conclude Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
