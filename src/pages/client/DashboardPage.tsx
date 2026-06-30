import React, { useState, useEffect } from "react";
import { BarChart3, Folder, FileText, BadgeDollarSign, MessageSquare, Check, Layers, TrendingUp, Users, Calendar, Activity } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Card } from "../../components/ui";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-400 font-mono uppercase">{title}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="text-2xl font-display font-black text-slate-900 dark:text-white">
        {value}
      </div>
    </Card>
  );
}

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
        <StatCard title="Progress" value={`${stats.progress}%`} icon={BarChart3} color="text-cyan-500" />
        <StatCard title="Active Tasks" value={stats.tasks} icon={Layers} color="text-purple-500" />
        <StatCard title="Deliverables" value={stats.deliverables} icon={FileText} color="text-slate-500" />
        <StatCard title="Invoices" value={stats.invoices} icon={BadgeDollarSign} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity" className="p-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 dark:text-white">Task updated</p>
                  <p className="text-[10px] text-slate-400">2 minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Quick Stats" className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Team Members</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">12</p>
            </div>
            <div className="text-center p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
              <p className="text-[10px] text-slate-400 font-mono uppercase">Projects</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">5</p>
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