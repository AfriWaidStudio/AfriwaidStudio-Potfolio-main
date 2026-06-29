import React from "react";
import { Send } from "lucide-react";

interface SupportChatProps {
  chatMessages: any[];
  activeChannel: string;
  setActiveChannel: (channel: string) => void;
  newMessageText: string;
  setNewMessageText: (text: string) => void;
  handleSendChatText: (e: React.FormEvent) => void;
  typingIndicator: string;
  chatScrollRef: React.RefObject<HTMLDivElement>;
  authUser: any;
}

export default function SupportChat({
  chatMessages,
  activeChannel,
  setActiveChannel,
  newMessageText,
  setNewMessageText,
  handleSendChatText,
  typingIndicator,
  chatScrollRef,
  authUser
}: SupportChatProps) {
  return (
    <div className="space-y-6 animate-fadeIn text-left">
      
      {/* TWO PANEL CHAT VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[640px]">
        
        {/* Channels side-pane - 4 cols */}
        <div className="lg:col-span-4 bg-slate-50 dark:bg-zinc-950/40 border border-slate-201 dark:border-neutral-900 p-5 flex flex-col justify-between h-full overflow-y-auto no-scrollbar">
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider mb-2">Secure Sync Channels</h4>
              <div className="space-y-1.5">
                {[
                  { name: "#dev-sprint-core", detail: "Scrum active pipeline logs" },
                  { name: "#milestone-revisions", detail: "Asset review & design" },
                  { name: "#ledger-clearance", detail: "Accounting wires and status" }
                ].map((ch) => (
                  <button
                    key={ch.name}
                    onClick={() => setActiveChannel(ch.name)}
                    className={`w-full text-left px-3.5 py-3 rounded-xl transition duration-150 block cursor-pointer ${
                      activeChannel === ch.name
                        ? "bg-slate-900 text-white dark:bg-zinc-900 dark:text-cyan-400 font-extrabold shadow-sm"
                        : "text-slate-650 hover:bg-slate-200/50 dark:text-zinc-400 dark:hover:bg-zinc-905"
                    }`}
                  >
                    <span className="block font-mono text-xs">{ch.name}</span>
                    <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-sans font-medium">{ch.detail}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* INTERACTIVE PRESET TRIGGERS SYSTEM */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono font-black uppercase text-slate-400 dark:text-zinc-550 tracking-wider block">QUICK FEEDBACK PAYLOADS</span>
              <div className="flex flex-col gap-1.5">
                {[
                  { title: "📊 Request sprint status", text: "Can you provide a code status update on active sprint tasks?" },
                  { title: "💳 Confirm ledger wires", text: "Who can confirm that my financial wire INV-2026-V88 has been fully cleared?" },
                  { title: "🛠 Request dashboard fixes", text: "How do I submit design revision feedback for the main user dashboard?" }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewMessageText(preset.text);
                    }}
                    className="text-left p-2.5 bg-white dark:bg-zinc-900 hover:bg-cyan-50 dark:hover:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-[9.5px] font-sans font-semibold text-slate-700 dark:text-zinc-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition cursor-pointer"
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-zinc-900/80 space-y-2 text-[9px] leading-relaxed">
            <span className="font-bold text-slate-800 dark:text-zinc-300 block">SUPPORT ACTIVE OPERATORS:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
              <p className="text-slate-500">Amara Okonkwo <span className="text-[8px] opacity-75 font-mono">(Lead Solutions Architect)</span></p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
              <p className="text-slate-500">Soko AI Dispatch Bot <span className="text-[8px] opacity-75 font-mono">(Supervisor Node)</span></p>
            </div>
          </div>
        </div>

        {/* Conversation flow - 8 cols */}
        <div className="lg:col-span-8 bg-slate-50 dark:bg-zinc-950/40 border border-slate-201 dark:border-neutral-900 rounded-2xl flex flex-col justify-between h-full overflow-hidden">
          
          {/* Active Header bar */}
          <div className="p-4 border-b border-slate-200 dark:border-neutral-900 bg-white dark:bg-black/40 flex items-center justify-between">
            <div className="text-left">
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">{activeChannel}</span>
              <span className="text-[9px] text-emerald-500 font-mono block">● Connected via Secure TLS 1.3 encryption</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-zinc-900 px-2 py-0.5 rounded">Operational feed</span>
          </div>

          {/* Messages container list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {chatMessages.map((msg, idx) => {
              const isMe = msg.senderRole === "Client" || msg.senderUsername === authUser?.username;
              return (
                <div key={msg.id || idx} className={`flex gap-3.5 max-w-[80%] ${isMe ? "ml-auto flex-row-reverse text-right" : "mr-auto text-left"}`}>
                  <div className={`w-9 h-9 rounded-xl border shrink-0 select-none overflow-hidden flex items-center justify-center font-bold text-xs ${
                    isMe 
                      ? "bg-cyan-500 border-cyan-400 text-black font-extrabold" 
                      : "bg-slate-100 dark:bg-zinc-900 border-slate-300 dark:border-zinc-800 text-slate-800 dark:text-zinc-200"
                  }`}>
                    {msg.senderUsername.slice(0, 2).toUpperCase()}
                  </div>
                  
                  <div className="space-y-1 max-w-full">
                    <span className="text-[9px] text-slate-400 font-mono block">
                      {msg.senderUsername} <span className="opacity-75 font-sans">({msg.senderRole})</span>
                    </span>
                    <div className={`p-4 rounded-2xl text-[11.5px] leading-relaxed text-left ${
                      isMe 
                        ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 rounded-tr-none font-semibold shadow-md" 
                        : "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-200 border border-slate-200/80 dark:border-neutral-800/80 rounded-tl-none shadow-sm"
                    }`}>
                      {msg.body}
                    </div>
                  </div>
                </div>
              );
            })}

            {typingIndicator && (
              <div className="p-3 max-w-[340px] bg-slate-200/60 dark:bg-zinc-900/50 border border-slate-250 dark:border-zinc-800/50 text-cyan-500 text-[10px] font-mono rounded-xl animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" />
                <span>{typingIndicator}</span>
              </div>
            )}
            <div ref={chatScrollRef} />
          </div>

          {/* Message Input submit bar */}
          <form onSubmit={handleSendChatText} className="p-4 border-t border-slate-200 dark:border-neutral-900 bg-white dark:bg-black/35 flex gap-2">
            <input 
              type="text"
              required
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder={`Transmit secure message payload to ${activeChannel}...`}
              className="flex-1 p-3.5 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-900 rounded-xl text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-cyan-500/50 text-left font-sans"
              id="dm-message-input-text"
            />
            <button
              type="submit"
              className="px-5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl flex items-center justify-center cursor-pointer transition shadow hover:shadow-cyan-500/20"
              id="dm-message-submit-button"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
