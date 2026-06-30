import React, { useState, useEffect } from "react";
import { FileText, Folder, Check, Clock, Archive, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { Card, Badge } from "../../components/ui";
import { PortalState, getRouteLeaf } from "./PortalState";

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
        headers: { "Authorization": `Bearer ${localStorage.getItem("afriwaid_auth_token") || ""}` }
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
        <Card className="p-4">
          <FileText className="w-6 h-6 text-slate-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Total</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <Folder className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Pending</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <Check className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Completed</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
        </Card>
        <Card className="p-4">
          <Clock className="w-6 h-6 text-purple-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">In Progress</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.inProgress}</p>
        </Card>
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
