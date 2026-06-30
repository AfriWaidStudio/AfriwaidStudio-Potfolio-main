import React, { useState, useEffect } from "react";
import { User, ShieldCheck, Key, Lock, Monitor, Trash2, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { useAuth } from "./AuthContext";

interface SessionDetails {
  id: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export default function SecuritySettings() {
  const { user, token, updateProfile, updatePassword, logout } = useAuth();
  
  // Profile settings state
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email] = useState(user?.email || ""); // Read-only secure email label
  
  const [profileSuccessMsg, setProfileSuccessMsg] = useState("");
  const [profileErrorMsg, setProfileErrorMsg] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // Password settings state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [securitySuccessMsg, setSecuritySuccessMsg] = useState("");
  const [securityErrorMsg, setSecurityErrorMsg] = useState("");
  const [securityLoading, setSecurityLoading] = useState(false);

  // Active Sessions
  const [sessions, setSessions] = useState<SessionDetails[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsErrorMsg, setSessionsErrorMsg] = useState("");

  const fetchActiveSessions = async () => {
    if (!token) return;
    setSessionsLoading(true);
    setSessionsErrorMsg("");
    try {
      const res = await fetch("/api/auth/sessions", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Sessions could not be loaded (${res.status}).`);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (e) {
      console.warn("Sessions retrieval failed.", e);
      setSessionsErrorMsg(e instanceof Error ? e.message : "Sessions could not be loaded.");
    } finally {
      setSessionsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSessions();
  }, [token]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg("");
    setProfileErrorMsg("");

    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      setProfileErrorMsg("All fields are required.");
      return;
    }

    setProfileLoading(true);
    const res = await updateProfile(firstName, lastName, username);
    setProfileLoading(false);

    if (res.success) {
      setProfileSuccessMsg("Profile details dynamically updated successfully inside user registers.");
      setTimeout(() => setProfileSuccessMsg(""), 3000);
    } else {
      setProfileErrorMsg(res.error || "Registry update request rejected.");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecuritySuccessMsg("");
    setSecurityErrorMsg("");

    if (!currentPassword.trim() || !newPassword.trim()) {
      setSecurityErrorMsg("Please specify both parameters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityErrorMsg("Error: Password confirmation mismatch.");
      return;
    }

    if (newPassword.length < 8) {
      setSecurityErrorMsg("Password must meet minimum complexity guidelines (length >= 8).");
      return;
    }

    setSecurityLoading(true);
    const res = await updatePassword(currentPassword, newPassword);
    setSecurityLoading(false);

    if (res.success) {
      setSecuritySuccessMsg("Logging parameters securely renewed. dispatches deactivated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSecuritySuccessMsg(""), 3000);
      fetchActiveSessions();
    } else {
      setSecurityErrorMsg(res.error || "Passcode renewing check parameter mismatch.");
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
      } else {
        setSessionsErrorMsg(`Session could not be revoked (${res.status}).`);
      }
    } catch (e) {
      console.warn("Session revoke request failed.", e);
      setSessionsErrorMsg("Session could not be revoked. Please try again shortly.");
    }
  };

  const handleLogoutAllSessions = async () => {
    try {
      const res = await fetch("/api/auth/logout-all", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        logout(); // Automatically clear local environment state and disconnect
      }
    } catch (e) {
      console.error("Logout all fail.", e);
      logout();
    }
  };

  return (
    <div className="space-y-12 text-left text-slate-800 animate-fadeIn">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-display font-extrabold text-slate-950 tracking-tight">Access Control & Security Settings</h1>
        <p className="text-xs text-slate-400 font-mono font-semibold">SECURITY CLEARANCE PROFILE CENTER</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left column: Profile update form */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-blue-500/[0.01] to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-display text-slate-950 font-bold">Identity Coordinates</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4 font-sans text-xs">
            {profileErrorMsg && (
              <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 font-mono flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
                <span>{profileErrorMsg}</span>
              </div>
            )}

            {profileSuccessMsg && (
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-mono uppercase tracking-wider font-semibold text-slate-500">First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs"
                id="sec-profile-first"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono uppercase tracking-wider font-semibold text-slate-500">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs"
                id="sec-profile-last"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono uppercase tracking-wider font-semibold text-slate-500">Username handle</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs"
                id="sec-profile-username"
              />
            </div>

            <div className="space-y-1.5 text-slate-400">
              <label className="font-mono uppercase tracking-wider font-semibold text-slate-500 block">Registered Email Address (Locked)</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed text-xs"
              />
              <span className="text-[10px] block font-sans italic leading-tight">To modify the core email handle, please establish a formal Super Admin ticketing audit request.</span>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition duration-150 font-mono cursor-pointer flex items-center justify-center gap-1.5"
              id="sec-profile-submit"
            >
              {profileLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Save Profile Coordinates"}
            </button>
          </form>
        </section>

        {/* Right column: Password update form */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs relative overflow-hidden">
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-indigo-500/[0.01] to-transparent pointer-events-none" />

          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Key className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-display text-slate-950 font-bold">Passcode Renewal Matrix</h3>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4 font-sans text-xs">
            {securityErrorMsg && (
              <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 font-mono flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-650 shrink-0" />
                <span>{securityErrorMsg}</span>
              </div>
            )}

            {securitySuccessMsg && (
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{securitySuccessMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-mono uppercase tracking-wider font-semibold text-slate-500">Current Security Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs"
                id="sec-pass-current"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono uppercase tracking-wider font-semibold text-slate-500">New Safety Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs"
                id="sec-pass-new"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono uppercase tracking-wider font-semibold text-slate-500">Verify Password Pin</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs"
                id="sec-pass-confirm"
              />
            </div>

            <button
              type="submit"
              disabled={securityLoading}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition duration-150 font-mono cursor-pointer flex items-center justify-center gap-1.5"
              id="sec-pass-submit"
            >
              {securityLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Initiate Passcode Upgrade"}
            </button>
          </form>
        </section>

      </div>

      {/* SECTION: ACTIVE OPERATIONAL SESSIONS (Session Management and Device Tracking) */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-500/[0.01] to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-display text-slate-950 font-bold">Session & Device Trace Directory</h3>
              <p className="text-[11px] text-slate-400 font-sans">Active token identifiers authorized across global networks.</p>
            </div>
          </div>
          
          <button
            onClick={handleLogoutAllSessions}
            className="px-4 py-2 bg-red-100/80 hover:bg-red-200 border border-red-200/50 text-red-750 font-bold text-[9px] uppercase tracking-wide rounded-lg transition duration-150 font-mono cursor-pointer self-start sm:self-center"
            id="sec-session-revoke-all"
          >
            Revoke All Other Sessions
          </button>
        </div>

        {sessionsErrorMsg && (
          <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 font-mono text-xs flex items-center justify-between gap-3">
            <span>{sessionsErrorMsg}</span>
            <button type="button" onClick={fetchActiveSessions} className="font-bold uppercase text-[9px] text-red-800 hover:text-red-950">
              Retry
            </button>
          </div>
        )}

        {sessionsLoading ? (
          <div className="py-12 text-center text-slate-400 font-mono text-[11px] flex items-center justify-center gap-1.5">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>Preloading security telemetry indices...</span>
          </div>
        ) : sessions.length === 0 ? (
          <p className="py-6 text-center text-xs text-slate-405 font-mono italic">No active telemetry sessions logged.</p>
        ) : (
          <div className="space-y-4 font-mono text-xs">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition duration-150 ${
                  sess.isCurrent ? "border-blue-200 bg-blue-50/20" : "border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs"
                }`}
              >
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[9px]">IP: {sess.ipAddress}</span>
                    {sess.isCurrent && (
                      <span className="px-2 py-0.5 rounded border border-blue-200 bg-blue-50 text-blue-700 font-black text-[9px] uppercase animate-pulse">
                        CURRENT DEVICE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-700 font-sans leading-relaxed pt-1 max-w-xl break-all">
                    System UserAgent: <span className="font-mono text-slate-500">{sess.userAgent}</span>
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Authorized on: <span className="text-slate-600">{new Date(sess.createdAt).toLocaleString()}</span> — Access Expires: <span className="text-slate-600">{new Date(sess.expiresAt).toLocaleString()}</span>
                  </p>
                </div>

                {!sess.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg hover:text-rose-750 font-bold uppercase text-[9px] border border-rose-200/50 cursor-pointer flex items-center gap-1 transition"
                    title="Terminate token authentication session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>REVOKE</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
