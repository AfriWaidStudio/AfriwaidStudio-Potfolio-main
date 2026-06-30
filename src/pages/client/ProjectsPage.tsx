import React, { useState, useEffect } from "react";
import { Folder, Layers, Calendar, BarChart3, Plus, Send, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { Card, Button } from "../../components/ui";
import { PortalState, getRouteLeaf } from "./PortalState";
import { getPortalAuthToken } from "./auth";
import { PortalMetricCard } from "./PortalMetricCard";

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  dueDate?: string;
  completionDate?: string;
  category?: string;
  description?: string;
  clientId?: string;
}

interface NormalizedProject extends Project {
  normalizedStatus: "active" | "archived" | "completed" | "planned";
  displayDate: string;
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestTitle, setRequestTitle] = useState("");
  const [requestSummary, setRequestSummary] = useState("");
  const [requestSaved, setRequestSaved] = useState("");

  const loadProjects = async () => {
    const token = getPortalAuthToken();
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
  const normalizedProjects: NormalizedProject[] = projects.map((project) => {
    const rawStatus = `${project.status || ""}`.toLowerCase();
    const normalizedStatus =
      rawStatus.includes("complete") ? "completed" :
      rawStatus.includes("archive") ? "archived" :
      rawStatus.includes("plan") || rawStatus.includes("template") ? "planned" :
      "active";

    return {
      ...project,
      normalizedStatus,
      displayDate: project.dueDate || project.completionDate || "Not scheduled",
      progress: Number(project.progress ?? (project as any).clientProgPercent ?? 0),
    };
  });

  const filteredProjects = normalizedProjects.filter((p) => {
    if (section === "active" || section === "kanban" || section === "calendar") return p.normalizedStatus === "active";
    if (section === "archived") return p.normalizedStatus === "archived" || p.normalizedStatus === "completed";
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
    total: normalizedProjects.length,
    active: normalizedProjects.filter(p => p.normalizedStatus === "active").length,
    dueThisWeek: normalizedProjects.filter((p) => {
      if (!p.displayDate || p.displayDate === "Not scheduled") return false;
      const due = new Date(p.displayDate).getTime();
      const now = Date.now();
      return due >= now && due <= now + 7 * 24 * 60 * 60 * 1000;
    }).length,
    avgProgress: normalizedProjects.length > 0 ? Math.round(normalizedProjects.reduce((sum, p) => sum + (p.progress || 0), 0) / normalizedProjects.length) : 0,
    completed: normalizedProjects.filter(p => p.normalizedStatus === "completed").length,
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const request = {
      id: `project-request-${Date.now()}`,
      title: requestTitle.trim(),
      summary: requestSummary.trim(),
      requester: user?.email || "",
      status: "new",
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("afriwaid_project_requests") || "[]");
    localStorage.setItem("afriwaid_project_requests", JSON.stringify([request, ...existing]));
    setRequestTitle("");
    setRequestSummary("");
    setRequestSaved("Project request saved. The team can review it from this browser workspace.");
    setTimeout(() => setRequestSaved(""), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">{copy.title}</h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">
            {copy.subtitle}
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-10 shrink-0 border-slate-300 bg-white px-4 text-sm shadow-sm hover:border-cyan-400 hover:bg-cyan-50 dark:bg-zinc-950 dark:hover:bg-cyan-950/20" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setRequestOpen(true)}>
          Request Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <PortalMetricCard label="Total Projects" value={stats.total} icon={Folder} tone="blue" helper="Visible to your account" />
        <PortalMetricCard label="Active" value={stats.active} icon={Layers} tone="purple" helper="Currently moving" />
        <PortalMetricCard label="Due This Week" value={stats.dueThisWeek} icon={Calendar} tone="cyan" helper="Next 7 days" />
        <PortalMetricCard label="Avg Progress" value={`${stats.avgProgress}%`} icon={BarChart3} tone="emerald" helper={`${stats.completed} completed`} />
      </div>

      {requestOpen && (
        <Card className="border-cyan-200 bg-cyan-50/40 p-5 dark:border-cyan-900/50 dark:bg-cyan-950/10">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">Request a project</h2>
              <p className="text-sm text-slate-600 dark:text-zinc-400">Send the team enough context to scope a new workspace or project lane.</p>
            </div>
            <button type="button" onClick={() => setRequestOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-slate-900 dark:hover:bg-zinc-900 dark:hover:text-white" title="Close request panel" aria-label="Close request panel">
              <X className="h-4 w-4" />
            </button>
          </div>
          {requestSaved && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">{requestSaved}</div>}
          <form onSubmit={handleSubmitRequest} className="grid gap-3 md:grid-cols-[minmax(220px,320px)_1fr_auto] md:items-end">
            <label className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Project title</span>
              <input required value={requestTitle} onChange={(e) => setRequestTitle(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" placeholder="Client portal upgrade" />
            </label>
            <label className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Brief summary</span>
              <input required value={requestSummary} onChange={(e) => setRequestSummary(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-cyan-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white" placeholder="Describe goals, timeline, integrations, or files needed..." />
            </label>
            <Button type="submit" size="sm" className="h-10" leftIcon={<Send className="h-4 w-4" />}>Submit</Button>
          </form>
        </Card>
      )}

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
                  <p className="text-[10px] text-slate-400">Status: {p.status} | Due: {p.displayDate}</p>
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
