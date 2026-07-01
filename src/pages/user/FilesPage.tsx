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
  mimeType?: string;
}

interface ProjectRecord {
  id: string;
  name: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
    if (!projectId || !selectedFile) return;
    setSaving(true);
    setError("");
    try {
      const dataUrl = await readFileAsDataUrl(selectedFile);
      await portalRequest("/api/files/upload", {
        method: "POST",
        body: JSON.stringify({
          projectId,
          name: name.trim() || selectedFile.name,
          size: formatFileSize(selectedFile.size),
          category: selectedFile.type.startsWith("image/") ? "Images" : "Documents",
          tags: ["Portal"],
          mimeType: selectedFile.type || "application/octet-stream",
          content: dataUrl.split(",")[1] || "",
          dataUrl
        }),
      });
      setName("");
      setSelectedFile(null);
      await loadFiles();
    } catch (e) {
      setError(e instanceof Error ? e.message : "File could not be uploaded.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async (file: FileRecord) => {
    try {
      const data = await portalRequest<{ file: FileRecord & { content?: string; dataUrl?: string } }>(`/api/files/${file.id}/download`);
      const loaded = data.file;
      if (loaded.dataUrl) {
        downloadDataUrl(loaded.name, loaded.dataUrl);
      } else if (loaded.content) {
        downloadDataUrl(loaded.name, `data:${loaded.mimeType || "application/octet-stream"};base64,${loaded.content}`);
      } else {
        downloadTextFile(`${file.name}.manifest.txt`, JSON.stringify(file, null, 2));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "File could not be downloaded.");
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

      <Card title="Upload File" description="Upload a real document or image into the selected workspace." className="p-0">
        <form onSubmit={handleUpload} className="p-6 pt-2 grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={selectedFile?.name || "Optional display name"} className="flex-1" />
          <input
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt,.zip,.fig"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm text-slate-700 dark:text-zinc-200"
          />
          <Button type="submit" disabled={saving || !projects[0] || !selectedFile} leftIcon={<FileUp className="w-4 h-4" />}>
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
                  <p className="text-xs text-slate-500">{file.category} / version {file.version} / {file.size}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Uploaded {formatDate(file.uploadedAt)}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDownload(file)}
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

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("File could not be read."));
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadDataUrl(filename: string, dataUrl: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
