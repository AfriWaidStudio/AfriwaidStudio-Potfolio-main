import React, { useEffect, useMemo, useRef, useState } from "react";
import { Download, Image, MessageSquare, Paperclip, RefreshCw, Send, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { Button, Input } from "../../components/ui";
import { PortalState } from "../user/PortalState";
import { portalRequest } from "../user/portalApi";

interface Conversation {
  id: string;
  name: string;
  type: string;
  projectId?: string;
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
  attachment?: {
    name: string;
    size?: string;
    type?: string;
    url?: string;
  };
}

export default function TeamMessagesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();
  const [message, setMessage] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
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
      const data = await portalRequest<{ messages: Message[] }>(`/api/messages/${conversationId}`);
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
      const data = await portalRequest<{ conversations: Conversation[] }>("/api/conversations");
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
    if ((!trimmed && !attachmentFile) || !activeConversationId) return;

    setSending(true);
    setError("");
    try {
      let attachment;
      if (attachmentFile) {
        const dataUrl = await readFileAsDataUrl(attachmentFile);
        attachment = {
          name: attachmentFile.name,
          size: formatFileSize(attachmentFile.size),
          type: attachmentFile.type || "application/octet-stream",
          url: dataUrl,
        };
      }

      const data = await portalRequest<{ message?: Message }>("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          conversationId: activeConversationId,
          body: trimmed || (attachment ? `Shared ${attachment.name}` : ""),
          attachment,
        }),
      });
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
        setConversations((prev) => prev.map((conversation) => (
          conversation.id === activeConversationId ? { ...conversation, latestMessage: data.message } : conversation
        )));
      }
      setMessage("");
      setAttachmentFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (imageInputRef.current) imageInputRef.current.value = "";
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
          {searchQuery ? `Showing results for "${searchParams.get("q")}".` : "Communicate with your project clients and support channels."}
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
                  conversation.id === activeConversationId ? "bg-emerald-50 dark:bg-emerald-950/20" : "hover:bg-slate-50 dark:hover:bg-zinc-950"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{conversation.name}</span>
                  {(conversation.unreadCount || 0) > 0 && (
                    <span className="min-w-5 h-5 px-1 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-1">
                  {conversation.latestMessage?.attachment?.name || conversation.latestMessage?.body || conversation.type}
                </p>
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {sender[0]?.toUpperCase() || "?"}
                  </div>
                  <div className={`space-y-1 ${mine ? "text-right" : ""}`}>
                    <div className={`flex items-center gap-2 ${mine ? "justify-end" : ""}`}>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{sender}</span>
                      <span className="text-[10px] text-slate-400">{renderTime(msg.timestamp || msg.createdAt)}</span>
                    </div>
                    <div className={`px-3 py-2 rounded-lg text-sm text-left ${
                      mine
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-white"
                    }`}>
                      {msg.body}
                      {msg.attachment && (
                        <button
                          type="button"
                          onClick={() => msg.attachment?.url && downloadDataUrl(msg.attachment.name, msg.attachment.url)}
                          disabled={!msg.attachment.url}
                          className={`mt-2 flex items-center gap-2 rounded-md border px-2 py-1 text-xs font-semibold ${
                            mine
                              ? "border-white/40 bg-white/10 text-white"
                              : "border-slate-200 bg-white text-slate-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                          } disabled:opacity-60`}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="truncate max-w-48">{msg.attachment.name}</span>
                          {msg.attachment.size && <span className="opacity-70">{msg.attachment.size}</span>}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 dark:border-zinc-800 p-4">
            <form onSubmit={handleSendMessage} className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(event) => setAttachmentFile(event.target.files?.[0] || null)}
              />
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => setAttachmentFile(event.target.files?.[0] || null)}
              />
              {attachmentFile && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                  <span className="truncate">Attached: {attachmentFile.name} ({formatFileSize(attachmentFile.size)})</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachmentFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                      if (imageInputRef.current) imageInputRef.current.value = "";
                    }}
                    className="rounded p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    title="Remove attachment"
                    aria-label="Remove attachment"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!activeConversationId || sending}
                  className="p-2 text-slate-500 hover:text-slate-700 rounded disabled:opacity-50"
                  title="Attach file"
                  aria-label="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={!activeConversationId || sending}
                  className="p-2 text-slate-500 hover:text-slate-700 rounded disabled:opacity-50"
                  title="Attach image"
                  aria-label="Attach image"
                >
                  <Image className="w-4 h-4" />
                </button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={activeConversationId ? "Type a message..." : "Select a conversation first"}
                  disabled={!activeConversationId || sending}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!activeConversationId || sending || (!message.trim() && !attachmentFile)}
                  title="Send message"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Attachment could not be read."));
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadDataUrl(filename: string, dataUrl: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
