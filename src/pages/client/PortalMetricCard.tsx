import React from "react";

interface PortalMetricCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  tone?: "blue" | "cyan" | "emerald" | "purple" | "slate" | "rose";
  helper?: string;
}

const tones = {
  blue: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/50",
  cyan: "bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-300 dark:border-cyan-900/50",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900/50",
  purple: "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-900/50",
  slate: "bg-slate-50 text-slate-600 border-slate-100 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800",
  rose: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/50",
};

export function PortalMetricCard({ label, value, icon: Icon, tone = "slate", helper }: PortalMetricCardProps) {
  return (
    <div className="min-h-[104px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-wide text-slate-500 dark:text-zinc-400">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-normal text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {helper && <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-zinc-400">{helper}</p>}
    </div>
  );
}
