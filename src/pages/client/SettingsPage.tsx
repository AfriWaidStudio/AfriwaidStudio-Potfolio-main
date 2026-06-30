import React, { useState, useEffect } from "react";
import { User, Bell, Shield, Palette, Save, Key, CreditCard, Plug, Monitor } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { Card, Input, Button } from "../../components/ui";
import { PortalState, getRouteLeaf } from "./PortalState";

export default function SettingsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [settings, setSettings] = useState({ profile: { firstName: "", lastName: "", username: "" }, notifications: { email: true, push: false } });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  const loadSettings = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("afriwaid_auth_token") || ""}` }
      });
      if (!res.ok) throw new Error(`Settings could not be loaded (${res.status}).`);
      const data = await res.json();
      setSettings(data.settings || { profile: {}, notifications: {} });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Settings could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaved("");
    setError("");
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Authorization": `Bearer ${localStorage.getItem("afriwaid_auth_token") || ""}`, "Content-Type": "application/json" },
        body: JSON.stringify(settings.profile)
      });
      if (!res.ok) throw new Error(`Settings could not be saved (${res.status}).`);
      setSaved("Settings saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Settings could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const section = getRouteLeaf(location.pathname, "/portal/settings");
  const titleMap: Record<string, string> = {
    overview: "Settings",
    profile: "Profile Settings",
    notifications: "Notification Settings",
    security: "Security Settings",
    sessions: "Active Sessions",
    "api-keys": "API Keys",
    appearance: "Appearance",
    billing: "Billing Settings",
    integrations: "Integrations",
  };
  const title = titleMap[section] || "Settings";
  const show = (key: string) => section === "overview" || section === key;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Manage your account preferences and security settings.
        </p>
      </div>

      {loading && <PortalState loading icon={User} title="Loading settings" />}
      {error && !loading && <PortalState icon={Shield} title="Settings need attention" message={error} actionLabel="Retry" onAction={loadSettings} />}
      {saved && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">{saved}</div>}

      {!loading && !error && (
      <div className="space-y-6">
        {show("profile") && (
        <Card title={<span className="flex items-center gap-2"><User className="w-5 h-5" /> Profile Settings</span>} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={settings.profile.firstName || ""}
              onChange={(e) => setSettings({...settings, profile: {...settings.profile, firstName: e.target.value}})}
            />
            <Input
              label="Last Name"
              value={settings.profile.lastName || ""}
              onChange={(e) => setSettings({...settings, profile: {...settings.profile, lastName: e.target.value}})}
            />
          </div>
        </Card>
        )}

        {show("notifications") && (
        <Card title={<span className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notification Preferences</span>} className="p-6">
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Email Notifications</span>
              <input type="checkbox" checked={settings.notifications.email} onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, email: e.target.checked}})} className="toggle" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Push Notifications</span>
              <input type="checkbox" checked={settings.notifications.push} onChange={(e) => setSettings({...settings, notifications: {...settings.notifications, push: e.target.checked}})} className="toggle" />
            </label>
          </div>
        </Card>
        )}

        {show("security") && (
        <Card title={<span className="flex items-center gap-2"><Shield className="w-5 h-5" /> Security</span>} className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">Change Password</Button>
            <Button variant="outline">Review Sessions</Button>
          </div>
        </Card>
        )}

        {show("sessions") && (
          <Card title={<span className="flex items-center gap-2"><Monitor className="w-5 h-5" /> Active Sessions</span>} className="p-6">
            <p className="text-sm text-slate-500 dark:text-zinc-400">Session management is available from the security API and will list browser sessions here.</p>
          </Card>
        )}

        {show("api-keys") && (
          <Card title={<span className="flex items-center gap-2"><Key className="w-5 h-5" /> API Keys</span>} className="p-6">
            <p className="text-sm text-slate-500 dark:text-zinc-400">No client API keys have been issued for this workspace.</p>
          </Card>
        )}

        {show("appearance") && (
          <Card title={<span className="flex items-center gap-2"><Palette className="w-5 h-5" /> Appearance</span>} className="p-6">
            <p className="text-sm text-slate-500 dark:text-zinc-400">Use the top bar theme toggle to switch between light and dark mode.</p>
          </Card>
        )}

        {show("billing") && (
          <Card title={<span className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> Billing</span>} className="p-6">
            <p className="text-sm text-slate-500 dark:text-zinc-400">Billing records are managed from the invoices workspace.</p>
          </Card>
        )}

        {show("integrations") && (
          <Card title={<span className="flex items-center gap-2"><Plug className="w-5 h-5" /> Integrations</span>} className="p-6">
            <p className="text-sm text-slate-500 dark:text-zinc-400">No external integrations are connected to this client portal yet.</p>
          </Card>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} leftIcon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </div>
      )}
    </div>
  );
}
