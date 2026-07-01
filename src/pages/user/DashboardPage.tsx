import React, { useState, useEffect } from "react";
import { BarChart3, FileText, BadgeDollarSign, Layers, Users, Calendar, Activity, MessageSquare } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Card } from "../../components/ui";
import { getPortalAuthToken } from "./auth";

interface PortalMetricCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  tone?: "cyan" | "purple" | "slate" | "emerald";
  helper?: string;
}

function PortalMetricCard({ label, value, icon: Icon, tone = "cyan", helper }: PortalMetricCardProps) {
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
      {helper && <p className="text-[10px] text-slate-400 mt-1">{helper}</p>}
    </div>
  );
}

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    progress: 75,
    projects: 1,
    deliverables: 3,
    invoices: 2,
    unreadMessages: 0,
    upcomingMeetings: 1,
  });

  useEffect(() => {
    const token = getPortalAuthToken();
    if (!token) return;

    Promise.all([
      fetch("/api/projects", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch("/api/conversations", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
    ]).then(([projectsData, conversationsData]) => {
      const projects = projectsData?.projects || [];
      const conversations = conversationsData?.conversations || [];
      setStats({
        progress: projects.length > 0 ? 65 : 0,
        projects: projects.length,
        deliverables: projects.reduce((sum: number, p: any) => sum + (p.deliverables?.length || 0), 0),
        invoices: 2,
        unreadMessages: conversations.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0),
        upcomingMeetings: 1,
      });
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          My Workspace
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Welcome back, {user?.firstName}. Track your project progress and communicate with your team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PortalMetricCard label="Progress" value={`${stats.progress}%`} icon={BarChart3} tone="cyan" helper="Project progress" />
        <PortalMetricCard label="Projects" value={stats.projects} icon={Layers} tone="purple" helper="Active workspaces" />
        <PortalMetricCard label="Deliverables" value={stats.deliverables} icon={FileText} tone="slate" helper="Available assets" />
        <PortalMetricCard label="Invoices" value={stats.invoices} icon={BadgeDollarSign} tone="emerald" helper="Billing records" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Quick Actions" className="p-6">
          <div className="grid grid-cols-2 gap-3">
            <a href="/portal/messages" className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg text-center hover:bg-slate-100 dark:hover:bg-zinc-900 transition">
              <MessageSquare className="w-6 h-6 text-blue-500 mx-auto mb-1" />
              <span className="text-sm font-medium text-slate-800 dark:text-white">Messages</span>
            </a>
            <a href="/portal/projects" className="p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg text-center hover:bg-slate-100 dark:hover:bg-zinc-900 transition">
              <Layers className="w-6 h-6 text-purple-500 mx-auto mb-1" />
              <span className="text-sm font-medium text-slate-800 dark:text-white">Projects</span>
            </a>
          </div>
        </Card>

        <Card title="Recent Activity" className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-950 flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-slate-800 dark:text-white">Project created</p>
                <p className="text-[10px] text-slate-400">Just now</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}