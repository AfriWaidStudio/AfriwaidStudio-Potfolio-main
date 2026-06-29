import React from "react";
import { Plus, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import { ClientProfile } from "../../types";

export interface KanbanTask {
  id: string;
  label: string;
  completed: boolean;
  column: "backlog" | "in_development" | "qa" | "completed";
  phase: string;
}

interface KanbanSprintProps {
  tasks: KanbanTask[];
  cycleTaskColumn: (taskId: string) => void;
  customTaskInput: string;
  setCustomTaskInput: (val: string) => void;
  handleAddCustomTask: (e: React.FormEvent) => void;
  uploadedFileIndicator: string | null;
  uploading: boolean;
  uploadFileName: string;
  uploadProgress: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUploadInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loggedInClient: ClientProfile;
}

export default function KanbanSprint({
  tasks,
  cycleTaskColumn,
  customTaskInput,
  setCustomTaskInput,
  handleAddCustomTask,
  uploadedFileIndicator,
  uploading,
  uploadFileName,
  uploadProgress,
  fileInputRef,
  handleFileUploadInput,
  loggedInClient
}: KanbanSprintProps) {
  return (
    <div className="space-y-8 animate-fadeIn text-left">
      {/* STATUS LOG MESSAGE */}
      {uploadedFileIndicator && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2 font-mono">
          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Success Uploaded Document: <strong className="font-extrabold">{uploadedFileIndicator}</strong> system is indexing...</span>
        </div>
      )}

      {/* DYNAMIC TWO COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* 1. INTERACTIVE PIPELINE KANBAN BOARD - occupying 3 cols */}
        <div className="xl:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-black text-slate-900 dark:text-zinc-200 uppercase font-mono tracking-wider">Agile Kanban Sprint Board</h3>
              <p className="text-[10px] text-slate-500 font-sans">Click on cards to move them downstream or cycle their completion development states.</p>
            </div>

            <form onSubmit={handleAddCustomTask} className="flex items-center gap-2 self-start">
              <input 
                type="text" 
                required
                value={customTaskInput}
                onChange={(e) => setCustomTaskInput(e.target.value)}
                placeholder="Add bespoke custom task item..."
                className="p-2 py-1.5 max-w-[200px] w-full bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-sans text-[10px]"
                id="kanban-new-task-entry"
              />
              <button 
                type="submit"
                className="px-2.5 py-1.5 bg-slate-955 dark:bg-zinc-900 hover:bg-cyan-500 hover:text-black dark:hover:bg-cyan-500 dark:hover:text-black text-slate-900 dark:text-zinc-300 font-mono font-bold text-[10px] rounded-lg transition"
                title="Add custom item to kanban"
                id="submit-custom-task"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* COLUMN: To Do / Backlog */}
            <div className="bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-neutral-900/40 p-3.5 rounded-2xl space-y-3 flex flex-col justify-between min-h-[350px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-900 pb-2">
                  <span className="font-mono text-[9px] font-black uppercase tracking-wider text-slate-500">Backlog queue</span>
                  <span className="text-[9px] font-mono bg-slate-200 dark:bg-zinc-900 text-slate-750 dark:text-zinc-350 px-1.5 rounded font-black">
                    {tasks.filter(t => t.column === "backlog").length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {tasks.filter(t => t.column === "backlog").map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => cycleTaskColumn(task.id)}
                      className="p-3 bg-white dark:bg-zinc-952 hover:bg-slate-100/40 dark:hover:bg-zinc-900/30 border border-slate-250 dark:border-neutral-900/85 hover:border-cyan-500/50 rounded-xl cursor-pointer transition font-sans text-left space-y-1.5 shadow-sm group active:scale-[0.98]"
                      id={`kanban-task-${task.id}`}
                    >
                      <p className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200 leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{task.label}</p>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span>{task.phase}</span>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[9px] font-mono text-slate-405 italic text-center py-2 border-t border-slate-200/50 dark:border-zinc-900/50">Awaiting dispatch</div>
            </div>

            {/* COLUMN: In Progress */}
            <div className="bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-neutral-900/40 p-3.5 rounded-2xl space-y-3 flex flex-col justify-between min-h-[350px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-900 pb-2">
                  <span className="font-mono text-[9px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">In Progress</span>
                  <span className="text-[9px] font-mono bg-purple-100 dark:bg-purple-955/35 text-purple-700 dark:text-purple-300 px-1.5 rounded font-black">
                    {tasks.filter(t => t.column === "in_development").length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {tasks.filter(t => t.column === "in_development").map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => cycleTaskColumn(task.id)}
                      className="p-3 bg-white dark:bg-zinc-952 hover:bg-slate-100/40 dark:hover:bg-zinc-900/30 border border-slate-250 dark:border-neutral-900/85 hover:border-cyan-500/50 rounded-xl cursor-pointer transition font-sans text-left space-y-1.5 shadow-sm group active:scale-[0.98]"
                    >
                      <p className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200 leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{task.label}</p>
                      <div className="flex items-center justify-between text-[9px] font-mono text-purple-400">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                          Active Coding
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-350" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[9px] font-mono text-purple-400 uppercase text-center font-bold tracking-wider py-1.5 bg-purple-100/20 dark:bg-purple-950/10 rounded-lg">Continuous deploy</div>
            </div>

            {/* COLUMN: QA review */}
            <div className="bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-neutral-900/40 p-3.5 rounded-2xl space-y-3 flex flex-col justify-between min-h-[350px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-900 pb-2">
                  <span className="font-mono text-[9px] font-black uppercase tracking-wider text-amber-650 dark:text-amber-400">Validation / QA</span>
                  <span className="text-[9px] font-mono bg-amber-105 dark:bg-amber-955/35 text-amber-700 dark:text-amber-300 px-1.5 rounded font-black">
                    {tasks.filter(t => t.column === "qa").length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {tasks.filter(t => t.column === "qa").map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => cycleTaskColumn(task.id)}
                      className="p-3 bg-white dark:bg-zinc-952 hover:bg-slate-100/40 dark:hover:bg-zinc-900/30 border border-slate-250 dark:border-neutral-900/85 hover:border-cyan-500/50 rounded-xl cursor-pointer transition font-sans text-left space-y-1.5 shadow-sm group active:scale-[0.98]"
                    >
                      <p className="text-[11px] font-semibold text-slate-800 dark:text-zinc-200 leading-snug group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{task.label}</p>
                      <div className="flex items-center justify-between text-[9px] font-mono text-amber-500">
                        <span>Pending Approval</span>
                        <ChevronRight className="w-3 h-3 text-slate-355" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[9px] font-mono text-slate-400 italic text-center py-2 border-t border-slate-200/50 dark:border-zinc-900/50">Click card to approve</div>
            </div>

            {/* COLUMN: Completed / Merged */}
            <div className="bg-slate-50/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-neutral-900/40 p-3.5 rounded-2xl space-y-3 flex flex-col justify-between min-h-[350px]">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-205 dark:border-neutral-900 pb-2">
                  <span className="font-mono text-[9px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Completed & Verified</span>
                  <span className="text-[9px] font-mono bg-emerald-100 dark:bg-emerald-955/35 text-emerald-700 dark:text-emerald-300 px-1.5 rounded font-black">
                    {tasks.filter(t => t.column === "completed").length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {tasks.filter(t => t.column === "completed").map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => cycleTaskColumn(task.id)}
                      className="p-3 bg-white dark:bg-zinc-952 hover:bg-slate-100/40 dark:hover:bg-zinc-900 hover:border-zinc-800 rounded-xl cursor-pointer transition font-sans text-left space-y-1 text-slate-400 dark:text-zinc-500 line-through select-none"
                    >
                      <p className="text-[11px] font-medium leading-normal">{task.label}</p>
                      <span className="text-[8px] font-mono block text-emerald-500 uppercase tracking-widest font-black">✔ Active Production</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase text-center py-1.5 bg-emerald-100/20 dark:bg-emerald-950/10 rounded-lg">Audit Secure Green</div>
            </div>

          </div>
        </div>

        {/* 2. SUB-SECTION: DISPATCH TRANSMITTER FILE UPLOAD AREA - 1 col */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Upload box */}
          <div className="p-5 bg-slate-50 dark:bg-zinc-950/40 border border-slate-200 dark:border-neutral-900 rounded-2xl space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-200 uppercase font-mono tracking-wider">Despatch Core Assets</h4>
              <p className="text-[10px] text-slate-500">Submit spec wireframes, system diagrams, or backups directly into development backlog.</p>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUploadInput} 
              className="hidden" 
              id="secret-backlog-file-selector"
            />

            {uploading ? (
              <div className="p-4 bg-slate-100 dark:bg-zinc-900/40 border border-slate-200 dark:border-zinc-800 rounded-xl text-center space-y-3 font-mono text-[10px] animate-pulse">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-500 mx-auto" />
                <div className="space-y-1">
                  <p className="font-bold text-slate-800 dark:text-zinc-250 truncate">Transmitting: {uploadFileName}</p>
                  <p className="text-[9px] text-slate-400">Speed rate: <strong className="text-cyan-500">8.4 MB/s</strong></p>
                </div>
                <div className="w-full bg-slate-201 dark:bg-zinc-950 h-1 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <span>{uploadProgress}% Streamed</span>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-6 bg-white dark:bg-black hover:bg-slate-100/50 dark:hover:bg-zinc-900/20 border border-dashed border-slate-300 dark:border-zinc-800 hover:border-cyan-500 dark:hover:border-cyan-500/50 rounded-xl text-center cursor-pointer transition duration-150 relative space-y-2 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 flex items-center justify-center text-slate-400 group-hover:text-cyan-500 group-hover:bg-white dark:group-hover:bg-zinc-900 mx-auto transition">
                  <Plus className="w-4 h-4 scale-100 group-hover:scale-110 transition-all duration-150" />
                </div>
                <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-zinc-300 block">DESPATCH DOCUMENT</span>
                <span className="text-[9px] text-slate-400 block uppercase font-mono">ZIP, PDF, JSON (MAX 50MB)</span>
              </div>
            )}
          </div>

          {/* System Event Logs */}
          <div className="p-5 bg-slate-50 dark:bg-zinc-950/40 border border-slate-200 dark:border-neutral-900 rounded-2xl space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-200 uppercase font-mono tracking-wider">Audit Transaction Ledger</h4>
              <p className="text-[10px] text-slate-405">Historical action logs triggered in sandbox terminal.</p>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
              {loggedInClient.progressLog?.slice(0, 5).map((log, lIdx) => (
                <div key={lIdx} className="p-2.5 bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-900 rounded-lg space-y-1 text-[10px] leading-relaxed">
                  <div className="flex items-center justify-between font-mono text-[9px] text-slate-400">
                    <span>{log.date}</span>
                    <span className="px-1 bg-slate-105 dark:bg-zinc-900 text-slate-650 dark:text-zinc-400 uppercase font-bold rounded">{log.phase}</span>
                  </div>
                  <p className="font-sans text-slate-700 dark:text-zinc-300">{log.title}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
