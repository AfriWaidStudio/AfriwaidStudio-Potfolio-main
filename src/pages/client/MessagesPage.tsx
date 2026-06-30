import React, { useEffect, useMemo, useState } from "react";
import { Image, MessageSquare, Paperclip, RefreshCw, Send } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { Button, Input } from "../../components/ui";
import { PortalState } from "./PortalState";
import { getPortalAuthHeaders } from "./auth";

interface Conversation {
  id: string;
  name: string;
  type: string;
  latestMessage?: Message | null;
  unreadCount?: number;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderUsername?: string;
  senderName?: string;
  senderRole?: string;
  body: string;
  timestamp?: string;
  createdAt?: string;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeConversationId),
    [activeConversationId, conversations]
  );
  const visibleConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    return conversations.filter((conversation) => {
      const haystack = `${conversation.name} ${conversation.type} ${conversation.latestMessage?.body || ""}`.toLowerCase();
      return haystack.includes(searchQuery);
    });
  }, [conversations, searchQuery]);
  const visibleMessages = useMemo(() => {
    if (!searchQuery) return messages;
    return messages.filter((msg) => `${msg.senderUsername || ""} ${msg.senderName || ""} ${msg.body}`.toLowerCase().includes(searchQuery));
  }, [messages, searchQuery]);

  const loadMessages = async (conversationId: string) => {
    if (!conversationId) return;
    setLoadingMessages(true);
    setError("");
    try {
      const res = await fetch(`/api/messages/${conversationId}`, {
        headers: getPortalAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Messages could not be loaded (${res.status}).`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Messages could not be loaded.");
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadConversations = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/conversations", {
        headers: getPortalAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Conversations could not be loaded (${res.status}).`);
      const data = await res.json();
      const list: Conversation[] = data.conversations || [];
      setConversations(list);
      const firstId = list[0]?.id || "";
      setActiveConversationId(firstId);
      if (firstId) await loadMessages(firstId);
      else setMessages([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversations could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  useEffect(() => {
    const handleIncomingMessage = (event: Event) => {
      const detail = (event as CustomEvent<any>).detail;
      const incoming = detail?.message || detail;
      if (!incoming?.conversationId) return;
      if (incoming.conversationId === activeConversationId) {
        setMessages((prev) => prev.some((item) => item.id === incoming.id) ? prev : [...prev, incoming]);
      }
      setConversations((prev) => prev.map((conversation) => (
        conversation.id === incoming.conversationId
          ? { ...conversation, latestMessage: incoming, unreadCount: conversation.id === activeConversationId ? 0 : (conversation.unreadCount || 0) + 1 }
          : conversation
      )));
    };
    window.addEventListener("ws:chat:message", handleIncomingMessage);
    return () => window.removeEventListener("ws:chat:message", handleIncomingMessage);
  }, [activeConversationId]);

  const handleSelectConversation = async (conversationId: string) => {
    setActiveConversationId(conversationId);
    setConversations((prev) => prev.map((conversation) => (
      conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
    )));
    await loadMessages(conversationId);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || !activeConversationId) return;

    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { ...getPortalAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeConversationId, body: trimmed }),
      });
      if (!res.ok) throw new Error(`Message could not be sent (${res.status}).`);
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        setConversations((prev) => prev.map((conversation) => (
          conversation.id === activeConversationId ? { ...conversation, latestMessage: data.message } : conversation
        )));
      }
      setMessage("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  const renderTime = (value?: string) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] min-h-[560px]">
      <div className="mb-4">
        <h1 className="text-2xl font-display font-black text-slate-900 dark:text-white mb-2">
          {searchQuery ? "Message Search" : "Messages"}
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-sm">
          {searchQuery ? `Showing results for "${searchParams.get("q")}".` : "Communicate with your project team and support channels."}
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr] bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
        <aside className="border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-zinc-800 overflow-y-auto">
          <div className="p-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400">Conversations</span>
            <button type="button" onClick={loadConversations} className="p-1.5 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white" title="Refresh conversations" aria-label="Refresh conversations">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="p-4">
              <PortalState loading icon={MessageSquare} title="Loading conversations" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4">
              <PortalState icon={MessageSquare} title="No conversations" message="Support or project channels will appear here once assigned." />
            </div>
          ) : visibleConversations.length === 0 ? (
            <div className="p-4">
              <PortalState icon={MessageSquare} title="No matching channels" message="No conversation name or preview matches this search." />
            </div>
          ) : (
            visibleConversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => handleSelectConversation(conversation.id)}
                className={`w-full p-3 text-left border-b border-slate-100 dark:border-zinc-900 transition ${
                  conversation.id === activeConversationId ? "bg-blue-50 dark:bg-blue-950/20" : "hover:bg-slate-50 dark:hover:bg-zinc-950"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{conversation.name}</span>
                  {(conversation.unreadCount || 0) > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-1">{conversation.latestMessage?.body || conversation.type}</p>
              </button>
            ))
          )}
        </aside>

        <section className="flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{activeConversation?.name || "Select a conversation"}</p>
            <p className="text-[10px] text-slate-400 uppercase font-mono">{activeConversation?.type || "workspace"}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {error && (
              <PortalState icon={MessageSquare} title="Messages need attention" message={error} actionLabel="Retry" onAction={() => activeConversationId ? loadMessages(activeConversationId) : loadConversations()} />
            )}
            {!error && loadingMessages && <PortalState loading icon={MessageSquare} title="Loading messages" />}
            {!error && !loadingMessages && activeConversationId && messages.length === 0 && (
              <PortalState icon={MessageSquare} title="No messages yet" message="Start the conversation from the message box below." />
            )}
            {!error && !loadingMessages && activeConversationId && messages.length > 0 && visibleMessages.length === 0 && (
              <PortalState icon={MessageSquare} title="No message matches" message="Try a different search term or choose another channel." />
            )}
            {!error && !loadingMessages && !activeConversationId && (
              <PortalState icon={MessageSquare} title="Choose a channel" message="Select a support or project conversation to view messages." />
            )}
            {!error && !loadingMessages && visibleMessages.map((msg) => {
              const mine = msg.senderId === user?.id || msg.senderUsername === user?.username;
              const sender = mine ? "You" : (msg.senderUsername || msg.senderId || "Team");
              return (
                <div key={msg.id} className={`flex items-start gap-3 max-w-[85%] ${mine ? "ml-auto flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {sender[0]?.toUpperCase() || "?"}
                  </div>
                  <div className={`space-y-1 ${mine ? "text-right" : ""}`}>
                    <div className={`flex items-center gap-2 ${mine ? "justify-end" : ""}`}>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{sender}</span>
                      <span className="text-[10px] text-slate-400">{renderTime(msg.timestamp || msg.createdAt)}</span>
                    </div>
                    <div className={`px-3 py-2 rounded-lg text-sm text-left ${
                      mine
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-white"
                    }`}>
                      {msg.body}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 dark:border-zinc-800 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button type="button" className="p-2 text-slate-500 hover:text-slate-700 rounded" title="Attach file" aria-label="Attach file">
                <Paperclip className="w-4 h-4" />
              </button>
              <button type="button" className="p-2 text-slate-500 hover:text-slate-700 rounded" title="Attach image" aria-label="Attach image">
                <Image className="w-4 h-4" />
              </button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={activeConversationId ? "Type a message..." : "Select a conversation first"}
                disabled={!activeConversationId || sending}
                className="flex-1"
              />
              <Button type="submit" variant="primary" size="sm" disabled={!activeConversationId || sending} title="Send message" aria-label="Send message">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
