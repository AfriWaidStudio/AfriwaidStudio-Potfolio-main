import React, { useState, useEffect } from "react";
import { CheckSquare, Clock, Archive, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { Card, Badge } from "../../components/ui";
import { PortalState, getRouteLeaf } from "./PortalState";
import { getPortalAuthHeaders } from "./auth";
import { PortalMetricCard } from "./PortalMetricCard";

interface Approval {
  id: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  projectId: string;
}

export default function ApprovalsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadApprovals = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/approvals", {
        headers: getPortalAuthHeaders()
      });
      if (!res.ok) throw new Error(`Approvals could not be loaded (${res.status}).`);
      const data = await res.json();
      setApprovals(data.approvals || data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Approvals could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, [user]);

  const section = getRouteLeaf(location.pathname, "/portal/approvals");
  const filteredApprovals = approvals.filter((a) => section === "overview" || a.status === section);
  const title = section === "overview" ? "Approvals" : `${section.charAt(0).toUpperCase()}${section.slice(1)} Approvals`;

  const stats = {
    total: approvals.length,
    pending: approvals.filter(a => a.status === "pending").length,
    approved: approvals.filter(a => a.status === "approved").length,
    rejected: approvals.filter(a => a.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Review and manage pending approvals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <PortalMetricCard label="Total" value={stats.total} icon={CheckSquare} tone="slate" helper="All approval items" />
        <PortalMetricCard label="Pending" value={stats.pending} icon={Clock} tone="blue" helper="Needs attention" />
        <PortalMetricCard label="Approved" value={stats.approved} icon={CheckSquare} tone="emerald" helper="Cleared items" />
        <PortalMetricCard label="Rejected" value={stats.rejected} icon={Archive} tone="rose" helper="Returned items" />
      </div>

      <Card title="Approvals List" className="p-6">
        {loading ? (
          <PortalState loading icon={RefreshCw} title="Loading approvals" />
        ) : error ? (
          <PortalState icon={Archive} title="Approvals unavailable" message={error} actionLabel="Retry" onAction={loadApprovals} />
        ) : filteredApprovals.length === 0 ? (
          <PortalState icon={Archive} title="No approvals found" message="There are no approval items in this view." />
        ) : (
          <div className="space-y-3">
            {filteredApprovals.map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{a.name}</p>
                  <p className="text-[10px] text-slate-400">Project: {a.projectId}</p>
                </div>
                <Badge variant={a.status === "approved" ? "success" : a.status === "rejected" ? "error" : "info"}>
                  {a.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
