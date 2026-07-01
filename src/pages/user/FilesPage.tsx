import React, { useEffect, useState } from "react";
import { Download, FileUp, Folder, RefreshCw } from "lucide-react";
import { Button, Card, Input } from "../../components/ui";
import { PortalState } from "./PortalState";
import { downloadTextFile, formatDate, portalRequest } from "./portalApi";

interface FileRecord {
  id: string;
  projectId: string;
  name: string;
  size: string;
  category: string;
  version: number;
  uploadedAt: string;
}

interface ProjectRecord {
  id: string;
  name: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadFiles = async () => {
    setLoading(true);
    setError("");
    try {
      const [filesData, projectsData] = await Promise.all([
        portalRequest<{ files: FileRecord[] }>("/api/files"),
        portalRequest<{ projects: ProjectRecord[] }>("/api/projects"),
      ]);
      setFiles(filesData.files || []);
      setProjects(projectsData.projects || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Files could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    const projectId = projects[0]?.id;
    if (!projectId || !name.trim()) return;
    setSaving(true);
    setError("");
    try {
      await portalRequest("/api/files/upload", {
        method: "POST",
        body: JSON.stringify({ projectId, name: name.trim(), size: "Client upload", category: "Documents", tags: ["Portal"] }),
      });
      setName("");
      await loadFiles();
    } catch (e) {
      setError(e instanceof Error ? e.message : "File could not be uploaded.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PortalState loading icon={Folder} title="Loading files" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Files</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Workspace file registry with upload metadata and downloadable manifests.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadFiles} leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
      </div>

      {error && <PortalState icon={Folder} title="Files need attention" message={error} actionLabel="Retry" onAction={loadFiles} />}

      <Card title="Upload File Record" description="Register a new project file in the workspace file API." className="p-0">
        <form onSubmit={handleUpload} className="p-6 pt-2 flex flex-col sm:flex-row gap-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Filename, e.g. discovery-notes.pdf" className="flex-1" />
          <Button type="submit" disabled={saving || !projects[0] || !name.trim()} leftIcon={<FileUp className="w-4 h-4" />}>
            {saving ? "Uploading" : "Upload"}
          </Button>
        </form>
      </Card>

      {files.length === 0 ? (
        <PortalState icon={Folder} title="No files" message="Project uploads and deliverables will appear here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-slate-900 dark:text-white">{file.name}</h2>
                  <p className="text-xs text-slate-500">{file.category} · version {file.version} · {file.size}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Uploaded {formatDate(file.uploadedAt)}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => downloadTextFile(`${file.name}.manifest.txt`, JSON.stringify(file, null, 2))}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
