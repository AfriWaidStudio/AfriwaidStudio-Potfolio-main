import React, { useState } from "react";
import { MessageSquare, Send, Paperclip, Image, Smile } from "lucide-react";

export default function MessagesPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: "1", sender: "amara_vanguard", role: "Lead Architect", body: "Hello partner! How is the project coming along?", time: "10:30 AM" },
    { id: "2", sender: "You", role: "Client", body: "Making good progress on the deliverables.", time: "10:32 AM" },
    { id: "3", sender: "System", role: "System", body: "New update available for review.", time: "09:15 AM" },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          Messages
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          Communicate with your team.
        </p>
      </div>

      <div className="flex-1 flex flex-col bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 max-w-[80%]`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs">
                {msg.sender === "You" ? "Y" : msg.sender[0].toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{msg.sender}</span>
                  <span className="text-[10px] text-slate-400">{msg.time}</span>
                </div>
                <div className={`px-3 py-2 rounded-lg text-sm ${
                  msg.role === "Client" 
                    ? "bg-blue-500 text-white" 
                    : "bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-white"
                }`}>
                  {msg.body}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 dark:border-zinc-800 p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button type="button" className="p-2 text-slate-500 hover:text-slate-700 rounded">
              <Paperclip className="w-4 h-4" />
            </button>
            <button type="button" className="p-2 text-slate-500 hover:text-slate-700 rounded">
              <Image className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="p-2 text-blue-500 hover:text-blue-600 rounded">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}