import React from "react";
import { AuditorWorkspaceLayout } from "../../workspaces/auditor/AuditorWorkspaceLayout";

export default function AuditorWorkspacePage() {
  return (
    <AuditorWorkspaceLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Auditor Dashboard</h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">System audit logs and security monitoring</p>
        </div>
      </div>
    </AuditorWorkspaceLayout>
  );
}