import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { User, UserRole } from "../../types";
import { Users, Search, UserPlus, ShieldAlert, Award, UserMinus, ToggleLeft, ToggleRight, Check, X, Loader2 } from "lucide-react";

export default function UsersListManager() {
  const { token, user: activeUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Create User Form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("User");
  const [modalLoading, setModalLoading] = useState(false);

  // Edit User state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<UserRole>("User");
  const [editingStatus, setEditingStatus] = useState<"active" | "suspended" | "pending">("active");

  const fetchUsersList = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        const d = await res.json();
        setErrorMsg(d.error || "Failed loading user directory.");
      }
    } catch (e) {
      console.warn("User list fetch fallback (displaying mock registries)", e);
      setUsers([
        { id: "u-1", firstName: "Waid", lastName: "Soko", username: "alasiri_waid", email: "waidsoko@gmail.com", role: "Super Admin", isEmailVerified: true, status: "active", createdAt: "2026-06-10T12:00:00Z" },
        { id: "u-2", firstName: "Aero", lastName: "Logistics", username: "aeroglobal", email: "logistics@aeroglobal.com", role: "Client", isEmailVerified: true, status: "active", createdAt: "2026-06-11T12:00:00Z" },
        { id: "u-3", firstName: "Amara", lastName: "Okonkwo", username: "amara_vanguard", email: "user@afriwaid.com", role: "User", isEmailVerified: false, status: "active", createdAt: "2026-06-12T12:00:00Z" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, [token]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !username || !email || !password) {
      setErrorMsg("All parameters are mandatory.");
      return;
    }

    setModalLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ firstName, lastName, username, email, password, role })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`User account ${username} created successfully.`);
        setShowAddModal(false);
        // Clear fields
        setFirstName("");
        setLastName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("User");
        fetchUsersList();
      } else {
        setErrorMsg(data.error || "Registry creation rejected.");
      }
    } catch (e) {
      setErrorMsg("Failed executing user creation on backend database.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateStatusAndRole = async (targetId: string, updatedRole: UserRole, status: "active" | "suspended" | "pending") => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/users/${targetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role: updatedRole, status })
      });
      if (res.ok) {
        setSuccessMsg("User clearance updated successfully.");
        setEditingUserId(null);
        fetchUsersList();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || "Update rejected.");
      }
    } catch (e) {
      setErrorMsg("Backend communication exception.");
    }
  };

  const handleDeleteUser = async (targetId: string) => {
    if (!confirm("Are you absolutely sure you want to delete this user? This system action is irreversible.")) return;

    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/users/${targetId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setSuccessMsg("User account deleted.");
        fetchUsersList();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || "Deletion rejected.");
      }
    } catch (e) {
      setErrorMsg("Failed connecting to directory endpoints.");
    }
  };

  // Filter list
  const filteredUsers = users.filter(u =>
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left font-sans text-xs text-neutral-300">
      
      {/* Header operations bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h4 className="text-sm font-mono text-white font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Identity & User Directory</span>
          </h4>
          <p className="text-[11px] text-neutral-450 leading-normal pt-1 font-sans">
            Search, suspend, activate, and configure systems profiles across AfriWaid Studio.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-[9px] uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md border border-blue-500/10 self-start sm:self-center"
          id="btn-admin-add-user"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Add Operator Profile</span>
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3 rounded-lg border border-red-900 bg-red-950/40 text-red-400 font-mono flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-lg border border-emerald-900 bg-emerald-950/40 text-emerald-400 font-mono flex items-center gap-1.5">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Input filter bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-500">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter directories by account credentials or role tags..."
          className="w-full pl-9 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs text-left"
          id="admin-user-search-input"
        />
      </div>

      {/* Directory table grid */}
      <div className="bg-neutral-950 border border-neutral-850 rounded-xl overflow-hidden shadow-inner">
        {loading ? (
          <div className="py-16 text-center space-y-2 font-mono">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
            <span>Re-indexing security registers...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <p className="py-12 text-center text-neutral-500 font-mono italic">No matching users located in database files.</p>
        ) : (
          <div className="overflow-x-auto select-none no-scrollbar">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-neutral-900/60 border-b border-neutral-800 font-mono uppercase text-[9px] text-neutral-400">
                  <th className="p-4">Full Identity</th>
                  <th className="p-4">Email Handles</th>
                  <th className="p-4">RBAC Role</th>
                  <th className="p-4">Verified</th>
                  <th className="p-4">Active State</th>
                  <th className="p-4 text-center">System Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-neutral-900/20 transition duration-100">
                    {/* Identity Name details */}
                    <td className="p-4">
                      <div className="font-bold text-white text-xs whitespace-nowrap">
                        {u.firstName} {u.lastName}
                      </div>
                      <div className="text-[10px] text-neutral-550 font-mono pt-0.5">@{u.username}</div>
                    </td>

                    {/* Email address info */}
                    <td className="p-4 whitespace-nowrap text-neutral-400 font-mono">{u.email}</td>

                    {/* Active RBAC role list */}
                    <td className="p-4 whitespace-nowrap font-mono">
                      {editingUserId === u.id ? (
                        <select
                          value={editingRole}
                          onChange={(e) => setEditingRole(e.target.value as UserRole)}
                          className="bg-neutral-900 border border-neutral-750 text-white rounded p-1 text-[11px] focus:outline-blue-500 cursor-pointer"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Admin">Admin</option>
                          <option value="Operator">Operator</option>
                          <option value="Moderator">Moderator</option>
                          <option value="Auditor">Auditor</option>
                          <option value="Developer">Developer</option>
                          <option value="Client">Client</option>
                          <option value="User">User</option>
                          <option value="Guest">Guest</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                          u.role === "Super Admin" ? "bg-red-950/60 border-red-800 text-red-400" :
                          u.role === "Admin" ? "bg-blue-950/60 border-blue-800 text-blue-400" :
                          u.role === "Client" ? "bg-amber-950/60 border-amber-800 text-amber-400" :
                          u.role === "Operator" ? "bg-cyan-950/60 border-cyan-800 text-cyan-400" :
                          "bg-neutral-900 border-neutral-750 text-neutral-350"
                        }`}>
                          {u.role}
                        </span>
                      )}
                    </td>

                    {/* Verification Status check */}
                    <td className="p-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        u.isEmailVerified ? "bg-emerald-950/50 text-emerald-400 border border-emerald-900/40" : "bg-red-950/50 text-red-400 border border-red-905/40"
                      }`}>
                        {u.isEmailVerified ? "CERTIFIED" : "UNVERIFIED"}
                      </span>
                    </td>

                    {/* Active session check */}
                    <td className="p-4 whitespace-nowrap font-mono">
                      {editingUserId === u.id ? (
                        <select
                          value={editingStatus}
                          onChange={(e) => setEditingStatus(e.target.value as any)}
                          className="bg-neutral-900 border border-neutral-750 text-white rounded p-1 text-[11px] focus:outline-blue-500 cursor-pointer"
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="pending">Pending</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                          <span className="capitalize">{u.status}</span>
                        </div>
                      )}
                    </td>

                    {/* Operations options list */}
                    <td className="p-4 whitespace-nowrap text-center">
                      <div className="inline-flex gap-2">
                        {editingUserId === u.id ? (
                          <>
                            <button
                              onClick={() => handleUpdateStatusAndRole(u.id, editingRole, editingStatus)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer"
                              title="Commit update parameters"
                            >
                              SAVE
                            </button>
                            <button
                              onClick={() => setEditingUserId(null)}
                              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded cursor-pointer"
                            >
                              CANCEL
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingUserId(u.id);
                                setEditingRole(u.role);
                                setEditingStatus(u.status);
                              }}
                              className="px-2.5 py-1.5 border border-neutral-800 hover:border-blue-400 text-neutral-300 hover:text-white rounded font-mono text-[9px] uppercase cursor-pointer transition duration-150"
                              id={`edit-user-btn-${u.id}`}
                            >
                              EDIT
                            </button>
                            {u.id !== activeUser?.id && (
                              <button
                                onClick={() => handleDeleteUser(u.id)}
                                className="px-2 py-1.5 border border-red-950 hover:bg-red-950 text-red-500 rounded font-mono text-[9px] uppercase cursor-pointer"
                                id={`del-user-btn-${u.id}`}
                              >
                                DELETE
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-850 rounded-2xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-white flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-blue-500" />
                Enroll New Operator Account
              </span>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 px-2 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded font-mono text-[9px] font-bold border border-neutral-800 cursor-pointer"
              >
                ESC
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 font-sans text-xs">
              
              {/* Full Name inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 font-semibold uppercase block text-[9px]">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Waid"
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 font-semibold uppercase block text-[9px]">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Soko"
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Username & Email row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 font-semibold uppercase block text-[9px]">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="alasiri_waid"
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-mono text-neutral-400 font-semibold uppercase block text-[9px]">Email Coordinates</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@afriwaid.com"
                    className="w-full px-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Role selector */}
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 font-semibold uppercase block text-[9px]">Requested RBAC Role Mode</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white cursor-pointer"
                >
                  <option value="Super Admin">Super Admin (Absolute Operations Owner)</option>
                  <option value="Admin">Admin (Core platform controls)</option>
                  <option value="Operator">Operator (Upload project deliverables)</option>
                  <option value="Moderator">Moderator (Manage users chat logs)</option>
                  <option value="Auditor">Compliance Auditor (Audit read-only logs)</option>
                  <option value="Developer">Developer (Systems telemetry diagnostics)</option>
                  <option value="Client">Client Partner (Portal activities)</option>
                  <option value="User">Standard User (Portal accounts)</option>
                </select>
              </div>

              {/* Secure Password pin */}
              <div className="space-y-1">
                <label className="font-mono text-neutral-400 font-semibold uppercase block text-[9px]">Secure Access Passcode</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-10 py-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                disabled={modalLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-[9px] uppercase tracking-wider rounded-lg transition"
              >
                {modalLoading ? "Creating account register..." : "Deploy New Account coordinates"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
