import React from "react";
import { Link } from "react-router-dom";
import { Shield, Users, Settings, BarChart3, FileText, MessageSquare, Database, Globe, Key, Activity, LogOut } from "lucide-react";

const ADMIN_NAVIGATION = [
  { icon: BarChart3, label: "Overview", path: "/workspace/admin" },
  { icon: Users, label: "Users", path: "/workspace/admin/users" },
  { icon: FileText, label: "Projects", path: "/workspace/admin/projects" },
  { icon: Database, label: "Content", path: "/workspace/admin/content" },
  { icon: MessageSquare, label: "Support", path: "/workspace/admin/support" },
  { icon: Globe, label: "Website", path: "/" },
  { icon: Settings, label: "Settings", path: "/workspace/admin/settings" },
];

interface AdminWorkspaceLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export function AdminWorkspaceLayout({ children, activeTab = "Admin Central", setActiveTab }: AdminWorkspaceLayoutProps) {
  const handleNavigationClick = (path: string, tabName: string) => {
    if (setActiveTab) {
      setActiveTab(tabName);
    }
    window.history.pushState({}, "", path);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex">
      <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-neutral-800">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
              A
            </div>
            <span className="font-bold text-lg">AfriWaid Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_NAVIGATION.map((item) => {
            const isActive = activeTab === item.label;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigationClick(item.path, item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-neutral-800">
          <button 
            onClick={() => {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('token');
              localStorage.removeItem('afriwaid_admin_role');
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
          <h1 className="font-semibold">Administration Center</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-600 hover:text-blue-600">
              <Key className="w-4 h-4" />
            </button>
            <button className="relative p-2 text-slate-600 hover:text-blue-600">
              <Activity className="w-4 h-4" />
            </button>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}