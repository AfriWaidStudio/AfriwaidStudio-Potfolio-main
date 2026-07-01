import React, { useEffect, useState } from "react";
import { CheckCircle, Download, FileText, RefreshCw } from "lucide-react";
import { Button, Card } from "../../components/ui";
import { PortalState } from "./PortalState";
import { downloadTextFile, portalRequest } from "./portalApi";

interface Deliverable {
  id: string;
  projectId: string;
  name: string;
  desc: string;
  status: string;
  fileName?: string;
  fileSize?: string;
}

export default function DeliverablesPage() {
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const loadDeliverables = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await portalRequest<{ deliverables: Deliverable[] }>("/api/deliverables");
      setDeliverables(data.deliverables || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Deliverables could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliverables();
  }, []);

  const review = async (id: string, status: "approved" | "pending") => {
    setBusyId(id);
    setError("");
    try {
      await portalRequest(`/api/deliverables/${id}/review`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await loadDeliverables();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Deliverable review failed.");
    } finally {
      setBusyId("");
    }
  };

  if (loading) return <PortalState loading icon={FileText} title="Loading deliverables" />;
  if (error && deliverables.length === 0) return <PortalState icon={FileText} title="Deliverables need attention" message={error} actionLabel="Retry" onAction={loadDeliverables} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Deliverables</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Review, approve, and download deliverable records from the workspace API.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadDeliverables} leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {deliverables.length === 0 ? (
        <PortalState icon={FileText} title="No deliverables" message="Completed project files will appear here for review." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {deliverables.map((item) => (
            <Card key={item.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">{item.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  <p className="text-xs text-slate-400 mt-2">{item.fileName || item.name} · {item.fileSize || "Recorded file"}</p>
                </div>
                <span className="px-2 py-1 rounded bg-slate-100 dark:bg-zinc-900 text-[10px] font-mono uppercase text-slate-600 dark:text-zinc-300">
                  {item.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-5">
                <Button size="sm" onClick={() => review(item.id, "approved")} disabled={busyId === item.id} leftIcon={<CheckCircle className="w-4 h-4" />}>Approve</Button>
                <Button size="sm" variant="outline" onClick={() => review(item.id, "pending")} disabled={busyId === item.id}>Request Review</Button>
                <Button size="sm" variant="secondary" onClick={() => downloadTextFile(`${item.fileName || item.name}.txt`, JSON.stringify(item, null, 2))} leftIcon={<Download className="w-4 h-4" />}>Download</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
