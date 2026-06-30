import React from "react";

interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "default" | "pills" | "underline";
}

export function Tabs({ tabs, activeTab, onChange, variant = "default" }: TabsProps) {
  const baseClasses = "flex gap-1";
  const variantClasses = {
    default: "bg-slate-100 dark:bg-zinc-900 p-1 rounded-lg",
    pills: "gap-2",
    underline: "border-b border-slate-200 dark:border-zinc-800",
  };

  const getButtonClasses = (id: string) => {
    const isActive = activeTab === id;
    if (variant === "default") {
      return `flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm"
          : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
      }`;
    }
    if (variant === "pills") {
      return `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isActive
          ? "bg-cyan-500 text-white"
          : "text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900"
      }`;
    }
    return `flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
      isActive
        ? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
        : "border-transparent text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
    }`;
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={getButtonClasses(tab.id)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}