import React from "react";
import { Check, Clock, X } from "lucide-react";

export default function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Approvals
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Review and approve project milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <Clock className="w-6 h-6 text-purple-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Pending</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <Check className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Approved</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <X className="w-6 h-6 text-red-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Rejected</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">2</p>
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4">
          Approval Queue
        </h3>
        <div className="text-center py-12 text-slate-500">
          <p className="font-mono text-xs">Approval queue - Coming soon</p>
        </div>
      </div>
    </div>
  );
}