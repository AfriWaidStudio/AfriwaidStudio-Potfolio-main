import React, { useState, useEffect } from "react";
import { FileText, Folder, Check, Clock, Archive, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { Card, Badge } from "../../components/ui";
import { PortalState, getRouteLeaf } from "./PortalState";
import { getPortalAuthHeaders } from "./auth";
import { PortalMetricCard } from "./PortalMetricCard";

interface Deliverable {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  fileName: string;
  fileSize: string;
  projectId: string;
}

export default function DeliverablesPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeliverables = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/deliverables", {
        headers: getPortalAuthHeaders()
      });
      if (!res.ok) throw new Error(`Deliverables could not be loaded (${res.status}).`);
      const data = await res.json();
      setDeliverables(data.deliverables || data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Deliverables could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliverables();
  }, [user]);

  const section = getRouteLeaf(location.pathname, "/portal/deliverables");
  const filteredDeliverables = deliverables.filter((d) => {
    if (section === "pending") return d.status === "pending";
    if (section === "in-progress") return d.status === "in-progress";
    if (section === "completed" || section === "history") return d.status === "completed";
    if (section === "rejected") return d.status === "rejected";
    return true;
  });
  const title = section === "overview" ? "Deliverables" : `Deliverables: ${section.replace("-", " ")}`;

  const stats = {
    total: deliverables.length,
    pending: deliverables.filter(d => d.status === "pending").length,
    completed: deliverables.filter(d => d.status === "completed").length,
    inProgress: deliverables.filter(d => d.status === "in-progress").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Track and manage project deliverables.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <PortalMetricCard label="Total" value={stats.total} icon={FileText} tone="slate" helper="All deliverables" />
        <PortalMetricCard label="Pending" value={stats.pending} icon={Folder} tone="blue" helper="Awaiting review" />
        <PortalMetricCard label="Completed" value={stats.completed} icon={Check} tone="emerald" helper="Approved assets" />
        <PortalMetricCard label="In Progress" value={stats.inProgress} icon={Clock} tone="purple" helper="Currently moving" />
      </div>

      <Card title="Deliverables List" className="p-6">
        {loading ? (
          <PortalState loading icon={RefreshCw} title="Loading deliverables" />
        ) : error ? (
          <PortalState icon={Archive} title="Deliverables unavailable" message={error} actionLabel="Retry" onAction={loadDeliverables} />
        ) : filteredDeliverables.length === 0 ? (
          <PortalState icon={Archive} title="No deliverables found" message="There are no deliverables matching this status." />
        ) : (
          <div className="space-y-3">
            {filteredDeliverables.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{d.name}</p>
                  <p className="text-[10px] text-slate-400">{d.fileName} ({d.fileSize})</p>
                </div>
                <Badge variant={d.status === "completed" ? "success" : d.status === "pending" ? "default" : "info"}>
                  {d.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
