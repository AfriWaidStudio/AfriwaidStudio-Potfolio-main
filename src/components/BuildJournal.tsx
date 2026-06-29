import React, { useState, useEffect } from "react";
import { GitCommit, Settings, Compass, Code, Brain, Link, X, Maximize2, Search, ArrowUpDown, Calendar } from "lucide-react";
import { JournalEntry, CustomizationSettings } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface BuildJournalProps {
  entries: JournalEntry[];
  customization?: CustomizationSettings;
}

export default function BuildJournal({ entries, customization }: BuildJournalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort entries (newest or oldest timeline order)
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
  });

  // Instant action to jump to the first post ever (Oldest history)
  const handleJumpToFirstPost = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortOrder("oldest");
    
    // Quick hardware animation to top of timeline
    setTimeout(() => {
      const el = document.getElementById("journal-timeline-start");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 70);
  };

  // Close light box on Escape press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "deployment":
        return <Code className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case "update":
        return <Settings className="w-4 h-4 text-blue-600 dark:text-cyan-400" />;
      case "design":
        return <Compass className="w-4 h-4 text-pink-600 dark:text-pink-400" />;
      case "ai":
        return <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <GitCommit className="w-4 h-4 text-slate-550 dark:text-zinc-400" />;
    }
  };

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case "deployment":
        return "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400";
      case "update":
        return "border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-cyan-405";
      case "design":
        return "border-pink-200 dark:border-pink-900/40 bg-pink-50 dark:bg-pink-950/20 text-pink-700 dark:text-pink-400";
      case "ai":
        return "border-purple-200 dark:border-purple-900/40 bg-purple-50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400";
      default:
        return "border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-slate-650 dark:text-zinc-400";
    }
  };

  return (
    <div className="space-y-12 text-slate-800">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-205 bg-blue-50 text-blue-700 dark:border-cyan-900/40 dark:bg-cyan-950/25 dark:text-cyan-400 text-xs font-mono tracking-widest uppercase align-middle font-bold">
          <GitCommit className="w-3.5 h-3.5 animate-pulse text-blue-600 dark:text-cyan-405" />
          {customization?.journalTagline || "Active Developer Logs & System Milestones"}
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-950 dark:text-white tracking-tight leading-none">
          {customization?.journalTitle || "The AfriWaid Build Journal"}
        </h1>
        <p className="text-slate-550 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
          {customization?.journalDescription || "Follow our transparent engineering roadmap. We push frequent hot-fixes, core architectural developments, spatial animations, and machine learning structures to the active sandbox stack."}
        </p>
      </div>

      {/* Search and Filters Controller Dashboard */}
      <div className="max-w-2xl mx-auto bg-slate-50/70 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4 md:p-5 space-y-4 shadow-sm">
        {/* Search Input and Sort control */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="relative md:col-span-8">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search commits, milestones, tags, dates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder-slate-400 dark:placeholder-zinc-500 transition-all font-sans"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition duration-150"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="md:col-span-4 flex gap-2">
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 text-xs font-mono font-bold hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all cursor-pointer shadow-xs whitespace-nowrap"
              title="Toggle timeline chron order"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
              <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
            </button>
          </div>
        </div>

        {/* Category Filters row and Quick jump to first-post */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1.5 border-t border-slate-200/50 dark:border-zinc-800/50">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-550 font-bold uppercase tracking-wider select-none mr-1">
              Filter:
            </span>
            {(["all", "deployment", "update", "design", "ai"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-0.5 rounded-lg text-xs font-mono font-extrabold transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 dark:bg-cyan-500 text-white border-blue-600 dark:border-cyan-550 shadow-xs"
                    : "bg-white dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleJumpToFirstPost}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-lg border border-dashed border-blue-300 dark:border-cyan-800/80 bg-blue-50/40 dark:bg-cyan-950/20 text-blue-700 dark:text-cyan-400 text-xs font-mono transition-all hover:bg-blue-50/80 dark:hover:bg-cyan-950/40 font-bold cursor-pointer"
            title="Instantly display the first log ever posted in AfriWaid history"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span>First Post Ever</span>
          </button>
        </div>

        {/* Status banner with item counts */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
          <span>
            Displaying <strong className="text-slate-800 dark:text-zinc-200">{filteredEntries.length}</strong> of{" "}
            <strong className="text-slate-800 dark:text-zinc-200">{entries.length}</strong> system logs
          </span>
          {(searchTerm || selectedCategory !== "all" || sortOrder !== "newest") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSortOrder("newest");
              }}
              className="text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Anchor marker for smooth scrolling */}
      <div id="journal-timeline-start" className="scroll-mt-24 h-px w-full" />

      {sortedEntries.length === 0 ? (
        <div className="max-w-2xl mx-auto rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 p-12 text-center space-y-4 bg-white dark:bg-zinc-900/20">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 dark:bg-zinc-900 text-slate-400 dark:text-zinc-500">
            <Search className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-155">No logs match your filter criteria</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto font-sans leading-relaxed">
              We couldn't find any development logs containing "{searchTerm}" in the "{selectedCategory}" pipeline.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSortOrder("newest");
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold cursor-pointer border border-transparent shadow-sm"
          >
            Clear Search &amp; Reset Filters
          </button>
        </div>
      ) : (
        /* Timeline core */
        <div className="relative max-w-2xl mx-auto pl-6 md:pl-8 border-l border-slate-200 dark:border-zinc-800 space-y-8 font-sans">
          {sortedEntries.map((entry, idx) => {
            const isFirst = idx === 0;
          return (
            <div key={entry.id} className="relative space-y-3">
              {/* Timeline marker node */}
              <div className={`absolute -left-[31px] md:-left-[39px] w-4 h-4 rounded-full flex items-center justify-center border z-10 ${
                isFirst ? "bg-blue-600 border-blue-600 dark:bg-cyan-500 dark:border-cyan-500 ring-4 ring-blue-105 dark:ring-cyan-950" : "bg-white dark:bg-zinc-950 border-slate-300 dark:border-zinc-700"
              }`}>
                {isFirst && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>

              {/* Data block */}
              <div className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-5 space-y-3 hover:border-blue-400 dark:hover:border-cyan-500/80 hover:shadow-md transition duration-150 shadow-xs text-left w-full">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs text-blue-700 dark:text-cyan-400 font-mono font-extrabold">{entry.date}</span>
                  
                  {/* Category badge */}
                  <span className={`px-2.5 py-0.5 rounded-md border text-[9px] font-mono uppercase tracking-wider flex items-center gap-1.5 font-bold ${getCategoryTheme(entry.category)}`}>
                    {getCategoryIcon(entry.category)}
                    <span>{entry.category}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                    {entry.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed pr-1 font-sans">
                    {entry.description}
                  </p>
                </div>

                {/* Optional clickable images */}
                {entry.images && entry.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-1 pb-1">
                    {entry.images.map((imgUrl, imgIdx) => (
                      <button
                        key={imgIdx}
                        type="button"
                        onClick={() => setSelectedImage(imgUrl)}
                        className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-100 cursor-zoom-in group text-left outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        title="Click to expand snapshot"
                      >
                        <img
                          src={imgUrl}
                          alt="Supporting journal snapshot"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-[1.03] transition duration-200"
                        />
                        {/* Interactive Zoom Overlay */}
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-200">
                          <span className="inline-flex items-center gap-1 bg-white/90 text-slate-900 text-[10px] font-mono font-extrabold px-2.5 py-1 rounded shadow-md transform scale-90 group-hover:scale-100 transition duration-200">
                            <Maximize2 className="w-3 h-3 text-blue-600" />
                            Expand View
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Optional links */}
                {entry.links && entry.links.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-zinc-850">
                    {entry.links.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.url}
                        onClick={(e) => {
                          if (link.url.startsWith("#")) {
                            e.preventDefault();
                            window.dispatchEvent(new CustomEvent("app:goto-tab", { detail: link.url.substring(1) }));
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-[10px] text-blue-600 hover:text-blue-800 dark:text-cyan-400 dark:hover:text-cyan-300 font-mono transition duration-150 font-bold bg-slate-100 dark:bg-zinc-900 px-2.5 py-1 rounded border border-slate-200 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-cyan-500"
                        id={`journal-link-${entry.id}-${lIdx}`}
                      >
                        <Link className="w-3 h-3 text-blue-500 dark:text-cyan-400" />
                        <span>{link.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Lightbox / Picture Overlay System */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 md:p-8 cursor-zoom-out"
          >
            {/* Close controls */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-800 transition shadow-lg cursor-pointer"
              title="Close image overlay (Esc)"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Inner frame */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // retain modal click propagation boundaries
              className="relative max-w-5xl max-h-[85vh] rounded-xl overflow-hidden shadow-2xl bg-neutral-950 border border-neutral-800"
            >
              <img
                src={selectedImage}
                alt="Expanded view snapshot"
                className="w-full h-auto max-h-[85vh] object-contain block mx-auto rounded-lg"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute bottom-3 left-4 text-[9px] font-mono tracking-wider font-extrabold uppercase bg-black/75 px-3 py-1 text-slate-300 rounded border border-white/5 shadow-xs">
                Studio Artifact View
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
