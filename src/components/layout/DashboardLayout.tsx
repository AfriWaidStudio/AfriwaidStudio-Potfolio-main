import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Breadcrumb } from "./Breadcrumb";
import { getNavigationByPath } from "../../app/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-black text-slate-900 dark:text-white">
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Breadcrumb />
          {children}
        </main>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
            <Sidebar />
          </div>
        </>
      )}
    </div>
  );
}
