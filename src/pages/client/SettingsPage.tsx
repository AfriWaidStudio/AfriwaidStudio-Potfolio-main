import React, { useState } from "react";
import { User, Bell, Shield, Key, Palette, CreditCard, Link, Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "api-keys", label: "API Keys", icon: Key },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "integrations", label: "Integrations", icon: Link },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Configure your account and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-48">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
          {activeTab === "profile" && (
            <div className="space-y-4">
              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                Profile Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase mb-1 block">First Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black" />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase mb-1 block">Last Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black" />
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-mono text-xs hover:bg-blue-600 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                Security Settings
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
                  <p className="font-mono text-xs text-slate-500 mb-1">Change Password</p>
                  <p className="text-sm text-slate-700 dark:text-white">Update your password</p>
                </button>
                <button className="w-full text-left p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
                  <p className="font-mono text-xs text-slate-500 mb-1">Two-Factor Authentication</p>
                  <p className="text-sm text-slate-700 dark:text-white">Enable 2FA for extra security</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === "api-keys" && (
            <div className="space-y-4">
              <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                API Keys
              </h3>
              <div className="text-center py-12 text-slate-500">
                <Key className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p className="font-mono text-xs">API keys management - Coming soon</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}