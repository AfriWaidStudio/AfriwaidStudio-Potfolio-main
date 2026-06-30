import React, { useState, useEffect } from "react";
import { Users, Mail, ExternalLink } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Card, Badge } from "../../components/ui";
import { PortalState } from "./PortalState";

interface TeamMember {
  id: string;
  userId: string;
  role: string;
  status: string;
  user?: { firstName: string; lastName: string; email: string };
}

export default function TeamPage() {
  const { user } = useAuth();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeam = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/team", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("afriwaid_auth_token") || ""}` }
      });
      if (!res.ok) throw new Error(`Team could not be loaded (${res.status}).`);
      const data = await res.json();
      setTeam(data.team || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Team could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Team
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Project team members and collaborators.
        </p>
      </div>

      {loading ? (
        <PortalState loading icon={Users} title="Loading team" />
      ) : error ? (
        <PortalState icon={Users} title="Team unavailable" message={error} actionLabel="Retry" onAction={loadTeam} />
      ) : team.length === 0 ? (
        <PortalState icon={Users} title="No team members" message="Assigned collaborators will appear once your project team is configured." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-zinc-700 flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {m.user?.firstName} {m.user?.lastName}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">{m.role}</p>
                </div>
              </div>
              <div className="space-y-2 text-[10px]">
                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className="w-3 h-3" />
                  <span>{m.user?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={m.status === "active" ? "success" : "default"}>
                    {m.status}
                  </Badge>
                  <button className="text-slate-400 hover:text-slate-600" title="View member details" aria-label="View member details">
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
