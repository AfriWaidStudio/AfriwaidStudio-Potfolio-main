import React from "react";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { Card } from "../../components/ui";

export default function TimelinePage() {
  const timeline = [
    { title: "Technical Discovery", date: "2026-06-10", status: "completed" },
    { title: "Blueprint Review", date: "2026-06-18", status: "completed" },
    { title: "Integration Sprint", date: "2026-06-28", status: "active" },
    { title: "Client Handover", date: "2026-07-05", status: "upcoming" },
  ];

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

      <Card title="Milestone Timeline" className="p-6">
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  item.status === "completed" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40" :
                  item.status === "active" ? "bg-blue-100 text-blue-700 dark:bg-blue-950/40" :
                  "bg-slate-100 text-slate-500 dark:bg-zinc-900"
                }`}>
                  {item.status === "completed" ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                </div>
                {index < timeline.length - 1 && <div className="w-px flex-1 min-h-8 bg-slate-200 dark:bg-zinc-800" />}
              </div>
              <div className="pb-6">
                <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
