import React from "react";
import { Folder, Layers, Calendar, BarChart3, FileText, Users, Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
            Projects
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">
            Manage all your projects and track progress.
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-mono text-xs hover:bg-blue-600 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <Folder className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Total Projects</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <Layers className="w-6 h-6 text-purple-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Active</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">8</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <Calendar className="w-6 h-6 text-cyan-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Due This Week</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <BarChart3 className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Avg Progress</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">75%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4">
          Project List
        </h3>
        <div className="text-center py-12 text-slate-500">
          <Folder className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="font-mono text-xs mb-4">No projects found</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-mono text-xs hover:bg-blue-600">
            Create First Project
          </button>
        </div>
      </div>
    </div>
  );
}