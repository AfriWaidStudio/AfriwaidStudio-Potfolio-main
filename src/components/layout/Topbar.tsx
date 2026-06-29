import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Menu, X, Search, Bell, ChevronDown, Globe, Sun, Moon, 
  ArrowLeft, Maximize2, Command
} from "lucide-react";
import { useAuth } from "../AuthContext";

interface TopbarProps {
  onMobileMenuToggle?: () => void;
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("afriwaid_theme") === "dark";
  });
  const [profileOpen, setProfileOpen] = useState(false);

  const handleThemeToggle = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("afriwaid_theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("afriwaid_theme", "dark");
      setIsDark(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="h-14 border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        {onMobileMenuToggle && (
          <button 
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-slate-600 hover:text-blue-600 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-zinc-900 rounded-lg text-xs font-mono">
          <Globe className="w-4 h-4 text-slate-500" />
          <span className="text-slate-600 dark:text-zinc-300">EN</span>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>

        <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-zinc-900 rounded-lg text-xs font-mono">
          <Command className="w-4 h-4 text-slate-500" />
          <span className="text-slate-600 dark:text-zinc-300">K B</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleThemeToggle}
          className="p-2 text-slate-600 hover:text-yellow-600 rounded-lg"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="relative p-2 text-slate-600 hover:text-blue-600 rounded-lg">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-zinc-900 rounded-lg"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
              {user?.firstName?.[0] || "U"}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs text-slate-500">{user?.role}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
              <Link to="/dashboard/settings/profile" className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-zinc-900">
                Profile Settings
              </Link>
              <Link to="/dashboard/settings/security" className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-zinc-900">
                Security
              </Link>
              <div className="border-t border-slate-200 dark:border-neutral-800 my-1"></div>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-500/10 dark:hover:bg-red-950/20"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}