import React, { useState, useMemo } from "react";
import { Search, Calendar, Clock, User, ArrowLeft, ArrowRight, Eye, Shield, Globe, Sparkles, Share2, BookOpen } from "lucide-react";
import { Article, CustomizationSettings } from "../types";

interface WritingHubProps {
  articles: Article[];
  onReadIncrement: (id: string) => void;
  customization?: CustomizationSettings;
}

export default function WritingHub({ articles, onReadIncrement, customization }: WritingHubProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Articles" | "News" | "Research" | "Opinions" | "Guides" | "Case Studies">("All");
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const categories = ["All", "Articles", "News", "Research", "Opinions", "Guides", "Case Studies"] as const;

  // Sync / select active article
  const activeArticle = useMemo(() => {
    return articles.find(a => a.id === activeArticleId);
  }, [articles, activeArticleId]);

  // Featured article is the latest published one
  const featuredArticle = useMemo(() => {
    if (articles.length === 0) return null;
    return articles[articles.length - 1];
  }, [articles]);

  // Filter rest of articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            art.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            art.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = activeCategory === "All" || art.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, activeCategory]);

  const handleOpenArticle = (id: string) => {
    setActiveArticleId(id);
    onReadIncrement(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareTooltip(true);
    setTimeout(() => {
      setShowShareTooltip(false);
    }, 2000);
  };

  // Custom typography high-fidelity renderer
  const renderArticleContent = (content: string) => {
    if (!content) return null;
    const lines = content.split("\n");
    let currentListItems: string[] = [];
    const elements: React.ReactNode[] = [];

    const flushList = (key: string) => {
      if (currentListItems.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="list-disc pl-6 my-5 space-y-2.5 text-slate-700 text-sm md:text-base border-l border-slate-200 last:mb-0 font-sans font-medium">
            {currentListItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed relative pl-1 text-slate-650">
                {item}
              </li>
            ))}
          </ul>
        );
        currentListItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Empty lines
      if (trimmed === "") {
        flushList(`empty-${index}`);
        return;
      }

      // Main Heading 1
      if (trimmed.startsWith("# ")) {
        flushList(`h1-${index}`);
        elements.push(
          <h1 key={index} className="text-2xl md:text-3.5xl font-display font-extrabold text-slate-900 mt-10 mb-5 tracking-tight leading-tight">
            {trimmed.substring(2)}
          </h1>
        );
      }
      // Section Heading 2
      else if (trimmed.startsWith("## ")) {
        flushList(`h2-${index}`);
        elements.push(
          <h2 key={index} className="text-xl md:text-2xl font-display font-extrabold text-slate-950 mt-9 mb-4 border-b border-slate-200 pb-2.5 tracking-tight">
            {trimmed.substring(3)}
          </h2>
        );
      }
      // Subsection Heading 3
      else if (trimmed.startsWith("### ")) {
        flushList(`h3-${index}`);
        elements.push(
          <h3 key={index} className="text-base md:text-lg font-mono font-bold text-blue-700 mt-7 mb-3 tracking-wider uppercase">
            {trimmed.substring(4)}
          </h3>
        );
      }
      // Lists (unordered)
      else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        currentListItems.push(trimmed.substring(2));
      }
      // Blocks / blockquotes
      else if (trimmed.startsWith("> ")) {
        flushList(`blockquote-${index}`);
        elements.push(
          <div key={index} className="pl-4 py-2 bg-blue-50 border-l-2 border-blue-600 my-6 rounded-r font-sans">
            <p className="text-xs md:text-sm font-semibold text-blue-800 italic leading-relaxed">
              {trimmed.substring(2)}
            </p>
          </div>
        );
      }
      // Regular paragraphs
      else {
        flushList(`par-${index}`);
        elements.push(
          <p key={index} className="text-slate-600 text-sm md:text-base leading-relaxed md:leading-loose text-left mb-5 font-sans font-medium">
            {trimmed}
          </p>
        );
      }
    });

    flushList("final");
    return elements;
  };

  return (
    <div className="space-y-10 text-left text-slate-800">
      {activeArticle ? (
        /* ==================== 1. DETAIL ARTICLE READER VIEW ==================== */
        <div className="space-y-8 animate-fadeIn">
          {/* Back Action Header */}
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <button
              onClick={() => setActiveArticleId(null)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-205 rounded-lg text-xs font-mono text-slate-650 hover:text-slate-950 hover:border-slate-350 transition duration-150 flex items-center gap-2 cursor-pointer font-bold shadow-xs"
              id="back-to-writing-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-650" />
              <span>Back to Publishing Hub</span>
            </button>

            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2.5 bg-white border border-slate-200 rounded-lg hover:border-slate-350 text-slate-600 hover:text-slate-900 transition cursor-pointer shadow-xs"
                title="Copy canonical link to clipboard"
              >
                <Share2 className="w-4 h-4 text-blue-600" />
              </button>
              {showShareTooltip && (
                <span className="absolute right-0 -bottom-8 bg-slate-900 border border-slate-750 text-blue-200 font-mono text-[9px] px-2 py-1 rounded whitespace-nowrap z-30 font-bold">
                  URL copied to clipboard
                </span>
              )}
            </div>
          </div>

          {/* Broad Core Reader Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content Pad (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Premium Hero Banner Cover */}
              <div className="aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative shadow-md">
                <img
                  src={activeArticle.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop"}
                  alt={activeArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <span className="px-2.5 py-1.5 bg-slate-900/90 border border-slate-700 text-blue-300 font-extrabold text-[9px] uppercase tracking-wider rounded font-mono">
                    {activeArticle.category}
                  </span>
                </div>
              </div>

              {/* Title & Micro Metadata Grid */}
              <div className="space-y-4 pb-5 border-b border-slate-200">
                <h1 className="text-2xl md:text-4xl font-display font-extrabold text-slate-950 tracking-tight leading-tight">
                  {activeArticle.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-455 font-mono font-bold">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold text-slate-700">Waid Soko</span>
                  </div>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-650" />
                    <span>{activeArticle.date}</span>
                  </div>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-650" />
                    <span>{activeArticle.readingTime}</span>
                  </div>
                  <span className="text-slate-300 hidden sm:inline">|</span>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeArticle.views} Reads</span>
                  </div>
                </div>
              </div>

              {/* Parsed Elegant Body Typography */}
              <div className="font-sans antialiased text-left">
                {renderArticleContent(activeArticle.content)}
              </div>

              {/* Footer Meta Tags */}
              <div className="flex flex-wrap gap-1.5 pt-6 border-t border-slate-200">
                {activeArticle.tags.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-[11px] text-slate-600 hover:text-slate-900 font-mono font-bold rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right SEO Metadata Inspect Panel (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs text-left">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-150">
                <Globe className="w-3.5 h-3.5 text-blue-600 font-bold" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Google SEO Node Insights</h3>
              </div>
              
              <div className="space-y-3.5 text-[11px] font-mono">
                <div className="space-y-1">
                  <span className="text-slate-400 uppercase text-[9px] tracking-wider block font-bold">Meta Title Tag</span>
                  <div className="text-slate-850 p-2.5 bg-slate-50 rounded-lg text-[11px] leading-normal font-semibold border border-slate-200">
                    {activeArticle.metaTitle || `${activeArticle.title} | AfriWaid Portfolio`}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 uppercase text-[9px] tracking-wider block font-bold">Meta Description Snip</span>
                  <div className="text-slate-650 p-2.5 bg-slate-50 rounded-lg text-[11px] leading-relaxed border border-slate-200 font-medium font-sans">
                    {activeArticle.metaDescription || activeArticle.description}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 uppercase text-[9px] tracking-wider block font-bold">Autogenerated Canonical Slug</span>
                  <div className="text-blue-700 p-2 bg-blue-50 border border-blue-200 rounded-lg text-[10px] break-all font-bold">
                    /writing/{activeArticle.slug}
                  </div>
                </div>

                {activeArticle.keywords && activeArticle.keywords.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-slate-400 uppercase text-[9px] tracking-wider block font-bold">Indexed Google Keywords</span>
                    <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      {activeArticle.keywords.map((kw, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 text-[10px] rounded font-semibold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-emerald-50 rounded-md border border-emerald-250 text-emerald-700 flex items-center gap-1.5 text-[10px] font-bold">
                  <Shield className="w-3.5 h-3.5 text-emerald-600 font-black" />
                  <span>CRAWLED INSTANTLY: STATE SYNC ACTIVE</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* ==================== 2. CATALOG PUBLISHING OVERVIEW ==================== */
        <div className="space-y-8 animate-fadeIn">
          
          {/* Header & Categories Selector */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-3xl font-display font-extrabold text-slate-950 tracking-tight flex items-center gap-1.5">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <span>{customization?.writingTitle || "Writing & Analytics Hub"}</span>
              </h1>
              <p className="text-[10px] text-slate-450 font-mono mt-1 uppercase tracking-wider font-semibold">
                {customization?.writingSubtitle || "Original research, deep technical deep-dives, and technical opinions"}
              </p>
            </div>

            {/* Selection quick pills */}
            <div className="flex flex-wrap gap-1 bg-slate-100 p-1 border border-slate-200 rounded-lg max-w-full overflow-x-auto no-scrollbar self-start">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-mono transition duration-150 whitespace-nowrap uppercase tracking-wider font-bold cursor-pointer ${
                    activeCategory === cat 
                      ? "bg-slate-900 text-white shadow-xs" 
                      : "text-slate-605 hover:text-slate-950 hover:bg-slate-200"
                  }`}
                  id={`article-cat-${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="relative max-w-md font-sans">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-slate-450" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, keyword elements, or content details..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 transition"
              id="article-search-input"
            />
          </div>

          {/* SPOTLIGHT HERO STORY (Only visible when filtering 'All' with no specific term) */}
          {activeCategory === "All" && !searchTerm.trim() && featuredArticle && (
            <div 
              onClick={() => handleOpenArticle(featuredArticle.id)}
              className="group cursor-pointer relative rounded-2xl border border-slate-201 bg-white p-6 md:p-8 hover:border-blue-400/30 hover:shadow-lg transition duration-350 shadow-md overflow-hidden flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 items-center"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/5 to-purple-600/5 blur-3xl rounded-full pointer-events-none" />
              
              {/* spotlight image */}
              <div className="md:col-span-5 w-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src={featuredArticle.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"}
                  alt={featuredArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-101 transition duration-550"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/90 text-[8px] font-mono text-blue-300 rounded font-bold border border-slate-700 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-blue-400 animate-spin" />
                  <span>Featured Insight</span>
                </span>
              </div>

              {/* spotlight content */}
              <div className="md:col-span-7 space-y-4 text-left w-full">
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono font-bold">
                  <span className="px-2 py-0.5 bg-blue-50 border border-blue-250 text-blue-700 text-[9px] font-extrabold uppercase rounded">
                    {featuredArticle.category}
                  </span>
                  <span>•</span>
                  <span>{featuredArticle.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold"><Clock className="w-3.5 h-3.5 text-blue-600" /> {featuredArticle.readingTime}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 group-hover:text-blue-605 transition leading-snug">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-sans line-clamp-3">
                    {featuredArticle.description}
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-between text-[11px] text-slate-450 font-mono border-t border-slate-100">
                  <span className="uppercase font-bold">Views: <span className="text-slate-900 font-extrabold">{featuredArticle.views}</span></span>
                  <span className="text-blue-600 flex items-center gap-1 font-extrabold group-hover:translate-x-1.5 transition duration-150 uppercase tracking-wider text-[10px]">
                    Read Spotlight Story <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* GRID OF REMAINING ARTICLES / CARDS */}
          <div>
            {activeCategory === "All" && !searchTerm.trim() && articles.length > 1 && (
              <h2 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-4 font-bold text-left">Latest publishing archives</h2>
            )}

            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 p-6 rounded-xl border border-slate-200 bg-white shadow-xs">
                <p className="text-xs text-slate-400 font-mono">No matching records found inside our intellectual vault.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles
                  .filter(art => activeCategory !== "All" || searchTerm.trim() !== "" || !featuredArticle || art.id !== featuredArticle.id)
                  .reverse() // show latest first
                  .map((art) => (
                    <div
                       key={art.id}
                       onClick={() => handleOpenArticle(art.id)}
                       className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 hover:border-blue-400/30 hover:shadow-lg transition duration-300 flex flex-col justify-between shadow-xs mb-1"
                    >
                      <div className="space-y-3.5">
                        {/* Widescreen Thumbnail aspect ratio */}
                        <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-slate-100 border border-slate-200 relative">
                          <img
                            src={art.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop"}
                            alt={art.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover opacity-95 group-hover:scale-[1.01] transition duration-550"
                          />
                          <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-slate-900/90 text-[8px] text-blue-300 font-mono rounded border border-slate-705 font-bold uppercase tracking-widest">
                            {art.category}
                          </span>
                        </div>

                        {/* Metas */}
                        <div className="flex items-center gap-3 text-[10px] text-slate-450 font-mono font-bold">
                          <span className="text-slate-600">{art.date}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" /> {art.readingTime}</span>
                        </div>

                        {/* Heading & short description */}
                        <div className="space-y-1.5 text-left">
                          <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
                            {art.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 font-sans">
                            {art.description}
                          </p>
                        </div>
                      </div>

                      {/* Read Link footer alignment */}
                      <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold">
                        <span>READS: {art.views}</span>
                        <span className="text-blue-600 group-hover:translate-x-1.5 transition duration-150 flex items-center gap-1 font-extrabold uppercase tracking-wider">
                          Open Content <ArrowRight className="w-3 h-3 text-blue-500" />
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
