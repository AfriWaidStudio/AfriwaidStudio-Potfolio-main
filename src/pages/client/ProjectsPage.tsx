import React, { useState, useEffect } from "react";
import { Folder, Layers, Calendar, BarChart3, FileText, Users, Plus } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Card, Button } from "../../components/ui";

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  dueDate: string;
}

export default function ProjectsPage() {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/projects", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [token]);

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "active").length,
    dueThisWeek: 3,
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) : 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
            Projects
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">
            Manage all your projects and track progress.
          </p>
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <Folder className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Total Projects</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <Layers className="w-6 h-6 text-purple-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Active</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.active}</p>
        </Card>
        <Card className="p-4">
          <Calendar className="w-6 h-6 text-cyan-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Due This Week</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.dueThisWeek}</p>
        </Card>
        <Card className="p-4">
          <BarChart3 className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Avg Progress</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.avgProgress}%</p>
        </Card>
      </div>

      <Card title="Project List" className="p-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500">
            <Folder className="w-12 h-12 mx-auto mb-4 text-slate-300 animate-pulse" />
            <p className="font-mono text-xs">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Folder className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="font-mono text-xs mb-4">No projects found</p>
            <Button variant="primary">Create First Project</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{p.name}</p>
                  <p className="text-[10px] text-slate-400">Status: {p.status} | Due: {p.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{p.progress}%</p>
                  <p className="text-[10px] text-slate-400">Progress</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}