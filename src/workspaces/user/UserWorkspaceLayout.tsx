import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Folder, MessageSquare, FileText, Calendar, Shield, Settings, LogOut, Users, CheckSquare, Clock, Receipt, BarChart3 } from "lucide-react";
import { Button } from "../../components/ui";

const USER_NAVIGATION = [
  { icon: BarChart3, label: "Overview", path: "/portal" },
  { icon: Folder, label: "Projects", path: "/portal/projects" },
  { icon: Clock, label: "Timeline", path: "/portal/timeline" },
  { icon: FileText, label: "Deliverables", path: "/portal/deliverables" },
  { icon: CheckSquare, label: "Approvals", path: "/portal/approvals" },
  { icon: Receipt, label: "Invoices", path: "/portal/invoices" },
  { icon: Calendar, label: "Meetings", path: "/portal/meetings" },
  { icon: MessageSquare, label: "Messages", path: "/portal/messages" },
  { icon: Folder, label: "Files", path: "/portal/files" },
  { icon: Users, label: "Team", path: "/portal/team" },
  { icon: BarChart3, label: "Reports", path: "/portal/reports" },
  { icon: Settings, label: "Settings", path: "/portal/settings" },
];

interface UserWorkspaceLayoutProps {
  children: React.ReactNode;
}

export function UserWorkspaceLayout({ children }: UserWorkspaceLayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/portal") {
      return location.pathname === "/portal";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex">
      <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-neutral-800">
          <Link to="/portal" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold">
              UP
            </div>
            <span className="font-bold text-lg">User Portal</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {USER_NAVIGATION.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  active
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
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
          <h1 className="font-semibold">User Workspace</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="p-2">
              <Shield className="w-4 h-4" />
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