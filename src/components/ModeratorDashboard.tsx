import React, { useState, useEffect } from "react";
import { Shield, ShieldCheck, FileText, MessageSquare, BarChart3, AlertCircle, Users, Calendar, Clock, CheckCircle, X, Activity, RefreshCw } from "lucide-react";
import { ClientProfile, Inquiry } from "../types";

interface ModeratorDashboardProps {
  clientProfiles: ClientProfile[];
  inquiries: Inquiry[];
}

export default function ModeratorDashboard({ clientProfiles, inquiries }: ModeratorDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "support" | "reports">("overview");
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const activeInquiries = inquiries.filter(i => i.status === "new");

  return (
    <div className="space-y-6 text-left font-sans text-xs text-neutral-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.04] pb-3 gap-2">
        <div>
          <h3 className="text-base font-display font-medium text-white uppercase tracking-wide flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Moderator Control Center
          </h3>
          <p className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase">
            PLATFORM CONTENT MODERATION & CLIENT INTERACTION OVERVIEW
          </p>
        </div>
      </div>

      <div className="flex gap-1 bg-neutral-900/50 p-1 rounded-xl">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "content", label: "Content Review", icon: FileText },
          { id: "support", label: "Support Review", icon: MessageSquare },
          { id: "reports", label: "Reports", icon: AlertCircle }
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
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Pending Inquiries</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">{activeInquiries.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Unread Messages</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">12</span>
            </div>
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
              <span className="text-[10px] text-neutral-500 font-mono block uppercase">Active Projects</span>
              <span className="text-xl font-bold font-display text-white mt-1 block">1</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">Recent Activity</h3>
            <div className="space-y-2">
              {activeInquiries.slice(0, 3).map((inq) => (
                <div key={inq.id} className="p-3 bg-neutral-950/50 border border-neutral-800 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-white">{inq.name}</span>
                    <p className="text-[11px] text-neutral-400 mt-1">{inq.email}</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 bg-red-950/60 text-red-400 rounded font-mono uppercase tracking-wider">
                    New
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "content" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Content Review Queue</h3>
          <div className="text-center py-12 text-neutral-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="font-mono">No content pending review</p>
          </div>
        </div>
      )}

      {activeTab === "support" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Support Review</h3>
          <div className="text-center py-12 text-neutral-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="font-mono">No support tickets requiring review</p>
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Moderation Reports</h3>
          <div className="text-center py-12 text-neutral-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-neutral-500" />
            <p className="font-mono">No moderation reports available</p>
          </div>
        </div>
      )}
    </div>
  );
}