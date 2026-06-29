import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, Folder, FileText, Check, BadgeDollarSign, MessageSquare, 
  ShieldCheck, Settings, Calendar, Users, ChevronDown, ChevronRight, LogOut, Cpu
} from "lucide-react";
import { CLIENT_NAVIGATION, NavigationItem } from "../../app/navigation";
import { useAuth } from "../AuthContext";

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (item: NavigationItem): boolean => {
    const currentPath = location.pathname;
    if (item.path === currentPath) return true;
    if (item.children) {
      return item.children.some(child => child.path === currentPath);
    }
    return false;
  };

  const activeParentId = React.useMemo(() => {
    for (const item of CLIENT_NAVIGATION) {
      if (item.path === location.pathname) return item.id;
      if (item.children) {
        if (item.children.some(child => child.path === location.pathname)) {
          return item.id;
        }
      }
    }
    return null;
  }, [location.pathname]);

  React.useEffect(() => {
    if (activeParentId) {
      setExpandedItems(prev => ({ ...prev, [activeParentId]: true }));
    }
  }, [activeParentId]);

  return (
    <aside className="w-64 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-neutral-800 flex flex-col h-screen shrink-0">
      <div className="p-6 border-b border-slate-200 dark:border-neutral-800">
        <Link to="/portal" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
            A
          </div>
          <span className="font-bold text-lg">AfriWaid Client</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {CLIENT_NAVIGATION.map((item) => {
          const active = isActive(item);
          const expanded = expandedItems[item.id];
          const hasChildren = item.children && item.children.length > 0;

          return (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => hasChildren ? toggleItem(item.id) : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition colors ${
                  active 
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 dark:text-zinc-400 hover:bg-slate-200/50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? "text-blue-600" : "text-slate-400"}`} />
                <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                {hasChildren && (
                  expanded ? 
                    <ChevronDown className="w-4 h-4 text-slate-400" /> :
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {hasChildren && expanded && (
                <div className="ml-6 pl-2 border-l border-slate-200 dark:border-zinc-800">
                  {item.children!.map((child) => (
                    <Link
                      key={child.id}
                      to={child.path}
                      className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded transition ${
                        location.pathname === child.path
                          ? "bg-blue-500/20 text-blue-500 font-medium"
                          : "text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                      }`}
                    >
                      <span className="flex-1">{child.label}</span>
                      {child.badge && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5">
                          {child.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-bold">SYSTEM OVERSEER: ARCH-1</span>
        </div>
        <button 
          onClick={() => {
            logout();
            window.location.reload();
          }}
          className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-red-500/10 dark:bg-zinc-900 hover:bg-red-950/20 text-slate-600 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 rounded-lg transition font-bold"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>LOGOUT</span>
        </button>
      </div>
    </aside>
  );
}