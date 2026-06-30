import React, { useState, useEffect } from "react";
import { Calendar, Clock, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "../../components/AuthContext";
import { Card, Badge } from "../../components/ui";

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
  const { token } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeetings = async () => {
      if (!token) return;
      try {
        const res = await fetch("/api/meetings", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMeetings(data.meetings || data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadMeetings();
  }, [token]);

  const stats = {
    total: meetings.length,
    upcoming: meetings.filter(m => m.status === "upcoming").length,
    completed: meetings.filter(m => m.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Meetings
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

      <Card title="Upcoming Meetings" className="p-6">
        {loading ? (
          <div className="text-center py-12 text-slate-500">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 text-slate-300 animate-spin" />
            <p className="font-mono text-xs">Loading meetings...</p>
          </div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="font-mono text-xs">No meetings scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meetings.filter(m => m.status === "upcoming").map((m) => (
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