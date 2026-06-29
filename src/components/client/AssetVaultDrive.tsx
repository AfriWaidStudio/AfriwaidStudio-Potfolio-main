import React from "react";
import { Folder, Download, Check, Layers, Database, Sparkles, FileSpreadsheet } from "lucide-react";
import { Deliverable } from "../../types";

interface AssetVaultDriveProps {
  deliverables: Deliverable[];
  setDeliverables: React.Dispatch<React.SetStateAction<Deliverable[]>>;
  setPaymentSuccessToast: (toast: string | null) => void;
}

export default function AssetVaultDrive({
  deliverables,
  setDeliverables,
  setPaymentSuccessToast
}: AssetVaultDriveProps) {
  return (
    <div className="space-y-6 animate-fadeIn text-left">
      <div className="p-5 bg-slate-50 dark:bg-zinc-950/40 border border-slate-200 dark:border-neutral-900 rounded-2xl">
        <h3 className="text-xs font-bold text-slate-900 dark:text-zinc-200 uppercase font-mono tracking-widest mb-1">Asset Vault Directory</h3>
        <p className="text-[10px] text-slate-500 font-mono">Encrypted workspace directory linked securely inside client deployment node.</p>
      </div>

      {/* Categorization Folders */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: "UI/UX Sketchbooks", items: 2, icon: Layers, size: "19.6 MB" },
          { name: "System Blueprints", items: 1, icon: Database, size: "1.4 MB" },
          { name: "Code Backups", items: 0, icon: Sparkles, size: "0 KB" },
          { name: "Ledgers & NDAs", items: 1, icon: FileSpreadsheet, size: "437 KB" }
        ].map((fld, idx) => (
          <div key={idx} className="p-4 bg-slate-50 hover:bg-white dark:bg-zinc-950/40 dark:hover:bg-zinc-900/30 border border-slate-200 dark:border-zinc-900 hover:border-cyan-500/30 rounded-2xl flex items-center gap-3 cursor-pointer transition">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-zinc-900 text-cyan-500 flex items-center justify-center shrink-0 border border-slate-205 dark:border-zinc-800">
              <Folder className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-left font-sans min-w-0">
              <h4 className="font-bold text-slate-800 dark:text-zinc-200 truncate font-sans text-xs">{fld.name}</h4>
              <p className="text-[9px] text-slate-505 font-mono truncate">{fld.items} documents • {fld.size}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shared Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deliverables.map((del) => {
          const isPdf = del.name.endsWith(".pdf");
          const isFig = del.name.endsWith(".fig");
          return (
            <div key={del.id} className="p-4 bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-neutral-900/60 hover:border-zinc-800 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow transition duration-155">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-mono font-black ${
                      isPdf ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                      isFig ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                      'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'
                    }`}>
                      {isPdf ? "PDF" : isFig ? "FIG" : "BIN"}
                    </span>
                    <div className="text-left font-sans min-w-0">
                      <h4 className="font-bold text-slate-950 dark:text-zinc-200 truncate text-xs" title={del.name}>{del.name}</h4>
                      <p className="text-[9px] text-slate-500 font-mono">{del.fileSize || "4.1 MB"}</p>
                    </div>
                  </div>
                  
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[8px] font-bold uppercase font-mono border ${
                    del.status === "approved" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400" :
                    del.status === "completed" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-500 dark:text-cyan-400" :
                    "bg-slate-205 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-500"
                  }`}>
                    {del.status}
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-600 dark:text-zinc-400 leading-normal text-left truncate">{del.description}</p>
              </div>

              <div className="flex items-center gap-2 border-t border-slate-200 dark:border-zinc-900 pt-3">
                <button 
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-black dark:hover:text-white rounded-lg transition font-mono font-bold text-[10px] cursor-pointer"
                  onClick={() => {
                    setPaymentSuccessToast(`Securely fetched file link token for ${del.name}. Downloading...`);
                    setTimeout(() => setPaymentSuccessToast(null), 4000);
                  }}
                >
                  <Download className="w-3 h-3 text-cyan-400" />
                  <span>FETCH LINK</span>
                </button>
                
                {del.status !== "approved" && (
                  <button 
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition font-mono font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow active:scale-95"
                    onClick={() => {
                      setDeliverables(prev => prev.map(d => d.id === del.id ? { ...d, status: "approved" } : d));
                      setPaymentSuccessToast(`Approved and verified deliverable asset: ${del.name}`);
                      setTimeout(() => setPaymentSuccessToast(null), 5000);
                    }}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>APPROVE</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
