import React, { useState, useEffect } from "react";
import { Folder, Layers, Calendar, BarChart3, Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { Card, Button } from "../../components/ui";
import { PortalState, getRouteLeaf } from "./PortalState";

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  dueDate: string;
  clientId?: string;
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    const token = localStorage.getItem("afriwaid_auth_token");
    if (!token) {
      setError("Your session is missing. Please sign in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error(`Projects could not be loaded (${res.status}).`);
      }
      const data = await res.json();
      setProjects(data.projects || data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Projects could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const section = getRouteLeaf(location.pathname, "/portal/projects");
  const filteredProjects = projects.filter((p) => {
    if (section === "active" || section === "kanban" || section === "calendar") return p.status === "active";
    if (section === "archived") return p.status === "archived" || p.status === "completed";
    if (section === "templates") return false;
    return true;
  });

  const pageCopy: Record<string, { title: string; subtitle: string; listTitle: string }> = {
    overview: { title: "Projects", subtitle: "Manage all your projects and track progress.", listTitle: "Project List" },
    active: { title: "Active Projects", subtitle: "Current workstreams that are still moving.", listTitle: "Active Project List" },
    archived: { title: "Archived Projects", subtitle: "Completed or closed project records.", listTitle: "Archived Project List" },
    templates: { title: "Project Templates", subtitle: "Reusable project structures prepared for future work.", listTitle: "Available Templates" },
    kanban: { title: "Kanban Board", subtitle: "A board-style view of active project execution.", listTitle: "Active Project Board" },
    calendar: { title: "Project Calendar", subtitle: "Upcoming dates grouped from active projects.", listTitle: "Scheduled Project Dates" },
    analytics: { title: "Project Analytics", subtitle: "Progress and delivery health across your projects.", listTitle: "Project Analytics" },
  };
  const copy = pageCopy[section] || pageCopy.overview;

  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === "active").length,
    dueThisWeek: projects.filter((p) => {
      if (!p.dueDate) return false;
      const due = new Date(p.dueDate).getTime();
      const now = Date.now();
      return due >= now && due <= now + 7 * 24 * 60 * 60 * 1000;
    }).length,
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length) : 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">{copy.title}</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">
            {copy.subtitle}
          </p>
        </div>
        <Button variant="outline" leftIcon={<Plus className="w-4 h-4" />} onClick={() => window.dispatchEvent(new CustomEvent("app:goto-tab", { detail: "Contact" }))}>
          Request Project
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

      <Card title={copy.listTitle} className="p-6">
        {loading ? (
          <PortalState loading icon={Folder} title="Loading projects" />
        ) : error ? (
          <PortalState icon={Folder} title="Projects unavailable" message={error} actionLabel="Retry" onAction={loadProjects} />
        ) : filteredProjects.length === 0 ? (
          <PortalState icon={Folder} title="No projects found" message="There are no project records for this view yet." />
        ) : (
          <div className="space-y-3">
            {filteredProjects.map((p) => (
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
