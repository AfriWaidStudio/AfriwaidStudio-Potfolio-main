import React from "react";
import { PieChart, TrendingUp, Download, Share2 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Reports
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Generate and view project reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
          <PieChart className="w-8 h-8 text-blue-500 mb-3" />
          <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2">
            Project Status Report
          </h3>
          <p className="text-[10px] text-slate-500 font-mono mb-4">
            Overview of all project statuses
          </p>
          <button className="text-xs text-blue-500 font-mono hover:text-blue-600">
            Download PDF
          </button>
        </div>

        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
          <TrendingUp className="w-8 h-8 text-emerald-500 mb-3" />
          <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2">
            Progress Timeline
          </h3>
          <p className="text-[10px] text-slate-500 font-mono mb-4">
            Project progress over time
          </p>
          <button className="text-xs text-blue-500 font-mono hover:text-blue-600">
            Download PDF
          </button>
        </div>

        <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
          <Download className="w-8 h-8 text-purple-500 mb-3" />
          <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2">
            Deliverables Report
          </h3>
          <p className="text-[10px] text-slate-500 font-mono mb-4">
            Complete deliverables list
          </p>
          <button className="text-xs text-blue-500 font-mono hover:text-blue-600">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}