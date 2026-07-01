import React, { useEffect, useState } from "react";
import { Calendar, Clock, RefreshCw } from "lucide-react";
import { Button, Card } from "../../components/ui";
import { PortalState } from "./PortalState";
import { formatDate, portalRequest } from "./portalApi";

interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMeetings = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await portalRequest<{ meetings: Meeting[] }>("/api/meetings");
      setMeetings(data.meetings || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Meetings could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  if (loading) return <PortalState loading icon={Calendar} title="Loading calendar" />;
  if (error) return <PortalState icon={Calendar} title="Calendar needs attention" message={error} actionLabel="Retry" onAction={loadMeetings} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white">Meetings</h1>
          <p className="text-sm text-slate-500 dark:text-zinc-400">Calendar view generated from project milestones.</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadMeetings} leftIcon={<RefreshCw className="w-4 h-4" />}>Refresh</Button>
      </div>

      {meetings.length === 0 ? (
        <PortalState icon={Calendar} title="No meetings scheduled" message="Milestone review meetings will appear here." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="p-5">
              <Calendar className="w-5 h-5 text-emerald-500 mb-3" />
              <h2 className="font-bold text-slate-900 dark:text-white">{meeting.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{formatDate(meeting.date)}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-3">
                <Clock className="w-3.5 h-3.5" /> {meeting.startTime} - {meeting.endTime}
              </p>
              <span className="inline-flex mt-4 px-2 py-1 rounded bg-slate-100 dark:bg-zinc-900 text-[10px] font-mono uppercase">{meeting.status}</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
