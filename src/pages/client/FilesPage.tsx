import React from "react";
import { Folder, Upload, Share2, Grid } from "lucide-react";

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Files
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Store and manage project files.
        </p>
      </div>

      <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
        <div className="text-center py-12 text-slate-500">
          <Folder className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="font-mono text-xs mb-4">No files uploaded yet</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-mono text-xs hover:bg-blue-600">
            Upload Files
          </button>
        </div>
      </div>
    </div>
  );
}