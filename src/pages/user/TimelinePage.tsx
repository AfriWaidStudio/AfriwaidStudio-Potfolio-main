import React, { useEffect, useState } from "react";
import { Clock, RefreshCw } from "lucide-react";
import { Button, Card } from "../../components/ui";
import { PortalState } from "./PortalState";
import { formatDate, portalRequest } from "./portalApi";

interface Milestone {
  id: string;
  title: string;
  phase: string;
  status: string;
  date: string;
}

export default function TimelinePage() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTimeline = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await portalRequest<{ milestones: Milestone[] }>("/api/milestones");
      setMilestones((data.milestones || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Timeline could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeline();
  }, []);

  if (loading) return <PortalState loading icon={Clock} title="Loading timeline" />;
  if (error) return <PortalState icon={Clock} title="Timeline needs attention" message={error} actionLabel="Retry" onAction={loadTimeline} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Timeline</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Milestone sequence loaded from the workspace milestone API.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadTimeline} leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
      </div>

      {milestones.length === 0 ? (
        <PortalState icon={Clock} title="No timeline entries" message="Project milestones will appear here." />
      ) : (
        <Card className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-zinc-900">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="p-5 flex gap-4">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <h2 className="font-bold text-slate-900 dark:text-white">{milestone.title}</h2>
                    <span className="text-xs text-slate-500">{formatDate(milestone.date)}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{milestone.phase}</p>
                  <span className="inline-flex mt-3 px-2 py-1 rounded bg-slate-100 dark:bg-zinc-900 text-[10px] font-mono uppercase">{milestone.status}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
