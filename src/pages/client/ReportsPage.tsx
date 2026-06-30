import React, { useState, useEffect } from "react";
import { BarChart3, PieChart, TrendingUp, Download, Calendar, DollarSign } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Card } from "../../components/ui";

export default function ReportsPage() {
  const { token } = useAuth();
  const [report, setReport] = useState({ summary: { projects: 0, invoices: 0, deliverables: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/reports", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setReport(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, [token]);

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
        <div className="text-center py-12 text-slate-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-300 animate-pulse" />
          <p className="font-mono text-xs">Loading reports...</p>
        </div>
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
            <div className="h-40 flex items-center justify-center text-slate-400">
              <BarChart3 className="w-12 h-12 mb-2" />
              <p className="font-mono text-xs">Chart visualization</p>
            </div>
          </Card>

          <Card title="Financial Overview" className="p-6">
            <div className="h-40 flex items-center justify-center text-slate-400">
              <PieChart className="w-12 h-12 mb-2" />
              <p className="font-mono text-xs">Financial chart</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}