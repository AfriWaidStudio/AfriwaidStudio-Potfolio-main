import React from "react";
import { Link } from "react-router-dom";
import { FileText, MessageSquare, BarChart3, Shield, Settings, LogOut, AlertCircle } from "lucide-react";

const MODERATOR_NAVIGATION = [
  { icon: BarChart3, label: "Overview", path: "/workspace/moderator" },
  { icon: FileText, label: "Content Review", path: "/workspace/moderator/content" },
  { icon: MessageSquare, label: "Support Review", path: "/workspace/moderator/support" },
  { icon: AlertCircle, label: "Reports", path: "/workspace/moderator/reports" },
  { icon: Shield, label: "Moderation", path: "/workspace/moderator/moderation" },
];

interface ModeratorWorkspaceLayoutProps {
  children: React.ReactNode;
}

export function ModeratorWorkspaceLayout({ children }: ModeratorWorkspaceLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex">
      <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-neutral-800">
          <Link to="/workspace/moderator" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center font-bold">
              M
            </div>
            <span className="font-bold text-lg">Moderator Workspace</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {MODERATOR_NAVIGATION.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-neutral-800">
          <button 
            onClick={() => {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-zinc-400 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between px-6">
          <h1 className="font-semibold">Moderator Dashboard</h1>
        </header>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}