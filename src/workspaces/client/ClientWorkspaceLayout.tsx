import React from "react";
import { Link } from "react-router-dom";
import { Folder, MessageSquare, FileText, Calendar, Shield, Settings, LogOut, Users, CheckSquare, Clock, Receipt } from "lucide-react";
import { Button } from "../../components/ui";

const CLIENT_NAVIGATION = [
  { icon: Users, label: "Overview", path: "/portal" },
  { icon: Folder, label: "Projects", path: "/portal/projects" },
  { icon: Clock, label: "Timeline", path: "/portal/timeline" },
  { icon: FileText, label: "Deliverables", path: "/portal/deliverables" },
  { icon: CheckSquare, label: "Approvals", path: "/portal/approvals" },
  { icon: Receipt, label: "Invoices", path: "/portal/invoices" },
  { icon: Calendar, label: "Meetings", path: "/portal/meetings" },
  { icon: MessageSquare, label: "Messages", path: "/portal/messages" },
  { icon: Settings, label: "Settings", path: "/portal/settings" },
];

interface ClientWorkspaceLayoutProps {
  children: React.ReactNode;
}

export function ClientWorkspaceLayout({ children }: ClientWorkspaceLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex">
      <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-neutral-800">
          <Link to="/portal" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold">
              CP
            </div>
            <span className="font-bold text-lg">Client Portal</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {CLIENT_NAVIGATION.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
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
        <header className="h-14 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between px-6">
          <h1 className="font-semibold">Client Workspace</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-600 hover:text-blue-600">
              <Shield className="w-4 h-4" />
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