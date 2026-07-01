import React, { useEffect, useState } from "react";
import { BarChart3, Download, RefreshCw } from "lucide-react";
import { Button, Card } from "../../components/ui";
import { PortalState } from "./PortalState";
import { downloadTextFile, portalRequest } from "./portalApi";

interface ReportsPayload {
  summary: { projects: number; invoices: number; deliverables: number };
  projects: any[];
  invoices: any[];
  deliverables: any[];
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReportsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    setLoading(true);
    setError("");
    try {
      setReport(await portalRequest<ReportsPayload>("/api/reports"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reports could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  if (loading) return <PortalState loading icon={BarChart3} title="Loading reports" />;
  if (error) return <PortalState icon={BarChart3} title="Reports need attention" message={error} actionLabel="Retry" onAction={loadReport} />;
  if (!report) return <PortalState icon={BarChart3} title="No report data" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Reports</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Workspace summary generated from projects, invoices, and deliverables.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadReport} leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
          <Button size="sm" onClick={() => downloadTextFile("portal-report.json", JSON.stringify(report, null, 2), "application/json")} leftIcon={<Download className="w-4 h-4" />}>Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(report.summary).map(([key, value]) => (
          <Card key={key} className="p-5">
            <p className="text-[10px] font-mono uppercase text-slate-400">{key}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
          </Card>
        ))}
      </div>

      <Card title="Report Detail" className="p-0">
        <div className="p-6 pt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ReportList title="Projects" items={report.projects} labelKey="name" />
          <ReportList title="Invoices" items={report.invoices} labelKey="invoiceNo" />
          <ReportList title="Deliverables" items={report.deliverables} labelKey="name" />
        </div>
      </Card>
    </div>
  );
}

function ReportList({ title, items, labelKey }: { title: string; items: any[]; labelKey: string }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-zinc-800 p-3">
      <h2 className="font-bold text-slate-900 dark:text-white mb-3">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No records</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <p key={item.id} className="text-sm text-slate-700 dark:text-zinc-300 truncate">{item[labelKey] || item.id}</p>
          ))}
        </div>
      )}
    </div>
  );
}
