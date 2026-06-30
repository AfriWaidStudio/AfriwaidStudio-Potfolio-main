import React from "react";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { Card } from "../../components/ui";

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Project Timeline
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Track project milestones and deliverables over time.
        </p>
      </div>

      <Card className="p-12">
        <div className="text-center text-slate-500 dark:text-zinc-400">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-mono">Timeline view coming soon</p>
        </div>
      </Card>
    </div>
  );
}