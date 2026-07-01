import React, { useEffect, useState } from "react";
import { RefreshCw, Save, Settings, Shield } from "lucide-react";
import { Button, Card, Input } from "../../components/ui";
import { PortalState } from "./PortalState";
import { portalRequest } from "./portalApi";

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [security, setSecurity] = useState<any>(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", username: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSettings = async () => {
    setLoading(true);
    setError("");
    try {
      const [settingsData, securityData] = await Promise.all([
        portalRequest<{ settings: { profile: any } }>("/api/settings"),
        portalRequest<{ security: any }>("/api/settings/security"),
      ]);
      const loadedProfile = settingsData.settings.profile;
      setProfile(loadedProfile);
      setSecurity(securityData.security);
      setForm({
        firstName: loadedProfile.firstName || "",
        lastName: loadedProfile.lastName || "",
        username: loadedProfile.username || "",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Settings could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const data = await portalRequest<{ user: any }>("/api/settings/profile", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      setProfile(data.user);
      setMessage("Profile updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Profile could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PortalState loading icon={Settings} title="Loading settings" />;
  if (error && !profile) return <PortalState icon={Settings} title="Settings need attention" message={error} actionLabel="Retry" onAction={loadSettings} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Profile and security details loaded from protected settings APIs.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadSettings} leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {message && <p className="text-sm text-emerald-600">{message}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Profile" className="p-0">
          <form onSubmit={saveProfile} className="p-6 pt-2 space-y-4">
            <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" />
            <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" />
            <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
            <Button type="submit" disabled={saving} leftIcon={<Save className="w-4 h-4" />}>{saving ? "Saving" : "Save profile"}</Button>
          </form>
        </Card>

        <Card title="Security" className="p-0">
          <div className="p-6 pt-2 space-y-3">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{profile?.role}</p>
                <p className="text-xs text-slate-500">Role clearance</p>
              </div>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-zinc-900 p-3 text-sm text-slate-600 dark:text-zinc-300">
              <p>Email verified: {profile?.isEmailVerified ? "Yes" : "No"}</p>
              <p>Status: {profile?.status}</p>
              <p>Two-factor: {security?.twoFactorEnabled ? "Enabled" : "Not enabled"}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
