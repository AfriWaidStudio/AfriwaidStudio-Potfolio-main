import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui";

interface PortalStateProps {
  title: string;
  message?: string;
  icon?: React.ElementType;
  actionLabel?: string;
  onAction?: () => void;
  loading?: boolean;
}

export function PortalState({ title, message, icon: Icon = AlertCircle, actionLabel, onAction, loading = false }: PortalStateProps) {
  const StateIcon = loading ? RefreshCw : Icon;

  return (
    <div className="text-center py-12 px-4 text-slate-500 dark:text-zinc-400">
      <StateIcon className={`w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-zinc-700 ${loading ? "animate-spin" : ""}`} />
      <p className="font-mono text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-zinc-300">{title}</p>
      {message && <p className="text-sm mt-2 max-w-md mx-auto leading-6">{message}</p>}
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function getRouteLeaf(pathname: string, basePath: string) {
  const suffix = pathname.replace(basePath, "").replace(/^\/+/, "");
  return suffix || "overview";
}
