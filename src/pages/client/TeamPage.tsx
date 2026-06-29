import React from "react";
import { Users, UserPlus, Mail, Shield, Calendar } from "lucide-react";

export default function TeamPage() {
  const members = [
    { id: "1", name: "Amara Vanguard", role: "Lead Architect", email: "amara@afriwaid.com", status: "online" },
    { id: "2", name: "Waid Soko", role: "Project Manager", email: "waid@afriwaid.com", status: "online" },
    { id: "3", name: "Client User", role: "Client", email: "client@example.com", status: "offline" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
            Team
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm">
            Manage project team members.
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg font-mono text-xs hover:bg-blue-600 flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-sm"
            />
          </div>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-zinc-800">
          {members.map((member) => (
            <div key={member.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                  {member.name[0]}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                  <p className="text-[10px] text-slate-500">{member.role}</p>
                </div>
              </div>
              <div className={`w-2 h-2 rounded-full ${
                member.status === "online" ? "bg-emerald-500" : "bg-slate-400"
              }`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}