import React, { useState, useEffect } from "react";
import { BarChart3, FileText, Layers, Users, Calendar, Activity, MessageSquare } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Card } from "../../components/ui";
import { PortalMetricCard } from "../user/PortalMetricCard";
import { getPortalAuthToken } from "../user/auth";

export default function TeamDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    progress: 0,
    projects: 0,
    deliverables: 0,
    unreadMessages: 0,
    upcomingMilestones: 0,
  });
  const [activity, setActivity] = useState([
    { title: "Team portal opened", time: "Just now" },
  ]);

  useEffect(() => {
    const token = getPortalAuthToken();
    if (!token) return;

    Promise.all([
      fetch("/api/projects", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch("/api/conversations", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch("/api/milestones", { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
    ]).then(([projectsData, conversationsData, milestonesData]) => {
      const projects = projectsData?.projects || [];
      const conversations = conversationsData?.conversations || [];
      const milestones = milestonesData?.milestones || [];
      
      const activeMilestones = milestones.filter((m: any) => m.status === "active");
      
      setStats({
        progress: projects.length > 0 ? 75 : 0,
        projects: projects.length,
        deliverables: projects.reduce((sum: number, p: any) => sum + (p.deliverables?.length || 0), 0),
        unreadMessages: conversations.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0),
        upcomingMilestones: activeMilestones.length,
      });
      setActivity([
        { title: `${projects.length} project${projects.length === 1 ? "" : "s"} assigned`, time: "Live" },
        { title: `${conversations.length} conversation${conversations.length === 1 ? "" : "s"} active`, time: "Live" },
        { title: `${activeMilestones.length} active milestone${activeMilestones.length === 1 ? "" : "s"}`, time: "Live" },
      ]);
    }).catch(() => {
      setActivity([{ title: "Dashboard data could not be refreshed", time: "Retry" }]);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Team Dashboard
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Welcome back, {user?.firstName}. Here's your project overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PortalMetricCard label="Projects" value={stats.projects} icon={Layers} tone="purple" helper="Assigned workspaces" />
        <PortalMetricCard label="Deliverables" value={stats.deliverables} icon={FileText} tone="slate" helper="Available assets" />
        <PortalMetricCard label="Messages" value={stats.unreadMessages} icon={MessageSquare} tone="emerald" helper="Unread conversations" />
        <PortalMetricCard label="Milestones" value={stats.upcomingMilestones} icon={Calendar} tone="cyan" helper="Active milestones" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity" className="p-6">
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.title} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-950 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-white">{item.title}</p>
                  <p className="text-[10px] text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Team Stats" className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Your Role</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{user?.role || "Team Member"}</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Status</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">Active</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Progress</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.progress}%</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Team Size</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">5+</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
