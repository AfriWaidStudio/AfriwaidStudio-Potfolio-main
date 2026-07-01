import React from "react";
import { BarChart3 } from "lucide-react";

interface PortalMetricCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  tone?: "cyan" | "purple" | "slate" | "emerald";
  helper?: string;
}

export function PortalMetricCard({ label, value, icon: Icon, tone = "cyan", helper }: PortalMetricCardProps) {
  const toneClasses = {
    cyan: "text-cyan-500 bg-cyan-500/10",
    purple: "text-purple-500 bg-purple-500/10",
    slate: "text-slate-500 bg-slate-500/10",
    emerald: "text-emerald-500 bg-emerald-500/10",
  };

  return (
    <div className={`p-4 rounded-xl border border-slate-200 dark:border-zinc-800 ${toneClasses[tone]}`}>
      <p className="text-[10px] font-mono uppercase text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      {helper && (
        <p className="text-[10px] text-slate-400 mt-1">{helper}</p>
      )}
    </div>
  );
}