import React, { useState, useEffect } from "react";
import { Settings, User, Bell, Shield, Palette, Save } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Card, Input, Button } from "../../components/ui";

export default function SettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState({ profile: { firstName: "", lastName: "", username: "" }, notifications: { email: true, push: false } });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/settings", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSettings(data.settings || { profile: {}, notifications: {} });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(settings.profile)
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Manage your account preferences and security settings.
        </p>
      </div>

      <div className="space-y-6">
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

        <Card title={<span className="flex items-center gap-2"><Shield className="w-5 h-5" /> Security</span>} className="p-6">
          <Button variant="outline">Change Password</Button>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving} leftIcon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}