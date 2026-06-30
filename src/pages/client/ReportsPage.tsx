import React, { useState, useEffect } from "react";
import { BarChart3, PieChart, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Card } from "../../components/ui";
import { PortalState } from "./PortalState";

export default function ReportsPage() {
  const { user } = useAuth();
  const [report, setReport] = useState({ summary: { projects: 0, invoices: 0, deliverables: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reports", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("afriwaid_auth_token") || ""}` }
      });
      if (!res.ok) throw new Error(`Reports could not be loaded (${res.status}).`);
      const data = await res.json();
      setReport(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reports could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Reports
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Project analytics and financial summaries.
        </p>
      </div>

      {loading ? (
        <PortalState loading icon={BarChart3} title="Loading reports" />
      ) : error ? (
        <PortalState icon={BarChart3} title="Reports unavailable" message={error} actionLabel="Retry" onAction={loadReports} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4">
              <Calendar className="w-6 h-6 text-slate-500 mb-2" />
              <p className="text-[10px] text-slate-400 font-mono uppercase">Projects</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{report.summary.projects}</p>
            </Card>
            <Card className="p-4">
              <DollarSign className="w-6 h-6 text-emerald-500 mb-2" />
              <p className="text-[10px] text-slate-400 font-mono uppercase">Invoices</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{report.summary.invoices}</p>
            </Card>
            <Card className="p-4">
              <TrendingUp className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-[10px] text-slate-400 font-mono uppercase">Deliverables</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{report.summary.deliverables}</p>
            </Card>
          </div>

          <Card title="Project Progress" className="p-6">
            <div className="space-y-4">
              {[
                { label: "Projects", value: report.summary.projects, color: "bg-blue-500" },
                { label: "Deliverables", value: report.summary.deliverables, color: "bg-cyan-500" },
                { label: "Invoices", value: report.summary.invoices, color: "bg-emerald-500" },
              ].map((row) => {
                const max = Math.max(report.summary.projects, report.summary.deliverables, report.summary.invoices, 1);
                return (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{row.label}</span>
                      <span className="font-mono">{row.value}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                      <div className={`h-full ${row.color}`} style={{ width: `${Math.max(8, (row.value / max) * 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Financial Overview" className="p-6">
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-zinc-400">
              <PieChart className="w-10 h-10 text-emerald-500" />
              <p>
                Billing records are available in the invoice workspace. Financial charts will become richer once invoice categories and payments are tracked separately.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
