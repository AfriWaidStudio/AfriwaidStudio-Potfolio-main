import React from "react";
import { CheckCircle } from "lucide-react";

export interface RoadmapItem {
  id: string;
  title: string;
  category: string;
  priority: "Blocker" | "High" | "Standard";
  status: "Proposed" | "Queued" | "In Sprint" | "Resolved";
  date: string;
}

interface AdvisoryRoadmapProps {
  roadmapTickets: RoadmapItem[];
  adviceText: string;
  setAdviceText: (txt: string) => void;
  adviceCategory: string;
  setAdviceCategory: (cat: string) => void;
  advicePriority: "Blocker" | "High" | "Standard";
  setAdvicePriority: (priority: "Blocker" | "High" | "Standard") => void;
  handlePublishAdvice: (e: React.FormEvent) => void;
  adviceSuccess: boolean;
}

export default function AdvisoryRoadmap({
  roadmapTickets,
  adviceText,
  setAdviceText,
  adviceCategory,
  setAdviceCategory,
  advicePriority,
  setAdvicePriority,
  handlePublishAdvice,
  adviceSuccess
}: AdvisoryRoadmapProps) {
  return (
    <div className="space-y-8 animate-fadeIn text-left">
      
      {/* Submission visual success indicator */}
      {adviceSuccess && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-mono">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Your suggestion was successfully submitted and mapped onto our stand-up Roadmap stream.</span>
        </div>
      )}

      {/* TWO PANEL REPORT MODULE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* Left pane: Submit target feedback loop - 5 cols */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-zinc-950/40 border border-slate-200 dark:border-neutral-900 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-200 dark:border-zinc-900 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-widest">Advisory Loop Submission</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-sans">Define feature upgrades, design criteria targets, or security audits directly.</p>
          </div>

          <form onSubmit={handlePublishAdvice} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-mono font-bold">Advisory Task Specification</label>
              <textarea
                required
                rows={4}
                value={adviceText}
                onChange={(e) => setAdviceText(e.target.value)}
                placeholder="Detail the sprint modifications or design adjustments our engineering team must evaluate..."
                className="w-full p-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 text-xs text-left focus:outline-none focus:border-cyan-500/50 transition-colors font-sans leading-relaxed"
                id="advisory-feedback-textarea"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-mono font-bold">Category</label>
                <select
                  value={adviceCategory}
                  onChange={(e) => setAdviceCategory(e.target.value)}
                  className="w-full p-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500 font-sans"
                >
                  <option>Feature Proposal</option>
                  <option>UI Refinement</option>
                  <option>Database Optimization</option>
                  <option>Security SLA Audit</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-mono font-bold">Priority Status</label>
                <select
                  value={advicePriority}
                  onChange={(e) => setAdvicePriority(e.target.value as any)}
                  className="w-full p-2.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500 font-sans"
                >
                  <option>Blocker</option>
                  <option>High</option>
                  <option>Standard</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold uppercase tracking-wider rounded-xl transition duration-150 cursor-pointer shadow hover:shadow-cyan-500/10 active:scale-98 text-xs"
              id="advisory-submit-btn"
            >
              Transmit Sprint Advisory
            </button>
          </form>
        </div>

        {/* Right pane: Continuous Standup roadmap - 7 cols */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-zinc-950/40 border border-slate-200 dark:border-neutral-900 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-200 dark:border-zinc-900 pb-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-widest">Engineering Roadmap Loop</h3>
            <p className="text-[10px] text-slate-500 mt-0.5 font-sans">Slicing backlog tickets by agile priorities and engineering validation status.</p>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
            {roadmapTickets.map((tc) => (
              <div key={tc.id} className="p-3.5 bg-white dark:bg-zinc-955 border border-slate-200 dark:border-zinc-900 rounded-xl flex items-center justify-between gap-4 font-sans hover:border-cyan-500/25 transition">
                <div className="text-left space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">{tc.category}</span>
                    <span className={`text-[8px] font-mono font-black uppercase px-1 rounded ${
                      tc.priority === "Blocker" ? "bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse" :
                      tc.priority === "High" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                      "bg-slate-200 dark:bg-zinc-805 text-slate-650 dark:text-zinc-400"
                    }`}>
                      {tc.priority} Priority
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-zinc-200 leading-snug truncate text-xs" title={tc.title}>{tc.title}</h4>
                  <span className="text-[9px] text-slate-400 block font-mono">Reported on {tc.date}</span>
                </div>

                <span className={`shrink-0 px-2.5 py-1 rounded text-[8.5px] font-mono font-bold uppercase border ${
                  tc.status === "Resolved" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" :
                  tc.status === "In Sprint" ? "bg-purple-500/10 border-purple-500/30 text-purple-500 animate-pulse" :
                  tc.status === "Queued" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-500" :
                  "bg-slate-100 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-500"
                }`}>
                  {tc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>              

    </div>
  );
}
