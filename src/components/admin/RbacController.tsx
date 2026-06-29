import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Role, Permission } from "../../types";
import { ShieldCheck, Loader2, CheckSquare, Square, RefreshCcw, Save, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RbacController() {
  const { token, reloadPermissionsAndUsers } = useAuth();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleName, setSelectedRoleName] = useState<string>("");
  const [activePermissions, setActivePermissions] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadRbacData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [rRes, pRes] = await Promise.all([
        fetch("/api/admin/roles", { headers: { "Authorization": `Bearer ${token}` } }),
        fetch("/api/admin/permissions", { headers: { "Authorization": `Bearer ${token}` } })
      ]);

      if (rRes.ok && pRes.ok) {
        const rData = await rRes.json();
        const pData = await pRes.json();
        
        const rolesList = rData.roles || [];
        const permissionList = pData.permissions || [];
        
        setRoles(rolesList);
        setPermissions(permissionList);

        // Select first role automatically
        if (rolesList.length > 0) {
          const defaultRole = rolesList.find((r: Role) => r.name === "Admin") || rolesList[0];
          setSelectedRoleName(defaultRole.name);
          setActivePermissions(defaultRole.permissions || []);
        }
      }
    } catch (e) {
      console.warn("RBAC offline fallback loaded.", e);
      // Hardcoded fallback permissions list corresponding to backend data-store seed config
      setRoles([
        { id: "r-1", name: "Super Admin", permissions: ["*"] },
        { id: "r-2", name: "Admin", permissions: ["p-users-create", "p-users-edit", "p-users-view", "p-proj-create", "p-proj-edit", "p-invoice-view"] },
        { id: "r-3", name: "Client", permissions: ["p-chat-send", "p-invoice-view"] }
      ]);
      setPermissions([
        { id: "p-users-view", name: "View Operators", action: "view", module: "users", description: "View list of registered operators" },
        { id: "p-users-create", name: "Create Operators", action: "create", module: "users", description: "Register new platform operator accounts" },
        { id: "p-users-edit", name: "Edit Operators", action: "edit", module: "users", description: "Alter role assignments and clearance tags" },
        { id: "p-proj-create", name: "Create Projects", action: "create", module: "projects", description: "Add a new creative venture to AfriWaid portfolio" },
        { id: "p-proj-edit", name: "Edit Projects", action: "edit", module: "projects", description: "Apply progress logs and tags" },
        { id: "p-chat-send", name: "Send Chat Messages", action: "send", module: "chat", description: "Interact on real-time channels" },
        { id: "p-invoice-view", name: "View Invoices", action: "view", module: "invoice", description: "Read payment statements and receipts" }
      ]);
      setSelectedRoleName("Admin");
      setActivePermissions(["p-users-create", "p-users-edit", "p-users-view", "p-proj-create", "p-proj-edit", "p-invoice-view"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRbacData();
  }, [token]);

  // Adjust permissions checking when chosen role changes
  useEffect(() => {
    const activeRole = roles.find(r => r.name === selectedRoleName);
    if (activeRole) {
      setActivePermissions(activeRole.permissions || []);
    }
  }, [selectedRoleName, roles]);

  const togglePermission = (id: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    if (id === "*") return; // Super admin unlimited wildcard cannot be altered

    setActivePermissions(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const saveRbacMatrixChanges = async () => {
    if (!selectedRoleName) return;
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`/api/admin/roles/${encodeURIComponent(selectedRoleName)}/permissions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ permissions: activePermissions })
      });

      if (res.ok) {
        setSuccessMsg(`Permissions rule sets updated for role ${selectedRoleName} in real database.`);
        // Reload global variables
        await reloadPermissionsAndUsers();

        // Update local roles list state
        setRoles(prev =>
          prev.map(r => r.name === selectedRoleName ? { ...r, permissions: activePermissions } : r)
        );

        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Save rejected.");
      }
    } catch (e) {
      setErrorMsg("Backend updating network request failed.");
    } finally {
      setSaving(false);
    }
  };

  // Group permissions by their respective modules
  const groupedPermissions: Record<string, Permission[]> = {};
  permissions.forEach(p => {
    if (!groupedPermissions[p.module]) {
      groupedPermissions[p.module] = [];
    }
    groupedPermissions[p.module].push(p);
  });

  const selectedRoleObj = roles.find(r => r.name === selectedRoleName);

  return (
    <div className="space-y-6 text-left font-sans text-xs text-neutral-300">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h4 className="text-sm font-mono text-white font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#8b5cf6]" />
            <span>Role-Based Access Control (RBAC) Console</span>
          </h4>
          <p className="text-[11px] text-neutral-450 leading-normal pt-1 font-sans">
            Configure permissions matrices mapped from Role to Permission to Module to Action. Super Admins operate on strict security protocols.
          </p>
        </div>

        <button
          onClick={loadRbacData}
          className="p-2 bg-neutral-950 hover:bg-neutral-850 text-neutral-400 hover:text-white border border-neutral-800 rounded-lg font-mono text-[9px] uppercase cursor-pointer flex items-center gap-1 transition"
          title="Reload system RBAC matrix"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Reload</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center space-y-2 font-mono">
          <Loader2 className="w-6 h-6 animate-spin text-[#8b5cf6] mx-auto" />
          <span>Syncing permissions system logs with database store...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel (4 cols): Role selectors */}
          <div className="lg:col-span-4 bg-neutral-950 border border-neutral-850 rounded-xl p-4 space-y-3">
            <span className="font-mono font-bold text-neutral-400 uppercase tracking-widest text-[9px] block">Select Role Channel</span>
            
            <div className="space-y-1">
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRoleName(r.name)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl border text-[11px] font-mono transition duration-150 flex items-center justify-between cursor-pointer ${
                    selectedRoleName === r.name
                      ? "bg-[#8b5cf6]/10 border-[#8b5cf6] text-white font-bold"
                      : "bg-neutral-900/30 border-neutral-850 text-neutral-400 hover:bg-neutral-900/10 hover:text-white"
                  }`}
                  id={`rbac-select-role-${r.name}`}
                >
                  <span>{r.name}</span>
                  <span className="text-[10px] text-neutral-500">
                    {r.permissions.includes("*") ? "Wildcard Rules" : `${r.permissions.length} nodes`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel (8 cols): Interactive checklist by module */}
          <div className="lg:col-span-8 bg-neutral-950 border border-neutral-850 rounded-xl p-6 space-y-6 relative overflow-hidden">
            
            {/* Context message */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-neutral-850">
              <div>
                <span className="text-[10px] text-neutral-450 font-mono">ACTIVE TARGET PROFILE:</span>
                <h5 className="font-mono text-white text-sm font-bold pt-0.5 uppercase tracking-wide">
                  Clearences for &ldquo;{selectedRoleName}&rdquo;
                </h5>
              </div>

              <button
                onClick={saveRbacMatrixChanges}
                disabled={saving || selectedRoleName === "Super Admin"}
                className="px-4 py-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold font-mono text-[9px] uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md disabled:opacity-40"
                id="rbac-submit-save"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Commit Permissions Rules</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg border border-red-900 bg-red-950/40 text-red-400 font-mono flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-lg border border-emerald-900 bg-emerald-950/40 text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Checkboxes grouped by Module directories */}
            {selectedRoleName === "Super Admin" ? (
              <div className="p-8 text-center bg-red-950/10 border border-red-900/30 rounded-xl space-y-2 mt-4">
                <ShieldCheck className="w-8 h-8 text-red-500 mx-auto" />
                <span className="font-mono font-bold text-red-400 uppercase tracking-widest text-[10px] block">SUPER ADMINISTRATOR WILDCARD ENABLED</span>
                <p className="text-[11px] text-neutral-450 leading-relaxed font-sans max-w-md mx-auto">
                  The Super Admin role is mapped to the absolute wildcard identifier (<code className="bg-neutral-900 px-1 py-0.5 border border-neutral-800 text-white font-semibold font-mono text-[10px] rounded">*</code>). Super Admins bypass all individual code check assertions. This wildcard remains locked to safeguard platform operations.
                </p>
              </div>
            ) : Object.keys(groupedPermissions).length === 0 ? (
              <p className="py-12 text-center text-neutral-500 font-mono italic">No permission modules loaded.</p>
            ) : (
              <div className="space-y-6">
                {Object.keys(groupedPermissions).map(moduleName => (
                  <div key={moduleName} className="space-y-2">
                    <span className="font-mono text-[9px] font-bold text-[#8b5cf6] uppercase tracking-widest block pb-1 border-b border-b-neutral-850">
                      Module: {moduleName}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {groupedPermissions[moduleName].map(p => {
                        const isGranted = activePermissions.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => togglePermission(p.id)}
                            className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer select-none transition ${
                              isGranted
                                ? "bg-[#8b5cf6]/5 border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/10"
                                : "bg-neutral-900/40 border-neutral-850 hover:bg-neutral-900/70"
                            }`}
                            id={`rbac-toggle-${p.id}`}
                          >
                            <span className="pt-0.5 text-neutral-400">
                              {isGranted ? (
                                <CheckSquare className="w-4 h-4 text-[#8b5cf6]" />
                              ) : (
                                <Square className="w-4 h-4 text-neutral-700 hover:text-neutral-500" />
                              )}
                            </span>
                            <div className="space-y-0.5 text-left">
                              <span className="font-mono font-bold text-white text-[11px]">{p.id}</span>
                              <p className="text-[10px] text-neutral-450 leading-normal font-sans pt-0.5">{p.description}</p>
                              <div className="text-[9px] text-neutral-600 font-mono pt-1">
                                Action Code: <code className="bg-neutral-950 px-1 py-0.5 text-slate-300 rounded">{p.action}</code>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
