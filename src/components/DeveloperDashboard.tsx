import React, { useState } from "react";
import { ShieldCheck, BarChart3, Code, Database, Terminal, Settings, Activity, AlertCircle } from "lucide-react";
import { ClientProfile } from "../types";
import { Card, Tabs } from "./ui";

interface DeveloperDashboardProps {
  clientProfiles: ClientProfile[];
}

export default function DeveloperDashboard({ clientProfiles }: DeveloperDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "integrations" | "diagnostics" | "settings">("overview");

  return (
    <div className="space-y-6 text-left font-sans text-xs text-neutral-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.04] pb-3 gap-2">
        <div>
          <h3 className="text-base font-display font-medium text-white uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" /> Developer Integration Hub
          </h3>
          <p className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase">
            SYSTEM INTEGRATIONS, DIAGNOSTICS & API CONFIGURATION
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-neutral-900/50 p-1 rounded-xl">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "integrations", label: "Integrations", icon: Code },
          { id: "diagnostics", label: "Diagnostics", icon: Terminal },
          { id: "settings", label: "Settings", icon: Settings }
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
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">API Endpoints</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">24</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Active Integrations</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">3</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">System Health</span>
              <span className="text-xl font-bold font-display text-emerald-400 mt-1 block">OK</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Clients</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">{clientProfiles.length}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">System Status</h3>
            <div className="text-center py-12 text-neutral-400">
              <Activity className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
              <p className="font-mono">All systems operational</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "integrations" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">API Integrations</h3>
          <div className="text-center py-12 text-neutral-400">
            <Code className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="font-mono">No integrations configured</p>
          </div>
        </div>
      )}

      {activeTab === "diagnostics" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Diagnostics</h3>
          <div className="text-center py-12 text-neutral-400">
            <Terminal className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="font-mono">No diagnostics available</p>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Developer Settings</h3>
          <div className="text-center py-12 text-neutral-400">
            <Settings className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="font-mono">No settings available</p>
          </div>
        </div>
      )}
    </div>
  );
}