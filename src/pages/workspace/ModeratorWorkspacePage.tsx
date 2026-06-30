import React from "react";
import { ModeratorWorkspaceLayout } from "../../workspaces/moderator/ModeratorWorkspaceLayout";

export default function ModeratorWorkspacePage() {
  return (
    <ModeratorWorkspaceLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Moderator Dashboard</h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Content moderation and support review</p>
        </div>
      </div>
    </ModeratorWorkspaceLayout>
  );
}