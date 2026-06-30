import React, { useState, useEffect } from "react";
import { Folder, FileText, Image, FileJson, Copy, Download, Trash2 } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Card } from "../../components/ui";
import { PortalState } from "./PortalState";

interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  projectId: string;
  uploadedAt: string;
}

export default function FilesPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFiles = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/files", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("afriwaid_auth_token") || ""}` }
      });
      if (!res.ok) throw new Error(`Files could not be loaded (${res.status}).`);
      const data = await res.json();
      setFiles(data.files || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Files could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [user]);

  const getIcon = (type: string) => {
    if (type.includes("image")) return Image;
    if (type.includes("json")) return FileJson;
    if (type.includes("pdf")) return FileText;
    return Folder;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Files
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Access project deliverables and documentation.
        </p>
      </div>

      {loading ? (
        <PortalState loading icon={Folder} title="Loading files" />
      ) : error ? (
        <PortalState icon={Folder} title="Files unavailable" message={error} actionLabel="Retry" onAction={loadFiles} />
      ) : files.length === 0 ? (
        <PortalState icon={FileText} title="No files available" message="Project files and deliverables will appear here once shared." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((f) => {
            const Icon = getIcon(f.type);
            return (
              <Card key={f.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-8 h-8 text-slate-500" />
                  <div className="flex gap-1">
                    <button className="p-1 text-slate-400 hover:text-slate-600" title="Copy file reference" aria-label={`Copy ${f.name} reference`}>
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-600" title="Download file" aria-label={`Download ${f.name}`}>
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-red-500" title="Delete file" aria-label={`Delete ${f.name}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{f.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{f.size}</p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
