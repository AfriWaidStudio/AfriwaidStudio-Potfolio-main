import React from "react";
import { BarChart3, FileText, MessageSquare, AlertCircle } from "lucide-react";

export default function ModeratorDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Moderator Overview</h2>
        <p className="text-slate-500 dark:text-zinc-400 mt-1">Content moderation and support review dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <FileText className="w-6 h-6 text-orange-500 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">24</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-mono">Pending Reviews</div>
        </div>
        <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <MessageSquare className="w-6 h-6 text-cyan-500 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">12</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-mono">Support Tickets</div>
        </div>
        <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <AlertCircle className="w-6 h-6 text-red-500 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">3</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-mono">Flagged Items</div>
        </div>
        <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <BarChart3 className="w-6 h-6 text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">98%</div>
          <div className="text-xs text-slate-500 dark:text-zinc-400 uppercase font-mono">Moderation Rate</div>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900 dark:text-white">Content review pending</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400">Project: Website Redesign</div>
              </div>
              <span className="text-xs text-slate-400 dark:text-zinc-500">2 min ago</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}