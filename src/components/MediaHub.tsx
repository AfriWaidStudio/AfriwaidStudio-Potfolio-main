import React, { useState } from "react";
import { Play, Film, Clock, ExternalLink, X, Sparkles } from "lucide-react";
import { MediaItem, CustomizationSettings } from "../types";

interface MediaHubProps {
  mediaItems: MediaItem[];
  onPlayIncrement: (id: string) => void;
  customization?: CustomizationSettings;
}

export default function MediaHub({ mediaItems, onPlayIncrement, customization }: MediaHubProps) {
  const [activeCategory, setActiveCategory] = useState<"All" | "Videos" | "Reels" | "Motion Graphics" | "Interviews" | "Productions">("All");
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);

  const categories = ["All", "Videos", "Reels", "Motion Graphics", "Interviews", "Productions"] as const;

  const filteredMedia = activeCategory === "All"
    ? mediaItems
    : mediaItems.filter(item => item.category === activeCategory);

  const handleOpenVideo = (item: MediaItem) => {
    setActiveVideo(item);
    onPlayIncrement(item.id);
  };

  return (
    <div className="space-y-8 text-left text-slate-800">
      {/* Search & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-950 tracking-tight">
            {customization?.mediaTitle || "Media Production Hub"}
          </h1>
          <p className="text-xs text-slate-400 font-mono font-semibold">
            {customization?.mediaSubtitle || "CINEMATIC DIGITAL ENG ENGAGEMENTS"}
          </p>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 border border-slate-205 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition duration-155 cursor-pointer font-bold ${activeCategory === cat ? "bg-slate-900 text-white font-bold shadow-xs" : "text-slate-650 hover:text-slate-905"}`}
              id={`media-cat-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredMedia.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-xl border border-slate-200 bg-white shadow-xs animate-fadeIn">
          <p className="text-sm text-slate-400 font-mono">No media productions are currently cataloged in this classification.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenVideo(item)}
              className="group cursor-pointer rounded-xl overflow-hidden border border-slate-202 bg-white hover:border-blue-400/30 hover:shadow-md transition duration-300 flex flex-col justify-between shadow-xs"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video overflow-hidden bg-slate-100 border-b border-slate-100">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />

                {/* Duration indicator */}
                <span className="absolute bottom-3 right-3 px-2 py-0.5 bg-slate-900/80 border border-slate-700 text-[10px] text-slate-100 font-mono rounded flex items-center gap-1 font-bold">
                  <Clock className="w-3 h-3 text-blue-400" />
                  {item.duration}
                </span>

                {/* Play Button Indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition duration-300 border border-blue-500/10">
                    <Play className="w-5 h-5 fill-white pl-0.5" />
                  </div>
                </div>

                {/* Category label */}
                <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-slate-900/90 border border-slate-705 text-[9px] text-blue-300 font-mono uppercase tracking-wider rounded font-bold">
                  {item.category}
                </span>
              </div>

              {/* Text metadata */}
              <div className="p-4 space-y-2 text-left">
                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition duration-150 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono font-bold">
                  <span>VIEWS: {item.views}</span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition duration-150 flex items-center gap-1 font-extrabold uppercase">
                    PLAY REEL <ExternalLink className="w-3 h-3 text-blue-500" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cinematic Modal Player Lightbox */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 p-5 pt-16 md:p-6 md:pt-14 space-y-4 shadow-2xl animate-scaleUp text-slate-900 dark:text-white">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900 text-slate-500 dark:text-neutral-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition duration-150 cursor-pointer shadow-sm flex items-center gap-1"
              id="close-lightbox-btn"
              title="Close Player"
            >
              <X className="w-4 h-4 text-blue-600 dark:text-cyan-400 font-extrabold" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase pr-1">Close</span>
            </button>

            {/* Video Canvas Dummy Play System */}
            <div className="w-full aspect-video rounded-xl bg-slate-900 relative overflow-hidden border border-slate-805 flex flex-col justify-between p-4 md:p-6">
              <div className="flex items-center justify-between text-[10px] md:text-xs font-mono text-slate-400">
                <div className="flex items-center gap-1.5 font-bold">
                  <Film className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                  <span>AFRIWAID CINEMATIC ENGINE</span>
                </div>
                <span className="hidden sm:inline">STREAM CODE//MP4_24K_AUDIO</span>
              </div>

              {/* Central Player UI */}
              <div className="flex flex-col items-center gap-3 text-center self-center py-4 md:py-8">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl border border-blue-500/20 bg-blue-500/10 flex items-center justify-center text-blue-400 animate-pulse">
                  <Play className="w-5 h-5 md:w-6 md:h-6 fill-blue-400 pl-0.5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-white text-sm md:text-base font-display font-medium">Ready to Stream via Redirection</h4>
                  <p className="text-slate-400 text-[10px] md:text-xs mt-1">Due to context limits. Open standard video player below.</p>
                </div>
                <a
                  href={activeVideo.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-705 text-white font-bold text-[10px] md:text-xs rounded-lg transition duration-150 flex items-center gap-1.5 mt-2 shadow-lg cursor-pointer"
                  id="external-stream-link"
                >
                  Confirm External Stream <ExternalLink className="w-3 h-3 text-white" />
                </a>
              </div>

              {/* Bottom Track Simulator */}
              <div className="space-y-2">
                <div className="w-full h-1 bg-slate-850 rounded overflow-hidden">
                  <div className="bg-blue-600 h-full w-2/5 animate-[pulse_3s_infinite]" />
                </div>
                <div className="flex items-center justify-between text-[9px] md:text-[10px] text-slate-400 font-mono">
                  <span>0:00 / {activeVideo.duration}</span>
                  <span>STEREO 48k</span>
                </div>
              </div>
            </div>

            {/* Video Stats info */}
            <div className="text-left space-y-1.5 font-sans">
              <span className="px-2.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-[10px] text-blue-700 dark:text-blue-300 font-mono border border-blue-200 dark:border-blue-900/40 inline-block uppercase font-bold tracking-wider">
                {activeVideo.category}
              </span>
              <h3 className="text-base md:text-lg font-display text-slate-900 dark:text-white font-extrabold">{activeVideo.title}</h3>
              <p className="text-xs md:text-sm text-slate-500 dark:text-neutral-400 leading-relaxed font-medium">{activeVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
