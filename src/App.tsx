import React, { useState, useEffect } from "react";
import {
  Menu, X, ArrowRight, Sparkles, Globe, Command, Search,
  ShieldCheck, Mail, Database, BrainCircuit, Play, BarChart3,
  Calendar, Clock, Award, Sun, Moon, ChevronDown, ChevronUp, FileText, User, Maximize2, Link
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { loadInitialData, saveInitialData, INITIAL_CUSTOMIZATION } from "./data";
import { Project, Article, JournalEntry, CV, ClientProfile, Inquiry, TrackedAnalytics, ServiceOffer, MediaItem, HomepageStats, TechStackItem, Testimonial, TeamMember, CustomizationSettings } from "./types";
import { useLocation, useNavigate } from "react-router-dom";

const formatStat = (val: string | number | undefined, defaultVal: string | number, suffix: string) => {
  const v = val !== undefined && val !== null ? val.toString().trim() : defaultVal.toString().trim();
  if (/^\d+$/.test(v)) {
    return `${v}${suffix}`;
  }
  return v;
};

// Component imports
import AboutUs from "./components/AboutUs";
import FounderProfile from "./components/FounderProfile";
import AILab from "./components/AILab";
import CVCenter from "./components/CVCenter";
import MediaHub from "./components/MediaHub";
import ProjectsPage from "./components/ProjectsPage";
import ServicesPage from "./components/ServicesPage";
import WritingHub from "./components/WritingHub";
import BuildJournal from "./components/BuildJournal";
import ContactForm from "./components/ContactForm";
import ClientPortal from "./components/ClientPortal";
import AdminDashboard from "./components/AdminDashboard";
import { AuthProvider, useAuth } from "./components/AuthContext";
import UnifiedAuthGate from "./components/UnifiedAuthGate";
import SecuritySettings from "./components/SecuritySettings";
import { ClientWorkspaceLayout } from "./workspaces/client/ClientWorkspaceLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/client/DashboardPage";
import ClientProjectsPage from "./pages/client/ProjectsPage";
import DeliverablesPage from "./pages/client/DeliverablesPage";
import ApprovalsPage from "./pages/client/ApprovalsPage";
import InvoicesPage from "./pages/client/InvoicesPage";
import MeetingsPage from "./pages/client/MeetingsPage";
import MessagesPage from "./pages/client/MessagesPage";
import FilesPage from "./pages/client/FilesPage";
import TeamPage from "./pages/client/TeamPage";
import ReportsPage from "./pages/client/ReportsPage";
import SettingsPage from "./pages/client/SettingsPage";

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const getInitialTabFromPath = (path: string): "Home" | "Projects" | "Services" | "Build Journal" | "AI Lab" | "Publishing" | "Media" | "Resumé CV" | "Founder Profile" | "Company Profile" | "Client Access" | "Admin Central" | "Security Settings" | "Contact" => {
    if (path.startsWith("/workspace/admin") || path.startsWith("/admin")) {
      return "Admin Central";
    } else if (path.startsWith("/portal") || path.startsWith("/client")) {
      return "Client Access";
    } else if (path.startsWith("/security-settings") || path.startsWith("/settings")) {
      return "Security Settings";
    }
    return "Home";
  };

  const [activeTab, setActiveTab] = useState<
    "Home" | "Projects" | "Services" | "Build Journal" | "AI Lab" | "Publishing" | "Media" | "Resumé CV" | "Founder Profile" | "Company Profile" | "Client Access" | "Admin Central" | "Security Settings" | "Contact"
  >(getInitialTabFromPath(location.pathname));

  const getInitialSubTabFromPath = (path: string): "analytics" | "projects" | "articles" | "journal" | "inquiries" | "cvs" | "media" | "tech" | "stats" | "testimonials" | "team" | "services" | "users" | "roles" | "audit_logs" | "workspaces" | "clients_billing" | "support_chat" | "alert_broadcasts" | "site_customization" => {
    if (path.startsWith("/workspace/admin") || path.startsWith("/admin")) {
      if (path.includes("/users")) return "users";
      if (path.includes("/settings") || path.includes("/site-customization")) return "site_customization";
      if (path.includes("/analytics")) return "analytics";
      if (path.includes("/projects")) return "projects";
      if (path.includes("/articles")) return "articles";
      if (path.includes("/journal")) return "journal";
      if (path.includes("/inquiries")) return "inquiries";
      if (path.includes("/cvs")) return "cvs";
      if (path.includes("/media")) return "media";
      if (path.includes("/tech")) return "tech";
      if (path.includes("/stats")) return "stats";
      if (path.includes("/testimonials")) return "testimonials";
      if (path.includes("/team")) return "team";
      if (path.includes("/services")) return "services";
      if (path.includes("/roles")) return "roles";
      if (path.includes("/audit")) return "audit_logs";
      if (path.includes("/workspaces")) return "workspaces";
    }
    return "analytics";
  };

  const [initialSubTab, setInitialSubTab] = useState<"analytics" | "projects" | "articles" | "journal" | "inquiries" | "cvs" | "media" | "tech" | "stats" | "testimonials" | "team" | "services" | "users" | "roles" | "audit_logs" | "workspaces" | "clients_billing" | "support_chat" | "alert_broadcasts" | "site_customization">(() => getInitialSubTabFromPath(location.pathname));

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/workspace/admin") || path.startsWith("/admin")) {
      setActiveTab("Admin Central");
      setInitialSubTab(getInitialSubTabFromPath(path));
    } else if (path.startsWith("/portal") || path.startsWith("/client")) {
      setActiveTab("Client Access");
    } else if (path.startsWith("/security-settings") || path.startsWith("/settings")) {
      setActiveTab("Security Settings");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      const role = user.role;
      if (role === "Super Admin" || role === "Admin") {
        if (!location.pathname.startsWith("/workspace/admin")) {
          navigate("/workspace/admin", { replace: true });
        }
      } else if (role === "Client") {
        if (!location.pathname.startsWith("/portal") && !location.pathname.startsWith("/client")) {
          navigate("/portal", { replace: true });
        }
      } else if (role === "Moderator") {
        if (!location.pathname.startsWith("/workspace/moderator")) {
          navigate("/workspace/moderator", { replace: true });
        }
      } else if (role === "Auditor") {
        if (!location.pathname.startsWith("/workspace/auditor")) {
          navigate("/workspace/auditor", { replace: true });
        }
      } else if (role === "Developer") {
        if (!location.pathname.startsWith("/workspace/developer")) {
          navigate("/workspace/developer", { replace: true });
        }
      } else if (role === "Operator") {
        if (!location.pathname.startsWith("/workspace/operator")) {
          navigate("/workspace/operator", { replace: true });
        }
      }
    }
  }, [user, location.pathname, navigate]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [selectedRecentImage, setSelectedRecentImage] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("afriwaid_recent_searches");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const saveSearchQuery = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 3);
      try {
        localStorage.setItem("afriwaid_recent_searches", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const [hubDropdownOpen, setHubDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem("afriwaid_theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("afriwaid_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("afriwaid_theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedRecentImage(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Scroll to top automatically when changing tabs (User Request: Fix globally so page shows from top)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

  // Handle app-wide tab redirect event
  useEffect(() => {
    const handleGotoTab = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        const dest = customEvent.detail;
        if (dest === "Projects") setActiveTab("Projects");
        else if (dest === "Services") setActiveTab("Services");
        else if (dest === "Client Access") setActiveTab("Client Access");
        else if (dest === "AI Lab") setActiveTab("AI Lab");
        else if (dest === "Media") setActiveTab("Media");
        else if (dest === "Publishing") setActiveTab("Publishing");
        else if (dest === "Build Journal") setActiveTab("Build Journal");
        else if (dest === "Resumé CV") setActiveTab("Resumé CV");
        
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };
    window.addEventListener("app:goto-tab", handleGotoTab);
    return () => window.removeEventListener("app:goto-tab", handleGotoTab);
  }, []);

  // Seed / local state databases
  const [dataLoaded, setDataLoaded] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [analytics, setAnalytics] = useState<TrackedAnalytics | null>(null);
  const [services, setServices] = useState<ServiceOffer[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [homepageStats, setHomepageStats] = useState<HomepageStats | null>(null);
  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [customization, setCustomization] = useState<CustomizationSettings>(INITIAL_CUSTOMIZATION);

  // Direct category selection inside Contact form
  const [preselectedCategory, setPreselectedCategory] = useState("Software Development");

  // Real-time synchronization state nodes
  const [liveNotifications, setLiveNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [wsSocket, setWsSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token") || localStorage.getItem("token") || "";
    if (!token) {
      if (wsSocket) {
        wsSocket.close();
        setWsSocket(null);
      }
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;
    
    console.log("[App.tsx] Initiating WebSocket connection to:", wsUrl);
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("[App.tsx] WebSocket connected.");
      socket.send(JSON.stringify({
        type: "auth:init",
        payload: { token }
      }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[App.tsx] WebSocket Event Match:", data);
        
        if (data.type === "auth:success") {
          console.log("[App.tsx] WS Authorized.");
        } else if (data.type === "notifications:sync") {
          setLiveNotifications(data.payload.list || []);
          setUnreadCount(data.payload.count || 0);
        } else if (data.type === "notification:receive") {
          const nt = data.payload;
          setLiveNotifications(prev => [nt, ...prev]);
          setUnreadCount(prev => prev + 1);
        } else if (data.type === "chat:message") {
          window.dispatchEvent(new CustomEvent("ws:chat:message", { detail: data.payload }));
        } else if (data.type === "chat:typing_broadcast") {
          window.dispatchEvent(new CustomEvent("ws:chat:typing", { detail: data.payload }));
        } else if (data.type === "chat:read") {
          window.dispatchEvent(new CustomEvent("ws:chat:read", { detail: data.payload }));
        }
      } catch (err) {
        console.error("Failed to parse websocket message", err);
      }
    };

    socket.onclose = () => {
      console.log("[App.tsx] WebSocket disconnected.");
      setWsSocket(null);
    };

    setWsSocket(socket);

    return () => {
      socket.close();
    };
  }, [user]);

  // Load initially
  useEffect(() => {
    const db = loadInitialData();
    setProjects(db.projects);
    setArticles(db.articles);
    setJournal(db.journal);
    setCvs(db.cvs);
    setClients(db.clients);
    setInquiries(db.inquiries);
    setAnalytics(db.analytics);
    setServices(db.services);
    setMedia(db.media);
    setHomepageStats(db.homepageStats);
    setTechStack(db.techStack || []);
    setTestimonials(db.testimonials || []);
    setTeamMembers(db.teamMembers || []);
    if (db.customization) {
      setCustomization(db.customization);
    }
    setDataLoaded(true);

    // Increment home page view tracking count
    if (db.analytics) {
      const copy = { ...db.analytics };
      const homePv = copy.pageViews.find(pv => pv.path === "/");
      if (homePv) homePv.count += 1;
      copy.visitorsLast30Days += 1;
      setAnalytics(copy);
      saveInitialData({ ...db, analytics: copy });
    }
  }, []);

  // Sync Favicon dynamically whenever it changes in customization settings
  useEffect(() => {
    if (customization?.faviconUrl) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = customization.faviconUrl;
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = customization.faviconUrl;
        document.head.appendChild(newLink);
      }
    }
  }, [customization?.faviconUrl]);

  // Save changes wrapper
  const syncChanges = (updatedDB: Partial<ReturnType<typeof loadInitialData>>) => {
    const current = loadInitialData();
    const finalDir = {
      projects: updatedDB.projects !== undefined ? updatedDB.projects : current.projects,
      articles: updatedDB.articles !== undefined ? updatedDB.articles : current.articles,
      journal: updatedDB.journal !== undefined ? updatedDB.journal : current.journal,
      cvs: updatedDB.cvs !== undefined ? updatedDB.cvs : current.cvs,
      clients: updatedDB.clients !== undefined ? updatedDB.clients : current.clients,
      inquiries: updatedDB.inquiries !== undefined ? updatedDB.inquiries : current.inquiries,
      analytics: updatedDB.analytics !== undefined ? updatedDB.analytics : current.analytics,
      services: updatedDB.services !== undefined ? updatedDB.services : current.services,
      media: updatedDB.media !== undefined ? updatedDB.media : current.media,
      homepageStats: updatedDB.homepageStats !== undefined ? updatedDB.homepageStats : current.homepageStats,
      techStack: updatedDB.techStack !== undefined ? updatedDB.techStack : current.techStack,
      testimonials: updatedDB.testimonials !== undefined ? updatedDB.testimonials : current.testimonials,
      teamMembers: updatedDB.teamMembers !== undefined ? updatedDB.teamMembers : current.teamMembers,
      customization: updatedDB.customization !== undefined ? updatedDB.customization : current.customization,
    };
    saveInitialData(finalDir);
  };

  const handleUpdateCustomization = (updated: CustomizationSettings) => {
    setCustomization(updated);
    syncChanges({ customization: updated });
  };

  const handleUpdateHomepageStats = (stats: HomepageStats) => {
    setHomepageStats(stats);
    syncChanges({ homepageStats: stats });
  };

  // State handlers to modify databases across components:
  const handleAddProject = (p: Project) => {
    const updated = [p, ...projects];
    setProjects(updated);
    syncChanges({ projects: updated });
  };

  const handleUpdateProject = (p: Project) => {
    const updated = projects.map(proj => proj.id === p.id ? p : proj);
    setProjects(updated);
    syncChanges({ projects: updated });
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    syncChanges({ projects: updated });
  };

  const handleAddArticle = (a: Article) => {
    const updated = [a, ...articles];
    setArticles(updated);
    syncChanges({ articles: updated });
  };

  const handleDeleteArticle = (id: string) => {
    const updated = articles.filter(a => a.id !== id);
    setArticles(updated);
    syncChanges({ articles: updated });
  };

  const handleAddJournal = (j: JournalEntry) => {
    const updated = [j, ...journal];
    setJournal(updated);
    syncChanges({ journal: updated });
  };

  const handleToggleCV = (id: string) => {
    const updated = cvs.map(c => c.id === id ? { ...c, isPublished: !c.isPublished } : c);
    setCvs(updated);
    syncChanges({ cvs: updated });
  };

  const handleUpdateCV = (updatedCV: CV) => {
    const updated = cvs.map(c => c.id === updatedCV.id ? updatedCV : c);
    setCvs(updated);
    syncChanges({ cvs: updated });
  };

  const handleAddCV = (newCv: CV) => {
    const updated = [...cvs, newCv];
    setCvs(updated);
    syncChanges({ cvs: updated });
  };

  const handleDeleteCV = (id: string) => {
    const updated = cvs.filter(c => c.id !== id);
    setCvs(updated);
    syncChanges({ cvs: updated });
  };

  const handleAddMedia = (newMedia: MediaItem) => {
    const updated = [...media, newMedia];
    setMedia(updated);
    syncChanges({ media: updated });
  };

  const handleDeleteMedia = (id: string) => {
    const updated = media.filter(m => m.id !== id);
    setMedia(updated);
    syncChanges({ media: updated });
  };

  const handleUpdateTechStack = (items: TechStackItem[]) => {
    setTechStack(items);
    syncChanges({ techStack: items });
  };

  const handleAddTestimonial = (item: Testimonial) => {
    const updated = [item, ...testimonials];
    setTestimonials(updated);
    syncChanges({ testimonials: updated });
  };

  const handleDeleteTestimonial = (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    syncChanges({ testimonials: updated });
  };

  const handleAddTeamMember = (item: TeamMember) => {
    const updated = [item, ...teamMembers];
    setTeamMembers(updated);
    syncChanges({ teamMembers: updated });
  };

  const handleDeleteTeamMember = (id: string) => {
    const updated = teamMembers.filter(m => m.id !== id);
    setTeamMembers(updated);
    syncChanges({ teamMembers: updated });
  };

  const handleUpdateTeamMember = (updatedMember: TeamMember) => {
    const updated = teamMembers.map(m => m.id === updatedMember.id ? updatedMember : m);
    setTeamMembers(updated);
    syncChanges({ teamMembers: updated });
  };

  const handleUpdateTestimonial = (updatedTestimonial: Testimonial) => {
    const updated = testimonials.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t);
    setTestimonials(updated);
    syncChanges({ testimonials: updated });
  };

  const handleUpdateArticle = (updatedArticle: Article) => {
    const updated = articles.map(a => a.id === updatedArticle.id ? updatedArticle : a);
    setArticles(updated);
    syncChanges({ articles: updated });
  };

  const handleUpdateJournal = (updatedJournal: JournalEntry) => {
    const updated = journal.map(j => j.id === updatedJournal.id ? updatedJournal : j);
    setJournal(updated);
    syncChanges({ journal: updated });
  };

  const handleDeleteJournal = (id: string) => {
    const updated = journal.filter(j => j.id !== id);
    setJournal(updated);
    syncChanges({ journal: updated });
  };

  const handleAddService = (newService: ServiceOffer) => {
    const updated = [...services, newService];
    setServices(updated);
    syncChanges({ services: updated });
  };

  const handleUpdateService = (updatedService: ServiceOffer) => {
    const updated = services.map(s => s.id === updatedService.id ? updatedService : s);
    setServices(updated);
    syncChanges({ services: updated });
  };

  const handleDeleteService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    syncChanges({ services: updated });
  };

  const handleUpdateInquiryStatus = (id: string, status: "new" | "reviewed" | "archived") => {
    const updated = inquiries.map(i => i.id === id ? { ...i, status } : i);
    setInquiries(updated);
    syncChanges({ inquiries: updated });
  };

  const handleInquirySubmitted = (newInq: Inquiry) => {
    const updated = [newInq, ...inquiries];
    setInquiries(updated);
    syncChanges({ inquiries: updated });
  };

  const handleFeedbackAdd = (clientId: string, text: string) => {
    const updated = clients.map(c => {
      if (c.id === clientId) {
        return {
          ...c,
          feedback: c.feedback ? [...c.feedback, text] : [text]
        };
      }
      return c;
    });
    setClients(updated);
    syncChanges({ clients: updated });
  };

  // Metrics Increments
  const handleDownloadIncrement = (id: string) => {
    if (analytics) {
      const copy = { ...analytics };
      copy.projectDownloads += 1;
      setAnalytics(copy);
      syncChanges({ analytics: copy });
    }
  };

  const handleViewIncrement = (id: string) => {
    const updated = projects.map(p => p.id === id ? { ...p, views: p.views + 1 } : p);
    setProjects(updated);
    syncChanges({ projects: updated });
  };

  const handleReadIncrement = (id: string) => {
    const updated = articles.map(a => a.id === id ? { ...a, views: a.views + 1 } : a);
    setArticles(updated);
    syncChanges({ articles: updated });
  };

  const handlePlayIncrement = (id: string) => {
    const updated = media.map(m => m.id === id ? { ...m, views: m.views + 1 } : m);
    setMedia(updated);
    syncChanges({ media: updated });
  };

  // Global search filtering
  const matchingSearchItems = () => {
    if (!globalSearchQuery.trim()) return [];
    const query = globalSearchQuery.toLowerCase();
    const results: { title: string; category: string; type: typeof activeTab; id: string }[] = [];

    // Projects
    projects.forEach(p => {
      if (p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)) {
        results.push({ title: p.name, category: p.category, type: "Projects", id: p.id });
      }
    });

    // Articles
    articles.forEach(a => {
      if (a.title.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)) {
        results.push({ title: a.title, category: a.category, type: "Publishing", id: a.id });
      }
    });

    // Services
    services.forEach(s => {
      if (s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query)) {
        results.push({ title: s.name, category: s.category, type: "Services", id: s.id });
      }
    });

    // Media
    media.forEach(m => {
      if (m.title.toLowerCase().includes(query) || m.description.toLowerCase().includes(query)) {
        results.push({ title: m.title, category: m.category, type: "Media", id: m.id });
      }
    });

    return results.slice(0, 8);
  };

  const handleSelectSearchResult = (type: typeof activeTab) => {
    if (globalSearchQuery.trim()) {
      saveSearchQuery(globalSearchQuery);
    }
    setActiveTab(type);
    setGlobalSearchOpen(false);
    setGlobalSearchQuery("");
  };

  const ACCENT_MAP = {
    cyan: {
      text: "text-cyan-500 dark:text-cyan-400",
      textBg: "bg-cyan-500 dark:bg-cyan-600",
      border: "border-cyan-500/20 dark:border-cyan-500/30",
      borderColor: "border-cyan-500 dark:border-cyan-400",
      bgGradient: "from-cyan-500 to-purple-500",
      accentLight: "text-cyan-400 border-cyan-200 dark:border-cyan-900/60"
    },
    amber: {
      text: "text-amber-500 dark:text-amber-400",
      textBg: "bg-amber-500 dark:bg-amber-600",
      border: "border-amber-500/20 dark:border-amber-500/30",
      borderColor: "border-amber-500 dark:border-amber-400",
      bgGradient: "from-amber-500 to-orange-600",
      accentLight: "text-amber-450 border-amber-200 dark:border-amber-900/60"
    },
    emerald: {
      text: "text-emerald-500 dark:text-emerald-400",
      textBg: "bg-emerald-500 dark:bg-emerald-600",
      border: "border-emerald-500/20 dark:border-emerald-500/30",
      borderColor: "border-emerald-500 dark:border-emerald-400",
      bgGradient: "from-emerald-500 to-teal-655",
      accentLight: "text-emerald-405 border-emerald-200 dark:border-emerald-900/60"
    },
    indigo: {
      text: "text-indigo-550 dark:text-indigo-400",
      textBg: "bg-indigo-505 dark:bg-indigo-600",
      border: "border-indigo-550/20 dark:border-indigo-550/30",
      borderColor: "border-indigo-505 dark:border-indigo-400",
      bgGradient: "from-indigo-500 to-purple-600",
      accentLight: "text-indigo-405 border-indigo-200 dark:border-indigo-900/60"
    },
    rose: {
      text: "text-rose-500 dark:text-rose-450",
      textBg: "bg-rose-500 dark:bg-rose-600",
      border: "border-rose-500/20 dark:border-rose-500/30",
      borderColor: "border-rose-500 dark:border-rose-400",
      bgGradient: "from-rose-500 to-pink-500",
      accentLight: "text-rose-400 border-rose-200 dark:border-rose-900/60"
    },
    violet: {
      text: "text-violet-500 dark:text-violet-400",
      textBg: "bg-violet-500 dark:bg-violet-605",
      border: "border-violet-500/20 dark:border-violet-505/30",
      borderColor: "border-violet-505 dark:border-violet-400",
      bgGradient: "from-violet-500 to-fuchsia-600",
      accentLight: "text-violet-405 border-violet-200 dark:border-violet-900/60"
    }
  };

  const accent = ACCENT_MAP[customization?.accentColor || "cyan"] || ACCENT_MAP.cyan;

  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center font-sans space-y-4">
        <Sparkles className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="text-xs uppercase tracking-widest text-slate-500 font-mono font-bold">BOOTING AFRIWAID CLIENT ENGINE...</span>
      </div>
    );
  }

  // Full-portal takeover if user is logged in as a Client role
  if (user && user.role === "Client") {
    return (
      <ClientWorkspaceLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <ClientPortal clientProfiles={clients} onFeedbackAdd={handleFeedbackAdd} wsSocket={wsSocket} />
      </ClientWorkspaceLayout>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-black text-white dark" : "bg-slate-50 text-slate-900"} relative flex flex-col justify-between overflow-x-hidden antialiased ${customization?.useMonochromeTerminalTheme ? "font-mono text-emerald-500 dark:text-emerald-400 scale-100" : "font-sans"}`}>
      
      {/* Decorative Cinematic Overlay */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.06),transparent_65%)] pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-100/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-15 w-96 h-96 bg-indigo-100/10 rounded-full blur-[120px] pointer-events-none" />


      {/* Navigation Header */}
      {!(activeTab === "Client Access" && user) && (
        <header className="sticky top-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-neutral-800 z-40 print:hidden shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          
          {/* Logo / Title brand */}
          <button
            onClick={() => setActiveTab("Home")}
            className="flex items-center gap-2 group text-left cursor-pointer hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 ease-out origin-left"
            id="nav-logo-btn"
          >
            <div className={`w-8 h-8 rounded bg-gradient-to-br ${accent.bgGradient} text-white flex items-center justify-center font-bold text-lg shadow-sm border border-cyan-500/10 group-hover:scale-105 transition-transform duration-150 overflow-hidden`}>
              {customization?.logoType === "image" && customization?.logoUrl ? (
                <img 
                  src={customization.logoUrl} 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="font-display animate-pulse">
                  {customization?.logoText || (customization?.appNickname || "A").charAt(0)}
                </span>
              )}
            </div>
            <div>
              <span className="text-sm font-display font-black tracking-widest text-slate-950 dark:text-white block uppercase">{customization?.appName || "AFRIWAID STUDIO"}</span>
              <span className="text-[9px] text-slate-400 dark:text-neutral-450 font-mono block -mt-1 leading-none font-bold uppercase">{customization?.tagline || "DIGITAL CREATIVE ENGINE"}</span>
            </div>
          </button>

          {/* Desktop Navigation Links (Responsive density) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 font-mono text-[10px] tracking-wider uppercase relative">
            {(["Home", "Projects", "Services", "Build Journal"] as const)
              .filter((tab) => tab !== "Build Journal" || (customization?.showJournal !== false))
              .map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as any);
                    setMobileMenuOpen(false);
                    setHubDropdownOpen(false);
                  }}
                  className={`px-3 py-1.5 transition-all duration-155 whitespace-nowrap font-bold ${
                    activeTab === tab
                      ? `${accent.text} border-b-2 ${accent.borderColor} rounded-none pb-1 font-extrabold`
                      : "text-slate-600 dark:text-neutral-400 hover:text-slate-950 dark:hover:text-white pb-1 border-b-2 border-transparent hover:border-slate-200 dark:hover:border-neutral-850"
                  }`}
                  id={`nav-${tab.toLowerCase().replace(" ", "-")}`}
                >
                  {tab}
                </button>
              ))}

            {/* Premium Category Hub Trigger */}
            <div className="relative">
              <button
                onClick={() => setHubDropdownOpen(!hubDropdownOpen)}
                className={`px-3 py-1.5 transition-all duration-155 whitespace-nowrap font-bold flex items-center gap-1.5 cursor-pointer ${
                  !(["Home", "Projects", "Services", "Build Journal"] as any).includes(activeTab) && activeTab !== "Security Settings"
                    ? `${accent.text} border-b-2 ${accent.borderColor} rounded-none pb-1 font-extrabold`
                    : "text-slate-600 dark:text-neutral-400 hover:text-slate-950 dark:hover:text-white pb-1 border-b-2 border-transparent hover:border-slate-200 dark:hover:border-neutral-850"
                }`}
                id="nav-hub-trigger"
              >
                <span>WORKSPACE HUB</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${hubDropdownOpen ? "rotate-180" : ""}`} />
                {!(["Home", "Projects", "Services", "Build Journal"] as any).includes(activeTab) && activeTab !== "Security Settings" && (
                  <span className={`w-1.5 h-1.5 ${accent.textBg} rounded-full shrink-0 animate-pulse block`} />
                )}
              </button>

              {hubDropdownOpen && (
                <>
                  {/* Invisible Backdrop target for clicking outside */}
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setHubDropdownOpen(false)} 
                  />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-neutral-800 shadow-xl py-2 z-50 animate-fadeIn">
                    <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-neutral-900 mb-1 flex items-center justify-between">
                      <span className="text-[9px] text-slate-400 dark:text-neutral-500 font-mono font-bold uppercase tracking-widest">Capabilities Index</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-500 dark:text-cyan-400 font-mono text-[8px] font-bold rounded">8 SLOTS</span>
                    </div>
                    {[
                      { name: "AI Lab", tab: "AI Lab" as const, desc: "AI models, engines & smart sandboxes", icon: BrainCircuit, color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40", show: customization?.showAILab !== false },
                      { name: "Publishing Hub", tab: "Publishing" as const, desc: "Bespoke insights, articles & logs", icon: FileText, color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40", show: customization?.showWriting !== false },
                      { name: "Media Center", tab: "Media" as const, desc: "Cinematic videos & high-fidelity assets", icon: Play, color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40", show: customization?.showMedia !== false },
                      { name: "Resumé CV", tab: "Resumé CV" as const, desc: "Academic or professional background", icon: Award, color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40", show: true },
                      { name: "Founder Profile", tab: "Founder Profile" as const, desc: "Nwogha Chigozie's 5 expressions", icon: User, color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40", show: true },
                      { name: "Company Profile", tab: "Company Profile" as const, desc: "Core identity, team slots & values", icon: Globe, color: "text-sky-600 dark:text-sky-450 bg-sky-50 dark:bg-sky-950/40", show: true },
                      { name: "Client Portal", tab: "Client Access" as const, desc: "Interactive secure partner workstation", icon: Command, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40", show: true },
                      { name: "Admin Dashboard", tab: "Admin Central" as const, desc: "Operator credentials & security logs", icon: ShieldCheck, color: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40", show: true }
                    ].filter(item => item.show).map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.tab;
                      return (
                        <button
                          key={item.tab}
                          onClick={() => {
                            setActiveTab(item.tab);
                            setHubDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 flex items-start gap-3 transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-zinc-900 group ${
                            isActive ? `bg-slate-50 dark:bg-zinc-900 border-l-2 ${accent.borderColor}` : "border-l-2 border-transparent"
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${item.color} ${isActive ? "scale-105" : ""}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`text-[11px] font-sans font-bold block transition-colors ${
                              isActive ? `${accent.text} font-extrabold` : `text-slate-850 dark:text-slate-200 group-hover:${accent.text}`
                            }`}>
                              {item.name}
                            </span>
                            <span className="text-[9px] text-slate-400 dark:text-neutral-500 leading-normal block font-sans truncate font-medium">
                              {item.desc}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Visual spacer */}
            <span className="h-4 w-px bg-slate-200 dark:bg-neutral-800 mx-1.5" />

            {/* Integrated Access Controls inside Desktop Nav */}
            {user ? (
              <div className="flex items-center gap-1.5 font-sans lowercase">
                
                {/* Live Real-time In-App Notifications Bell */}
                <div className="relative group">
                  <button
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem("auth_token") || localStorage.getItem("token") || "";
                        await fetch("/api/notifications/read-all", {
                          method: "PUT",
                          headers: { "Authorization": `Bearer ${token}` }
                        });
                        setUnreadCount(0);
                        setLiveNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      } catch (err) {
                        console.error("Read all notifications failed", err);
                      }
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-neutral-300 hover:text-cyan-400 dark:hover:text-cyan-400 hover:border-cyan-400 dark:hover:border-cyan-400 transition-all duration-150 cursor-pointer flex items-center justify-center relative"
                    title="Real-time Alerts Matrix"
                    id="header-notification-bell-btn"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-cyan-500 text-black font-mono font-bold text-[8px] flex items-center justify-center rounded-full px-0.5 animate-pulse border border-black">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Overlay Panel */}
                  <div className="absolute right-0 top-full mt-2 w-80 bg-black border border-zinc-800 rounded-xl py-2 shadow-2xl z-50 invisible group-hover:visible transition-all duration-200">
                    <div className="px-3.5 py-1.5 border-b border-zinc-900 flex items-center justify-between">
                      <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-wider">Live System Broadcasts</span>
                      <span className="text-[8px] text-cyan-400 font-mono uppercase">REAL-TIME BRIDGE ACTIVE</span>
                    </div>

                    <div className="max-h-60 overflow-y-auto w-full no-scrollbar divide-y divide-zinc-900">
                      {liveNotifications.length === 0 ? (
                        <div className="p-4 text-center text-[10px] text-zinc-500 font-mono">
                          Zero pending pending broadcasts.
                        </div>
                      ) : (
                        liveNotifications.map((n, idx) => (
                          <div key={n.id || idx} className={`p-3 text-left space-y-1 ${n.read ? "opacity-60" : "bg-cyan-500/5"}`}>
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="text-[10px] font-bold text-white tracking-tight">{n.title}</span>
                              <span className="text-[8px] text-zinc-400 font-mono">{new Date(n.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-[10px] text-zinc-400 leading-normal">{n.msg}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("Security Settings");
                    setHubDropdownOpen(false);
                  }}
                  className={`p-1 px-2.5 rounded-md border text-[10px] font-mono font-bold transition duration-150 flex items-center gap-1 cursor-pointer ${
                    activeTab === "Security Settings"
                      ? "bg-cyan-500 border-cyan-500 text-white"
                      : "bg-slate-50 dark:bg-zinc-90 w-auto hover:bg-slate-100 dark:bg-zinc-900 dark:border-neutral-800 dark:text-neutral-300 hover:text-slate-900 text-slate-700"
                  }`}
                  id="profile-nav-btn"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
                  <span className="max-w-[70px] truncate">@{user.username}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setActiveTab("Home");
                    setHubDropdownOpen(false);
                  }}
                  className="p-1 px-2.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-650 dark:text-red-400 rounded-lg border border-red-200/50 dark:border-red-900/30 cursor-pointer font-mono font-bold text-[9px] uppercase tracking-wider"
                  id="nav-logout-action-btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setActiveTab("Client Access");
                  setHubDropdownOpen(false);
                }}
                className={`p-1 px-3 rounded-lg font-mono text-[10px] font-bold transition duration-150 flex items-center gap-1 cursor-pointer border ${
                  activeTab === "Client Access"
                    ? "bg-cyan-500 border-cyan-500 text-white"
                    : "bg-slate-900 dark:bg-zinc-900 hover:bg-slate-800 text-white dark:text-zinc-200 border-neutral-850 dark:border-neutral-800"
                }`}
                id="header-login-gate-btn"
              >
                <span>LOG IN</span>
              </button>
            )}
          </nav>

          {/* Right Toolbar Action: Global Search & Hamburger */}
          <div className="flex items-center gap-2">
            
            {/* Theme Toggle Button (Compact Icon) */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-655 hover:text-slate-905 dark:bg-zinc-900 dark:border-neutral-800 dark:text-neutral-400 transition duration-150 flex items-center justify-center cursor-pointer w-8 h-8"
              title={isDark ? "Activate Light System" : "Activate Cosmic Black System"}
              id="theme-toggle-btn"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 dark:text-zinc-500" />
              )}
            </button>

            {/* Global Search Tool button (Compact Icon) */}
            <button
              onClick={() => setGlobalSearchOpen(true)}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-655 hover:text-slate-900 dark:bg-zinc-900 dark:border-neutral-800 dark:text-neutral-400 transition duration-150 flex items-center justify-center cursor-pointer w-8 h-8"
              title="Global directory search engine"
              id="global-search-btn"
            >
              <Search className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            </button>

            {/* Mobile hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 lg:hidden rounded-lg bg-slate-50 border border-slate-200 dark:bg-zinc-900 dark:border-neutral-800 text-slate-655 hover:text-slate-900 dark:text-neutral-400 transition duration-150"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>
        </div>

         {/* Mobile Hamburger Navigation layout */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-neutral-800 px-4 py-4 space-y-2 text-left font-mono text-xs uppercase z-40 animate-fadeIn">
            {(["Home", "Projects", "Services", "Build Journal", "AI Lab", "Publishing", "Media", "Resumé CV", "Founder Profile", "Company Profile", "Client Access", "Admin Central"] as const)
              .filter((tab) => {
                if (tab === "Build Journal") return customization?.showJournal !== false;
                if (tab === "AI Lab") return customization?.showAILab !== false;
                if (tab === "Publishing") return customization?.showWriting !== false;
                if (tab === "Media") return customization?.showMedia !== false;
                return true;
              })
              .map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg block font-bold transition duration-155 ${
                    activeTab === tab 
                      ? `bg-slate-100 dark:bg-zinc-900 ${accent.text} font-extrabold border-l-2 ${accent.borderColor}` 
                      : "text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-zinc-900"
                  }`}
                  id={`mobile-nav-${tab.toLowerCase().replace(" ", "-")}`}
                >
                  {tab}
                </button>
              ))}
          </div>
        )}
      </header>
      )}

      {/* Main Sandbox Canvas Wrapper */}
      <main className={(activeTab === "Client Access" && user) ? "w-full flex-1" : "max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex-1 w-full"}>
        
        {/* Render: 1. Home landing page */}
        {activeTab === "Home" && (
          <div className="space-y-16 py-4 md:py-8">
            
            {/* Display Hero Area */}
            <div className="text-center max-w-4xl mx-auto space-y-6 md:space-y-8 relative">
              
              {/* Dynamic status nodes */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${accent.border} bg-black ${accent.text} text-xs font-mono tracking-widest uppercase mb-2 font-bold`}>
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                {customization?.tagline || "Empowering Digital Innovation"}
              </div>

              {/* Bold Cinematic Display Header */}
              <h1 className="text-4xl md:text-7xl font-display font-extrabold text-slate-900 dark:text-white tracking-tight leading-none uppercase">
                {customization?.heroHeadline || "AFRIWAID STUDIO"}
              </h1>

              <p className="text-slate-600 dark:text-zinc-400 text-base md:text-xl leading-relaxed max-w-3xl mx-auto font-sans">
                {customization?.heroSubtitle || "A world-class technology, portfolio, AI innovation, and client management node. We design high-scale Web applications, custom AI pipelines, and stunning cinematic visual experiences."}
              </p>

              {/* Primary action triggers */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 font-mono text-xs">
                <button
                  onClick={() => setActiveTab("Projects")}
                  className={`px-6 py-3.5 bg-gradient-to-r ${accent.bgGradient} text-white font-bold rounded-lg transition duration-150 flex items-center gap-2 shadow-md tracking-wider uppercase cursor-pointer`}
                  id="hero-explore-btn"
                >
                  {customization?.primaryCtaText || "Explore Showcase"} <ArrowRight className="w-4 h-4 text-cyan-200 animate-bounce-horizontal" />
                </button>
                <button
                  onClick={() => {
                    if (customization?.showAILab !== false) {
                      setActiveTab("AI Lab");
                    } else {
                      setActiveTab("Services");
                    }
                  }}
                  className="px-6 py-3.5 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black text-slate-705 dark:text-zinc-350 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-zinc-900 rounded-lg shadow-sm transition duration-150 flex items-center gap-2 cursor-pointer"
                  id="hero-ai-btn"
                >
                  <BrainCircuit className="w-4 h-4 text-purple-500 animate-pulse" />
                  <span className="font-bold">{customization?.secondaryCtaText || "Initiate AI Systems Lab"}</span>
                </button>
              </div>
            </div>

            {/* bento box statistic counts */}
            <div className="space-y-4">
              <div className="text-center">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider block ${accent.text}`}>{customization?.statsSubtitle || "Enterprise Impact Metric Matrix"}</span>
                <h3 className="text-2xl font-display text-slate-950 dark:text-white font-extrabold">{customization?.statsTitle || "AfriWaid Studio Performance Indication"}</h3>
              </div>
              <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 px-1">
                <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 text-left space-y-1.5 shadow-xs hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-lg transition duration-150">
                  <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono uppercase tracking-wider block leading-tight h-8 font-bold">Projects Completed</span>
                  <span className="text-2xl font-display font-black text-cyan-500 block">{formatStat(homepageStats?.projectsCompleted, 24, "+")}</span>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-sans leading-relaxed">Deployed SaaS and platforms live.</p>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 text-left space-y-1.5 shadow-xs hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition duration-150">
                  <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono uppercase tracking-wider block leading-tight h-8 font-bold">Applications Built</span>
                  <span className="text-2xl font-display font-black text-purple-500 block">{formatStat(homepageStats?.applicationsBuilt, 18, " Built")}</span>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-sans leading-relaxed">Full-stack web & mobile apps.</p>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 text-left space-y-1.5 shadow-xs hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-lg transition duration-150">
                  <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono uppercase tracking-wider block leading-tight h-8 font-bold">AI Systems Developed</span>
                  <span className="text-2xl font-display font-black text-cyan-500 block">{formatStat(homepageStats?.aiSystemsDeveloped, 12, " Deployed")}</span>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-sans leading-relaxed">Neural agent orchestrators.</p>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 text-left space-y-1.5 shadow-xs hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition duration-150">
                  <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono uppercase tracking-wider block leading-tight h-8 font-bold">Articles Published</span>
                  <span className="text-2xl font-display font-black text-purple-500 block">{formatStat(homepageStats?.articlesPublished, 8, " Issues")}</span>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-sans leading-relaxed">Deep technical & research papers.</p>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 text-left space-y-1.5 shadow-xs hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-lg transition duration-150">
                  <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono uppercase tracking-wider block leading-tight h-8 font-bold">Brands Created</span>
                  <span className="text-2xl font-display font-black text-cyan-500 block">{formatStat(homepageStats?.brandsCreated, 6, " Identities")}</span>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-sans leading-relaxed">Premium visual corporate marks.</p>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 text-left space-y-1.5 shadow-xs hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition duration-150">
                  <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono uppercase tracking-wider block leading-tight h-8 font-bold">Videos Produced</span>
                  <span className="text-2xl font-display font-black text-purple-500 block">{formatStat(homepageStats?.videosProduced, 15, " Clips")}</span>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-sans leading-relaxed">High-energy cine commercials.</p>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 text-left space-y-1.5 shadow-xs hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-lg transition duration-150 col-span-2 md:col-span-1">
                  <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono uppercase tracking-wider block leading-tight h-8 font-bold">Clients Served</span>
                  <span className="text-2xl font-display font-black text-cyan-500 block">{formatStat(homepageStats?.clientsServed, 30, " Global")}</span>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-sans leading-relaxed">Satisfied enterprise groups.</p>
                </div>
              </section>
            </div>

            {/* Technology stack layout panel */}
            <section className="bg-white dark:bg-black rounded-xl border border-slate-200 dark:border-zinc-800 p-6 md:p-8 space-y-6 text-left relative overflow-hidden shadow-xs">
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cyan-500/[0.015] to-transparent pointer-events-none" />
              
              <div className="space-y-1">
                <span className={`text-xs font-mono font-bold uppercase tracking-wider block ${accent.text}`}>{customization?.techSubtitle || "TECHNOLOGY SPECIFICATION"}</span>
                <h3 className="text-xl font-display text-slate-900 dark:text-white font-bold">{customization?.techTitle || "Verified Hyper-engine Development Stack"}</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-450 max-w-2xl leading-relaxed font-sans">
                  {customization?.techDescription || "Every product deployed by AfriWaid conforms to rigorous, type-safe paradigms. Here are our verified stack parameters:"}
                </p>
              </div>

              {techStack && techStack.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {techStack.map((tech, idx) => (
                    <div key={tech.id || idx} className="p-4 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 space-y-2 hover:border-cyan-400/30 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-md transition">
                      <span className={`w-6 h-6 rounded bg-slate-150 dark:bg-zinc-900 flex items-center justify-center text-[10px] font-mono font-bold ${
                        idx % 2 === 0 ? "text-cyan-500" : "text-purple-500"
                      }`}>
                        {tech.badge || "TS"}
                      </span>
                      <h4 className="text-xs text-slate-900 dark:text-white font-bold">{tech.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal font-sans">{tech.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-mono italic">No technologies specified in sandbox register.</p>
              )}
            </section>

            {/* Quick Teaser blocks: Recent Journal Commits & Featured Project */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              
              {/* Journal teaser (Left) */}
              <div className="p-6 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-800/50">Recent Journal Commits</h4>
                  <button onClick={() => setActiveTab("Build Journal")} className="text-[10px] text-slate-400 hover:text-cyan-500 font-mono uppercase font-bold tracking-wider cursor-pointer transition">All Logs</button>
                </div>

                <div className="space-y-3">
                  {journal.slice(0, 3).map((j) => (
                    <div
                      key={j.id}
                      onClick={() => setActiveTab("Build Journal")}
                      className="p-3 bg-slate-50/50 dark:bg-zinc-950/40 rounded-lg border border-slate-200 dark:border-zinc-850 space-y-2 hover:border-cyan-400/80 hover:bg-white dark:hover:bg-zinc-900/60 transition duration-150 cursor-pointer group focus-within:ring-1 focus-within:ring-cyan-500 text-left"
                      title="Click to view entry in Build Journal timeline"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-900 dark:text-white font-bold group-hover:text-cyan-400 transition duration-150">{j.title}</span>
                        <span className="text-slate-400 shrink-0">{j.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-zinc-450 line-clamp-2 font-sans leading-relaxed">{j.description}</p>
                      
                      {j.images && j.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {j.images.map((imgUrl, imgIdx) => (
                            <div
                              key={imgIdx}
                              onClick={(e) => {
                                e.stopPropagation(); // Avoid switching tabs when zoom is requested
                                setSelectedRecentImage(imgUrl);
                              }}
                              className="relative w-16 h-10 rounded overflow-hidden border border-slate-200 dark:border-zinc-800 hover:border-cyan-400 dark:hover:border-cyan-500/80 transition-all cursor-zoom-in group/img"
                              title="Click to zoom snapshot"
                            >
                              <img
                                src={imgUrl}
                                alt="Journal preview thumbnail"
                                className="w-full h-full object-cover group-hover/img:scale-105 transition duration-155"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/10 hover:bg-black/0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition duration-150">
                                <Maximize2 className="w-2.5 h-2.5 text-white filter drop-shadow-sm" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {j.links && j.links.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-150/50 dark:border-zinc-850/50">
                          {j.links.map((link, lIdx) => (
                            <button
                              key={lIdx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation(); // Avoid triggering parent setActiveTab("Build Journal")
                                if (link.url.startsWith("#")) {
                                  window.dispatchEvent(new CustomEvent("app:goto-tab", { detail: link.url.substring(1) }));
                                } else {
                                  window.open(link.url, "_blank", "noopener,noreferrer");
                                }
                              }}
                              className="inline-flex items-center gap-1 text-[9px] bg-slate-105 hover:bg-slate-200 dark:bg-zinc-900/85 dark:hover:bg-zinc-800 text-blue-650 dark:text-cyan-400 hover:text-blue-800 dark:hover:text-cyan-300 font-mono transition duration-150 px-2.5 py-0.5 rounded border border-slate-200/50 dark:border-zinc-800/50 font-bold cursor-pointer"
                            >
                              <Link className="w-2.5 h-2.5 text-blue-500 dark:text-cyan-500" />
                              <span>{link.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Client inquiries teaser link (Right) */}
              <div className="p-6 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-zinc-800 space-y-6 flex flex-col justify-between shadow-xs">
                <div className="space-y-2">
                  <span className="text-purple-500 text-xs font-mono font-bold uppercase tracking-wider">PREPARED CONSULTATIONS</span>
                  <h3 className="text-xl font-display text-slate-900 dark:text-white font-bold">Have an enterprise project or partnership idea?</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-450 leading-relaxed max-w-md font-sans">
                    Initiate contact with standard requirements profiles. We pre-route ticketing categories. Let's launch your next system.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("Services")}
                  className="px-5 py-3 bg-slate-900 dark:bg-zinc-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 dark:hover:bg-zinc-800 transition duration-150 flex items-center justify-center gap-2 uppercase tracking-wider font-mono self-start cursor-pointer border border-slate-755 dark:border-zinc-800 shadow-sm"
                  id="teaser-contact-btn"
                >
                  <span>Request Technical Services</span>
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Render: 2. Projects */}
        {activeTab === "Projects" && (
          <ProjectsPage projects={projects} onViewIncrement={handleViewIncrement} customization={customization} />
        )}

        {/* Render: 3. Services */}
        {activeTab === "Services" && (
          <ServicesPage
            services={services}
            onSelectInquiryCategory={(cat) => setPreselectedCategory(cat)}
            onNavigateToTab={(tab) => setActiveTab(tab as any)}
            customization={customization}
          />
        )}

        {/* Render: 4. Build Journal */}
        {activeTab === "Build Journal" && (
          <BuildJournal entries={journal} customization={customization} />
        )}

        {/* Render: 5. AI Systems Lab */}
        {activeTab === "AI Lab" && (
          <AILab customization={customization} />
        )}

        {/* Render: 6. Publishing Hub */}
        {activeTab === "Publishing" && (
          <WritingHub articles={articles} onReadIncrement={handleReadIncrement} customization={customization} />
        )}

        {/* Render: 7. Media */}
        {activeTab === "Media" && (
          <MediaHub mediaItems={media} onPlayIncrement={handlePlayIncrement} customization={customization} />
        )}

        {/* Render: 8. Resumé CV */}
        {activeTab === "Resumé CV" && (
          <CVCenter cvs={cvs} onDownloadIncrement={handleDownloadIncrement} customization={customization} />
        )}

        {/* Render: Founder Profile */}
        {activeTab === "Founder Profile" && (
          <FounderProfile cvs={cvs} onDownloadIncrement={handleDownloadIncrement} onContactClick={() => setActiveTab("Services")} />
        )}

        {/* Render: 9. Company Profile */}
        {activeTab === "Company Profile" && (
          <AboutUs testimonials={testimonials} teamMembers={teamMembers} customization={customization} />
        )}

        {/* Render: 10. Client Access - New Enterprise Portal */}
        {activeTab === "Client Access" && (
          user ? (
            <DashboardLayout>
              {location.pathname === "/portal" && <DashboardPage />}
              {location.pathname === "/portal/dashboard" && <DashboardPage />}
              {location.pathname === "/portal/projects" && <ClientProjectsPage />}
              {location.pathname === "/portal/projects/active" && <ClientProjectsPage />}
              {location.pathname === "/portal/projects/kanban" && <ClientProjectsPage />}
              {location.pathname === "/portal/deliverables" && <DeliverablesPage />}
              {location.pathname === "/portal/approvals" && <ApprovalsPage />}
              {location.pathname === "/portal/invoices" && <InvoicesPage />}
              {location.pathname === "/portal/invoices/ledger" && <InvoicesPage />}
              {location.pathname === "/portal/meetings" && <MeetingsPage />}
              {location.pathname === "/portal/messages" && <MessagesPage />}
              {location.pathname === "/portal/files" && <FilesPage />}
              {location.pathname === "/portal/team" && <TeamPage />}
              {location.pathname === "/portal/reports" && <ReportsPage />}
              {location.pathname === "/portal/settings" && <SettingsPage />}
              {location.pathname === "/portal/settings/security" && <SettingsPage />}
            </DashboardLayout>
          ) : (
            <UnifiedAuthGate
              onAuthSuccess={() => setActiveTab("Client Access")}
              subTitle="Authenticate as a certified Client Partner to retrieve bespoke workflow indices and project deliverables dashboards."
            />
          )
        )}

{/* Render: 11. Admin Central */}
        {activeTab === "Admin Central" && (
          user && (user.role === "Super Admin" || user.role === "Admin") ? (
            <AdminDashboard
              projects={projects}
              articles={articles}
              journal={journal}
              cvs={cvs}
              clients={clients}
              inquiries={inquiries}
              analytics={analytics || { visitorsLast30Days: 250, projectDownloads: 45, pageViews: [] }}
              services={services}
              media={media}
              techStack={techStack}
              testimonials={testimonials}
              teamMembers={teamMembers}
              customization={customization}
              onUpdateCustomization={handleUpdateCustomization}
              homepageStats={homepageStats || {
                projectsCompleted: 24,
                applicationsBuilt: 18,
                aiSystemsDeveloped: 12,
                articlesPublished: 8,
                brandsCreated: 6,
                videosProduced: 15,
                clientsServed: 30
              }}
              onAddProject={handleAddProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
              onAddArticle={handleAddArticle}
              onDeleteArticle={handleDeleteArticle}
              onAddJournal={handleAddJournal}
              onToggleCV={handleToggleCV}
              onUpdateCV={handleUpdateCV}
              onAddCV={handleAddCV}
              onDeleteCV={handleDeleteCV}
              onAddMedia={handleAddMedia}
              onDeleteMedia={handleDeleteMedia}
              onUpdateTechStack={handleUpdateTechStack}
              onAddTestimonial={handleAddTestimonial}
              onDeleteTestimonial={handleDeleteTestimonial}
              onUpdateTestimonial={handleUpdateTestimonial}
              onAddTeamMember={handleAddTeamMember}
              onDeleteTeamMember={handleDeleteTeamMember}
              onUpdateTeamMember={handleUpdateTeamMember}
              onAddService={handleAddService}
              onUpdateService={handleUpdateService}
              onDeleteService={handleDeleteService}
              onUpdateArticle={handleUpdateArticle}
              onUpdateJournal={handleUpdateJournal}
              onDeleteJournal={handleDeleteJournal}
              onUpdateInquiryStatus={handleUpdateInquiryStatus}
              onUpdateHomepageStats={handleUpdateHomepageStats}
              initialSubTab={initialSubTab}
            />
          ) : (
            <UnifiedAuthGate
              onAuthSuccess={() => setActiveTab("Admin Central")}
              subTitle="Authorize secure administrator token credentials to enter the system registers management and audit logging consoles."
            />
          )
        )}

        {/* Render: 12. Security Settings Profile */}
        {activeTab === "Security Settings" && (
          user ? (
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
              <SecuritySettings />
            </div>
          ) : (
            <UnifiedAuthGate
              onAuthSuccess={() => setActiveTab("Security Settings")}
              subTitle="Log in with your platform coordinates to configure security variables or revoke active operational sessions."
            />
          )
        )}

        {/* Render: 13. Dedicated Inquiry/Contact Workspace */}
        {activeTab === "Contact" && (
          <div className="max-w-4xl mx-auto py-10">
            <ContactForm
              initialServiceCategory={preselectedCategory}
              onInquirySubmitted={handleInquirySubmitted}
            />
          </div>
        )}
      </main>

      {/* Global In-App Portal Contact Tab Link Bottom (Satisfying Blueprint contact details) */}
      {["Home", "Services", "Company Profile"].includes(activeTab) && (
        <div className="bg-slate-100 border-y border-slate-200 py-12 text-left print:hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <ContactForm
              initialServiceCategory={preselectedCategory}
              onInquirySubmitted={handleInquirySubmitted}
            />
          </div>
        </div>
      )}

      {/* Footer Branding Panels */}
      {!["AI Lab", "Client Access", "Admin Central", "Security Settings"].includes(activeTab) && (
        <footer className="border-t border-slate-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 py-8 text-xs text-slate-500 font-mono print:hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-slate-900 dark:text-white font-display font-bold tracking-wide uppercase">{customization?.appName || "AFRIWAID STUDIO"} LTD.</p>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 leading-normal font-sans">
                {customization?.footerDescription || "Building robust software, decision intelligence MCDA models, and fine editorial papers globally."}
              </p>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500">© {new Date().getFullYear()} {customization?.appNickname || "AfriWaid"} Studio. All assets authorized.</p>
          </div>
        </footer>
      )}

      {/* Unified Global Search Overlay */}
      {globalSearchOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md z-50 flex items-start justify-center p-4 pt-16 md:pt-24 select-none">
          <div className="w-full max-w-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden p-6 space-y-4 shadow-2xl">
            
            {/* Control line */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600 dark:text-zinc-400 uppercase font-bold">
                <Command className="w-4 h-4 text-cyan-500" />
                <span>AFRIWAID GLOBAL QUERY SEARCH</span>
              </div>
              <button
                onClick={() => {
                  setGlobalSearchOpen(false);
                  setGlobalSearchQuery("");
                }}
                className="p-1 px-2.5 rounded bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white text-[10px] font-bold border border-slate-200 dark:border-neutral-800 cursor-pointer"
                id="search-escape-btn"
              >
                ESC
              </button>
            </div>

            {/* Input field */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search className="w-4 h-4 text-cyan-500" />
              </span>
              <input
                type="text"
                autoFocus
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && globalSearchQuery.trim()) {
                    saveSearchQuery(globalSearchQuery);
                  }
                }}
                placeholder="Query articles, projects, custom CV matrices, media..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black border border-slate-200 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-xs transition duration-150"
                id="global-search-input-field"
              />
            </div>

            {/* Result items box */}
            <div className="space-y-1.5 text-left pt-2 font-mono text-xs max-h-[300px] overflow-y-auto no-scrollbar">
              {globalSearchQuery.trim() === "" ? (
                <div className="space-y-4">
                  {recentSearches.length > 0 && (
                    <div className="space-y-2 border-b border-slate-100 dark:border-neutral-900 pb-3" id="recent-searches-section">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-bold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-cyan-500" />
                          <span>Recent Queries</span>
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecentSearches([]);
                            try {
                              localStorage.removeItem("afriwaid_recent_searches");
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="hover:text-red-500 dark:hover:text-red-400 transition cursor-pointer text-[10px]"
                          id="clear-recent-searches-btn"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-col gap-1">
                        {recentSearches.map((query, rIdx) => (
                          <div
                            key={rIdx}
                            onClick={() => setGlobalSearchQuery(query)}
                            className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-black hover:bg-slate-100 dark:hover:bg-neutral-900 border border-slate-105 dark:border-neutral-900 cursor-pointer text-slate-700 dark:text-zinc-300 transition group"
                            id={`recent-search-${rIdx}`}
                          >
                            <span className="text-xs truncate font-mono">{query}</span>
                            <span className="text-[9px] text-slate-400 dark:text-zinc-500 group-hover:text-cyan-500 transition font-mono">
                              Invoke query →
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="py-2 text-center text-slate-500 dark:text-zinc-500 font-mono text-[11px]">
                    Begin writing a keyword to pull matching database registers.
                  </div>
                </div>
              ) : matchingSearchItems().length === 0 ? (
                <div className="py-6 text-center text-slate-500 dark:text-zinc-500 font-mono text-[11px]">
                  No matching files located inside repository indices.
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-bold px-1 block pb-1">Register results</span>
                  {matchingSearchItems().map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSearchResult(item.type)}
                      className="w-full p-3 rounded-lg bg-slate-50 dark:bg-zinc-950/60 hover:bg-slate-100 dark:hover:bg-zinc-900/60 border border-slate-200 dark:border-neutral-850 flex items-center justify-between text-left transition duration-150 cursor-pointer"
                      id={`search-res-item-${idx}`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-slate-900 dark:text-white block font-bold text-xs">{item.title}</span>
                        <span className="text-[10px] text-slate-500 dark:text-zinc-450 font-sans">{item.category}</span>
                      </div>
                      <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-950/40 text-cyan-750 dark:text-cyan-400 border border-cyan-200/50 dark:border-cyan-900/30 rounded text-[9px] uppercase font-bold">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Picture Overlay System for Teasers */}
      <AnimatePresence>
        {selectedRecentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedRecentImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 md:p-8 cursor-zoom-out"
          >
            {/* Close controls */}
            <button
              onClick={() => setSelectedRecentImage(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-850 text-white border border-neutral-800 transition shadow-lg cursor-pointer animate-none"
              title="Close image overlay (Esc)"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Inner frame */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()} // retain modal click propagation boundaries
              className="relative max-w-5xl max-h-[85vh] rounded-xl overflow-hidden shadow-2xl bg-neutral-950 border border-neutral-800"
            >
              <img
                src={selectedRecentImage}
                alt="Expanded view snapshot"
                className="w-full h-auto max-h-[85vh] object-contain block mx-auto rounded-lg"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute bottom-3 left-4 text-[9px] font-mono tracking-wider font-extrabold uppercase bg-black/75 px-3 py-1 text-slate-300 rounded border border-white/5 shadow-xs">
                Studio Artifact View
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top tiny floating button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 p-2.5 rounded-full bg-slate-900/90 dark:bg-zinc-900/80 hover:bg-slate-950 dark:hover:bg-black text-slate-100 dark:text-cyan-400 border border-slate-200 dark:border-neutral-850/80 transition shadow-lg cursor-pointer flex items-center justify-center backdrop-blur-md focus:outline-none hover:scale-110 active:scale-95 group"
            title="Scroll to top"
            id="scroll-to-top-btn"
          >
            <ChevronUp className="w-4 h-4 transition duration-200 group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
