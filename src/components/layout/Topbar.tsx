import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu, Search, Bell, ChevronDown, Sun, Moon, LifeBuoy, Settings
} from "lucide-react";
import { useAuth } from "../AuthContext";
import { Button } from "../ui";
import { getNavigationByPath } from "../../app/navigation";

interface TopbarProps {
  onMobileMenuToggle?: () => void;
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("afriwaid_theme") === "dark";
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navContext = getNavigationByPath(location.pathname);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/portal/messages/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="min-h-14 border-b border-slate-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 flex items-center justify-between gap-4 px-4 md:px-6 py-2 shrink-0">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {onMobileMenuToggle && (
          <Button variant="ghost" size="sm" className="lg:hidden p-2" onClick={onMobileMenuToggle}>
            <Menu className="w-5 h-5" />
          </Button>
        )}

        <form onSubmit={handleSearch} className="hidden md:flex h-10 w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500 dark:border-zinc-800 dark:bg-zinc-900/70">
          <Search className="h-4 w-4 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            placeholder={`Search ${navContext.item?.label || "portal"}...`}
            aria-label="Search portal"
          />
        </form>

        <div className="hidden xl:flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          <span className="font-mono uppercase">{navContext.item?.label || "Portal"}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Button variant="ghost" size="sm" className="hidden sm:inline-flex p-2" onClick={() => navigate("/portal/messages")}>
          <LifeBuoy className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm" className="hidden sm:inline-flex p-2" onClick={() => navigate("/portal/settings")}>
          <Settings className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm" className="p-2" onClick={handleThemeToggle}>
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 md:p-2"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
              {user?.firstName?.[0] || "U"}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs text-slate-500">{user?.role}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </Button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-neutral-800 rounded-lg shadow-lg py-1 z-50">
              <Link to="/portal/settings/profile" className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-zinc-900">
                Profile Settings
              </Link>
              <Link to="/portal/settings/security" className="block px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-zinc-900">
                Security
              </Link>
              <div className="border-t border-slate-200 dark:border-neutral-800 my-1"></div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start px-4 py-2 text-red-600 hover:bg-red-500/10 dark:hover:bg-red-950-20"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
