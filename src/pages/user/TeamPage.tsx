import React, { useEffect, useState } from "react";
import { RefreshCw, Users } from "lucide-react";
import { Button, Card } from "../../components/ui";
import { PortalState } from "./PortalState";
import { portalRequest } from "./portalApi";

interface TeamMember {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  status: string;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTeam = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await portalRequest<{ team: TeamMember[]; client: any }>("/api/team");
      setTeam(data.team || []);
      setClient(data.client || null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Team could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  if (loading) return <PortalState loading icon={Users} title="Loading team" />;
  if (error) return <PortalState icon={Users} title="Team needs attention" message={error} actionLabel="Retry" onAction={loadTeam} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Team</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">People assigned to your active project workspace.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadTeam} leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
      </div>

      {client && (
        <Card className="p-5">
          <p className="text-[10px] font-mono uppercase text-slate-400">Client profile</p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{client.name}</h2>
          <p className="text-sm text-slate-500">{client.company} · {client.email}</p>
        </Card>
      )}

      {team.length === 0 ? (
        <PortalState icon={Users} title="No assigned team" message="Team assignments will appear here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {team.map((member) => (
            <Card key={member.id} className="p-5">
              <div className="w-10 h-10 rounded bg-emerald-500 text-white flex items-center justify-center font-bold mb-3">
                {member.role.slice(0, 2).toUpperCase()}
              </div>
              <h2 className="font-bold text-slate-900 dark:text-white">{member.role}</h2>
              <p className="text-sm text-slate-500">User: {member.userId}</p>
              <p className="text-xs text-slate-400 mt-2">Project: {member.projectId}</p>
              <span className="inline-flex mt-4 px-2 py-1 rounded bg-slate-100 dark:bg-zinc-900 text-[10px] font-mono uppercase">{member.status}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
