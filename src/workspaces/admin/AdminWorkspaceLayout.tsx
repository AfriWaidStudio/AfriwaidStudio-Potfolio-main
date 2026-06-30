import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Users, Settings, BarChart3, FileText, MessageSquare, Database, Globe, Key, Activity, LogOut } from "lucide-react";
import { Button } from "../../components/ui";

const ADMIN_NAVIGATION = [
  { icon: BarChart3, label: "Overview", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: FileText, label: "Projects", path: "/admin/projects" },
  { icon: Database, label: "Content", path: "/admin/content" },
  { icon: MessageSquare, label: "Support", path: "/admin/support" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

interface AdminWorkspaceLayoutProps {
  children: React.ReactNode;
}

export function AdminWorkspaceLayout({ children }: AdminWorkspaceLayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
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

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {ADMIN_NAVIGATION.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-neutral-800">
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('token');
              localStorage.removeItem('afriwaid_admin_role');
              localStorage.removeItem('afriwaid_auth_token');
              localStorage.removeItem('afriwaid_fallback_user');
              window.location.href = '/';
            }}
            className="w-full justify-start text-slate-600 dark:text-zinc-400 hover:text-red-600"
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between px-6 bg-white dark:bg-zinc-950">
          <h1 className="font-semibold">Administration Center</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="p-2">
              <Key className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Activity className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}