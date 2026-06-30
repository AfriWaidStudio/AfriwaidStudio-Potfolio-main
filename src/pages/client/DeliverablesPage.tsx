import React, { useState, useEffect } from "react";
import { FileText, Folder, Check, Clock, Archive, RefreshCw } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Button } from "../../components/ui";
import { Card, Badge } from "../../components/ui";

interface Deliverable {
  id: string;
  name: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  fileName: string;
  fileSize: string;
  projectId: string;
}

export default function DeliverablesPage() {
  const { token } = useAuth();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeliverables = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/deliverables", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDeliverables(data.deliverables || data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadDeliverables();
  }, [token]);

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
          Deliverables
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
          <div className="text-center py-12 text-slate-500">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 text-slate-300 animate-spin" />
            <p className="font-mono text-xs">Loading deliverables...</p>
          </div>
        ) : deliverables.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Archive className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="font-mono text-xs">No deliverables found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deliverables.map((d) => (
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