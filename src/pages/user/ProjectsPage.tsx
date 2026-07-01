import React, { useEffect, useState } from "react";
import { Activity, CheckCircle, Columns3, Folder, RefreshCw } from "lucide-react";
import { Button, Card } from "../../components/ui";
import { PortalState } from "./PortalState";
import { formatDate, portalRequest } from "./portalApi";

interface Project {
  id: string;
  name: string;
  category: string;
  projectStatus: string;
  clientProgPercent?: number;
  completionDate?: string;
}

interface Workspace {
  project: Project;
  milestones: any[];
  tasks: any[];
  files: any[];
  deliverables: any[];
  activities: any[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await portalRequest<{ projects: Project[] }>("/api/projects");
      setProjects(data.projects || []);
      if (data.projects?.[0]) {
        const details = await portalRequest<Workspace>(`/api/projects/${data.projects[0].id}/workspace`);
        setWorkspace(details);
      } else {
        setWorkspace(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Projects could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) return <PortalState loading icon={Folder} title="Loading projects" />;
  if (error) return <PortalState icon={Folder} title="Projects need attention" message={error} actionLabel="Retry" onAction={loadProjects} />;
  if (projects.length === 0) return <PortalState icon={Folder} title="No assigned projects" message="Assigned client workspaces will appear here." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Projects</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Live project progress, tasks, files, and activity from the workspace API.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadProjects} leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <div className="space-y-3">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              onClick={async () => setWorkspace(await portalRequest<Workspace>(`/api/projects/${project.id}/workspace`))}
              className={`w-full text-left p-4 rounded-lg border transition ${workspace?.project.id === project.id ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20" : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"}`}
            >
              <p className="font-bold text-slate-900 dark:text-white">{project.name}</p>
              <p className="text-xs text-slate-500">{project.category} · {project.projectStatus}</p>
              <div className="mt-3 h-2 rounded bg-slate-100 dark:bg-zinc-900 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${project.clientProgPercent || 0}%` }} />
              </div>
            </button>
          ))}
        </div>

        {workspace && (
          <div className="space-y-4">
            <Card title={workspace.project.name} description={`Target date: ${formatDate(workspace.project.completionDate)}`} className="p-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-6 pt-2">
                <Metric label="Milestones" value={workspace.milestones.length} icon={CheckCircle} />
                <Metric label="Tasks" value={workspace.tasks.length} icon={Columns3} />
                <Metric label="Files" value={workspace.files.length} icon={Folder} />
                <Metric label="Activity" value={workspace.activities.length} icon={Activity} />
              </div>
            </Card>

            <Card title="Kanban Tasks" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-6 pt-2">
                {["planned", "active", "completed"].map((status) => (
                  <div key={status} className="rounded-lg border border-slate-200 dark:border-zinc-800 p-3 min-h-32">
                    <p className="text-[10px] font-mono uppercase text-slate-400 mb-3">{status}</p>
                    {workspace.tasks.filter((task) => task.status === status).map((task) => (
                      <div key={task.id} className="p-3 rounded bg-slate-50 dark:bg-zinc-900 mb-2">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{task.title}</p>
                        <p className="text-xs text-slate-500">{task.desc}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Activity History" className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-zinc-900">
                {workspace.activities.map((item) => (
                  <div key={item.id} className="p-4 flex items-start gap-3">
                    <Activity className="w-4 h-4 text-emerald-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.details}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{formatDate(item.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="rounded-lg bg-slate-50 dark:bg-zinc-900 p-3">
      <Icon className="w-4 h-4 text-emerald-500 mb-2" />
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-[10px] uppercase font-mono text-slate-400">{label}</p>
    </div>
  );
}
