import React from "react";
import { Loader2, MessageSquare } from "lucide-react";

interface PortalStateProps {
  loading?: boolean;
  icon?: React.ElementType;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function PortalState({ loading, icon: Icon, title, message, actionLabel, onAction }: PortalStateProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-slate-500 dark:text-zinc-400">{title}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon className="w-12 h-12 text-slate-300 dark:text-zinc-700 mb-3" />}
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1">{title}</h3>
      {message && <p className="text-sm text-slate-500 dark:text-zinc-400 mb-3">{message}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="text-sm text-blue-500 hover:text-blue-600 font-medium">
          {actionLabel}
        </button>
      )}
    </div>
  );
}