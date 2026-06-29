import React from "react";
import { Calendar, Users, Clock, MessageCircle } from "lucide-react";

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Meetings
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Schedule and manage meetings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <Calendar className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Upcoming</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">5</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <Clock className="w-6 h-6 text-purple-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Today</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">2</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <Users className="w-6 h-6 text-cyan-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Participants</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">12</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800">
          <MessageCircle className="w-6 h-6 text-slate-500 mb-2" />
          <p className="text-[10px] text-slate-400 font-mono uppercase">Recordings</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">3</p>
        </div>
      </div>

      <div className="bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl p-6">
        <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-4">
          Upcoming Meetings
        </h3>
        <div className="text-center py-12 text-slate-500">
          <p className="font-mono text-xs">Meetings calendar - Coming soon</p>
        </div>
      </div>
    </div>
  );
}