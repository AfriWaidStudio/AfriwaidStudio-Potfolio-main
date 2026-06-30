import React from "react";
import { BarChart3, ShieldCheck, Clock, Eye, FileText } from "lucide-react";

export default function AuditorDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Auditor Overview</h2>
        <p className="text-slate-500 dark:text-zinc-400 mt-1">System audit logs and security event monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <ShieldCheck className="w-6 h-6 text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">142</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-mono">Audit Events</div>
        </div>
        <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <Clock className="w-6 h-6 text-cyan-500 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">24</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-mono">Hours Monitored</div>
        </div>
        <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <Eye className="w-6 h-6 text-emerald-500 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">8</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-mono">Security Events</div>
        </div>
        <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <BarChart3 className="w-6 h-6 text-indigo-500 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">100%</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-mono">Compliance Rate</div>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Audit Events</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900 dark:text-white">User authentication logged</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400">User: admin@example.com</div>
              </div>
              <span className="text-xs text-slate-400 dark:text-zinc-500">5 min ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}