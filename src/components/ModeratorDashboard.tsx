import React, { useState, useEffect } from "react";
import { Shield, ShieldCheck, FileText, MessageSquare, BarChart3, AlertCircle, Users, Calendar, Clock, CheckCircle, X } from "lucide-react";
import { ClientProfile, Inquiry } from "../types";

interface ModeratorDashboardProps {
  clientProfiles: ClientProfile[];
  inquiries: Inquiry[];
}

export default function ModeratorDashboard({ clientProfiles, inquiries }: ModeratorDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "support" | "reports">("overview");
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const activeInquiries = inquiries.filter(i => i.status === "new");
  const unreadMessages = 12;

  const dismissAlert = (id: string) => {
    setDismissedAlerts(prev => [...prev, id]);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="border-b border-slate-200 dark:border-neutral-800 pb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">Moderator Control Center</h2>
        <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono mt-1">
          Monitor platform content, moderate communications, and review client interactions
        </p>
      </div>

      <div className="flex gap-1 bg-slate-100 dark:bg-zinc-900/50 p-1 rounded-xl">
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
                ? "bg-white dark:bg-zinc-950 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
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
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-neutral-800">
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono uppercase block">Total Clients</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{clientProfiles.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-neutral-800">
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono uppercase block">Pending Inquiries</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeInquiries.length}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-neutral-800">
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono uppercase block">Unread Messages</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{unreadMessages}</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-neutral-800">
              <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono uppercase block">Active Projects</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1">1</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">Recent Activity</h3>
            <div className="space-y-2">
              {activeInquiries.slice(0, 3).map((inq) => (
                <div key={inq.id} className="p-3 bg-slate-50 dark:bg-zinc-950/30 border border-slate-200 dark:border-neutral-800 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{inq.name}</span>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">{inq.email}</p>
                  </div>
                  <span className="text-[10px] px-2 py-1 bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 rounded font-mono uppercase">
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
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">Content Review Queue</h3>
          <div className="text-center py-12 text-slate-500 dark:text-zinc-400">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-mono">No content pending review</p>
          </div>
        </div>
      )}

      {activeTab === "support" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">Support Review</h3>
          <div className="text-center py-12 text-slate-500 dark:text-zinc-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-mono">No support tickets requiring review</p>
          </div>
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wider">Moderation Reports</h3>
          <div className="text-center py-12 text-slate-500 dark:text-zinc-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="font-mono">No moderation reports available</p>
          </div>
        </div>
      )}
    </div>
  );
}