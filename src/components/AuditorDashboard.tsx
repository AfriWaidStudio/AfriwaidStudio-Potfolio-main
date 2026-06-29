import React, { useState } from "react";
import { ShieldCheck, BarChart3, FileText, Users, Clock, Activity, AlertTriangle } from "lucide-react";
import { ClientProfile } from "../types";

interface AuditorDashboardProps {
  clientProfiles: ClientProfile[];
}

export default function AuditorDashboard({ clientProfiles }: AuditorDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "logs" | "reports" | "compliance">("overview");

  return (
    <div className="space-y-6 text-left font-sans text-xs text-neutral-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.04] pb-3 gap-2">
        <div>
          <h3 className="text-base font-display font-medium text-white uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Auditor Compliance Center
          </h3>
          <p className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase">
            READ-ONLY COMPLIANCE AUDIT & REGULATORY OVERVIEW
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-neutral-900/50 p-1 rounded-xl">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "logs", label: "Audit Logs", icon: Clock },
          { id: "reports", label: "Reports", icon: FileText },
          { id: "compliance", label: "Compliance", icon: ShieldCheck }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono transition ${
              activeTab === tab.id
                ? "bg-white text-black font-bold shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Total Clients</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">{clientProfiles.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Active Projects</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">1</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Audit Logs</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">24</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Compliance Score</span>
              <span className="text-xl font-bold font-display text-emerald-400 mt-1 block">98%</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Recent Audit Activity</h3>
            <div className="text-center py-12 text-neutral-400">
              <Activity className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
              <p className="font-mono">No recent audit activity</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Audit Logs</h3>
          <div className="text-center py-12 text-neutral-400">
            <Clock className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="font-mono">No audit logs available</p>
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Compliance Reports</h3>
          <div className="text-center py-12 text-neutral-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="font-mono">No compliance reports available</p>
          </div>
        </div>
      )}

      {activeTab === "compliance" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Regulatory Compliance</h3>
          <div className="text-center py-12 text-neutral-400">
            <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="font-mono">No compliance items pending</p>
          </div>
        </div>
      )}
    </div>
  );
}