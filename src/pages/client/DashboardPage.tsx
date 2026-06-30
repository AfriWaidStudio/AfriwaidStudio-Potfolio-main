import React, { useState, useEffect } from "react";
import { BarChart3, FileText, BadgeDollarSign, Layers, Users, Calendar, Activity } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Card } from "../../components/ui";
import { getPortalAuthToken } from "./auth";
import { PortalMetricCard } from "./PortalMetricCard";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    progress: 75,
    tasks: 12,
    deliverables: 8,
    invoices: 5,
    unreadMessages: 3,
    upcomingMeetings: 2,
  });
  const [activity, setActivity] = useState([
    { title: "Portal opened", time: "Just now" },
  ]);

  useEffect(() => {
    const token = getPortalAuthToken();
    if (!token) return;

    Promise.all([
      fetch("/api/projects", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch("/api/deliverables", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch("/api/invoices", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch("/api/meetings", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
    ]).then(([projectsData, deliverablesData, invoicesData, meetingsData]) => {
      const projects = projectsData?.projects || [];
      const deliverables = deliverablesData?.deliverables || [];
      const invoices = invoicesData?.invoices || [];
      const meetings = meetingsData?.meetings || [];
      const avgProgress = projects.length ? Math.round(projects.reduce((sum: number, p: any) => sum + (p.progress || 0), 0) / projects.length) : 0;
      setStats({
        progress: avgProgress,
        tasks: projects.length,
        deliverables: deliverables.length,
        invoices: invoices.length,
        unreadMessages: 0,
        upcomingMeetings: meetings.filter((m: any) => m.status === "upcoming").length,
      });
      setActivity([
        { title: `${projects.length} project record${projects.length === 1 ? "" : "s"} synced`, time: "Live" },
        { title: `${deliverables.length} deliverable${deliverables.length === 1 ? "" : "s"} available`, time: "Live" },
        { title: `${invoices.length} invoice${invoices.length === 1 ? "" : "s"} in billing`, time: "Live" },
      ]);
    }).catch(() => {
      setActivity([{ title: "Dashboard data could not be refreshed", time: "Retry from each workspace" }]);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Welcome back, {user?.firstName}. Here's your project overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PortalMetricCard label="Progress" value={`${stats.progress}%`} icon={BarChart3} tone="cyan" helper="Average project progress" />
        <PortalMetricCard label="Projects" value={stats.tasks} icon={Layers} tone="purple" helper="Visible workspaces" />
        <PortalMetricCard label="Deliverables" value={stats.deliverables} icon={FileText} tone="slate" helper="Available assets" />
        <PortalMetricCard label="Invoices" value={stats.invoices} icon={BadgeDollarSign} tone="emerald" helper="Billing records" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity" className="p-6">
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.title} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-white">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Stats" className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Team Members</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">Active</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Projects</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.tasks}</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Messages</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.unreadMessages}</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Meetings</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.upcomingMeetings}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
