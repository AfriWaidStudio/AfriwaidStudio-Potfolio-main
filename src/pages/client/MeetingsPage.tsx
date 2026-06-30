import React, { useState, useEffect } from "react";
import { Calendar, Clock, Plus, RefreshCw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { Card, Badge } from "../../components/ui";
import { PortalState, getRouteLeaf } from "./PortalState";

interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  projectId: string;
  status: "upcoming" | "completed" | "cancelled";
}

export default function MeetingsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMeetings = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/meetings", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("afriwaid_auth_token") || ""}` }
      });
      if (!res.ok) throw new Error(`Meetings could not be loaded (${res.status}).`);
      const data = await res.json();
      setMeetings(data.meetings || data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Meetings could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [user]);

  const section = getRouteLeaf(location.pathname, "/portal/meetings");
  const filteredMeetings = meetings.filter((m) => {
    if (section === "upcoming" || section === "calendar" || section === "agenda") return m.status === "upcoming";
    if (section === "recordings") return m.status === "completed";
    return true;
  });
  const titleMap: Record<string, string> = {
    overview: "Meetings",
    upcoming: "Upcoming Meetings",
    calendar: "Meeting Calendar",
    agenda: "Meeting Agenda",
    recordings: "Meeting Recordings",
  };
  const title = titleMap[section] || "Meetings";

  const stats = {
    total: meetings.length,
    upcoming: meetings.filter(m => m.status === "upcoming").length,
    completed: meetings.filter(m => m.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Schedule and manage project meetings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <Calendar className="w-6 h-6 text-slate-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Total Meetings</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <Clock className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Upcoming</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.upcoming}</p>
        </Card>
        <Card className="p-4">
          <Plus className="w-6 h-6 text-emerald-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Completed</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
        </Card>
      </div>

      <Card title={title} className="p-6">
        {loading ? (
          <PortalState loading icon={RefreshCw} title="Loading meetings" />
        ) : error ? (
          <PortalState icon={Calendar} title="Meetings unavailable" message={error} actionLabel="Retry" onAction={loadMeetings} />
        ) : filteredMeetings.length === 0 ? (
          <PortalState icon={Calendar} title="No meetings scheduled" message="There are no meetings in this view." />
        ) : (
          <div className="space-y-3">
            {filteredMeetings.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-950 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{m.title}</p>
                  <p className="text-[10px] text-slate-400">{m.date} | {m.startTime} - {m.endTime}</p>
                </div>
                <Badge variant="info">{m.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
