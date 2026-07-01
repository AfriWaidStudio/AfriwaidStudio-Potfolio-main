import React, { useEffect, useState } from "react";
import { CheckSquare, RefreshCw } from "lucide-react";
import { Button, Card } from "../../components/ui";
import { PortalState } from "./PortalState";
import { portalRequest } from "./portalApi";

interface Approval {
  id: string;
  name: string;
  status: string;
  type: "deliverable" | "milestone";
  projectId: string;
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const loadApprovals = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await portalRequest<{ approvals: Approval[] }>("/api/approvals");
      setApprovals(data.approvals || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Approvals could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, []);

  const approve = async (item: Approval) => {
    setBusyId(item.id);
    setError("");
    try {
      if (item.type === "deliverable") {
        await portalRequest(`/api/deliverables/${item.id}/review`, {
          method: "PUT",
          body: JSON.stringify({ status: "approved" }),
        });
      } else {
        await portalRequest(`/api/milestones/${item.id}/approve`, { method: "POST", body: JSON.stringify({}) });
      }
      await loadApprovals();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Approval action failed.");
    } finally {
      setBusyId("");
    }
  };

  if (loading) return <PortalState loading icon={CheckSquare} title="Loading approvals" />;
  if (error && approvals.length === 0) return <PortalState icon={CheckSquare} title="Approvals need attention" message={error} actionLabel="Retry" onAction={loadApprovals} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Approvals</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Approve milestone and deliverable items assigned to your workspace.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadApprovals} leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {approvals.length === 0 ? (
        <PortalState icon={CheckSquare} title="Nothing awaiting approval" message="Pending approval items will appear here." />
      ) : (
        <div className="space-y-3">
          {approvals.map((item) => (
            <Card key={`${item.type}-${item.id}`} className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-mono uppercase text-slate-400">{item.type}</p>
                  <h2 className="font-bold text-slate-900 dark:text-white">{item.name}</h2>
                  <p className="text-xs text-slate-500">Project: {item.projectId} · Status: {item.status}</p>
                </div>
                <Button size="sm" disabled={busyId === item.id || item.status === "approved"} onClick={() => approve(item)}>
                  {item.status === "approved" ? "Approved" : "Approve"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
