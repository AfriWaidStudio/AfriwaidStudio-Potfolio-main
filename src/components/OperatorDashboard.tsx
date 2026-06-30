import React, { useState } from "react";
import { ShieldCheck, BarChart3, Package, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { ClientProfile } from "../types";
import { Card, Tabs } from "./ui";

interface OperatorDashboardProps {
  clientProfiles: ClientProfile[];
}

export default function OperatorDashboard({ clientProfiles }: OperatorDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "deployments" | "milestones" | "dispatch">("overview");

  return (
    <div className="space-y-6 text-left font-sans text-xs text-neutral-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.04] pb-3 gap-2">
        <div>
          <h3 className="text-base font-display font-medium text-white uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" /> Operator Deployment Hub
          </h3>
          <p className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase">
            PROJECT DEPLOYMENT, MILESTONE TRACKING & DELIVERABLE DISPATCH
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-neutral-900/50 p-1 rounded-xl">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "deployments", label: "Deployments", icon: Package },
          { id: "milestones", label: "Milestones", icon: Calendar },
          { id: "dispatch", label: "Dispatch", icon: Clock }
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
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Active Projects</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">1</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Milestones</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">5</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Deliverables</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">3</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Clients</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">{clientProfiles.length}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Deployment Status</h3>
            <div className="text-center py-12 text-neutral-400">
              <Package className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
              <p className="font-mono">No active deployments</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "deployments" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Deployments</h3>
          <div className="text-center py-12 text-neutral-400">
            <Package className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="font-mono">No deployments found</p>
          </div>
        </div>
      )}

      {activeTab === "milestones" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Milestones</h3>
          <div className="text-center py-12 text-neutral-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="font-mono">No milestones found</p>
          </div>
        </div>
      )}

      {activeTab === "dispatch" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Dispatch Deliverables</h3>
          <div className="text-center py-12 text-neutral-400">
            <Clock className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="font-mono">No dispatch items available</p>
          </div>
        </div>
      )}
    </div>
  );
}