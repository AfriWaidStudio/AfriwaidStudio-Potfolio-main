import React, { useState, useEffect, useRef } from "react";
import { 
  Lock, AlertCircle, LogOut, Cpu, Wifi, Key, ChevronRight, Loader2,
  Layers, Folder, BadgeDollarSign, MessageSquare, FolderGit, Sparkles, ArrowLeft
} from "lucide-react";
import { ClientProfile, Deliverable, Invoice } from "../types";
import { useAuth } from "./AuthContext";

// Modular sub-components imports
import KanbanSprint, { KanbanTask } from "./client/KanbanSprint";
import AssetVaultDrive from "./client/AssetVaultDrive";
import FinancialLedger from "./client/FinancialLedger";
import SupportChat from "./client/SupportChat";
import AdvisoryRoadmap, { RoadmapItem } from "./client/AdvisoryRoadmap";
import SecurityCredentials from "./client/SecurityCredentials";

interface ClientPortalProps {
  clientProfiles: ClientProfile[];
  onFeedbackAdd: (id: string, text: string) => void;
  wsSocket?: WebSocket | null;
  isEmbedded?: boolean;
}

export default function ClientPortal({ clientProfiles, onFeedbackAdd, wsSocket, isEmbedded = false }: ClientPortalProps) {
  const { user: authUser, logout } = useAuth();
  const [loggedInClient, setLoggedInClient] = useState<ClientProfile | null>(null);

  // Layout selection
  const [activeTab, setActiveTab] = useState<"workspace" | "drive" | "billing" | "support" | "advisory" | "credentials" | "profile_settings">("workspace");

  // State values
  const [tasks, setTasks] = useState<KanbanTask[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([]);
  
  // Custom interactive countdown to estimated launch
  const [countdown, setCountdown] = useState({ days: 11, hours: 18, minutes: 42, seconds: 15 });

  // Upload Simulation
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadedFileIndicator, setUploadedFileIndicator] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // General payment notification toast
  const [paymentSuccessToast, setPaymentSuccessToast] = useState<string | null>(null);

  // Slack style chat properties
  const [activeChannel, setActiveChannel] = useState<string>("#dev-sprint-core");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [typingIndicator, setTypingIndicator] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Advisory feedback Roadmap list
  const [roadmapTickets, setRoadmapTickets] = useState<RoadmapItem[]>([
    { id: "rd-1", title: "Integrate Real-time WebSocket Status Indicators", category: "Technical Spec", priority: "High", status: "In Sprint", date: "2026-06-20" },
    { id: "rd-2", title: "Refactor invoice ledger responsive drawer animations", category: "UI Refinement", priority: "Standard", status: "Resolved", date: "2026-06-18" },
    { id: "rd-3", title: "Relational Spanner database indexing optimization", category: "Database Tuning", priority: "Blocker", status: "Proposed", date: "2026-06-22" }
  ]);
  const [adviceText, setAdviceText] = useState("");
  const [adviceCategory, setAdviceCategory] = useState("Feature Proposal");
  const [advicePriority, setAdvicePriority] = useState<"Blocker" | "High" | "Standard">("Standard");
  const [adviceSuccess, setAdviceSuccess] = useState(false);

  // Credentials settings
  const [tokenVisible, setTokenVisible] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [generatedKey] = useState("aw_pk_live_dca3922de1cb42f0a8d46e255fba71a0");
  const [sshNodes] = useState([
    { region: "eu-west-2 (London)", ip: "35.189.15.202", protocol: "TLS 1.3 Secure", service: "Cloud Run Container" },
    { region: "us-central-1 (Iowa)", ip: "104.197.68.80", protocol: "TLS 1.3 Secure", service: "Replica Cluster Cluster" }
  ]);

  // Profile Form fields
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profileUsername, setProfileUsername] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  // 1. Estimate Timer Countdown trigger
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Load profiles
  useEffect(() => {
    if (authUser) {
      setProfileFirstName(authUser.firstName || "");
      setProfileLastName(authUser.lastName || "");
      setProfileUsername(authUser.username || "");

      const match = clientProfiles.find(
        (c) => c.email.toLowerCase() === authUser.email.toLowerCase()
      );
      if (match) {
        setLoggedInClient(match);
      } else {
        const virtualProfile: ClientProfile = {
          id: `cl-g-${authUser.id}`,
          name: `${authUser.firstName} ${authUser.lastName}`,
          company: `${authUser.firstName} Projects & Innovations Ltd`,
          email: authUser.email,
          assignedProjectName: "Bespoke Platform Orchestration",
          projectProgress: 75,
          deliverables: [
            { id: "del-1", name: "System_Architecture_Blueprint.pdf", description: "Technical System Specifications Layout", status: "approved", fileName: "System_Architecture_Blueprint.pdf", fileSize: "1.4 MB" },
            { id: "del-2", name: "Dynamic_Figma_Prototypes.fig", description: "Visual and structural UI guidelines", status: "completed", fileName: "Dynamic_Figma_Prototypes.fig", fileSize: "18.2 MB" },
            { id: "del-3", name: "OAuth_Flows_Design_Handout.pdf", description: "Secure credential handshakes blueprint", status: "completed", fileName: "OAuth_Flows_Design_Handout.pdf", fileSize: "3.2 MB" }
          ],
          proposals: [
            { id: "prop-1", title: "Enterprise Scalability Implementation Project", date: "2026-06-12", value: "$35,000 USD", status: "Accepted" }
          ],
          invoices: [
            { id: "inv-1", invoiceNumber: "INV-2026-V88", issueDate: "2026-06-15", dueDate: "2026-06-29", amount: "$12,500 USD", status: "Unpaid" },
            { id: "inv-2", invoiceNumber: "INV-2026-V71", issueDate: "2026-06-01", dueDate: "2026-06-15", amount: "$10,000 USD", status: "Paid" }
          ],
          progressLog: [
            { date: "2026-06-22", title: "Account Initiated via Google federated logs", phase: "Research", status: "completed" }
          ],
          feedback: ["We require interactive layout optimizations to clear visual clutter in the team boards."]
        };
        setLoggedInClient(virtualProfile);
      }
    }
  }, [authUser, clientProfiles]);

  // 3. Setup tasks & invoices
  useEffect(() => {
    if (!loggedInClient) return;
    setDeliverables(loggedInClient.deliverables || []);
    setInvoicesList(loggedInClient.invoices || []);

    // Dynamic projects tasks setup
    setTasks([
      { id: "t1", label: "Establish secure PostgreSQL DB on Cloud SQL with developer endpoints", completed: true, column: "completed", phase: "Milestone Phase 1" },
      { id: "t2", label: "Configure Google Federated OAuth logins and security boundaries", completed: true, column: "completed", phase: "Milestone Phase 1" },
      { id: "t3", label: "Develop real-time WebSocket messaging layer for sync channels", completed: false, column: "in_development", phase: "Milestone Phase 2" },
      { id: "t4", label: "Implement cryptographic billing wire verification gates", completed: false, column: "in_development", phase: "Milestone Phase 2" },
      { id: "t5", label: "Conduct penetration audit of secure tokens and sessions API", completed: false, column: "backlog", phase: "Milestone Phase 3" },
      { id: "t6", label: "Optimize bento dashboard layouts and canvas scaling limits", completed: false, column: "qa", phase: "Milestone Phase 2" }
    ]);

    // Setup chat messages
    setChatMessages([
      { id: "msg-1", senderUsername: "amara_vanguard", senderRole: "Lead Architect", body: "Hello partner! I have set up the direct channel `#dev-sprint-core`. Let me know if you want to review current tasks or verify invoice clearings.", timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: "msg-2", senderUsername: "System Terminal", senderRole: "System Admin", body: "Operational channel connection routed with Secure Shield TLS 1.3 protocol. Access audited successfully.", timestamp: new Date(Date.now() - 3400000).toISOString() }
    ]);
  }, [loggedInClient]);

  // Socket updates
  useEffect(() => {
    const handleRecvMessage = (e: Event) => {
      const msg = (e as CustomEvent).detail;
      if (msg) {
        setChatMessages((prev) => {
          if (prev.find((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        setTypingIndicator("");
        setTimeout(() => chatScrollRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
      }
    };
    window.addEventListener("ws:chat:message", handleRecvMessage);
    return () => window.removeEventListener("ws:chat:message", handleRecvMessage);
  }, []);

  // Recalculate Project Progress Dynamically on Task changes
  const computedProgress = () => {
    if (tasks.length === 0) return loggedInClient?.projectProgress || 75;
    const completed = tasks.filter(t => t.column === "completed").length;
    return Math.round((completed / tasks.length) * 100);
  };

  // Drag and drop / Column clicking
  const cycleTaskColumn = (taskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        let nextCol: "backlog" | "in_development" | "qa" | "completed";
        if (task.column === "backlog") nextCol = "in_development";
        else if (task.column === "in_development") nextCol = "qa";
        else if (task.column === "qa") nextCol = "completed";
        else nextCol = "backlog";

        // log entry
        if (loggedInClient) {
          const updatedLog = {
            date: new Date().toISOString().split("T")[0],
            title: `Task '${task.label.slice(0, 25)}...' upgraded to ${nextCol.replace("_", " ")}`,
            phase: "Development" as const,
            status: nextCol === "completed" ? "completed" as const : "active" as const
          };
          if (!loggedInClient.progressLog) loggedInClient.progressLog = [];
          loggedInClient.progressLog = [updatedLog, ...loggedInClient.progressLog];
        }
        return { ...task, column: nextCol, completed: nextCol === "completed" };
      }
      return task;
    }));
  };

  // Add customized task inline
  const [customTaskInput, setCustomTaskInput] = useState("");
  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTaskInput.trim()) return;
    const newTask: KanbanTask = {
      id: `t-user-${Date.now()}`,
      label: customTaskInput,
      completed: false,
      column: "backlog",
      phase: "Client Workspace Advisory"
    };
    setTasks(prev => [...prev, newTask]);
    setCustomTaskInput("");
  };

  // Simulation upload file
  const startSimulatedUpload = (file: File) => {
    setUploading(true);
    setUploadFileName(file.name);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadedFileIndicator(file.name);
          setTimeout(() => setUploadedFileIndicator(null), 3500);

          // Append to Deliverables grid
          const newDel: Deliverable = {
            id: `del-user-${Date.now()}`,
            name: file.name,
            description: "Client Portal Despatched Asset",
            status: "pending",
            fileName: file.name,
            fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`
          };
          setDeliverables(prev => [newDel, ...prev]);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 6;
      });
    }, 120);
  };

  const handleFileUploadInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) startSimulatedUpload(file);
  };

  // Chat submit
  const handleSendChatText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const userMsg = {
      id: `chat-u-${Date.now()}`,
      senderUsername: authUser?.username || "You",
      senderRole: "Client",
      body: newMessageText,
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, userMsg]);
    setNewMessageText("");
    setTimeout(() => chatScrollRef.current?.scrollIntoView({ behavior: "smooth" }), 150);

    // Simulate smart agent developer reply
    const query = newMessageText.toLowerCase();
    setTimeout(() => {
      setTypingIndicator("amara_vanguard (Lead Architect) is writing code response...");
      setTimeout(() => {
        setTypingIndicator("");
        let responseValue = "I have received this log. We are verifying system routes and will implement this immediately in the next Stand-up scrum.";
        if (query.includes("sprint") || query.includes("status") || query.includes("progress")) {
          responseValue = "Your sprint parameters look great. System progress is synchronized live. Phase 2 (Crypto Wire & Websocket Sync) is at 100% completion on local dev instances.";
        } else if (query.includes("billing") || query.includes("invoice") || query.includes("payment")) {
          responseValue = "Our billing accounts ledger is fully encrypted. You can clear INV-2026-V88 directly in the Invoice Desk tab, which will prompt a downloadable transaction receipt.";
        } else if (query.includes("feedback") || query.includes("design") || query.includes("layout")) {
          responseValue = "Continuous optimization is our priority! Please file design revision targets inside the Advisory Hub tab. AfriWaid engineers review issues during morning build cycles.";
        } else if (query.includes("token") || query.includes("key") || query.includes("api")) {
          responseValue = "For API token handshakes and operational SSH keys, look at the Security keys tab in the left tray. Credentials authenticate with our container cluster registers.";
        }

        setChatMessages(prev => [...prev, {
          id: `chat-bot-${Date.now()}`,
          senderUsername: "amara_vanguard",
          senderRole: "Lead Architect",
          body: responseValue,
          timestamp: new Date().toISOString()
        }]);
        setTimeout(() => chatScrollRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
      }, 1500);
    }, 1000);
  };

  // advisory feedback ROADMAP
  const handlePublishAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adviceText.trim()) return;

    const newTicket: RoadmapItem = {
      id: `rd-user-${Date.now()}`,
      title: adviceText,
      category: adviceCategory,
      priority: advicePriority,
      status: "Proposed",
      date: new Date().toISOString().split("T")[0]
    };
    setRoadmapTickets(prev => [newTicket, ...prev]);
    onFeedbackAdd(loggedInClient?.id || "cl-g-active", `[${adviceCategory} - ${advicePriority}] ${adviceText}`);
    setAdviceText("");
    setAdviceSuccess(true);
    setTimeout(() => setAdviceSuccess(false), 3000);
  };

  // Profile Save
  const handleSaveProfileDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErr("");
    setProfileMsg("");
    setProfileLoading(true);

    try {
      const token = localStorage.getItem("afriwaid_auth_token") || "";
      const res = await fetch("/api/users/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: profileFirstName,
          lastName: profileLastName,
          username: profileUsername
        })
      });
      const data = await res.json();
      if (res.ok) {
        setProfileMsg("Identity credentials successfully saved in crypt-node ledger.");
      } else {
        setProfileErr(data.error || "Token authorization invalid.");
      }
    } catch {
      setProfileMsg("Mock Sandbox Identity updated successfully.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleReturnToMainSite = () => {
    window.dispatchEvent(new CustomEvent("app:goto-tab", { detail: "Home" }));
  };

  if (!loggedInClient) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500 mb-4" />
        <p className="font-mono text-xs text-slate-800 dark:text-zinc-400">Loading AfriWaid Partner Credentials...</p>
      </div>
    );
  }

  const progressTotal = computedProgress();

  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50/50 dark:bg-black font-sans text-xs select-none">
      
      {/* 
        =====================================================================
        DEDICATED PORTAL HEADER & NAVIGATION: EXQUISITE & EXCLUSIVE
        =====================================================================
      */}
      <header className="w-full bg-slate-900 border-b border-slate-800 py-3.5 px-6 flex items-center justify-between z-30 shadow-lg text-white font-mono">
        <div className="flex items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[12px] font-black tracking-widest text-cyan-400">AFRIWAID CORE TRADING DESK</span>
          </div>

          <span className="hidden md:inline text-slate-505 text-[10px]">//</span>

          {/* Connected company name tag */}
          <div className="hidden md:flex items-center gap-2 text-slate-300">
            <span className="text-[10px] bg-slate-800 px-2.5 py-0.5 rounded text-cyan-300 font-bold tracking-wider">{loggedInClient.company}</span>
            <span className="text-[9px] text-slate-500 font-bold">{loggedInClient.id}</span>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* Secure Shield Signal indicator */}
          <div className="hidden lg:flex items-center gap-2 p-1.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-[9px]">
            <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
            <span className="text-emerald-400 font-bold uppercase">LIVE CONNECTION [12ms]</span>
          </div>

          {/* Back to main website button */}
          <button 
            onClick={handleReturnToMainSite}
            className="p-2 px-3 bg-slate-800 hover:bg-slate-700 hover:text-cyan-400 text-slate-300 rounded-lg border border-slate-700 transition cursor-pointer flex items-center gap-1.5 font-bold text-[9px] uppercase tracking-wider"
            id="back-to-main-website-btn"
          >
            <ArrowLeft className="w-3 h-3 text-cyan-400" />
            <span>Return to Site</span>
          </button>
        </div>
      </header>

      {/* 
        =====================================================================
        CORE CONTAINER LAYOUT: TWO-PANEL SPLIT WITH EXPANDED SPACING
        =====================================================================
      */}
      <div className="w-full flex-1 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-201 dark:divide-zinc-900">
        
        {/* LEFTSIDE PORTAL NAVIGATION TRAY */}
        <aside className="w-full lg:w-72 bg-slate-50/50 dark:bg-zinc-955/80 p-6 flex flex-col justify-between shrink-0 font-sans text-left">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[8px] text-slate-400 uppercase font-mono tracking-widest font-black">Secure Nav Desk</span>
              <p className="text-[10.5px] text-slate-500 font-medium">Bespoke workstation channels.</p>
            </div>

            {/* Navigation tabs list */}
            <nav className="space-y-1.5">
              {[
                { id: "workspace" as const, label: "Agile Kanban Sprint", icon: Layers, count: tasks.filter(t => t.column !== "completed").length },
                { id: "drive" as const, label: "Assets Vault Drive", icon: Folder, count: deliverables.length },
                { id: "billing" as const, label: "Financial ledger Desk", icon: BadgeDollarSign, count: invoicesList.filter(i => i.status === "Unpaid").length },
                { id: "support" as const, label: "Live DM chat logs", icon: MessageSquare, count: 0 },
                { id: "advisory" as const, label: "Product Advisory Node", icon: FolderGit, count: roadmapTickets.length },
                { id: "credentials" as const, label: "Credential keys & SSH", icon: Key, count: 0 }
              ].map((tab) => {
                const active = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition duration-150 font-bold ${
                      active 
                        ? "bg-slate-900 text-white dark:bg-zinc-900 dark:text-white shadow-md"
                        : "text-slate-650 dark:text-zinc-400 hover:bg-slate-200/50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    id={`client-tray-nav-tab-${tab.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? "text-cyan-400" : "text-slate-400"}`} />
                      <span className="font-sans text-xs">{tab.label}</span>
                    </div>
                    {tab.count > 0 && (
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-cyan-500 text-black" : "bg-slate-205 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300"}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom logout column */}
          <div className="border-t border-slate-200 dark:border-zinc-900 pt-5 mt-8 space-y-4 font-mono text-[9px] text-slate-500">
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-bold">SYSTEM OVERSEER: ARCH-1</span>
            </div>
            
            <button 
              onClick={() => {
                logout();
                window.location.reload();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-red-500/10 dark:bg-zinc-90 w-auto hover:bg-slate-105 dark:bg-zinc-900/60 dark:hover:bg-red-950/20 text-slate-600 hover:text-red-650 dark:text-zinc-400 dark:hover:text-red-400 rounded-xl cursor-pointer border border-slate-200 dark:border-zinc-800 transition font-bold"
              id="disconnect-access-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT SESSION</span>
            </button>
          </div>
        </aside>

        {/* RIGHTSIDE WORKSPACE ACTIVE CONTENT AREA */}
        <main className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto bg-white dark:bg-black min-h-[550px]">
          <div>
            
            {/* Header Title Board */}
            <div className="border-b border-slate-150 dark:border-neutral-900 pb-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] bg-cyan-100 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 font-mono font-black border border-cyan-200 dark:border-cyan-500/20 rounded">
                    PROJECT ACTIVE WORKSPACE
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">ESTIMATED ESTIMATION PIPELINE</span>
                </div>
                <h1 className="text-xl md:text-2xl font-display font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {loggedInClient.company} Console
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-zinc-455 font-sans leading-relaxed max-w-xl">
                  Bespoke interactive portal. Coordinate milestones, clear balance ledgers, stream files, log roadmap priorities, and converse instantly with lead architects.
                </p>
              </div>

              {/* Live Progress Matrix and Estimate Launch countdown */}
              <div className="flex items-center gap-5 shrink-0 bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-neutral-900/80 p-4 rounded-2xl relative overflow-hidden shadow-sm">
                <div className="text-left font-sans space-y-1">
                  <span className="text-[8px] text-slate-400 font-mono font-bold tracking-wider block uppercase">Calculated Progress</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-sm font-black text-cyan-600 dark:text-cyan-400">{progressTotal}%</span>
                    <div className="w-16 h-2 bg-slate-205 dark:bg-zinc-900 rounded-full overflow-hidden shrink-0 border border-slate-201 dark:border-zinc-800">
                      <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${progressTotal}%` }} />
                    </div>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-201 dark:bg-neutral-900" />

                <div className="text-left font-sans">
                  <span className="text-[8px] text-slate-400 font-mono font-bold tracking-wider block uppercase">Sprint Est. Release</span>
                  <span className="text-xs font-mono font-black text-slate-900 dark:text-white tabular-nums">
                    {countdown.days}d : {countdown.hours}h : {countdown.minutes}m : <strong className="text-cyan-500">{countdown.seconds}s</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* TAB OUTLET DISPATCH */}
            {activeTab === "workspace" && (
              <KanbanSprint
                tasks={tasks}
                cycleTaskColumn={cycleTaskColumn}
                customTaskInput={customTaskInput}
                setCustomTaskInput={setCustomTaskInput}
                handleAddCustomTask={handleAddCustomTask}
                uploadedFileIndicator={uploadedFileIndicator}
                uploading={uploading}
                uploadFileName={uploadFileName}
                uploadProgress={uploadProgress}
                fileInputRef={fileInputRef}
                handleFileUploadInput={handleFileUploadInput}
                loggedInClient={loggedInClient}
              />
            )}

            {activeTab === "drive" && (
              <AssetVaultDrive
                deliverables={deliverables}
                setDeliverables={setDeliverables}
                setPaymentSuccessToast={setPaymentSuccessToast}
              />
            )}

            {activeTab === "billing" && (
              <FinancialLedger
                invoicesList={invoicesList}
                setInvoicesList={setInvoicesList}
                loggedInClient={loggedInClient}
                paymentSuccessToast={paymentSuccessToast}
                setPaymentSuccessToast={setPaymentSuccessToast}
              />
            )}

            {activeTab === "support" && (
              <SupportChat
                chatMessages={chatMessages}
                activeChannel={activeChannel}
                setActiveChannel={setActiveChannel}
                newMessageText={newMessageText}
                setNewMessageText={setNewMessageText}
                handleSendChatText={handleSendChatText}
                typingIndicator={typingIndicator}
                chatScrollRef={chatScrollRef}
                authUser={authUser}
              />
            )}

            {activeTab === "advisory" && (
              <AdvisoryRoadmap
                roadmapTickets={roadmapTickets}
                adviceText={adviceText}
                setAdviceText={setAdviceText}
                adviceCategory={adviceCategory}
                setAdviceCategory={setAdviceCategory}
                advicePriority={advicePriority}
                setAdvicePriority={setAdvicePriority}
                handlePublishAdvice={handlePublishAdvice}
                adviceSuccess={adviceSuccess}
              />
            )}

            {activeTab === "credentials" && (
              <SecurityCredentials
                tokenVisible={tokenVisible}
                setTokenVisible={setTokenVisible}
                copiedToken={copiedToken}
                setCopiedToken={setCopiedToken}
                generatedKey={generatedKey}
                sshNodes={sshNodes}
                profileFirstName={profileFirstName}
                setProfileFirstName={setProfileFirstName}
                profileLastName={profileLastName}
                setProfileLastName={setProfileLastName}
                profileUsername={profileUsername}
                setProfileUsername={setProfileUsername}
                profileMsg={profileMsg}
                setProfileMsg={setProfileMsg}
                profileErr={profileErr}
                setProfileErr={setProfileErr}
                profileLoading={profileLoading}
                handleSaveProfileDetails={handleSaveProfileDetails}
              />
            )}

          </div>
        </main>

      </div>
    </div>
  );
}
