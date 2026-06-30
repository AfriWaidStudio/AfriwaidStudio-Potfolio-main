import React, { useState, useEffect } from "react";
import { Folder, FileText, Image, FileJson, Copy, Download, Trash2 } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Card } from "../../components/ui";

interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  projectId: string;
  uploadedAt: string;
}

export default function FilesPage() {
  const { token } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFiles = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/files", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setFiles(data.files || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadFiles();
  }, [token]);

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
        <div className="text-center py-12 text-slate-500">
          <Folder className="w-12 h-12 mx-auto mb-4 text-slate-300 animate-pulse" />
          <p className="font-mono text-xs">Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="font-mono text-xs">No files available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((f) => {
            const Icon = getIcon(f.type);
            return (
              <Card key={f.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-8 h-8 text-slate-500" />
                  <div className="flex gap-1">
                    <button className="p-1 text-slate-400 hover:text-slate-600">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-600">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-red-500">
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