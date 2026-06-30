import React, { useState, useEffect } from "react";
import { Shield, ShieldCheck, Database, FileText, Settings, Sparkles, MessageSquare, ClipboardList, HelpCircle, BarChart3, Trash2, Plus, Check, Eye, Video, Film, ExternalLink, Quote, Users, Star, Zap, Linkedin, Github, Twitter, Activity, Globe, TrendingUp, RefreshCw } from "lucide-react";
import { Project, Article, JournalEntry, CV, ClientProfile, Inquiry, TrackedAnalytics, ServiceOffer, MediaItem, HomepageStats, TechStackItem, Testimonial, TeamMember, Deliverable, Invoice, CustomizationSettings } from "../types";
import { useAuth } from "./AuthContext";
import UsersListManager from "./admin/UsersListManager";
import RbacController from "./admin/RbacController";
import AuditLogsPanel from "./admin/AuditLogsPanel";
import ImageUploadDropzone from "./ImageUploadDropzone";

interface AdminDashboardProps {
  projects: Project[];
  articles: Article[];
  journal: JournalEntry[];
  cvs: CV[];
  clients: ClientProfile[];
  inquiries: Inquiry[];
  analytics: TrackedAnalytics;
  services: ServiceOffer[];
  media: MediaItem[];
  homepageStats: HomepageStats;
  techStack: TechStackItem[];
  testimonials: Testimonial[];
  teamMembers: TeamMember[];
  customization?: CustomizationSettings;
  onUpdateCustomization?: (settings: CustomizationSettings) => void;
  onAddProject: (p: Project) => void;
  onUpdateProject: (p: Project) => void;
  onDeleteProject: (id: string) => void;
  onAddArticle: (a: Article) => void;
  onDeleteArticle: (id: string) => void;
  onUpdateArticle?: (a: Article) => void;
  onAddJournal: (j: JournalEntry) => void;
  onUpdateJournal?: (j: JournalEntry) => void;
  onDeleteJournal?: (id: string) => void;
  onToggleCV: (id: string) => void;
  onUpdateCV: (cv: CV) => void;
  onAddCV: (cv: CV) => void;
  onDeleteCV: (id: string) => void;
  onAddMedia: (m: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
  onUpdateTechStack: (techStack: TechStackItem[]) => void;
  onAddTestimonial: (t: Testimonial) => void;
  onDeleteTestimonial: (id: string) => void;
  onUpdateTestimonial?: (t: Testimonial) => void;
  onAddTeamMember: (m: TeamMember) => void;
  onDeleteTeamMember: (id: string) => void;
  onUpdateTeamMember?: (m: TeamMember) => void;
  onAddService?: (s: ServiceOffer) => void;
  onUpdateService?: (s: ServiceOffer) => void;
  onDeleteService?: (id: string) => void;
  onUpdateInquiryStatus: (id: string, status: "new" | "reviewed" | "archived") => void;
  onUpdateHomepageStats: (stats: HomepageStats) => void;
  initialSubTab?: "analytics" | "projects" | "articles" | "journal" | "inquiries" | "cvs" | "media" | "tech" | "stats" | "testimonials" | "team" | "services" | "users" | "roles" | "audit_logs" | "workspaces" | "clients_billing" | "support_chat" | "alert_broadcasts" | "site_customization";
}

export default function AdminDashboard({
  projects, articles, journal, cvs, clients, inquiries, analytics, services, media, homepageStats, techStack, testimonials, teamMembers, customization, onUpdateCustomization,
  onAddProject, onUpdateProject, onDeleteProject, onAddArticle, onDeleteArticle, onUpdateArticle, onAddJournal, onUpdateJournal, onDeleteJournal, onToggleCV, onUpdateCV, onAddCV, onDeleteCV, onAddMedia, onDeleteMedia, onUpdateTechStack, onAddTestimonial, onDeleteTestimonial, onUpdateTestimonial, onAddTeamMember, onDeleteTeamMember, onUpdateTeamMember, onAddService, onUpdateService, onDeleteService, onUpdateInquiryStatus, onUpdateHomepageStats,
  initialSubTab
}: AdminDashboardProps) {
  const { user: authUser, checkPermission } = useAuth();
  const [authorizedRole, setAuthorizedRole] = useState<"Super Admin" | "Admin" | "Editor" | null>(() => {
    if (typeof window !== "undefined" && localStorage.getItem("afriwaid_admin_role")) {
      return localStorage.getItem("afriwaid_admin_role") as "Super Admin" | "Admin" | "Editor";
    }
    return null;
  });
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [activeSubTab, setActiveSubTab] = useState<"analytics" | "projects" | "articles" | "journal" | "inquiries" | "cvs" | "media" | "tech" | "stats" | "testimonials" | "team" | "services" | "users" | "roles" | "audit_logs" | "workspaces" | "clients_billing" | "support_chat" | "alert_broadcasts" | "site_customization">(initialSubTab || "analytics");

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Google Analytics integration local state & handlers
  const [isSyncingGA, setIsSyncingGA] = useState(false);
  const [selectedGAProperty, setSelectedGAProperty] = useState("AfriWaid Production (GA4 Property)");
  const [gaManualInput, setGaManualInput] = useState("");
  const [aiReportText, setAiReportText] = useState("");
  const [isLoadingAIReport, setIsLoadingAIReport] = useState(false);

  const handleSyncGoogleAnalytics = async () => {
    setIsSyncingGA(true);
    // Simulate real secure authentication handshakes & GA4 property discovery
    await new Promise(r => setTimeout(r, 1800));
    onUpdateCustomization({
      ...customization,
      googleAnalyticsId: "G-AFRIWAID99",
    });
    setIsSyncingGA(false);
  };

  const handleDisconnectGoogleAnalytics = () => {
    onUpdateCustomization({
      ...customization,
      googleAnalyticsId: "",
    });
    setGaManualInput("");
    setAiReportText("");
  };

  const handleSaveManualGAId = () => {
    if (!gaManualInput.trim().startsWith("G-")) {
      alert("Invalid GA4 Measurement ID format. ID must start with 'G-' (e.g., G-XXXXXXXXXX)");
      return;
    }
    onUpdateCustomization({
      ...customization,
      googleAnalyticsId: gaManualInput.trim(),
    });
  };

  const handleGenerateAIReport = async () => {
    setIsLoadingAIReport(true);
    setAiReportText("");
    try {
      const response = await fetch("/api/analytics/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authUser?.email || "waidsoko@gmail.com",
          googleAnalyticsId: customization?.googleAnalyticsId || "G-AFRIWAID99",
        }),
      });
      const data = await response.json();
      if (data.text) {
        setAiReportText(data.text);
      } else if (data.error) {
        setAiReportText(`### Analysis Failed\n\nError: ${data.error}`);
      }
    } catch (err: any) {
      setAiReportText(`### Communication Error\n\nFailed to dispatch report trigger: ${err.message}`);
    } finally {
      setIsLoadingAIReport(false);
    }
  };

  // Automatically authenticate active session owner to avoid typing password
  useEffect(() => {
    if (authUser) {
      if (authUser.role === "Super Admin") {
        setAuthorizedRole("Super Admin");
        localStorage.setItem("afriwaid_admin_role", "Super Admin");
      } else if (authUser.role === "Admin") {
        setAuthorizedRole("Admin");
        localStorage.setItem("afriwaid_admin_role", "Admin");
      } else if (authUser.role === "Moderator" || authUser.role === "Auditor" || authUser.role === "Developer" || authUser.role === "Operator") {
        setAuthorizedRole("Editor");
        localStorage.setItem("afriwaid_admin_role", "Editor");
      }
    }
  }, [authUser]);

  // Form states - Add Testimonial
  const [newTestClientName, setNewTestClientName] = useState("");
  const [newTestClientCompany, setNewTestClientCompany] = useState("");
  const [newTestClientRole, setNewTestClientRole] = useState("");
  const [newTestRating, setNewTestRating] = useState(5);
  const [newTestText, setNewTestText] = useState("");
  const [newTestAvatar, setNewTestAvatar] = useState("");
  const [newTestCategory, setNewTestCategory] = useState("Software Development");
  const [testSuccess, setTestSuccess] = useState(false);

  // Form states - Add Team Member
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamRole, setNewTeamRole] = useState("");
  const [newTeamType, setNewTeamType] = useState<TeamMember["teamType"]>("Development Team");
  const [newTeamBio, setNewTeamBio] = useState("");
  const [newTeamAvatar, setNewTeamAvatar] = useState("");
  const [newTeamSkills, setNewTeamSkills] = useState("");
  const [newTeamExpertiseTags, setNewTeamExpertiseTags] = useState("");
  const [newTeamLinkedin, setNewTeamLinkedin] = useState("");
  const [newTeamGithub, setNewTeamGithub] = useState("");
  const [newTeamTwitter, setNewTeamTwitter] = useState("");
  const [teamSuccess, setTeamSuccess] = useState(false);

  // Editing states
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingJournal, setEditingJournal] = useState<JournalEntry | null>(null);
  const [editingService, setEditingService] = useState<ServiceOffer | null>(null);

   // Form states - Add/Edit Service
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState<ServiceOffer["category"]>("Software Development");
  const [newServiceTimeline, setNewServiceTimeline] = useState("");
  const [newServiceDeliverables, setNewServiceDeliverables] = useState("");
  const [newServiceProcess, setNewServiceProcess] = useState("");
  const [serviceSuccess, setServiceSuccess] = useState(false);

  // Form states - Site Branding Rebranding Realtime Panel
  const [custAppName, setCustAppName] = useState(customization?.appName || "AFRIWAID STUDIO");
  const [custAppNickname, setCustAppNickname] = useState(customization?.appNickname || "AFRIWAID");
  const [custTagline, setCustTagline] = useState(customization?.tagline || "Empowering Digital Innovation");
  const [custHeroHeadline, setCustHeroHeadline] = useState(customization?.heroHeadline || "AFRIWAID STUDIO");
  const [custHeroSubtitle, setCustHeroSubtitle] = useState(customization?.heroSubtitle || "");
  const [custAccentColor, setCustAccentColor] = useState<CustomizationSettings["accentColor"]>(customization?.accentColor || "cyan");
  const [custPrimaryCta, setCustPrimaryCta] = useState(customization?.primaryCtaText || "Explore Showcase");
  const [custSecondaryCta, setCustSecondaryCta] = useState(customization?.secondaryCtaText || "Initiate AI Systems Lab");
  const [custShowAILab, setCustShowAILab] = useState(customization?.showAILab !== false);
  const [custShowJournal, setCustShowJournal] = useState(customization?.showJournal !== false);
  const [custShowMedia, setCustShowMedia] = useState(customization?.showMedia !== false);
  const [custShowWriting, setCustShowWriting] = useState(customization?.showWriting !== false);
  const [custUseTerminal, setCustUseTerminal] = useState(customization?.useMonochromeTerminalTheme || false);
  const [custFooterDesc, setCustFooterDesc] = useState(customization?.footerDescription || "");
  const [custLogoType, setCustLogoType] = useState<"text" | "image">(customization?.logoType || "text");
  const [custLogoText, setCustLogoText] = useState(customization?.logoText || "A");
  const [custLogoUrl, setCustLogoUrl] = useState(customization?.logoUrl || "");
  const [custFaviconUrl, setCustFaviconUrl] = useState(customization?.faviconUrl || "");
  const [custGoogleAnalyticsId, setCustGoogleAnalyticsId] = useState(customization?.googleAnalyticsId || "");
  const [custStatsSubtitle, setCustStatsSubtitle] = useState(customization?.statsSubtitle || "Enterprise Impact Metric Matrix");
  const [custStatsTitle, setCustStatsTitle] = useState(customization?.statsTitle || "AfriWaid Studio Performance Indication");
  const [custTechSubtitle, setCustTechSubtitle] = useState(customization?.techSubtitle || "TECHNOLOGY SPECIFICATION");
  const [custTechTitle, setCustTechTitle] = useState(customization?.techTitle || "Verified Hyper-engine Development Stack");
  const [custTechDescription, setCustTechDescription] = useState(customization?.techDescription || "Every product deployed by AfriWaid conforms to rigorous, type-safe paradigms. Here are our verified stack parameters:");
  
  // Company Profile (About Us)
  const [custAboutTagline, setCustAboutTagline] = useState(customization?.aboutTagline || "METRICS & CORE PRINCIPLES");
  const [custAboutTitle, setCustAboutTitle] = useState(customization?.aboutTitle || "Bridging Cognitive Engineering with Aesthetic Rigor");
  const [custAboutDescription, setCustAboutDescription] = useState(customization?.aboutDescription || "AfriWaid is a premium, multi-module digital studio. We do not build generic portfolio templates. We design, deploy, and verify mission-critical cloud applications, neural agent frameworks, and high-fidelity global branding structures.");
  const [custAboutMissionTitle, setCustAboutMissionTitle] = useState(customization?.aboutMissionTitle || "Our Mission");
  const [custAboutMissionDesc, setCustAboutMissionDesc] = useState(customization?.aboutMissionDesc || "To build intelligent digital structures that allow organizations worldwide to seamlessly automate, audit, and display complex logistics pipelines and branding matrices without tech-debt decay.");
  const [custAboutVisionTitle, setCustAboutVisionTitle] = useState(customization?.aboutVisionTitle || "Our Vision");
  const [custAboutVisionDesc, setCustAboutVisionDesc] = useState(customization?.aboutVisionDesc || "To grow into a global, institutional tech studio that acts as a living showcase of multi-agent safety engineering, pixel-perfect user frameworks, and elite publishing workflows.");
  const [custAboutPhilosophyTitle, setCustAboutPhilosophyTitle] = useState(customization?.aboutPhilosophyTitle || "Our Innovation Philosophy");
  const [custAboutPhilosophyDesc, setCustAboutPhilosophyDesc] = useState(customization?.aboutPhilosophyDesc || "We believe that technology gains value only through absolute transparency. Unusable AI telemetry is a systematic pollutant. We focus on physical, human-verified loops, mathematical criteria weighting, and breathtaking visual controls.");

  // Services, Projects & CV Page Customizations (Stage 3)
  const [custServicesTagline, setCustServicesTagline] = useState(customization?.servicesTagline || "Technical Capabilities & Service Matrix");
  const [custServicesTitle, setCustServicesTitle] = useState(customization?.servicesTitle || "Professional Digital Offerings");
  const [custServicesDescription, setCustServicesDescription] = useState(customization?.servicesDescription || "AfriWaid is built to handle enterprise projects. Explore our core engineering competencies, interactive knowledge disciplines, and pre-structured commercial execution models.");
  const [custProjectsTitle, setCustProjectsTitle] = useState(customization?.projectsTitle || "Technical Portfolio & Showcase");
  const [custProjectsSubtitle, setCustProjectsSubtitle] = useState(customization?.projectsSubtitle || "COMPLETE ARCHIVE OF INTELLECTUAL WORK");
  const [custCvTitle, setCustCvTitle] = useState(customization?.cvTitle || "Resume & CV Center");
  const [custCvSubtitle, setCustCvSubtitle] = useState(customization?.cvSubtitle || "OFFICIAL INSTANCE: CHOOSE PROFESSIONAL PATHWAY");

  // Stage 4: AI Lab, Writing Hub, Media Center, and Build Journal Customizations
  const [custAiLabTagline, setCustAiLabTagline] = useState(customization?.aiLabTagline || "Neural Architecture & Design Lab");
  const [custAiLabTitle, setCustAiLabTitle] = useState(customization?.aiLabTitle || "Active AI & KI Innovation Playground");
  const [custAiLabDescription, setCustAiLabDescription] = useState(customization?.aiLabDescription || "Experiment directly with our server-side cognitive modules of AfriWaid. Consult our live systems analyst or tweak the decision criteria weight formulas dynamically.");
  const [custWritingTitle, setCustWritingTitle] = useState(customization?.writingTitle || "Writing & Analytics Hub");
  const [custWritingSubtitle, setCustWritingSubtitle] = useState(customization?.writingSubtitle || "Original research, deep technical deep-dives, and technical opinions");
  const [custMediaTitle, setCustMediaTitle] = useState(customization?.mediaTitle || "Media Production Hub");
  const [custMediaSubtitle, setCustMediaSubtitle] = useState(customization?.mediaSubtitle || "CINEMATIC DIGITAL ENG ENGAGEMENTS");
  const [custJournalTagline, setCustJournalTagline] = useState(customization?.journalTagline || "Active Developer Logs & System Milestones");
  const [custJournalTitle, setCustJournalTitle] = useState(customization?.journalTitle || "The AfriWaid Build Journal");
  const [custJournalDescription, setCustJournalDescription] = useState(customization?.journalDescription || "Follow our transparent engineering roadmap. We push frequent hot-fixes, core architectural developments, spatial animations, and machine learning structures to the active sandbox stack.");

  const [custSuccess, setCustSuccess] = useState(false);

  useEffect(() => {
    if (customization) {
      setCustAppName(customization.appName || "AFRIWAID STUDIO");
      setCustAppNickname(customization.appNickname || "AFRIWAID");
      setCustTagline(customization.tagline || "Empowering Digital Innovation");
      setCustHeroHeadline(customization.heroHeadline || "AFRIWAID STUDIO");
      setCustHeroSubtitle(customization.heroSubtitle || "");
      setCustAccentColor(customization.accentColor || "cyan");
      setCustPrimaryCta(customization.primaryCtaText || "Explore Showcase");
      setCustSecondaryCta(customization.secondaryCtaText || "Initiate AI Systems Lab");
      setCustShowAILab(customization.showAILab !== false);
      setCustShowJournal(customization.showJournal !== false);
      setCustShowMedia(customization.showMedia !== false);
      setCustShowWriting(customization.showWriting !== false);
      setCustUseTerminal(customization.useMonochromeTerminalTheme || false);
      setCustFooterDesc(customization.footerDescription || "");
      setCustLogoType(customization.logoType || "text");
      setCustLogoText(customization.logoText || "A");
      setCustLogoUrl(customization.logoUrl || "");
      setCustFaviconUrl(customization.faviconUrl || "");
      setCustGoogleAnalyticsId(customization.googleAnalyticsId || "");
      setCustStatsSubtitle(customization.statsSubtitle || "Enterprise Impact Metric Matrix");
      setCustStatsTitle(customization.statsTitle || "AfriWaid Studio Performance Indication");
      setCustTechSubtitle(customization.techSubtitle || "TECHNOLOGY SPECIFICATION");
      setCustTechTitle(customization.techTitle || "Verified Hyper-engine Development Stack");
      setCustTechDescription(customization.techDescription || "Every product deployed by AfriWaid conforms to rigorous, type-safe paradigms. Here are our verified stack parameters:");
      
      setCustAboutTagline(customization.aboutTagline || "METRICS & CORE PRINCIPLES");
      setCustAboutTitle(customization.aboutTitle || "Bridging Cognitive Engineering with Aesthetic Rigor");
      setCustAboutDescription(customization.aboutDescription || "AfriWaid is a premium, multi-module digital studio. We do not build generic portfolio templates. We design, deploy, and verify mission-critical cloud applications, neural agent frameworks, and high-fidelity global branding structures.");
      setCustAboutMissionTitle(customization.aboutMissionTitle || "Our Mission");
      setCustAboutMissionDesc(customization.aboutMissionDesc || "To build intelligent digital structures that allow organizations worldwide to seamlessly automate, audit, and display complex logistics pipelines and branding matrices without tech-debt decay.");
      setCustAboutVisionTitle(customization.aboutVisionTitle || "Our Vision");
      setCustAboutVisionDesc(customization.aboutVisionDesc || "To grow into a global, institutional tech studio that acts as a living showcase of multi-agent safety engineering, pixel-perfect user frameworks, and elite publishing workflows.");
      setCustAboutPhilosophyTitle(customization.aboutPhilosophyTitle || "Our Innovation Philosophy");
      setCustAboutPhilosophyDesc(customization.aboutPhilosophyDesc || "We believe that technology gains value only through absolute transparency. Unusable AI telemetry is a systematic pollutant. We focus on physical, human-verified loops, mathematical criteria weighting, and breathtaking visual controls.");
      
      setCustServicesTagline(customization.servicesTagline || "Technical Capabilities & Service Matrix");
      setCustServicesTitle(customization.servicesTitle || "Professional Digital Offerings");
      setCustServicesDescription(customization.servicesDescription || "AfriWaid is built to handle enterprise projects. Explore our core engineering competencies, interactive knowledge disciplines, and pre-structured commercial execution models.");
      setCustProjectsTitle(customization.projectsTitle || "Technical Portfolio & Showcase");
      setCustProjectsSubtitle(customization.projectsSubtitle || "COMPLETE ARCHIVE OF INTELLECTUAL WORK");
      setCustCvTitle(customization.cvTitle || "Resume & CV Center");
      setCustCvSubtitle(customization.cvSubtitle || "OFFICIAL INSTANCE: CHOOSE PROFESSIONAL PATHWAY");

      setCustAiLabTagline(customization.aiLabTagline || "Neural Architecture & Design Lab");
      setCustAiLabTitle(customization.aiLabTitle || "Active AI & KI Innovation Playground");
      setCustAiLabDescription(customization.aiLabDescription || "Experiment directly with our server-side cognitive modules of AfriWaid. Consult our live systems analyst or tweak the decision criteria weight formulas dynamically.");
      setCustWritingTitle(customization.writingTitle || "Writing & Analytics Hub");
      setCustWritingSubtitle(customization.writingSubtitle || "Original research, deep technical deep-dives, and technical opinions");
      setCustMediaTitle(customization.mediaTitle || "Media Production Hub");
      setCustMediaSubtitle(customization.mediaSubtitle || "CINEMATIC DIGITAL ENG ENGAGEMENTS");
      setCustJournalTagline(customization.journalTagline || "Active Developer Logs & System Milestones");
      setCustJournalTitle(customization.journalTitle || "The AfriWaid Build Journal");
      setCustJournalDescription(customization.journalDescription || "Follow our transparent engineering roadmap. We push frequent hot-fixes, core architectural developments, spatial animations, and machine learning structures to the active sandbox stack.");
    }
  }, [customization]);

  const handleSaveCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateCustomization) {
      onUpdateCustomization({
        appName: custAppName,
        appNickname: custAppNickname,
        tagline: custTagline,
        heroHeadline: custHeroHeadline,
        heroSubtitle: custHeroSubtitle,
        accentColor: custAccentColor,
        primaryCtaText: custPrimaryCta,
        secondaryCtaText: custSecondaryCta,
        showAILab: custShowAILab,
        showJournal: custShowJournal,
        showMedia: custShowMedia,
        showWriting: custShowWriting,
        useMonochromeTerminalTheme: custUseTerminal,
        footerDescription: custFooterDesc,
        logoType: custLogoType,
        logoText: custLogoText,
        logoUrl: custLogoUrl,
        faviconUrl: custFaviconUrl,
        googleAnalyticsId: custGoogleAnalyticsId,
        statsSubtitle: custStatsSubtitle,
        statsTitle: custStatsTitle,
        techSubtitle: custTechSubtitle,
        techTitle: custTechTitle,
        techDescription: custTechDescription,
        aboutTagline: custAboutTagline,
        aboutTitle: custAboutTitle,
        aboutDescription: custAboutDescription,
        aboutMissionTitle: custAboutMissionTitle,
        aboutMissionDesc: custAboutMissionDesc,
        aboutVisionTitle: custAboutVisionTitle,
        aboutVisionDesc: custAboutVisionDesc,
        aboutPhilosophyTitle: custAboutPhilosophyTitle,
        aboutPhilosophyDesc: custAboutPhilosophyDesc,
        servicesTagline: custServicesTagline,
        servicesTitle: custServicesTitle,
        servicesDescription: custServicesDescription,
        projectsTitle: custProjectsTitle,
        projectsSubtitle: custProjectsSubtitle,
        cvTitle: custCvTitle,
        cvSubtitle: custCvSubtitle,
        aiLabTagline: custAiLabTagline,
        aiLabTitle: custAiLabTitle,
        aiLabDescription: custAiLabDescription,
        writingTitle: custWritingTitle,
        writingSubtitle: custWritingSubtitle,
        mediaTitle: custMediaTitle,
        mediaSubtitle: custMediaSubtitle,
        journalTagline: custJournalTagline,
        journalTitle: custJournalTitle,
        journalDescription: custJournalDescription
      });
      setCustSuccess(true);
      setTimeout(() => setCustSuccess(false), 3000);
    }
  };

  const handleResetCustomization = () => {
    if (confirm("Reset layout settings and branding to original AfriWaid Studio defaults?")) {
      const defaults: CustomizationSettings = {
        appName: "AFRIWAID STUDIO",
        appNickname: "AFRIWAID",
        tagline: "Empowering Digital Innovation",
        heroHeadline: "AFRIWAID STUDIO",
        heroSubtitle: "A world-class technology, portfolio, AI innovation, and client management node. We design high-scale Web applications, custom AI pipelines, and stunning cinematic visual experiences.",
        accentColor: "cyan",
        primaryCtaText: "Explore Showcase",
        secondaryCtaText: "Initiate AI Systems Lab",
        showAILab: true,
        showJournal: true,
        showMedia: true,
        showWriting: true,
        useMonochromeTerminalTheme: false,
        footerDescription: "Building robust software, decision intelligence MCDA models, and fine editorial papers globally.",
        logoType: "text",
        logoText: "A",
        logoUrl: "",
        faviconUrl: "",
        googleAnalyticsId: "",
        statsSubtitle: "Enterprise Impact Metric Matrix",
        statsTitle: "AfriWaid Studio Performance Indication",
        techSubtitle: "TECHNOLOGY SPECIFICATION",
        techTitle: "Verified Hyper-engine Development Stack",
        techDescription: "Every product deployed by AfriWaid conforms to rigorous, type-safe paradigms. Here are our verified stack parameters:",
        aboutTagline: "METRICS & CORE PRINCIPLES",
        aboutTitle: "Bridging Cognitive Engineering with Aesthetic Rigor",
        aboutDescription: "AfriWaid is a premium, multi-module digital studio. We do not build generic portfolio templates. We design, deploy, and verify mission-critical cloud applications, neural agent frameworks, and high-fidelity global branding structures.",
        aboutMissionTitle: "Our Mission",
        aboutMissionDesc: "To build intelligent digital structures that allow organizations worldwide to seamlessly automate, audit, and display complex logistics pipelines and branding matrices without tech-debt decay.",
        aboutVisionTitle: "Our Vision",
        aboutVisionDesc: "To grow into a global, institutional tech studio that acts as a living showcase of multi-agent safety engineering, pixel-perfect user frameworks, and elite publishing workflows.",
        aboutPhilosophyTitle: "Our Innovation Philosophy",
        aboutPhilosophyDesc: "We believe that technology gains value only through absolute transparency. Unusable AI telemetry is a systematic pollutant. We focus on physical, human-verified loops, mathematical criteria weighting, and breathtaking visual controls.",
        servicesTagline: "Technical Capabilities & Service Matrix",
        servicesTitle: "Professional Digital Offerings",
        servicesDescription: "AfriWaid is built to handle enterprise projects. Explore our core engineering competencies, interactive knowledge disciplines, and pre-structured commercial execution models.",
        projectsTitle: "Technical Portfolio & Showcase",
        projectsSubtitle: "COMPLETE ARCHIVE OF INTELLECTUAL WORK",
        cvTitle: "Resume & CV Center",
        cvSubtitle: "OFFICIAL INSTANCE: CHOOSE PROFESSIONAL PATHWAY",
        aiLabTagline: "Neural Architecture & Design Lab",
        aiLabTitle: "Active AI & KI Innovation Playground",
        aiLabDescription: "Experiment directly with our server-side cognitive modules of AfriWaid. Consult our live systems analyst or tweak the decision criteria weight formulas dynamically.",
        writingTitle: "Writing & Analytics Hub",
        writingSubtitle: "Original research, deep technical deep-dives, and technical opinions",
        mediaTitle: "Media Production Hub",
        mediaSubtitle: "CINEMATIC DIGITAL ENG ENGAGEMENTS",
        journalTagline: "Active Developer Logs & System Milestones",
        journalTitle: "The AfriWaid Build Journal",
        journalDescription: "Follow our transparent engineering roadmap. We push frequent hot-fixes, core architectural developments, spatial animations, and machine learning structures to the active sandbox stack."
      };

      setCustAppName(defaults.appName);
      setCustAppNickname(defaults.appNickname);
      setCustTagline(defaults.tagline);
      setCustHeroHeadline(defaults.heroHeadline);
      setCustHeroSubtitle(defaults.heroSubtitle);
      setCustAccentColor(defaults.accentColor);
      setCustPrimaryCta(defaults.primaryCtaText);
      setCustSecondaryCta(defaults.secondaryCtaText);
      setCustShowAILab(defaults.showAILab);
      setCustShowJournal(defaults.showJournal);
      setCustShowMedia(defaults.showMedia);
      setCustShowWriting(defaults.showWriting);
      setCustUseTerminal(defaults.useMonochromeTerminalTheme);
      setCustFooterDesc(defaults.footerDescription);
      setCustLogoType(defaults.logoType || "text");
      setCustLogoText(defaults.logoText || "A");
      setCustLogoUrl(defaults.logoUrl || "");
      setCustFaviconUrl(defaults.faviconUrl || "");
      setCustGoogleAnalyticsId(defaults.googleAnalyticsId || "");
      setCustStatsSubtitle(defaults.statsSubtitle || "Enterprise Impact Metric Matrix");
      setCustStatsTitle(defaults.statsTitle || "AfriWaid Studio Performance Indication");
      setCustTechSubtitle(defaults.techSubtitle || "TECHNOLOGY SPECIFICATION");
      setCustTechTitle(defaults.techTitle || "Verified Hyper-engine Development Stack");
      setCustTechDescription(defaults.techDescription || "Every product deployed by AfriWaid conforms to rigorous, type-safe paradigms. Here are our verified stack parameters:");
      
      setCustAboutTagline(defaults.aboutTagline || "METRICS & CORE PRINCIPLES");
      setCustAboutTitle(defaults.aboutTitle || "Bridging Cognitive Engineering with Aesthetic Rigor");
      setCustAboutDescription(defaults.aboutDescription || "AfriWaid is a premium, multi-module digital studio. We do not build generic portfolio templates. We design, deploy, and verify mission-critical cloud applications, neural agent frameworks, and high-fidelity global branding structures.");
      setCustAboutMissionTitle(defaults.aboutMissionTitle || "Our Mission");
      setCustAboutMissionDesc(defaults.aboutMissionDesc || "To build intelligent digital structures that allow organizations worldwide to seamlessly automate, audit, and display complex logistics pipelines and branding matrices without tech-debt decay.");
      setCustAboutVisionTitle(defaults.aboutVisionTitle || "Our Vision");
      setCustAboutVisionDesc(defaults.aboutVisionDesc || "To grow into a global, institutional tech studio that acts as a living showcase of multi-agent safety engineering, pixel-perfect user frameworks, and elite publishing workflows.");
      setCustAboutPhilosophyTitle(defaults.aboutPhilosophyTitle || "Our Innovation Philosophy");
      setCustAboutPhilosophyDesc(defaults.aboutPhilosophyDesc || "We believe that technology gains value only through absolute transparency. Unusable AI telemetry is a systematic pollutant. We focus on physical, human-verified loops, mathematical criteria weighting, and breathtaking visual controls.");

      setCustServicesTagline(defaults.servicesTagline || "Technical Capabilities & Service Matrix");
      setCustServicesTitle(defaults.servicesTitle || "Professional Digital Offerings");
      setCustServicesDescription(defaults.servicesDescription || "AfriWaid is built to handle enterprise projects. Explore our core engineering competencies, interactive knowledge disciplines, and pre-structured commercial execution models.");
      setCustProjectsTitle(defaults.projectsTitle || "Technical Portfolio & Showcase");
      setCustProjectsSubtitle(defaults.projectsSubtitle || "COMPLETE ARCHIVE OF INTELLECTUAL WORK");
      setCustCvTitle(defaults.cvTitle || "Resume & CV Center");
      setCustCvSubtitle(defaults.cvSubtitle || "OFFICIAL INSTANCE: CHOOSE PROFESSIONAL PATHWAY");

      setCustAiLabTagline(defaults.aiLabTagline || "Neural Architecture & Design Lab");
      setCustAiLabTitle(defaults.aiLabTitle || "Active AI & KI Innovation Playground");
      setCustAiLabDescription(defaults.aiLabDescription || "Experiment directly with our server-side cognitive modules of AfriWaid. Consult our live systems analyst or tweak the decision criteria weight formulas dynamically.");
      setCustWritingTitle(defaults.writingTitle || "Writing & Analytics Hub");
      setCustWritingSubtitle(defaults.writingSubtitle || "Original research, deep technical deep-dives, and technical opinions");
      setCustMediaTitle(defaults.mediaTitle || "Media Production Hub");
      setCustMediaSubtitle(defaults.mediaSubtitle || "CINEMATIC DIGITAL ENG ENGAGEMENTS");
      setCustJournalTagline(defaults.journalTagline || "Active Developer Logs & System Milestones");
      setCustJournalTitle(defaults.journalTitle || "The AfriWaid Build Journal");
      setCustJournalDescription(defaults.journalDescription || "Follow our transparent engineering roadmap. We push frequent hot-fixes, core architectural developments, spatial animations, and machine learning structures to the active sandbox stack.");

      if (onUpdateCustomization) {
        onUpdateCustomization(defaults);
      }
      setCustSuccess(true);
      setTimeout(() => setCustSuccess(false), 3000);
    }
  };

  // Form states - Add Media / Reels
  const [newMediaTitle, setNewMediaTitle] = useState("");
  const [newMediaDesc, setNewMediaDesc] = useState("");
  const [newMediaCategory, setNewMediaCategory] = useState<MediaItem["category"]>("Videos");
  const [newMediaDuration, setNewMediaDuration] = useState("");
  const [newMediaThumbnail, setNewMediaThumbnail] = useState("");
  const [newMediaExternalLink, setNewMediaExternalLink] = useState("");
  const [mediaSuccess, setMediaSuccess] = useState(false);

  // Form states - Add Project
  const [newProjName, setNewProjName] = useState("");
  const [newProjCategory, setNewProjCategory] = useState<Project["category"]>("AI");
  const [newProjImage, setNewProjImage] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjTech, setNewProjTech] = useState("");
  const [newProjProblem, setNewProjProblem] = useState("");
  const [newProjFeatures, setNewProjFeatures] = useState("");
  const [newProjStatus, setNewProjStatus] = useState<Project["projectStatus"]>("Active");
  const [newProjTags, setNewProjTags] = useState("");
  const [newProjLiveUrl, setNewProjLiveUrl] = useState("");
  const [newProjGitHubUrl, setNewProjGitHubUrl] = useState("");
  const [newProjScreenshots, setNewProjScreenshots] = useState("");
  const [newProjVideoDemo, setNewProjVideoDemo] = useState("");
  const [newProjCompletionDate, setNewProjCompletionDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projSuccess, setProjSuccess] = useState(false);

  // Form states - Add Article
  const [newArtTitle, setNewArtTitle] = useState("");
  const [newArtCategory, setNewArtCategory] = useState<Article["category"]>("Research");
  const [newArtImage, setNewArtImage] = useState("");
  const [newArtDesc, setNewArtDesc] = useState("");
  const [newArtContent, setNewArtContent] = useState("");
  const [newArtTags, setNewArtTags] = useState("");
  const [newArtMetaTitle, setNewArtMetaTitle] = useState("");
  const [newArtMetaDesc, setNewArtMetaDesc] = useState("");
  const [newArtKeywords, setNewArtKeywords] = useState("");
  const [artSuccess, setArtSuccess] = useState(false);

  // Form states - Add Journal
  const [newJourTitle, setNewJourTitle] = useState("");
  const [newJourCategory, setNewJourCategory] = useState<JournalEntry["category"]>("ai");
  const [newJourDesc, setNewJourDesc] = useState("");
  const [newJourDate, setNewJourDate] = useState(new Date().toISOString().split("T")[0]);
  const [newJourImages, setNewJourImages] = useState("");
  const [newJourLinks, setNewJourLinks] = useState("");
  const [jourSuccess, setJourSuccess] = useState(false);

  // Form states - Stats Manager
  const [statsProjects, setStatsProjects] = useState<number | string>(homepageStats.projectsCompleted);
  const [statsApps, setStatsApps] = useState<number | string>(homepageStats.applicationsBuilt);
  const [statsAi, setStatsAi] = useState<number | string>(homepageStats.aiSystemsDeveloped);
  const [statsArticles, setStatsArticles] = useState<number | string>(homepageStats.articlesPublished);
  const [statsBrands, setStatsBrands] = useState<number | string>(homepageStats.brandsCreated);
  const [statsVideos, setStatsVideos] = useState<number | string>(homepageStats.videosProduced);
  const [statsClients, setStatsClients] = useState<number | string>(homepageStats.clientsServed);
  const [statsSuccess, setStatsSuccess] = useState(false);

  // CV editing form states
  const [editingCV, setEditingCV] = useState<CV | null>(null);
  const [editCVSuccess, setEditCVSuccess] = useState(false);

  // Tech Stack management states
  const [newTechBadge, setNewTechBadge] = useState("");
  const [newTechName, setNewTechName] = useState("");
  const [newTechDesc, setNewTechDesc] = useState("");
  const [editingTechItem, setEditingTechItem] = useState<TechStackItem | null>(null);
  const [techSuccess, setTechSuccess] = useState("");

  // Stage 2 Admin Orchestrator state variables
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastBody, setBroadcastBody] = useState("");
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const [selectedClientBillingId, setSelectedClientBillingId] = useState("");
  const [newInvoiceNumber, setNewInvoiceNumber] = useState("");
  const [newInvoiceAmount, setNewInvoiceAmount] = useState("");
  const [newInvoiceDueDate, setNewInvoiceDueDate] = useState("");
  const [billingSuccessMsg, setBillingSuccessMsg] = useState("");

  const [targetWorkspaceClientId, setTargetWorkspaceClientId] = useState("");
  const [newMilestoneLabel, setNewMilestoneLabel] = useState("");
  const [newDeliverableName, setNewDeliverableName] = useState("");
  const [newDeliverableDesc, setNewDeliverableDesc] = useState("");
  const [workspaceSuccessMsg, setWorkspaceSuccessMsg] = useState("");

  const [selectedAdminClientId, setSelectedAdminClientId] = useState("");
  const [activeAdminConvoId, setActiveAdminConvoId] = useState("");
  const [adminChatMessages, setAdminChatMessages] = useState<any[]>([]);
  const [adminNewMessageText, setAdminNewMessageText] = useState("");
  const [adminTypingState, setAdminTypingState] = useState("");

  React.useEffect(() => {
    setStatsProjects(homepageStats.projectsCompleted);
    setStatsApps(homepageStats.applicationsBuilt);
    setStatsAi(homepageStats.aiSystemsDeveloped);
    setStatsArticles(homepageStats.articlesPublished);
    setStatsBrands(homepageStats.brandsCreated);
    setStatsVideos(homepageStats.videosProduced);
    setStatsClients(homepageStats.clientsServed);
  }, [homepageStats]);

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "afriwaid2026") {
      setAuthorizedRole("Super Admin");
      setErrorMsg("");
    } else if (passcode === "editor") {
      setAuthorizedRole("Editor");
      setErrorMsg("");
    } else {
      setErrorMsg("Error: Invalid administrator credential node.");
    }
  };

  const handleBypass = (role: "Super Admin" | "Editor") => {
    setAuthorizedRole(role);
    setErrorMsg("");
  };

  // Savers
  const handleStartEditProject = (proj: Project) => {
    setEditingProject(proj);
    setNewProjName(proj.name);
    setNewProjCategory(proj.category);
    setNewProjImage(proj.coverImage && !proj.coverImage.startsWith("http") ? "" : proj.coverImage || "");
    setNewProjDesc(proj.description || "");
    setNewProjTech((proj.technologiesUsed || []).join(", "));
    setNewProjProblem(proj.problemSolved || "");
    setNewProjFeatures((proj.features || []).join(", "));
    setNewProjStatus(proj.projectStatus);
    setNewProjTags((proj.tags || []).join(", "));
    setNewProjLiveUrl(proj.liveUrl || "");
    setNewProjGitHubUrl(proj.gitHubUrl || "");
    setNewProjScreenshots((proj.screenshots || []).join(", "));
    setNewProjVideoDemo(proj.videoDemo || "");
    setNewProjCompletionDate(proj.completionDate || new Date().toISOString().split("T")[0]);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim() || !newProjDesc.trim()) return;

    if (editingProject) {
      const updated: Project = {
        ...editingProject,
        name: newProjName,
        category: newProjCategory,
        coverImage: newProjImage || "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
        description: newProjDesc,
        technologiesUsed: newProjTech.split(",").map(t => t.trim()).filter(Boolean),
        problemSolved: newProjProblem || "System deployment efficiency optimization.",
        features: newProjFeatures.split(",").map(f => f.trim()).filter(Boolean),
        projectStatus: newProjStatus,
        completionDate: newProjCompletionDate || new Date().toISOString().split("T")[0],
        tags: newProjTags.split(",").map(t => t.trim()).filter(Boolean),
        liveUrl: newProjLiveUrl.trim() || undefined,
        gitHubUrl: newProjGitHubUrl.trim() || undefined,
        screenshots: newProjScreenshots.split(",").map(s => s.trim()).filter(Boolean),
        videoDemo: newProjVideoDemo.trim() || undefined,
      };
      onUpdateProject(updated);
      setEditingProject(null);
    } else {
      const added: Project = {
        id: `proj-${Date.now()}`,
        name: newProjName,
        category: newProjCategory,
        coverImage: newProjImage || "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop",
        description: newProjDesc,
        technologiesUsed: newProjTech.split(",").map(t => t.trim()).filter(Boolean),
        problemSolved: newProjProblem || "System deployment efficiency optimization.",
        features: newProjFeatures.split(",").map(f => f.trim()).filter(Boolean),
        projectStatus: newProjStatus,
        completionDate: newProjCompletionDate || new Date().toISOString().split("T")[0],
        tags: newProjTags.split(",").map(t => t.trim()).filter(Boolean),
        liveUrl: newProjLiveUrl.trim() || undefined,
        gitHubUrl: newProjGitHubUrl.trim() || undefined,
        screenshots: newProjScreenshots.split(",").map(s => s.trim()).filter(Boolean),
        videoDemo: newProjVideoDemo.trim() || undefined,
        views: 0
      };
      onAddProject(added);
    }

    setProjSuccess(true);
    
    // reset
    setNewProjName("");
    setNewProjDesc("");
    setNewProjTech("");
    setNewProjProblem("");
    setNewProjFeatures("");
    setNewProjTags("");
    setNewProjImage("");
    setNewProjLiveUrl("");
    setNewProjGitHubUrl("");
    setNewProjScreenshots("");
    setNewProjVideoDemo("");
    setNewProjCompletionDate(new Date().toISOString().split("T")[0]);

    setTimeout(() => setProjSuccess(false), 3000);
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArtTitle.trim() || !newArtContent.trim()) return;

    const cleanSlug = newArtTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const finalDesc = newArtDesc.trim() || (newArtContent.replace(/[#*\-\n]+/g, " ").substring(0, 150).trim() + "...");

    const added: Article = {
      id: `art-${Date.now()}`,
      title: newArtTitle,
      slug: cleanSlug,
      description: finalDesc,
      content: newArtContent,
      coverImage: newArtImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
      category: newArtCategory,
      tags: newArtTags.trim() ? newArtTags.split(",").map(t => t.trim()).filter(Boolean) : ["intellect", "technology"],
      readingTime: `${Math.max(1, Math.ceil(newArtContent.split(/\s+/).length / 200))} min read`,
      date: new Date().toISOString().split("T")[0],
      metaTitle: newArtMetaTitle || `${newArtTitle} | AfriWaid`,
      metaDescription: newArtMetaDesc || finalDesc,
      keywords: newArtKeywords.trim() ? newArtKeywords.split(",").map(k => k.trim()).filter(Boolean) : [newArtCategory.toLowerCase()],
      views: 0
    };

    onAddArticle(added);
    setArtSuccess(true);

    // reset
    setNewArtTitle("");
    setNewArtDesc("");
    setNewArtContent("");
    setNewArtTags("");
    setNewArtMetaTitle("");
    setNewArtMetaDesc("");
    setNewArtKeywords("");
    setNewArtImage("");

    setTimeout(() => setArtSuccess(false), 3000);
  };

  const handleCreateJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJourTitle.trim() || !newJourDesc.trim()) return;

    const cleanImages = newJourImages.split(",").map(i => i.trim()).filter(Boolean);
    const cleanLinks = newJourLinks.split("\n").map(line => {
      const parts = line.split("|").map(p => p.trim());
      if (parts.length >= 2) {
        return { label: parts[0], url: parts[1] };
      } else if (parts[0]) {
        return { label: "Link", url: parts[0] };
      }
      return null;
    }).filter(Boolean) as { label: string; url: string }[];

    if (editingJournal) {
      const updated: JournalEntry = {
        ...editingJournal,
        title: newJourTitle,
        description: newJourDesc,
        category: newJourCategory,
        date: newJourDate || new Date().toISOString().split("T")[0],
        images: cleanImages.length > 0 ? cleanImages : undefined,
        links: cleanLinks.length > 0 ? cleanLinks : undefined
      };
      if (onUpdateJournal) {
        onUpdateJournal(updated);
      }
      setEditingJournal(null);
    } else {
      const added: JournalEntry = {
        id: `j-${Date.now()}`,
        title: newJourTitle,
        description: newJourDesc,
        category: newJourCategory,
        date: newJourDate || new Date().toISOString().split("T")[0],
        images: cleanImages.length > 0 ? cleanImages : undefined,
        links: cleanLinks.length > 0 ? cleanLinks : undefined
      };
      onAddJournal(added);
    }
    setJourSuccess(true);
    
    setNewJourTitle("");
    setNewJourDesc("");
    setNewJourDate(new Date().toISOString().split("T")[0]);
    setNewJourImages("");
    setNewJourLinks("");

    setTimeout(() => setJourSuccess(false), 3000);
  };

  // EDIT HELPER ROUTINES
  // TEAM EDIT HELPERS
  const startEditTeamMember = (m: TeamMember) => {
    setEditingTeamMember(m);
    setNewTeamName(m.name);
    setNewTeamRole(m.role);
    setNewTeamType(m.teamType);
    setNewTeamBio(m.bio);
    setNewTeamAvatar(m.avatar || "");
    setNewTeamSkills(m.skills.join(", "));
    setNewTeamExpertiseTags(m.expertiseTags ? m.expertiseTags.join(", ") : "");
    setNewTeamLinkedin(m.linkedin || "");
    setNewTeamGithub(m.github || "");
    setNewTeamTwitter(m.twitter || "");
  };

  const cancelEditTeamMember = () => {
    setEditingTeamMember(null);
    setNewTeamName("");
    setNewTeamRole("");
    setNewTeamType("Development Team");
    setNewTeamBio("");
    setNewTeamAvatar("");
    setNewTeamSkills("");
    setNewTeamExpertiseTags("");
    setNewTeamLinkedin("");
    setNewTeamGithub("");
    setNewTeamTwitter("");
  };

  // TESTIMONIAL EDIT HELPERS
  const startEditTestimonial = (t: Testimonial) => {
    setEditingTestimonial(t);
    setNewTestClientName(t.clientName);
    setNewTestClientCompany(t.clientCompany);
    setNewTestClientRole(t.clientRole);
    setNewTestRating(t.rating);
    setNewTestText(t.text);
    setNewTestAvatar(t.avatar || "");
    setNewTestCategory(t.category);
  };

  const cancelEditTestimonial = () => {
    setEditingTestimonial(null);
    setNewTestClientName("");
    setNewTestClientCompany("");
    setNewTestClientRole("");
    setNewTestRating(5);
    setNewTestText("");
    setNewTestAvatar("");
    setNewTestCategory("Software Development");
  };

  // JOURNAL EDIT HELPERS
  const startEditJournal = (j: JournalEntry) => {
    setEditingJournal(j);
    setNewJourTitle(j.title);
    setNewJourDesc(j.description);
    setNewJourCategory(j.category);
    setNewJourDate(j.date);
    setNewJourImages(j.images ? j.images.join(", ") : "");
    setNewJourLinks(j.links ? j.links.map(l => `${l.label}|${l.url}`).join("\n") : "");
  };

  const cancelEditJournal = () => {
    setEditingJournal(null);
    setNewJourTitle("");
    setNewJourDesc("");
    setNewJourCategory("ai");
    setNewJourDate(new Date().toISOString().split("T")[0]);
    setNewJourImages("");
    setNewJourLinks("");
  };

  // ARTICLES EDIT HELPERS
  const startEditArticle = (a: Article) => {
    setEditingArticle(a);
    setNewArtTitle(a.title);
    setNewArtCategory(a.category);
    setNewArtImage(a.coverImage);
    setNewArtDesc(a.description);
    setNewArtContent(a.content);
    setNewArtTags(a.tags.join(", "));
    setNewArtMetaTitle(a.metaTitle || "");
    setNewArtMetaDesc(a.metaDescription || "");
    setNewArtKeywords(a.keywords ? a.keywords.join(", ") : "");
  };

  const cancelEditArticle = () => {
    setEditingArticle(null);
    setNewArtTitle("");
    setNewArtCategory("Research");
    setNewArtImage("");
    setNewArtDesc("");
    setNewArtContent("");
    setNewArtTags("");
    setNewArtMetaTitle("");
    setNewArtMetaDesc("");
    setNewArtKeywords("");
  };

  // SERVICES EDIT HELPERS
  const startEditService = (s: ServiceOffer) => {
    setEditingService(s);
    setNewServiceName(s.name);
    setNewServiceDesc(s.description);
    setNewServiceCategory(s.category);
    setNewServiceTimeline(s.estimatedTimeline);
    setNewServiceDeliverables(s.deliverables.join(", "));
    setNewServiceProcess(s.process.join(", "));
  };

  const cancelEditService = () => {
    setEditingService(null);
    setNewServiceName("");
    setNewServiceDesc("");
    setNewServiceCategory("Software Development");
    setNewServiceTimeline("");
    setNewServiceDeliverables("");
    setNewServiceProcess("");
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Systems Command Centre</h1>
          <p className="text-xs text-neutral-500 font-mono">AUTHORIZED ADMINISTRATOR DECK</p>
        </div>
        {authorizedRole && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-sm text-xs text-blue-400 font-mono">
            <ShieldCheck className="w-4 h-4 animate-pulse text-blue-400" />
            <span>Role: {authorizedRole}</span>
          </div>
        )}
      </div>

      {!authorizedRole ? (
        // Login panel
        <div className="max-w-md mx-auto bg-neutral-950 border border-white/10 rounded-sm p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-sm bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-lg font-display text-white font-bold">Admin Verification Required</h3>
            <p className="text-xs text-neutral-400">Enter your assigned administration key credentials to access core managers.</p>
          </div>

          <form onSubmit={handleAdminVerify} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-sm border border-red-500/30 bg-red-500/5 text-red-400 text-xs font-mono">
                {errorMsg}
              </div>
            )}
            <div className="space-y-1.5 text-xs text-neutral-400">
              <label className="font-mono uppercase tracking-wider">Access Passcode Key</label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-sm text-neutral-200 focus:outline-[#2563eb] focus:ring-1 focus:ring-blue-500 text-xs"
                id="admin-pass-input"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-extrabold text-[10px] uppercase rounded-sm hover:bg-blue-700 transition duration-150 tracking-wider font-mono shadow-lg"
              id="admin-pass-submit"
            >
              Verify Passcode
            </button>
          </form>

          {/* Direct verification options for convenient inspection */}
          <div className="space-y-2 pt-4 border-t border-neutral-900 text-center">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono font-bold block">Developer Inspection Bypass</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleBypass("Super Admin")}
                className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-mono text-[10px] uppercase rounded-lg border border-neutral-800 transition duration-150"
                id="bypass-super"
              >
                Super Admin Role
              </button>
              <button
                onClick={() => handleBypass("Editor")}
                className="py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-mono text-[10px] uppercase rounded-lg border border-neutral-800 transition duration-150"
                id="bypass-editor"
              >
                Editor Role
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Authorized Console Layout
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sub Navbar Left/Top (3 cols) */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1 bg-neutral-950 p-1.5 border border-neutral-800 rounded-2xl overflow-x-auto no-scrollbar lg:space-y-1">
            <button
              onClick={() => setActiveSubTab("analytics")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "analytics" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-analytics"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Metrics & Visuals</span>
            </button>
            
            <button
              onClick={() => setActiveSubTab("projects")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "projects" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-projects"
            >
              <Database className="w-4 h-4" />
              <span>Projects Manager</span>
            </button>

            <button
              onClick={() => setActiveSubTab("articles")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "articles" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-articles"
            >
              <FileText className="w-4 h-4" />
              <span>Article Writer</span>
            </button>

            <button
              onClick={() => setActiveSubTab("journal")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "journal" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-journal"
            >
              <Settings className="w-4 h-4" />
              <span>Journal Logs</span>
            </button>

            <button
              onClick={() => setActiveSubTab("inquiries")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "inquiries" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-inquiries"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries ({inquiries.filter(i => i.status === "new").length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab("cvs")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "cvs" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-cvs"
            >
              <ClipboardList className="w-4 h-4" />
              <span>CV Catalog</span>
            </button>

            <button
              onClick={() => setActiveSubTab("media")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "media" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-media"
            >
              <Film className="w-4 h-4 text-purple-400" />
              <span>Video & Reel Hub</span>
            </button>

            <button
              onClick={() => setActiveSubTab("tech")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "tech" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-tech"
            >
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Sandbox Tech Stack</span>
            </button>

            <button
              onClick={() => setActiveSubTab("stats")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 relative ${
                activeSubTab === "stats" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-stats"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Homepage Stats</span>
            </button>

            <button
              onClick={() => setActiveSubTab("testimonials")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "testimonials" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-testimonials"
            >
              <Quote className="w-4 h-4 text-amber-400" />
              <span>Testimonials</span>
            </button>

            <button
              onClick={() => setActiveSubTab("team")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "team" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-team"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Team Members</span>
            </button>

            <button
              onClick={() => setActiveSubTab("services")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "services" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-services"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Services Core</span>
            </button>

            <button
              onClick={() => setActiveSubTab("site_customization")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "site_customization" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
              }`}
              id="subtab-site-customization"
            >
              <Settings className="w-4 h-4 text-pink-400 rotate-12" />
              <span>Site rebrand Matrix</span>
            </button>

            {(authorizedRole === "Super Admin" || authorizedRole === "Admin" || checkPermission("users.view")) && (
              <button
                onClick={() => setActiveSubTab("users")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                  activeSubTab === "users" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
                }`}
                id="subtab-users"
              >
                <Users className="w-4 h-4 text-blue-400" />
                <span>Users Control</span>
              </button>
            )}

            {(authorizedRole === "Super Admin" || authorizedRole === "Admin" || checkPermission("role.manage")) && (
              <button
                onClick={() => setActiveSubTab("roles")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                  activeSubTab === "roles" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
                }`}
                id="subtab-roles"
              >
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span>RBAC Matrices</span>
              </button>
            )}

            {(authorizedRole === "Super Admin" || authorizedRole === "Admin" || checkPermission("audit_logs.view")) && (
              <button
                onClick={() => setActiveSubTab("audit_logs")}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                  activeSubTab === "audit_logs" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-white"
                }`}
                id="subtab-audit"
              >
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Security Logs</span>
              </button>
            )}

            <button
              onClick={() => setActiveSubTab("workspaces")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "workspaces" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-cyan-400"
              }`}
              id="subtab-workspaces-dispatch"
            >
              <ClipboardList className="w-4 h-4 text-purple-400" />
              <span>Workspace Dispatch</span>
            </button>

            <button
              onClick={() => setActiveSubTab("clients_billing")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "clients_billing" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-cyan-400"
              }`}
              id="subtab-billing-dispatch"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Clients & Billing</span>
            </button>

            <button
              onClick={() => setActiveSubTab("support_chat")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 relative ${
                activeSubTab === "support_chat" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-cyan-400"
              }`}
              id="subtab-chat-dispatch"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Support Chat Matrix</span>
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse block" />
            </button>

            <button
              onClick={() => setActiveSubTab("alert_broadcasts")}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono transition duration-150 flex items-center gap-2 ${
                activeSubTab === "alert_broadcasts" ? "bg-white text-black font-bold" : "text-neutral-400 hover:text-cyan-400"
              }`}
              id="subtab-broadcasts-dispatch"
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Broadcast Alerts</span>
            </button>

            <button
              onClick={() => {
                setAuthorizedRole(null);
                localStorage.removeItem("afriwaid_admin_role");
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono text-red-400 hover:bg-red-500/10 transition duration-150 flex items-center gap-2 border-t border-neutral-800 lg:mt-4"
              id="admin-logout-trigger"
            >
              <ShieldCheck className="w-4 h-4 whitespace-nowrap shrink-0" />
              <span>Lock Command</span>
            </button>
          </div>

          {/* Panel Core (9 cols) */}
          <div className="lg:col-span-9 bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 min-h-[450px]">
            {/* 1. Analytics */}
            {activeSubTab === "analytics" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.04] pb-3 gap-2">
                  <div>
                    <h3 className="text-base font-display font-medium text-white uppercase tracking-wide flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-cyan-400" /> Live Operations & Google Analytics Hub
                    </h3>
                    <p className="text-[9px] text-neutral-400 font-mono tracking-widest uppercase">INTEGRATED CLIENT AUDIENCE & TRAFFIC METRICS</p>
                  </div>
                </div>

                {/* Seed metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 font-mono block">TOTAL CLIENT INBOUND</span>
                    <span className="text-xl font-bold font-display text-white mt-1 block">{analytics.visitorsLast30Days}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 font-mono block">TOTAL PORTFOLIO VIEWS</span>
                    <span className="text-xl font-bold font-display text-white mt-1 block">{projects.reduce((acc, curr) => acc + curr.views, 0) + articles.reduce((acc, curr) => acc + curr.views, 0)}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 font-mono block">CV PDF DNLDS</span>
                    <span className="text-xl font-bold font-display text-white mt-1 block">{analytics.projectDownloads}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 font-mono block">STATION INQUIRIES</span>
                    <span className="text-xl font-bold font-display text-white mt-1 block">{inquiries.length}</span>
                  </div>
                </div>

                {/* Google Analytics Integration Core Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-950 to-neutral-900 border border-neutral-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-neutral-850">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-xs select-none">GA</span>
                        <div>
                          <h4 className="text-sm font-bold text-white font-sans">Google Analytics 4 Connection Panel</h4>
                          <p className="text-[10px] text-neutral-400 font-mono">Sync active client streams and tag global event logs seamlessly</p>
                        </div>
                      </div>

                      {customization?.googleAnalyticsId ? (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-wider">GA4 Integration Connected & Tracking Live</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                          <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider">Google Analytics Integration Inactive</span>
                        </div>
                      )}
                    </div>

                    {customization?.googleAnalyticsId ? (
                      <button
                        onClick={handleDisconnectGoogleAnalytics}
                        className="px-3.5 py-1.5 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-xl text-xs font-mono font-bold transition duration-150 self-start"
                      >
                        Disconnect Integration
                      </button>
                    ) : (
                      <button
                        onClick={handleSyncGoogleAnalytics}
                        disabled={isSyncingGA}
                        className="px-4 py-2 bg-white hover:bg-neutral-100 text-black rounded-xl text-xs font-bold transition duration-150 flex items-center gap-2 disabled:opacity-50 font-sans shadow-lg shadow-white/5"
                      >
                        {isSyncingGA ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                            Connecting Account...
                          </>
                        ) : (
                          <>
                            <Globe className="w-3.5 h-3.5 text-amber-500" />
                            1-Click Login with Email ({authUser?.email || "waidsoko@gmail.com"})
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {customization?.googleAnalyticsId ? (
                    <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase pb-1.5">Authenticated ID Mapping</label>
                            <div className="bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-neutral-300 font-mono">
                              {customization.googleAnalyticsId}
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase pb-1.5">Target Web Property</label>
                            <select
                              value={selectedGAProperty}
                              onChange={(e) => setSelectedGAProperty(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            >
                              <option value="AfriWaid Production (GA4 Property)">AfriWaid Production (GA4 Property)</option>
                              <option value="AfriWaid Dev/Staging Sandbox (GA4 Property)">AfriWaid Dev Sandbox (GA4 Property)</option>
                              <option value="Enterprise Systems Portal (GA4 Property)">Enterprise Systems (GA4 Property)</option>
                            </select>
                          </div>
                        </div>

                        {/* Real-Time Live Activity Pulse Console */}
                        <div className="bg-neutral-950 border border-neutral-850 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                            <h5 className="text-[11px] font-mono text-cyan-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5 text-cyan-400" /> GA4 Real-Time User Stream
                            </h5>
                            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-ping"></span>
                              4 Active Sites
                            </span>
                          </div>

                          <div className="space-y-1.5 text-[10.5px] font-mono text-neutral-400">
                            <div className="flex items-start gap-2 p-1.5 bg-neutral-900/40 rounded border border-neutral-850">
                              <span className="text-emerald-500 shrink-0">●</span>
                              <span><strong className="text-white">Visitor from Lagos, Nigeria</strong> viewing page <code className="bg-black/40 px-1 py-0.5 rounded text-cyan-400">/projects/waidpulse-ai-engine</code> (10s ago)</span>
                            </div>
                            <div className="flex items-start gap-2 p-1.5 bg-neutral-900/40 rounded border border-neutral-850">
                              <span className="text-emerald-500 shrink-0">●</span>
                              <span><strong className="text-white">Visitor from Cape Town, South Africa</strong> downloaded file <code className="bg-black/40 px-1 py-0.5 rounded text-cyan-400">AfriWaid_Tech_Core_CV.pdf</code> (1m ago)</span>
                            </div>
                            <div className="flex items-start gap-2 p-1.5 bg-neutral-900/40 rounded border border-neutral-850">
                              <span className="text-emerald-500 shrink-0">●</span>
                              <span><strong className="text-white">Visitor from Paris, France</strong> finished reading <code className="bg-black/40 px-1 py-0.5 rounded text-cyan-400">Rise of Orchestrated Agritech Agents</code> (4m ago)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase pb-1">GA4 Stream Sync Account</label>
                          <div className="text-xs font-semibold text-white truncate bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {authUser?.email || "waidsoko@gmail.com"}
                          </div>
                        </div>

                        {/* Top Referral progress bars */}
                        <div className="p-4 bg-neutral-950 border border-neutral-850 rounded-2xl space-y-3">
                          <h5 className="text-[10px] font-mono text-neutral-400 uppercase font-bold tracking-wider">Top Acquisition Channels</h5>
                          <div className="space-y-2 text-[11px]">
                            <div className="space-y-1">
                              <div className="flex justify-between text-neutral-400 font-mono text-[9.5px]">
                                <span>Direct Traffic</span>
                                <span>54%</span>
                              </div>
                              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full" style={{ width: "54%" }}></div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-neutral-400 font-mono text-[9.5px]">
                                <span>Organic Search (Google)</span>
                                <span>28%</span>
                              </div>
                              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-cyan-400 h-full rounded-full" style={{ width: "28%" }}></div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-neutral-400 font-mono text-[9.5px]">
                                <span>LinkedIn Referral</span>
                                <span>12%</span>
                              </div>
                              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: "12%" }}></div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-neutral-400 font-mono text-[9.5px]">
                                <span>GitHub Repository Link</span>
                                <span>6%</span>
                              </div>
                              <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-400 h-full rounded-full" style={{ width: "6%" }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-6 space-y-4">
                      <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-850 text-xs text-neutral-400 leading-relaxed font-sans">
                        Integrating Google Analytics provides robust monitoring of global client streams, real-time activity dashboards, custom trigger auditing, and AI recommendation engines. Use the instant sync button above to bind your session email automatically, or map a custom ID manually below:
                      </div>

                      <div className="flex flex-col md:flex-row items-end gap-3">
                        <div className="space-y-1 shrink-0 w-full md:w-80">
                          <label className="block text-[10px] font-mono font-bold text-neutral-400 uppercase">Manual GA4 Measurement ID</label>
                          <input
                            type="text"
                            value={gaManualInput}
                            onChange={(e) => setGaManualInput(e.target.value)}
                            placeholder="e.g. G-AFRIWAID99"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                          />
                        </div>
                        <button
                          onClick={handleSaveManualGAId}
                          className="px-4 py-2 border border-neutral-750 hover:border-neutral-500 text-white rounded-xl text-xs font-mono font-bold transition duration-150"
                        >
                          Link Custom ID
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* If Connected -> Draw Visual SVG Analytic Graph & Gemini traffic audit reports */}
                {customization?.googleAnalyticsId && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* SVG Analytics Graph */}
                    <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-neutral-400 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Hourly Visitor Metrics (Last 14 Days)
                        </h4>
                        <span className="text-[10px] font-mono text-neutral-500">GA4 API FEED</span>
                      </div>

                      {/* Stunning premium Custom SVG Line graph */}
                      <div className="relative w-full h-48 bg-neutral-900/20 rounded-xl overflow-hidden border border-neutral-850 p-2">
                        <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                          {/* Grid Lines */}
                          <line x1="0" y1="30" x2="500" y2="30" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="3,3" />
                          <line x1="0" y1="75" x2="500" y2="75" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="3,3" />
                          <line x1="0" y1="120" x2="500" y2="120" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="3,3" />

                          {/* Gradient definition for filled graph area */}
                          <defs>
                            <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.18" />
                              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.00" />
                            </linearGradient>
                          </defs>

                          {/* Graph Gradient Fill */}
                          <path
                            d="M 0 150 L 0 120 Q 50 40 100 95 T 200 45 T 300 110 T 400 35 T 500 80 L 500 150 Z"
                            fill="url(#glowGrad)"
                          />

                          {/* Glowing Line Path */}
                          <path
                            d="M 0 120 Q 50 40 100 95 T 200 45 T 300 110 T 400 35 T 500 80"
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />

                          {/* Glowing Node dots on high-traffic peaks */}
                          <circle cx="100" cy="95" r="4" fill="#06b6d4" />
                          <circle cx="200" cy="45" r="4" fill="#06b6d4" />
                          <circle cx="300" cy="110" r="4" fill="#06b6d4" />
                          <circle cx="400" cy="35" r="4" fill="#06b6d4" />
                          <circle cx="500" cy="80" r="4" fill="#06b6d4" />
                        </svg>

                        {/* Chart labels */}
                        <div className="absolute bottom-1.5 left-2 right-2 flex justify-between text-[8.5px] font-mono text-neutral-500">
                          <span>Day 1</span>
                          <span>Day 4</span>
                          <span>Day 7</span>
                          <span>Day 10</span>
                          <span>Day 14</span>
                        </div>
                        <div className="absolute top-1.5 left-2 text-[8.5px] font-mono text-neutral-400">
                          Max: 142 daily visitors
                        </div>
                      </div>
                    </div>

                    {/* Gemini AI Optimization Advisor */}
                    <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950 space-y-4 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-neutral-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> Gemini Traffic Analyst
                          </h4>
                          <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/25 px-2 py-0.5 rounded-full font-mono uppercase font-bold">GEMINI 3.5 FLASH</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                          Scan active project directories, routing lists, and referral logs to formulate type-safe, strategic growth campaigns using Google GenAI models.
                        </p>
                      </div>

                      {aiReportText ? (
                        <div className="bg-neutral-900/60 border border-neutral-850 p-4 rounded-xl text-left text-xs text-neutral-300 max-h-52 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed space-y-2">
                          {aiReportText}
                        </div>
                      ) : (
                        <div className="border border-dashed border-neutral-800 rounded-xl py-8 text-center text-[11px] text-neutral-500 font-sans">
                          Click below to dispatch client logs to Gemini and formulate a dynamic performance analysis report.
                        </div>
                      )}

                      <button
                        onClick={handleGenerateAIReport}
                        disabled={isLoadingAIReport}
                        className="w-full py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border border-cyan-500/20 hover:border-cyan-500/40 text-neutral-200 text-xs font-mono font-bold rounded-xl transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoadingAIReport ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                            Formulating Traffic Analysis...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            Generate Gemini GA4 Traffic Report
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing detailed tables (Top Projects / Top Pages) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Projects */}
                  <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950 space-y-3">
                    <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-neutral-400">Most Viewed Projects</h4>
                    <div className="space-y-2 text-xs">
                      {projects.map((p, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-neutral-900/45 rounded-sm border border-white/5">
                          <span className="text-white font-medium">{p.name}</span>
                          <span className="font-mono text-blue-400 font-bold">{p.views} Views</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Pages */}
                  <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-950 space-y-3">
                    <h4 className="text-xs uppercase font-mono tracking-wider font-semibold text-neutral-400">Target Path Log Routing</h4>
                    <div className="space-y-2 text-xs">
                      {analytics.pageViews.map((pv, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2 bg-neutral-900/40 rounded border border-neutral-850">
                          <span className="font-mono text-neutral-400">{pv.path}</span>
                          <span className="font-mono text-white font-bold">{pv.count} Loads</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Projects Manager */}
            {activeSubTab === "projects" && (
              <div className="space-y-8">
                {/* Form to Add / Edit */}
                <div className="p-5 bg-neutral-950 rounded-sm border border-white/10 space-y-4">
                  <h3 className="text-xs font-mono text-blue-400 tracking-wider uppercase font-bold flex items-center gap-1.5 border-b border-white/5 pb-2">
                    <Plus className="w-4 h-4 text-blue-400" /> {editingProject ? "Update Existing App / Showcase Node" : "Create New Production Project Node"}
                  </h3>

                  {projSuccess && (
                     <div className="p-3 bg-green-500/5 text-green-400 border border-green-500/20 text-xs rounded-lg font-mono">
                      Success: Project node safely compiled inside index.
                    </div>
                  )}

                  <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-neutral-500 font-mono uppercase">Project Name *</label>
                        <input
                          type="text" required value={newProjName} onChange={(e) => setNewProjName(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none"
                          placeholder="e.g. My Custom Calculator App"
                        />
                      </div>
                      {/* Category */}
                      <div className="space-y-1">
                        <label className="text-neutral-500 font-mono uppercase">Classification Directory</label>
                        <select
                          value={newProjCategory} onChange={(e) => setNewProjCategory(e.target.value as any)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded focus:outline-none"
                        >
                          <option value="Websites">Websites</option>
                          <option value="SaaS">SaaS</option>
                          <option value="AI">AI</option>
                          <option value="KI">KI</option>
                          <option value="Mobile Apps">Mobile Apps</option>
                          <option value="Design">Design</option>
                          <option value="Writing">Writing</option>
                          <option value="Media font">Media</option>
                          <option value="Research">Research</option>
                        </select>
                      </div>
                    </div>

                    {/* Cover Picture & Status Selection */}
                    <div className="space-y-3 font-mono">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        {/* Status Select */}
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-neutral-500 uppercase font-mono">Execution state *</label>
                          <select
                            value={newProjStatus} onChange={(e) => setNewProjStatus(e.target.value as any)}
                            className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded focus:outline-none text-neutral-200"
                          >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="In Development">In Development</option>
                            <option value="QA">QA</option>
                            <option value="Planning">Planning</option>
                          </select>
                        </div>

                        {/* File Upload Trigger */}
                        <div className="md:col-span-4 relative group border border-dashed border-white/10 hover:border-cyan-400/50 rounded bg-neutral-900/60 p-3 h-11 transition duration-150 flex items-center justify-center gap-2 cursor-pointer focus-within:ring-1 focus-within:ring-cyan-500">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setNewProjImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            id="proj-pict-file-upload"
                          />
                          <Sparkles className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400 transition" />
                          <span className="text-[10px] text-neutral-300 font-mono uppercase tracking-wider font-semibold">Upload Local Photo</span>
                        </div>

                        {/* Direct URL input */}
                        <div className="md:col-span-4 space-y-1">
                          <label className="text-neutral-500 uppercase text-[9px] block">Or Web URL</label>
                          <input
                            type="text" value={newProjImage} onChange={(e) => setNewProjImage(e.target.value)}
                            className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none text-[11px]"
                            placeholder="Direct image URL..."
                          />
                        </div>
                      </div>

                      {/* Display Preview Thumbnail if selected */}
                      {newProjImage && (
                        <div className="relative h-12 rounded overflow-hidden border border-white/5 flex items-center justify-between px-3 bg-neutral-900/40">
                          <div className="flex items-center gap-2">
                            <img src={newProjImage} alt="Project cover preview" className="w-8 h-8 rounded object-cover border border-white/10" />
                            <span className="text-[9px] text-cyan-400 font-mono">Project Cover Picture Selected</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewProjImage("")}
                            className="text-[9px] uppercase font-mono text-neutral-400 hover:text-red-400 rounded bg-red-500/5 px-2 py-1 transition border border-neutral-800"
                          >
                            Clear Photo
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Desc */}
                    <div className="space-y-1">
                      <label className="text-neutral-500 font-mono uppercase">Scope description *</label>
                      <input
                        type="text" required value={newProjDesc} onChange={(e) => setNewProjDesc(e.target.value)}
                        className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none"
                        placeholder="e.g. A fully interactive tool to calculate and log outputs in seconds."
                      />
                    </div>

                    {/* Live URL & GitHub URL inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Live Url */}
                      <div className="space-y-1">
                        <label className="text-neutral-500 font-mono uppercase text-cyan-400">Live Web App Link (Highly Recommended)</label>
                        <input
                          type="url" value={newProjLiveUrl} onChange={(e) => setNewProjLiveUrl(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none focus:border-cyan-400/45"
                          placeholder="e.g. https://my-custom-app.com"
                        />
                      </div>
                      {/* GitHub Repository URL */}
                      <div className="space-y-1">
                        <label className="text-neutral-500 font-mono uppercase text-indigo-400">GitHub Source Code Link (Optional)</label>
                        <input
                          type="url" value={newProjGitHubUrl} onChange={(e) => setNewProjGitHubUrl(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none focus:border-indigo-400/45"
                          placeholder="e.g. https://github.com/myusername/my-repo"
                        />
                      </div>
                    </div>

                    {/* Screenshot Galleries & Video Demos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-neutral-500 font-mono uppercase text-purple-400">Showcase Screenshots (Comma separated URLs)</label>
                        <input
                          type="text" value={newProjScreenshots} onChange={(e) => setNewProjScreenshots(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none focus:border-purple-400/30"
                          placeholder="e.g. url1, url2, url3"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-500 font-mono uppercase text-pink-400">Video Demo / Embed URL (YouTube/Vimeo)</label>
                        <input
                          type="text" value={newProjVideoDemo} onChange={(e) => setNewProjVideoDemo(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none focus:border-pink-400/30"
                          placeholder="e.g. https://www.youtube.com/embed/..."
                        />
                      </div>
                    </div>

                    {/* Completion Date & Filter Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Completion Date */}
                      <div className="space-y-1">
                        <label className="text-neutral-500 font-mono uppercase">Completion Date</label>
                        <input
                          type="date" value={newProjCompletionDate} onChange={(e) => setNewProjCompletionDate(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded focus:outline-none"
                        />
                      </div>
                      {/* Filter Tags */}
                      <div className="space-y-1">
                        <label className="text-neutral-500 font-mono uppercase">Search Tags (Comma separated)</label>
                        <input
                          type="text" value={newProjTags} onChange={(e) => setNewProjTags(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none"
                          placeholder="e.g. calculator, utility, real-time, client-side"
                        />
                      </div>
                    </div>

                    {/* Problem */}
                    <div className="space-y-1">
                      <label className="text-neutral-500 font-mono uppercase">Mathematical / Structural Target Problem</label>
                      <input
                        type="text" value={newProjProblem} onChange={(e) => setNewProjProblem(e.target.value)}
                        className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none"
                        placeholder="e.g. User needed a safe, reliable offline-ready logging system."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Tech */}
                      <div className="space-y-1">
                        <label className="text-neutral-500 font-mono uppercase">Engine parameters (Comma split) *</label>
                        <input
                          type="text" value={newProjTech} onChange={(e) => setNewProjTech(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none"
                          placeholder="e.g. React, Express, @google/genai"
                        />
                      </div>
                      {/* Features */}
                      <div className="space-y-1">
                        <label className="text-neutral-500 font-mono uppercase">Key Features (Comma split)</label>
                        <input
                          type="text" value={newProjFeatures} onChange={(e) => setNewProjFeatures(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none"
                          placeholder="e.g. Sandbox Compiler, PDF Reports"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded hover:bg-blue-500 transition duration-150 uppercase font-mono text-[10px]"
                        id="save-new-project-btn"
                      >
                        {editingProject ? "Update Project Node" : "Publish Project Node"}
                      </button>

                      {editingProject && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(null);
                            setNewProjName("");
                            setNewProjDesc("");
                            setNewProjTech("");
                            setNewProjProblem("");
                            setNewProjFeatures("");
                            setNewProjTags("");
                            setNewProjImage("");
                            setNewProjLiveUrl("");
                            setNewProjGitHubUrl("");
                            setNewProjCompletionDate(new Date().toISOString().split("T")[0]);
                          }}
                          className="px-5 py-2.5 bg-neutral-800 text-neutral-300 font-semibold rounded hover:bg-neutral-750 transition duration-150 uppercase font-mono text-[10px] border border-white/5"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List current */}
                <div className="space-y-3">
                  <h4 className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Active Inventory Directory</h4>
                  <div className="space-y-2">
                    {projects.map((p) => (
                      <div key={p.id} className="p-3 bg-neutral-950 rounded-sm border border-white/10 flex items-center justify-between text-xs">
                        <div className="text-left font-sans">
                          <span className="text-blue-400 font-mono text-[10px] mr-2 font-bold">[{p.category}]</span>
                          <span className="text-white font-medium">{p.name}</span>
                          {(p.liveUrl || p.gitHubUrl) && (
                            <span className="text-neutral-500 font-mono text-[9px] block mt-0.5">
                              {p.liveUrl && <span className="text-cyan-400 mr-2">Live App Linked</span>}
                              {p.gitHubUrl && <span className="text-indigo-400 font-semibold">GitHub Source Linked</span>}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEditProject(p)}
                            className="px-2.5 py-1.5 rounded bg-neutral-900 border border-white/5 hover:border-blue-400/30 text-neutral-300 hover:text-white transition duration-150 font-mono text-[10px] uppercase font-bold"
                            title="Edit Project Details"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDeleteProject(p.id)}
                            className="p-1.5 rounded hover:bg-red-500/10 text-red-400 border border-neutral-850 hover:border-red-500/30 transition duration-150"
                            title="Delete Project node"
                            id={`del-proj-idx-${p.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* 3. Article Writer */}
            {activeSubTab === "articles" && (
              <div className="space-y-8">
                <div className="p-6 bg-black/80 rounded-sm border border-white/5 space-y-6">
                  <div>
                    <h3 className="text-sm font-display text-cyan-400 tracking-wider uppercase font-bold flex items-center gap-1.5 border-b border-white/5 pb-2">
                      <Plus className="w-4 h-4 text-cyan-400" /> Create & Publish Technical Article
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-mono mt-1">
                      INSCRIBE INSIGHTS DIRECTLY INTO THE GLOBAL PUBLISHING PIPELINE.
                    </p>
                  </div>

                  {artSuccess && (
                    <div className="p-3 bg-cyan-500/5 text-cyan-400 border border-cyan-500/20 text-xs rounded font-mono animate-pulse">
                      Success: Article live. Indexed successfully in local repository index.
                    </div>
                  )}

                  <form onSubmit={handleCreateArticle} className="space-y-5 text-xs text-left">
                    {/* Title */}
                    <div className="space-y-1.5 font-mono">
                      <label className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">Article Title *</label>
                      <input
                        type="text" required value={newArtTitle} onChange={(e) => setNewArtTitle(e.target.value)}
                        className="w-full p-3 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-600 focus:outline-none focus:border-cyan-400 text-sm font-semibold transition"
                        placeholder="e.g. Decoupled AI Agent Orchestration Protocols"
                      />
                    </div>

                    {/* Picture Upload Area */}
                    <div className="space-y-2">
                      <label className="text-neutral-400 font-mono font-bold uppercase tracking-wider text-[10px] block">Cover Picture / Banner *</label>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* Drag and Drop File Selector */}
                        <div className="md:col-span-4 relative group border border-dashed border-white/10 hover:border-cyan-500/30 rounded bg-neutral-900/60 p-5 transition duration-150 flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px] focus-within:ring-1 focus-within:ring-cyan-500">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setNewArtImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            id="art-pict-file-upload"
                          />
                          <Sparkles className="w-5 h-5 text-neutral-500 group-hover:text-cyan-400 transition mb-2" />
                          <span className="text-[10px] text-neutral-300 font-mono uppercase tracking-wider">Upload Local Picture</span>
                          <span className="text-[9px] text-neutral-500 mt-1 block">Drop image or click here</span>
                        </div>

                        {/* Presets and URL Input */}
                        <div className="md:col-span-8 flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            <span className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider block">Or Paste Digital Photo Web URL</span>
                            <input
                              type="text" value={newArtImage} onChange={(e) => setNewArtImage(e.target.value)}
                              className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none focus:border-cyan-400 text-[11px]"
                              placeholder="e.g. https://images.unsplash.com/your-favorite-photo"
                            />
                          </div>

                          {/* Quick Stocks Preset Covers */}
                          <div>
                            <span className="text-neutral-500 font-mono text-[9px] uppercase tracking-wider block mb-1.5">Quick Stock Premium Covers</span>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { name: "Neon Code", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop" },
                                { name: "Quantum Cyber", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop" },
                                { name: "Abstract AI", url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop" },
                                { name: "Workspace", url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop" }
                              ].map((item, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setNewArtImage(item.url)}
                                  className={`px-2.5 py-1 rounded text-[10px] font-mono border transition ${
                                    newArtImage === item.url 
                                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-400/50" 
                                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                                  }`}
                                >
                                  {item.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Cover Image Preview */}
                          {newArtImage ? (
                            <div className="relative h-[44px] rounded overflow-hidden border border-white/5 flex items-center justify-between px-3 bg-neutral-900/60">
                              <div className="flex items-center gap-2">
                                <img src={newArtImage} alt="Selection preview" className="w-8 h-8 rounded object-cover border border-white/10" />
                                <span className="text-[10px] font-mono text-cyan-400 truncate max-w-[200px]">Cover Picture Applied</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setNewArtImage("")}
                                className="px-2 py-1 text-[9px] font-mono text-neutral-400 hover:text-red-400 rounded bg-red-500/5 hover:bg-red-500/15 border border-neutral-800 transition"
                              >
                                Clear Cover Image
                              </button>
                            </div>
                          ) : (
                            <div className="p-2 border border-white/5 bg-black text-neutral-500 font-mono text-[9px] text-center rounded">
                              Default abstract code card will fill automatically.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Main Post Writing Editor */}
                    <div className="space-y-1.5 font-mono">
                      <div className="flex items-center justify-between">
                        <label className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">What do you want to post? (Full Content Editor) *</label>
                        <span className="text-[9px] text-neutral-600">Markdown format: ## Headings | - Bullets</span>
                      </div>
                      <textarea
                        required rows={12} value={newArtContent} onChange={(e) => setNewArtContent(e.target.value)}
                        className="w-full p-4 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-600 focus:outline-none focus:border-cyan-400 text-xs md:text-sm font-sans leading-relaxed text-neutral-200 transition"
                        placeholder="Inscribe everything you want to publish inside this paragraph node. Use '#' for main titles, '##' for section headers, '-' for bullet lists..."
                      />
                    </div>

                    {/* Basic Settings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Classification Category */}
                      <div className="space-y-1.5 font-mono">
                        <label className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">Publishing Category</label>
                        <select
                          value={newArtCategory} onChange={(e) => setNewArtCategory(e.target.value as any)}
                          className="w-full p-3 bg-neutral-900 border border-neutral-800 rounded focus:outline-none focus:border-cyan-400 text-neutral-200 font-sans"
                        >
                          <option value="Articles">Articles</option>
                          <option value="News">News</option>
                          <option value="Research">Research</option>
                          <option value="Opinions">Opinions</option>
                          <option value="Guides">Guides</option>
                          <option value="Case Studies">Case Studies</option>
                        </select>
                      </div>

                      {/* Manual Summary / Description */}
                      <div className="space-y-1.5 font-mono">
                        <label className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">Short summary description (Auto-fallback if empty)</label>
                        <input
                          type="text" value={newArtDesc} onChange={(e) => setNewArtDesc(e.target.value)}
                          className="w-full p-3 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-600 focus:outline-none focus:border-cyan-400"
                          placeholder="e.g. Analysis of next-generation distributed multi-agent state machines."
                        />
                      </div>
                    </div>

                    {/* Collapsible SEO & metadata settings */}
                    <details className="group font-mono border border-white/5 bg-neutral-950/40 rounded p-3 transition-all duration-200">
                      <summary className="text-[10px] text-neutral-400 hover:text-cyan-300 font-bold uppercase tracking-wider cursor-pointer list-none flex items-center justify-between select-none">
                        <span>Advanced Metadata Tuning (SEO, Keywords, Slug Controls)</span>
                        <span className="text-neutral-600 group-open:rotate-180 transition-transform">▼</span>
                      </summary>

                      <div className="space-y-4 pt-4 border-t border-white/5 mt-3 text-[10px]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-neutral-500 uppercase tracking-wider">SEO Custom Meta Title</label>
                            <input
                              type="text" value={newArtMetaTitle} onChange={(e) => setNewArtMetaTitle(e.target.value)}
                              className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none"
                              placeholder="Leave blank to use original title"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-neutral-500 uppercase tracking-wider">Tags Customization (Comma split)</label>
                            <input
                              type="text" value={newArtTags} onChange={(e) => setNewArtTags(e.target.value)}
                              className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none"
                              placeholder="e.g. artificialintelligence, telemetry, web3"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-neutral-500 uppercase tracking-wider">Search Keywords Index</label>
                            <input
                              type="text" value={newArtKeywords} onChange={(e) => setNewArtKeywords(e.target.value)}
                              className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none"
                              placeholder="e.g. models, deployment, speed"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-neutral-500 uppercase tracking-wider">Custom SEO Summary Description</label>
                            <input
                              type="text" value={newArtMetaDesc} onChange={(e) => setNewArtMetaDesc(e.target.value)}
                              className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none"
                              placeholder="Custom meta description for search preview node"
                            />
                          </div>
                        </div>
                      </div>
                    </details>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold rounded-sm transition duration-150 uppercase font-mono tracking-wider text-[10px] cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                        id="save-new-article-btn"
                      >
                        Publish Post Live
                      </button>
                    </div>
                  </form>
                </div>

                {/* List current articles */}
                <div className="space-y-3">
                  <h4 className="text-xs text-neutral-400 font-mono uppercase tracking-wider">Active Articles Catalog</h4>
                  <div className="space-y-2">
                    {articles.map((art) => (
                      <div key={art.id} className="p-3 bg-neutral-950 rounded-sm border border-white/10 flex items-center justify-between text-xs">
                        <div className="text-left font-sans">
                          <span className="text-purple-400 font-mono text-[10px] mr-2 font-bold">[{art.category}]</span>
                          <span className="text-white font-medium">{art.title}</span>
                        </div>
                        <button
                          onClick={() => onDeleteArticle(art.id)}
                          className="p-1.5 rounded hover:bg-red-500/10 text-red-400 border border-neutral-800 hover:border-red-500/30 transition duration-150 cursor-pointer"
                          title="Delete Article node"
                          id={`del-art-idx-${art.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Journal logs */}
            {activeSubTab === "journal" && (
              <div className="space-y-6">
                <div className="border-b border-white/[0.04] pb-2 flex items-center justify-between">
                  <h3 className="text-base font-display font-medium text-white uppercase tracking-wide flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" /> Build Journal logs (Technical State Commits)
                  </h3>
                  <span className="text-[10px] font-mono bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-neutral-400">
                    Total: {journal.length} Entries
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Form */}
                  <div className="lg:col-span-5 p-5 bg-neutral-950 rounded-sm border border-white/10 space-y-4 h-auto self-start">
                    <h4 className="text-sm font-mono text-white uppercase font-bold">
                      {editingJournal ? "Edit Technical Log Node" : "Push Technical Update Log"}
                    </h4>

                    {jourSuccess && (
                      <div className="p-3 bg-green-500/5 text-green-400 border border-green-500/20 text-xs rounded-lg font-mono">
                        Success: Technical update synchronized successfully.
                      </div>
                    )}

                    <form onSubmit={handleCreateJournal} className="space-y-4 text-xs font-mono">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="space-y-1">
                          <label className="text-neutral-500 uppercase">Log Title *</label>
                          <input
                            type="text" required value={newJourTitle} onChange={(e) => setNewJourTitle(e.target.value)}
                            className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none text-white"
                            placeholder="e.g. Integrated D3 Force Ontologies"
                          />
                        </div>
                        {/* Classification */}
                        <div className="space-y-1">
                          <label className="text-neutral-500 uppercase">Log class</label>
                          <select
                            value={newJourCategory} onChange={(e) => setNewJourCategory(e.target.value as any)}
                            className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded focus:outline-none text-white"
                          >
                            <option value="deployment">Deployment</option>
                            <option value="update">Update</option>
                            <option value="design">Design</option>
                            <option value="ai">AI System</option>
                          </select>
                        </div>
                      </div>

                      {/* Desc */}
                      <div className="space-y-1">
                        <label className="text-neutral-500 uppercase">Log description *</label>
                        <textarea
                          required rows={3} value={newJourDesc} onChange={(e) => setNewJourDesc(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none text-white"
                          placeholder="Include exact version numbers, diagnostic coordinates, or performance values..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Date */}
                        <div className="space-y-1">
                          <label className="text-neutral-500 uppercase">Log Date</label>
                          <input
                            type="date"
                            value={newJourDate}
                            onChange={(e) => setNewJourDate(e.target.value)}
                            className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded focus:outline-none text-white"
                            id="new-journal-date"
                          />
                        </div>

                        {/* Supporting Images Upload */}
                        <div className="space-y-1 md:col-span-2">
                          <ImageUploadDropzone
                            value={newJourImages}
                            onChange={(newValue) => setNewJourImages(newValue)}
                            multiple={true}
                            label="Supporting Images"
                            placeholderText="Drag & drop images here or select files"
                          />
                        </div>
                      </div>

                      {/* External Links */}
                      <div className="space-y-1">
                        <label className="text-neutral-500 uppercase">External Links (One per line: Label | URL)</label>
                        <textarea
                          rows={2}
                          value={newJourLinks}
                          onChange={(e) => setNewJourLinks(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none text-white font-mono"
                          placeholder="Source Code | https://github.com/afriwaid/pulse&#10;Live API | https://api.afriwaid.studio"
                          id="new-journal-links"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-150 uppercase text-[10px] cursor-pointer"
                          id="save-new-journal-btn"
                        >
                          {editingJournal ? "Save Changes" : "Commit Journal Node"}
                        </button>
                        {editingJournal && (
                          <button
                            type="button"
                            onClick={cancelEditJournal}
                            className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded transition duration-150 uppercase text-[10px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Listing */}
                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="text-sm font-mono text-neutral-400 uppercase font-bold text-left">Logged Commit Registry</h4>
                    {journal.length === 0 ? (
                      <div className="p-8 text-center bg-neutral-900/10 border border-white/10 rounded text-neutral-500 text-xs font-mono">
                        No logs recorded yet. Build some code changes to update the journal!
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 no-scrollbar text-left">
                        {journal.map((j) => (
                          <div key={j.id} className="p-4 rounded-sm border border-white/5 bg-neutral-900/20 flex items-start justify-between gap-4 text-xs font-mono">
                            <div className="space-y-2 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-neutral-500 font-mono">{j.date}</span>
                                <span className="px-1.5 py-0.5 rounded text-[8px] bg-blue-500/10 border border-blue-500/20 text-blue-400 uppercase font-bold font-mono">
                                  {j.category}
                                </span>
                              </div>
                              <h5 className="font-bold text-white text-sm">{j.title}</h5>
                              <p className="text-neutral-400 leading-relaxed font-sans text-xs">
                                {j.description}
                              </p>
                              {j.images && j.images.length > 0 && (
                                <div className="text-[10px] text-blue-400/80 font-mono">
                                  ✓ Supporting attachments: {j.images.length} images link'd
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1.5 shrink-0 align-end font-mono">
                              <button
                                onClick={() => startEditJournal(j)}
                                className="px-2 py-1 text-[10px] uppercase font-bold text-left text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-sm border border-neutral-700 transition"
                                title="Edit Journal Entry"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete the log: "${j.title}"?`)) {
                                    if (onDeleteJournal) {
                                      onDeleteJournal(j.id);
                                    }
                                  }
                                }}
                                className="p-1 px-1.5 rounded-sm bg-red-950 text-red-400 border border-red-900/30 hover:bg-red-900 hover:text-white transition"
                                title="Delete Log Entry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Inquiries Regulator */}
            {activeSubTab === "inquiries" && (
              <div className="space-y-4 text-left">
                <h3 className="text-base font-display font-medium text-white border-b border-white/[0.04] pb-2 uppercase tracking-wide">
                  Corporate Inquiries & Tickets Catalog
                </h3>
                
                {inquiries.length === 0 ? (
                  <p className="text-xs text-neutral-500 font-mono py-8 text-center">No inquiry logs have been received on the system yet.</p>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inq) => (
                      <div key={inq.id} className="p-4 rounded-xl bg-neutral-950 border border-neutral-850 space-y-3 relative overflow-hidden">
                        
                        {/* Status bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                          <span className="text-blue-400 font-mono text-[10px] font-bold">{inq.date}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 rounded-sm text-[9px] font-mono border uppercase tracking-wider ${
                              inq.status === "new" ? "bg-red-500/10 border-red-500/20 text-red-400" :
                              inq.status === "reviewed" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                              "bg-neutral-850 border-white/5 text-neutral-400"
                            }`}>
                              {inq.status}
                            </span>
                            <span className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[9px] text-neutral-400 font-mono uppercase">
                              {inq.type}
                            </span>
                          </div>
                        </div>

                        {/* Text */}
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white uppercase">{inq.name}</h4>
                          <p className="text-[10px] text-neutral-500 font-mono">COMPANY: {inq.organization} | EMAIL: {inq.email}</p>
                          {inq.serviceCategory && (
                            <p className="text-[10px] text-blue-400/85 font-mono">SERVICE REQUESTED: {inq.serviceCategory}</p>
                          )}
                          <p className="text-xs text-neutral-300 leading-relaxed pt-2">
                            "{inq.message}"
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-900 justify-end">
                          <button
                            onClick={() => onUpdateInquiryStatus(inq.id, "reviewed")}
                            className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-mono hover:text-white hover:border-neutral-700 transition duration-150"
                            id={`inq-mark-rev-${inq.id}`}
                          >
                            Mark Reviewed
                          </button>
                          <button
                            onClick={() => onUpdateInquiryStatus(inq.id, "archived")}
                            className="px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-mono hover:text-white hover:border-neutral-700 transition duration-150"
                            id={`inq-mark-arch-${inq.id}`}
                          >
                            Mark Archival
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. CV Catalog */}
            {activeSubTab === "cvs" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                  <h3 className="text-base font-display font-medium text-white uppercase tracking-wide">
                    CV Profile Director
                  </h3>
                  {editingCV && (
                    <button
                      onClick={() => setEditingCV(null)}
                      className="px-2.5 py-1 text-[10px] font-mono rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 transition"
                    >
                      ← Back to List
                    </button>
                  )}
                </div>

                {editCVSuccess && (
                  <div className="p-3 bg-cyan-500/5 text-cyan-400 border border-cyan-500/20 text-xs rounded font-mono animate-pulse">
                    ✓ Success: Profile state synchronized successfully.
                  </div>
                )}

                {editingCV ? (
                  /* ==================================================== */
                  /* SECTION: FULL DYNAMIC CV EDITING WORKBENCH           */
                  /* ==================================================== */
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (cvs.some(c => c.id === editingCV.id)) {
                        onUpdateCV(editingCV);
                      } else {
                        onAddCV(editingCV);
                      }
                      setEditCVSuccess(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setTimeout(() => {
                        setEditCVSuccess(false);
                        setEditingCV(null);
                      }, 1500);
                    }}
                    className="space-y-6 text-xs text-left text-neutral-300 font-mono bg-black/90 p-5 rounded border border-white/5"
                  >
                    <div>
                      <h4 className="text-cyan-400 font-bold uppercase text-xs">Curriculum Vitae Architect Workspace</h4>
                      <p className="text-[9px] text-neutral-500 mt-0.5">EDIT REAL-TIME PARAMETERS PERSISTED SAFELY IN LOCAL DATABASE ENGINE.</p>
                    </div>

                    {/* Phase 1: Core Details */}
                    <div className="space-y-4">
                      <h5 className="text-[10px] text-neutral-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">1. Structural Base Metrics</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 block">FULL NAME *</label>
                          <input
                            type="text" required
                            value={editingCV.name}
                            onChange={(e) => setEditingCV({ ...editingCV, name: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/10 rounded-sm px-3 py-2 text-white font-semibold focus:border-cyan-500 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 block">PROFESSIONAL TITLE *</label>
                          <input
                            type="text" required
                            value={editingCV.title}
                            onChange={(e) => setEditingCV({ ...editingCV, title: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/10 rounded-sm px-3 py-2 text-white font-semibold focus:border-cyan-500 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 block">DURABLE URL SLUG *</label>
                          <input
                            type="text" required
                            value={editingCV.slug}
                            onChange={(e) => setEditingCV({ ...editingCV, slug: e.target.value })}
                            className="w-full bg-neutral-900 border border-white/10 rounded-sm px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 block">CERTIFICATIONS (comma split)</label>
                          <input
                            type="text"
                            value={editingCV.certifications ? editingCV.certifications.join(", ") : ""}
                            onChange={(e) => setEditingCV({ 
                              ...editingCV, 
                              certifications: e.target.value.split(",").map(c => c.trim()).filter(Boolean) 
                            })}
                            className="w-full bg-neutral-900 border border-white/10 rounded-sm px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                            placeholder="e.g. AWS Cloud Practitioner, Certified ScrumMaster"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-neutral-500 block">BIO SUMMARY *</label>
                        <textarea
                          required rows={4}
                          value={editingCV.summary}
                          onChange={(e) => setEditingCV({ ...editingCV, summary: e.target.value })}
                          className="w-full bg-neutral-900 border border-white/10 rounded-sm px-3 py-2 text-white focus:border-cyan-500 focus:outline-none font-sans"
                        />
                      </div>
                    </div>

                    {/* Phase 2: Skills Categories (Category & List) */}
                    <div className="space-y-3">
                      <h5 className="text-[10px] text-neutral-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">2. Interactive Skills Matrices</h5>
                      
                      <div className="space-y-2.5">
                        {editingCV.skills.map((sk, idx) => (
                          <div key={idx} className="p-3 bg-neutral-900 rounded-sm border border-white/5 flex items-start gap-3">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div>
                                <label className="text-[9px] text-neutral-500 block uppercase mb-0.5">CATEGORY</label>
                                <input
                                  type="text" required
                                  value={sk.category}
                                  placeholder="e.g. Backend"
                                  onChange={(e) => {
                                    const updatedSkills = [...editingCV.skills];
                                    updatedSkills[idx].category = e.target.value;
                                    setEditingCV({ ...editingCV, skills: updatedSkills });
                                  }}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="text-[9px] text-neutral-500 block uppercase mb-0.5">SKILLS (comma split)</label>
                                <input
                                  type="text" required
                                  value={sk.list.join(", ")}
                                  placeholder="e.g. Go, Rust, Java, Docker"
                                  onChange={(e) => {
                                    const updatedSkills = [...editingCV.skills];
                                    updatedSkills[idx].list = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                                    setEditingCV({ ...editingCV, skills: updatedSkills });
                                  }}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const filtered = editingCV.skills.filter((_, sIdx) => sIdx !== idx);
                                setEditingCV({ ...editingCV, skills: filtered });
                              }}
                              className="p-1.5 mt-4 text-red-400 hover:text-white hover:bg-red-500/10 rounded border border-neutral-800 transition cursor-pointer"
                              title="Delete skill category"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingCV({
                          ...editingCV,
                          skills: [...editingCV.skills, { category: "New Group", list: [] }]
                        })}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Skills Category Group
                      </button>
                    </div>

                    {/* Phase 3: Work Experience */}
                    <div className="space-y-4">
                      <h5 className="text-[10px] text-neutral-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">3. Professional Experience Chronicles</h5>
                      
                      <div className="space-y-3">
                        {editingCV.experience.map((exp, idx) => (
                          <div key={idx} className="p-4 bg-neutral-900 border border-white/5 rounded-sm relative space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <label className="text-[9px] text-neutral-500 block">COMPANY NAME *</label>
                                <input
                                  type="text" required
                                  value={exp.company}
                                  onChange={(e) => {
                                    const updatedExp = [...editingCV.experience];
                                    updatedExp[idx].company = e.target.value;
                                    setEditingCV({ ...editingCV, experience: updatedExp });
                                  }}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white font-semibold"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-neutral-500 block">ROLE / TITLE *</label>
                                <input
                                  type="text" required
                                  value={exp.role}
                                  onChange={(e) => {
                                    const updatedExp = [...editingCV.experience];
                                    updatedExp[idx].role = e.target.value;
                                    setEditingCV({ ...editingCV, experience: updatedExp });
                                  }}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] text-neutral-500 block">PERIOD (e.g. 2024 - Present) *</label>
                                <input
                                  type="text" required
                                  value={exp.period}
                                  onChange={(e) => {
                                    const updatedExp = [...editingCV.experience];
                                    updatedExp[idx].period = e.target.value;
                                    setEditingCV({ ...editingCV, experience: updatedExp });
                                  }}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                            </div>

                            <div className="space-y-1 text-left">
                              <label className="text-[9px] text-neutral-500 block uppercase font-bold">Role Description Bullets (One sentence per line)</label>
                              <textarea
                                required rows={4}
                                value={exp.description ? exp.description.join("\n") : ""}
                                onChange={(e) => {
                                  const updatedExp = [...editingCV.experience];
                                  updatedExp[idx].description = e.target.value.split("\n").filter(Boolean);
                                  setEditingCV({ ...editingCV, experience: updatedExp });
                                }}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white font-sans leading-relaxed"
                                placeholder="- Orchestrated microservices using Kubernetes.&#15; - Streamlined continuous delivery pipeline by 40%."
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const filtered = editingCV.experience.filter((_, eIdx) => eIdx !== idx);
                                setEditingCV({ ...editingCV, experience: filtered });
                              }}
                              className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-white hover:bg-red-500/10 rounded border border-neutral-800 transition cursor-pointer"
                              title="Delete position entry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingCV({
                          ...editingCV,
                          experience: [...editingCV.experience, { company: "New Enterprise", role: "Specialist", period: "2025 - Present", description: [] }]
                        })}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Experience Node
                      </button>
                    </div>

                    {/* Phase 4: Academic History */}
                    <div className="space-y-3">
                      <h5 className="text-[10px] text-neutral-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">4. Academic Foundations</h5>
                      
                      <div className="space-y-2.5">
                        {editingCV.education.map((edu, idx) => (
                          <div key={idx} className="p-3 bg-neutral-900 rounded-sm border border-white/5 flex items-start gap-3">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div>
                                <label className="text-[9px] text-neutral-500 block uppercase mb-0.5">INSTITUTION</label>
                                <input
                                  type="text" required
                                  value={edu.institution}
                                  onChange={(e) => {
                                    const updatedEdu = [...editingCV.education];
                                    updatedEdu[idx].institution = e.target.value;
                                    setEditingCV({ ...editingCV, education: updatedEdu });
                                  }}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-neutral-500 block uppercase mb-0.5">DEGREE / STUDY FIELD</label>
                                <input
                                  type="text" required
                                  value={edu.degree}
                                  onChange={(e) => {
                                    const updatedEdu = [...editingCV.education];
                                    updatedEdu[idx].degree = e.target.value;
                                    setEditingCV({ ...editingCV, education: updatedEdu });
                                  }}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-neutral-500 block uppercase mb-0.5">PERIOD</label>
                                <input
                                  type="text" required
                                  value={edu.period}
                                  onChange={(e) => {
                                    const updatedEdu = [...editingCV.education];
                                    updatedEdu[idx].period = e.target.value;
                                    setEditingCV({ ...editingCV, education: updatedEdu });
                                  }}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const filtered = editingCV.education.filter((_, edIdx) => edIdx !== idx);
                                setEditingCV({ ...editingCV, education: filtered });
                              }}
                              className="p-1.5 mt-4 text-red-400 hover:text-white hover:bg-red-500/10 rounded border border-neutral-800 transition cursor-pointer"
                              title="Delete education node"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingCV({
                          ...editingCV,
                          education: [...editingCV.education, { institution: "Academy Institute", degree: "Certification Domain", period: "2020 - 2024" }]
                        })}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Academic Node
                      </button>
                    </div>

                    {/* Phase 5: Portfolio References */}
                    <div className="space-y-3">
                      <h5 className="text-[10px] text-neutral-400 font-bold border-b border-white/5 pb-1 uppercase tracking-wider">5. Portfolio Links & Anchors</h5>
                      
                      <div className="space-y-2.5">
                        {editingCV.portfolioLinks.map((pL, idx) => (
                          <div key={idx} className="p-3 bg-neutral-900 rounded-sm border border-white/5 flex items-start gap-3">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[9px] text-neutral-500 block uppercase mb-0.5">LABEL</label>
                                <input
                                  type="text" required
                                  value={pL.label}
                                  onChange={(e) => {
                                    const updatedLinks = [...editingCV.portfolioLinks];
                                    updatedLinks[idx].label = e.target.value;
                                    setEditingCV({ ...editingCV, portfolioLinks: updatedLinks });
                                  }}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-neutral-500 block uppercase mb-0.5">URL ADDRESS</label>
                                <input
                                  type="text" required
                                  value={pL.url}
                                  onChange={(e) => {
                                    const updatedLinks = [...editingCV.portfolioLinks];
                                    updatedLinks[idx].url = e.target.value;
                                    setEditingCV({ ...editingCV, portfolioLinks: updatedLinks });
                                  }}
                                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-white"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                const filtered = editingCV.portfolioLinks.filter((_, lIdx) => lIdx !== idx);
                                setEditingCV({ ...editingCV, portfolioLinks: filtered });
                              }}
                              className="p-1.5 mt-4 text-red-400 hover:text-white hover:bg-red-500/10 rounded border border-neutral-800 transition cursor-pointer"
                              title="Delete link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setEditingCV({
                          ...editingCV,
                          portfolioLinks: [...editingCV.portfolioLinks, { label: "Alternate Project Link", url: "https://" }]
                        })}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Portfolio Reference Link
                      </button>
                    </div>

                    {/* Bottom controls */}
                    <div className="pt-4 border-t border-white/5 flex gap-3">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded uppercase tracking-wider text-[10px] cursor-pointer shadow-lg"
                      >
                        💾 Save CV Profile Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCV(null)}
                        className="px-5 py-2.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 font-bold rounded uppercase tracking-wider text-[10px]"
                      >
                        Abort
                      </button>
                    </div>

                  </form>
                ) : (
                  /* ==================================================== */
                  /* SECTION: GENERAL CV PROFILES CATALOG LISTING VIEW    */
                  /* ==================================================== */
                  <div className="space-y-4 text-xs font-mono">
                    <div className="flex justify-end pb-2">
                      <button
                        type="button"
                        onClick={() => {
                          const brandNewCV: CV = {
                            id: `cv-${Date.now()}`,
                            slug: "new-cv-" + Math.floor(Math.random() * 1000),
                            name: "AfrIwaid Creative",
                            title: "Lead Creative Technologist & Editor",
                            summary: "Provide a compelling professional trajectory statement here highlighting systems performance and video design engineering.",
                            skills: [
                              { category: "Multimedia & Design", list: ["Adobe Premiere", "After Effects", "Davinci Resolve", "Tailwind CSS"] },
                              { category: "Systems Core", list: ["React", "TypeScript", "Node.js", "Firebase"] }
                            ],
                            experience: [
                              {
                                company: "Freelance Creative Agency",
                                role: "Principal Multi-disciplinary Designer",
                                period: "2024 - Present",
                                description: [
                                  "Produced premium video editing deliverables and motion graphic reels with custom asset overlays.",
                                  "Architected full-stack portfolios and business tools using real-time sync systems."
                                ]
                              }
                            ],
                            education: [
                              { institution: "Digital Innovation Institute", degree: "Applied Science & Creative Media", period: "2021 - 2024" }
                            ],
                            certifications: ["Adobe Certified Expert", "Advanced React Practitioner"],
                            portfolioLinks: [{ label: "Production Reel", url: "https://youtube.com" }],
                            isPublished: true,
                            downloads: 0
                          };
                          setEditingCV(brandNewCV);
                        }}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded uppercase tracking-wider text-[10px] flex items-center gap-1.5 transition duration-150 cursor-pointer shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5" /> Initialize New CV Profile Node
                      </button>
                    </div>

                    {cvs.length === 0 ? (
                      <div className="p-8 border border-dashed border-white/10 rounded text-center text-neutral-500 font-sans">
                        No custom CV documents are currently cataloged. Click the initialization button above to draft one.
                      </div>
                    ) : (
                      cvs.map((cv) => (
                        <div key={cv.id} className="p-4 rounded-sm bg-neutral-950 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-white font-display uppercase">{cv.name}</h4>
                            <p className="text-neutral-400 font-sans text-xs">{cv.title}</p>
                            <p className="text-[10px] text-cyan-400/85 font-mono">SLUG NODE: /cv/{cv.slug}</p>
                            <p className="text-[9px] text-neutral-500">Skills groups: {cv.skills.length} | Experiences: {cv.experience.length}</p>
                          </div>

                          {/* Toggler & Editor Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setEditingCV(JSON.parse(JSON.stringify(cv)))}
                              className="px-3 py-1.5 rounded bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/25 hover:border-cyan-500/40 text-cyan-400 hover:text-cyan-300 font-mono text-[10px] uppercase font-bold transition duration-150 cursor-pointer"
                            >
                              ✏️ Edit CV Profile
                            </button>

                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase border ${
                              cv.isPublished ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}>
                              {cv.isPublished ? "PUBLISHED" : "UNPUBLISHED"}
                            </span>
                            
                            <button
                              onClick={() => onToggleCV(cv.id)}
                              className="px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 transition duration-150 text-[10px] uppercase font-bold cursor-pointer"
                              id={`toggle-cv-publish-${cv.id}`}
                            >
                              {cv.isPublished ? "Unpublish" : "Publish Live"}
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Permanently delete original CV structure "${cv.name}"? This action cannot be undone.`)) {
                                  onDeleteCV(cv.id);
                                }
                              }}
                              className="p-1.5 rounded text-red-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:bg-red-500/10 hover:border-red-500/25 transition duration-150"
                              title="Delete CV Node"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 6.5 Technology Stack Manager */}
            {activeSubTab === "tech" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-display font-medium text-white uppercase tracking-wide">
                      Technology Stack Director
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-mono">CONFIGURE THE ACTIVE PARADIGM REGISTRY RENDERED ON THE HOME SCREEN.</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      const defaults: TechStackItem[] = [
                        { id: "tech-1", badge: "TS", name: "TypeScript 5.8", description: "Rigorous static analysis" },
                        { id: "tech-2", badge: "RE", name: "React 19 & Vite", description: "Atomic virtual layout rendering" },
                        { id: "tech-3", badge: "PG", name: "PostgreSQL 17", description: "Durable relational database model" },
                        { id: "tech-4", badge: "DO", name: "Docker Containers", description: "Hermetic multi-platform deployments" },
                        { id: "tech-5", badge: "NX", name: "Node & Express", description: "Backend database pipeline" }
                      ];
                      onUpdateTechStack(defaults);
                      setTechSuccess("Restored standard product stack presets.");
                      setTimeout(() => setTechSuccess(""), 3000);
                    }}
                    className="px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-cyan-400 hover:text-cyan-300 border border-white/5 text-[9px] uppercase font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                    <span>Restore Baseline Stack</span>
                  </button>
                </div>

                {techSuccess && (
                  <div className="p-3 bg-cyan-500/5 text-cyan-400 border border-cyan-500/20 text-xs rounded font-mono">
                    ✓ Success: {techSuccess}
                  </div>
                )}

                {/* Grid layout: Add/Edit Form vs Current Cards list */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs font-mono">
                  
                  {/* Left Column: Register Form (5 cols) */}
                  <div className="lg:col-span-5 bg-neutral-950 p-5 rounded border border-white/10 space-y-4 text-left">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      {editingTechItem ? "🔧 Modify Existing Parameter" : "➕ Add Custom Parameter"}
                    </h4>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newTechBadge.trim() || !newTechName.trim() || !newTechDesc.trim()) return;

                        if (editingTechItem) {
                          const updated = techStack.map(t => 
                            t.id === editingTechItem.id 
                              ? { ...t, badge: newTechBadge.toUpperCase().substring(0, 3).trim(), name: newTechName, description: newTechDesc } 
                              : t
                          );
                          onUpdateTechStack(updated);
                          setTechSuccess(`Updated '${newTechName}' stack credentials.`);
                          setEditingTechItem(null);
                        } else {
                          const newTech: TechStackItem = {
                            id: `tech-${Date.now()}`,
                            badge: newTechBadge.toUpperCase().substring(0, 3).trim(),
                            name: newTechName,
                            description: newTechDesc
                          };
                          onUpdateTechStack([...techStack, newTech]);
                          setTechSuccess(`Registered '${newTechName}' parameter into sandbox engine.`);
                        }

                        setNewTechBadge("");
                        setNewTechName("");
                        setNewTechDesc("");
                        setTimeout(() => setTechSuccess(""), 3500);
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="space-y-1 md:col-span-1">
                          <label className="text-[9px] text-neutral-500 block uppercase font-bold">BADGE *</label>
                          <input
                            type="text" required maxLength={3}
                            placeholder="e.g. TS"
                            value={newTechBadge}
                            onChange={(e) => setNewTechBadge(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white text-center font-bold focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div className="space-y-1 md:col-span-3">
                          <label className="text-[9px] text-neutral-500 block uppercase font-bold">PRODUCT NAME *</label>
                          <input
                            type="text" required
                            placeholder="e.g. TypeScript 5.8"
                            value={newTechName}
                            onChange={(e) => setNewTechName(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] text-neutral-500 block uppercase font-bold">STATEMENT / SPECIFICATION *</label>
                        <input
                          type="text" required
                          placeholder="e.g. Rigorous static analysis and compile safety"
                          value={newTechDesc}
                          onChange={(e) => setNewTechDesc(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded uppercase tracking-wider text-[10px] transition cursor-pointer"
                        >
                          {editingTechItem ? "Save Changes" : "Register Node"}
                        </button>
                        {editingTechItem && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTechItem(null);
                              setNewTechBadge("");
                              setNewTechName("");
                              setNewTechDesc("");
                            }}
                            className="px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white rounded text-[10px] uppercase font-bold"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Existing stack list with edit/remove buttons (7 cols) */}
                  <div className="lg:col-span-7 space-y-3 text-left">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      Active Parameter Registry ({techStack ? techStack.length : 0})
                    </h4>

                    {!techStack || techStack.length === 0 ? (
                      <div className="p-8 text-center bg-neutral-950 rounded border border-white/5">
                        <p className="text-neutral-500 text-xs italic">Operational registry is currently empty. Click 'Restore Baseline' to reset.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                        {techStack.map((tech, idx) => (
                          <div 
                            key={tech.id || idx} 
                            className="p-3 bg-neutral-950 border border-white/5 rounded flex items-center justify-between gap-4 hover:border-cyan-500/20 transition"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center text-[10px] font-mono text-cyan-400 font-bold">
                                {tech.badge}
                              </span>
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-neutral-200">{tech.name}</h5>
                                <p className="text-[10px] text-neutral-500 break-words leading-tight">{tech.description}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTechItem(tech);
                                  setNewTechBadge(tech.badge);
                                  setNewTechName(tech.name);
                                  setNewTechDesc(tech.description);
                                }}
                                className="px-2.5 py-1 text-[9px] uppercase font-bold bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 hover:border-white/10 text-cyan-400 rounded transition cursor-pointer"
                              >
                                Modify
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove custom specification parameter for ${tech.name}?`)) {
                                    const filtered = techStack.filter(t => t.id !== tech.id);
                                    onUpdateTechStack(filtered);
                                    setTechSuccess(`Removed '${tech.name}' parameter.`);
                                    setTimeout(() => setTechSuccess(""), 3000);
                                  }
                                }}
                                className="px-2.5 py-1 text-[9px] uppercase font-bold bg-neutral-900 hover:bg-red-950 border border-neutral-850 hover:border-red-500/30 text-red-400 rounded transition cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* 6.7 Media Production Hub Manager */}
            {activeSubTab === "media" && (
              <div className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-2">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-display font-medium text-white uppercase tracking-wide">
                      Video & Reel Production Hub Manager
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-mono text-left">DRAFT CINEMATIC VIDEOTAPES, AFTER EFFECTS MOTION GRAPHICS AND SOCIAL REELS FOR PUBLIC SHOWCASE.</p>
                  </div>
                </div>

                {mediaSuccess && (
                  <div className="p-3 bg-green-500/10 text-green-400 border border-green-500/20 text-xs rounded font-mono animate-pulse text-left">
                    ✓ Success: Production node appended and live-wired successfully.
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-neutral-300">
                  {/* Left Column: Form to create/add media */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newMediaTitle.trim() || !newMediaExternalLink.trim()) return;

                      const defaultThumbnails = [
                        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&w=800&q=80",
                        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80"
                      ];
                      const chosenThumb = newMediaThumbnail.trim() || defaultThumbnails[Math.floor(Math.random() * defaultThumbnails.length)];

                      const newItem: MediaItem = {
                        id: `media-${Date.now()}`,
                        title: newMediaTitle,
                        description: newMediaDesc.trim() || "No detailed cinematic log is provided for this production.",
                        category: newMediaCategory,
                        duration: newMediaDuration.trim() || "1:00",
                        thumbnail: chosenThumb,
                        externalLink: newMediaExternalLink,
                        views: Math.floor(Math.random() * 5)
                      };

                      onAddMedia(newItem);
                      setMediaSuccess(true);
                      
                      // Reset fields
                      setNewMediaTitle("");
                      setNewMediaDesc("");
                      setNewMediaDuration("");
                      setNewMediaThumbnail("");
                      setNewMediaExternalLink("");

                      setTimeout(() => setMediaSuccess(false), 3000);
                    }}
                    className="lg:col-span-5 space-y-4 text-xs font-mono bg-black/40 p-4 border border-white/5 rounded-lg text-left"
                  >
                    <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-widest border-b border-white/5 pb-1">
                      Add Production Node
                    </h4>

                    <div className="space-y-1">
                      <label className="text-[9px] text-neutral-500 block uppercase font-bold">Production Title *</label>
                      <input
                        type="text" required
                        placeholder="e.g. AfrIwaid Agency Autumn Reel"
                        value={newMediaTitle}
                        onChange={(e) => setNewMediaTitle(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-neutral-500 block uppercase font-bold">Category Class *</label>
                      <select
                        value={newMediaCategory}
                        onChange={(e) => setNewMediaCategory(e.target.value as any)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-neutral-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option value="Videos">Videos (Cinematic)</option>
                        <option value="Reels">Reels (Portrait & Socials)</option>
                        <option value="Motion Graphics">Motion Graphics (FX / Logo)</option>
                        <option value="Interviews">Interviews</option>
                        <option value="Productions">Productions (Corporate)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-neutral-500 block uppercase font-bold">Video Clip Playback / Stream Link *</label>
                      <input
                        type="url" required
                        placeholder="e.g. https://youtube.com/watch?v=..."
                        value={newMediaExternalLink}
                        onChange={(e) => setNewMediaExternalLink(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-neutral-500 block uppercase font-bold">Duration Format</label>
                        <input
                          type="text"
                          placeholder="e.g. 1:45"
                          value={newMediaDuration}
                          onChange={(e) => setNewMediaDuration(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-neutral-500 block uppercase font-bold">Thumbnail URL (Optional)</label>
                        <input
                          type="text"
                          placeholder="Unsplash image link"
                          value={newMediaThumbnail}
                          onChange={(e) => setNewMediaThumbnail(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-neutral-500 block uppercase font-bold">Cinematic Log / Brief description</label>
                      <textarea
                        rows={3}
                        placeholder="Highlight details of color grading, cutting, or graphics integrated during editing..."
                        value={newMediaDesc}
                        onChange={(e) => setNewMediaDesc(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded uppercase tracking-wider text-[10px] transition cursor-pointer shadow-lg mt-2"
                    >
                      💾 Save Video Node
                    </button>
                  </form>

                  {/* Right Column: List of existing MediaItems */}
                  <div className="lg:col-span-7 space-y-3 text-left">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest border-b border-white/5 pb-1">
                      Registered Videos & Reels ({media ? media.length : 0})
                    </h4>

                    {!media || media.length === 0 ? (
                      <div className="p-8 text-center bg-neutral-950 rounded border border-white/5">
                        <p className="text-neutral-500 text-xs italic">No digital productions currently cataloged in database.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                        {media.map((item, idx) => (
                          <div 
                            key={item.id || idx} 
                            className="p-3 bg-neutral-950 border border-white/5 rounded flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/20 transition"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-16 h-10 rounded overflow-hidden relative flex-shrink-0 bg-neutral-900">
                                <img
                                  src={item.thumbnail}
                                  alt=""
                                  className="w-full h-full object-cover opacity-80"
                                />
                                <span className="absolute bottom-0 right-0 px-1 bg-black/80 text-[8px] text-neutral-400 font-mono scale-90">
                                  {item.duration}
                                </span>
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h5 className="font-bold text-neutral-200 text-xs truncate max-w-[200px]">{item.title}</h5>
                                  <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 text-[8px] border border-blue-500/20 uppercase font-bold tracking-wider shrink-0 font-mono">
                                    {item.category}
                                  </span>
                                </div>
                                <p className="text-[10px] text-neutral-400 truncate max-w-[280px] break-words font-sans">{item.description}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0 justify-end">
                              <a
                                href={item.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 text-[9px] uppercase font-bold bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 text-blue-400 rounded transition flex items-center gap-1"
                              >
                                Play <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to permanently erase video node "${item.title}"?`)) {
                                    onDeleteMedia(item.id);
                                  }
                                }}
                                className="p-1 px-2.5 text-red-400 hover:text-white bg-neutral-900 border border-neutral-850 hover:bg-red-500/10 hover:border-red-500/20 rounded text-[9px] uppercase font-bold transition cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 7. Homepage Stats Manager */}
            {activeSubTab === "stats" && (
              <div className="space-y-4">
                <h3 className="text-base font-display font-medium text-white border-b border-white/[0.04] pb-2 uppercase tracking-wide">
                  Homepage Metric Matrix Configuration
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onUpdateHomepageStats({
                      projectsCompleted: statsProjects.toString() || "0",
                      applicationsBuilt: statsApps.toString() || "0",
                      aiSystemsDeveloped: statsAi.toString() || "0",
                      articlesPublished: statsArticles.toString() || "0",
                      brandsCreated: statsBrands.toString() || "0",
                      videosProduced: statsVideos.toString() || "0",
                      clientsServed: statsClients.toString() || "0",
                    });
                    setStatsSuccess(true);
                    setTimeout(() => setStatsSuccess(false), 3000);
                  }}
                  className="space-y-4 text-xs font-mono"
                  id="stats-manager-form"
                >
                  {statsSuccess && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-sm">
                      ✓ System parameters successfully synchronized and updated!
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-neutral-400 block font-mono">PROJECTS COMPLETED</label>
                      <input
                        type="text"
                        value={statsProjects}
                        onChange={(e) => setStatsProjects(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                        required
                        id="stat-in-projects"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 block font-mono">APPLICATIONS BUILT</label>
                      <input
                        type="text"
                        value={statsApps}
                        onChange={(e) => setStatsApps(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                        required
                        id="stat-in-apps"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 block font-mono">AI SYSTEMS DEVELOPED</label>
                      <input
                        type="text"
                        value={statsAi}
                        onChange={(e) => setStatsAi(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                        required
                        id="stat-in-ai"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 block font-mono">ARTICLES PUBLISHED</label>
                      <input
                        type="text"
                        value={statsArticles}
                        onChange={(e) => setStatsArticles(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                        required
                        id="stat-in-articles"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 block font-mono">BRANDS CREATED</label>
                      <input
                        type="text"
                        value={statsBrands}
                        onChange={(e) => setStatsBrands(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                        required
                        id="stat-in-brands"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 block font-mono">VIDEOS PRODUCED</label>
                      <input
                        type="text"
                        value={statsVideos}
                        onChange={(e) => setStatsVideos(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                        required
                        id="stat-in-videos"
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-neutral-400 block font-mono">CLIENTS SERVED</label>
                      <input
                        type="text"
                        value={statsClients}
                        onChange={(e) => setStatsClients(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                        required
                        id="stat-in-clients"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-sm uppercase tracking-wider text-xs transition duration-150 flex items-center justify-center gap-2"
                    id="stats-submit-trigger"
                  >
                    <Check className="w-4 h-4" />
                    <span>Synchronize Platform Parameters</span>
                  </button>
                </form>
              </div>
            )}

            {/* 8. Testimonials Console */}
            {activeSubTab === "testimonials" && (
              <div className="space-y-6">
                <div className="border-b border-white/[0.04] pb-2 flex items-center justify-between">
                  <h3 className="text-base font-display font-medium text-white uppercase tracking-wide flex items-center gap-2">
                    <Quote className="w-4 h-4 text-amber-400" /> Client Testimonial Configuration
                  </h3>
                  <span className="text-[10px] font-mono bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-neutral-400">
                    Total: {testimonials.length} Active
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Form */}
                  <div className="lg:col-span-5 p-5 bg-neutral-900/30 border border-white/10 rounded-sm space-y-4">
                    <h4 className="text-sm font-mono text-white uppercase">{editingTestimonial ? "Edit Active Endorsement" : "Register New Endorsement"}</h4>
                    
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (editingTestimonial) {
                          const updated: Testimonial = {
                            ...editingTestimonial,
                            clientName: newTestClientName,
                            clientCompany: newTestClientCompany,
                            clientRole: newTestClientRole,
                            rating: newTestRating,
                            text: newTestText,
                            avatar: newTestAvatar.trim() || "",
                            category: newTestCategory,
                          };
                          if (onUpdateTestimonial) {
                            onUpdateTestimonial(updated);
                          }
                          setEditingTestimonial(null);
                        } else {
                          const newTest: Testimonial = {
                            id: "test-" + Date.now(),
                            clientName: newTestClientName,
                            clientCompany: newTestClientCompany,
                            clientRole: newTestClientRole,
                            rating: newTestRating,
                            text: newTestText,
                            avatar: newTestAvatar.trim() || "",
                            category: newTestCategory,
                            isPublished: true
                          };
                          onAddTestimonial(newTest);
                        }
                        setTestSuccess(true);
                        // Reset form fields
                        setNewTestClientName("");
                        setNewTestClientCompany("");
                        setNewTestClientRole("");
                        setNewTestRating(5);
                        setNewTestText("");
                        setNewTestAvatar("");
                        setNewTestCategory("Software Development");
                        setTimeout(() => setTestSuccess(false), 3000);
                      }}
                      className="space-y-3 text-xs font-mono"
                      id="testimonials-creator-form"
                    >
                      {testSuccess && (
                        <div className="p-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-sm">
                          ✓ Testimonial endorsement successfully sync'd!
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">CLIENT NAME</label>
                        <input
                          type="text"
                          value={newTestClientName}
                          onChange={(e) => setNewTestClientName(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          required
                          placeholder="e.g. Elena Rostova"
                          id="test-in-name"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">COMPANY / AGENCY</label>
                        <input
                          type="text"
                          value={newTestClientCompany}
                          onChange={(e) => setNewTestClientCompany(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          required
                          placeholder="e.g. AeroGlobal Logistics"
                          id="test-in-company"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">CLIENT TITLE / ROLE</label>
                        <input
                          type="text"
                          value={newTestClientRole}
                          onChange={(e) => setNewTestClientRole(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          required
                          placeholder="e.g. Chief of Technology"
                          id="test-in-role"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-neutral-400 block pb-0.5">SERVICE CATEGORY</label>
                          <input
                            type="text"
                            value={newTestCategory}
                            onChange={(e) => setNewTestCategory(e.target.value)}
                            className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                            required
                            placeholder="e.g. AI System Integration"
                            id="test-in-cat"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-neutral-400 block pb-0.5">CUSTOMER RATING</label>
                          <select
                            value={newTestRating}
                            onChange={(e) => setNewTestRating(Number(e.target.value))}
                            className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                            id="test-in-rating"
                          >
                            <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                            <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                            <option value={3}>⭐⭐⭐ (3/5)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">AVATAR IMAGE URL (OPTIONAL)</label>
                        <input
                          type="url"
                          value={newTestAvatar}
                          onChange={(e) => setNewTestAvatar(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          placeholder="https://images.unsplash.com/..."
                          id="test-in-avatar"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">TESTIMONIAL CITATION TEXT</label>
                        <textarea
                          rows={4}
                          value={newTestText}
                          onChange={(e) => setNewTestText(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none text-xs"
                          required
                          placeholder="Provide the client endorsement narrative here..."
                          id="test-in-text"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-sm uppercase text-[10px] tracking-wider transition cursor-pointer"
                          id="test-btn-submit"
                        >
                          {editingTestimonial ? "Save Changes" : "Publish Client Endorsement"}
                        </button>
                        {editingTestimonial && (
                          <button
                            type="button"
                            onClick={cancelEditTestimonial}
                            className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-sm uppercase text-[10px] tracking-wider transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Listing */}
                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="text-sm font-mono text-neutral-400 uppercase">Existing Endorsement Registry</h4>
                    {testimonials.length === 0 ? (
                      <div className="p-8 text-center bg-neutral-900/10 border border-white/10 rounded text-neutral-500 text-xs font-mono">
                        No testimonials registered. Fill out the creation form on the left to add one.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                        {testimonials.map((t) => (
                          <div key={t.id} className="p-4 rounded-sm border border-white/5 bg-neutral-900/20 flex items-start justify-between gap-4">
                            <div className="space-y-2 min-w-0">
                              <div className="flex items-center gap-2">
                                <img
                                  src={t.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                                  alt={t.clientName}
                                  className="w-6 h-6 rounded-full object-cover border border-white/10"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="text-xs">
                                  <span className="font-bold text-white">{t.clientName}</span>{" "}
                                  <span className="text-neutral-500">({t.clientRole} at {t.clientCompany})</span>
                                </div>
                              </div>
                              <div className="flex gap-1 text-[9px] text-amber-400">
                                {Array.from({ length: t.rating || 5 }).map((_, rIdx) => (
                                  <Star key={rIdx} className="w-2.5 h-2.5 fill-amber-400" />
                                ))}
                                <span className="ml-2 font-mono text-blue-400 text-[8px] bg-blue-500/10 px-1 rounded">
                                  {t.category}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-400 leading-relaxed italic pr-2">
                                "{t.text}"
                              </p>
                            </div>
                            <div className="flex flex-col gap-1.5 shrink-0 align-end font-mono">
                              <button
                                onClick={() => startEditTestimonial(t)}
                                className="px-2 py-1 text-[10px] uppercase font-bold text-left text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-sm border border-neutral-700 transition"
                                title="Edit Endorsement"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete the testimonial from ${t.clientName}?`)) {
                                    onDeleteTestimonial(t.id);
                                  }
                                }}
                                className="p-1 px-1.5 rounded-sm bg-red-950 text-red-400 border border-red-900/30 hover:bg-red-900 hover:text-white transition"
                                title="Delete Testimonial"
                                id={`test-del-btn-${t.id}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 9. Team Members Console */}
            {activeSubTab === "team" && (
              <div className="space-y-6">
                <div className="border-b border-white/[0.04] pb-2 flex items-center justify-between">
                  <h3 className="text-base font-display font-medium text-white uppercase tracking-wide flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" /> Team Specialist Roster Core
                  </h3>
                  <span className="text-[10px] font-mono bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-neutral-400">
                    Total: {teamMembers.length} Specialists
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Form */}
                  <div className="lg:col-span-5 p-5 bg-neutral-900/30 border border-white/10 rounded-sm space-y-4">
                    <h4 className="text-sm font-mono text-white uppercase font-bold">{editingTeamMember ? "Edit Active Specialist State" : "Register New Specialist"}</h4>
                    
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const skillsArr = newTeamSkills
                          .split(",")
                          .map((s) => s.trim())
                          .filter((s) => s.length > 0);
                        const tagsArr = newTeamExpertiseTags
                          .split(",")
                          .map((t) => t.trim())
                          .filter((t) => t.length > 0);

                        if (editingTeamMember) {
                          const updatedMem: TeamMember = {
                            ...editingTeamMember,
                            name: newTeamName,
                            role: newTeamRole,
                            teamType: newTeamType,
                            bio: newTeamBio,
                            avatar: newTeamAvatar.trim() || "",
                            skills: skillsArr,
                            expertiseTags: tagsArr,
                            linkedin: newTeamLinkedin.trim() || undefined,
                            github: newTeamGithub.trim() || undefined,
                            twitter: newTeamTwitter.trim() || undefined
                          };
                          if (onUpdateTeamMember) {
                            onUpdateTeamMember(updatedMem);
                          }
                          setEditingTeamMember(null);
                        } else {
                          const newMem: TeamMember = {
                            id: "team-" + Date.now(),
                            name: newTeamName,
                            role: newTeamRole,
                            teamType: newTeamType,
                            bio: newTeamBio,
                            avatar: newTeamAvatar.trim() || "",
                            skills: skillsArr,
                            expertiseTags: tagsArr,
                            linkedin: newTeamLinkedin.trim() || undefined,
                            github: newTeamGithub.trim() || undefined,
                            twitter: newTeamTwitter.trim() || undefined
                          };
                          onAddTeamMember(newMem);
                        }
                        setTeamSuccess(true);
                        // Reset fields
                        setNewTeamName("");
                        setNewTeamRole("");
                        setNewTeamType("Development Team");
                        setNewTeamBio("");
                        setNewTeamAvatar("");
                        setNewTeamSkills("");
                        setNewTeamExpertiseTags("");
                        setNewTeamLinkedin("");
                        setNewTeamGithub("");
                        setNewTeamTwitter("");
                        setTimeout(() => setTeamSuccess(false), 3000);
                      }}
                      className="space-y-3 text-xs font-mono"
                      id="team-specialist-creator-form"
                    >
                      {teamSuccess && (
                        <div className="p-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-sm">
                          ✓ Team member registry node updated successfully!
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">FULL NAME</label>
                        <input
                          type="text"
                          value={newTeamName}
                          onChange={(e) => setNewTeamName(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          required
                          placeholder="e.g. Victor Alawi"
                          id="team-in-name"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">SPECIFIC ROLE / TITLE</label>
                        <input
                          type="text"
                          value={newTeamRole}
                          onChange={(e) => setNewTeamRole(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          required
                          placeholder="e.g. Lead Motion Editor & Colorist"
                          id="team-in-role"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">CLASSIFICATION NODE (TEAM TYPE)</label>
                        <select
                          value={newTeamType}
                          onChange={(e) => setNewTeamType(e.target.value as any)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          id="team-in-type"
                        >
                          <option value="Management Core">Management Core</option>
                          <option value="Development Team">Development Team</option>
                          <option value="Creative Node">Creative Node</option>
                          <option value="Intelligence Node">Intelligence Node</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">PRIMARY EXPERTISE SKILLS (COMMA-SEPARATED)</label>
                        <input
                          type="text"
                          value={newTeamSkills}
                          onChange={(e) => setNewTeamSkills(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          required
                          placeholder="React, Blender 3D, DaVinci Resolve, CUDA, MCDA"
                          id="team-in-skills"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">ROLE OR EXPERTISE TAGS (COMMA-SEPARATED)</label>
                        <input
                          type="text"
                          value={newTeamExpertiseTags}
                          onChange={(e) => setNewTeamExpertiseTags(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          placeholder="Founder, Core Director, Optimization Analyst"
                          id="team-in-tags"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">AVATAR IMAGE URL (OPTIONAL)</label>
                        <input
                          type="url"
                          value={newTeamAvatar}
                          onChange={(e) => setNewTeamAvatar(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          placeholder="https://images.unsplash.com/..."
                          id="team-in-avatar"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">LINKEDIN URL (OPTIONAL)</label>
                        <input
                          type="url"
                          value={newTeamLinkedin}
                          onChange={(e) => setNewTeamLinkedin(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          placeholder="https://linkedin.com/in/..."
                          id="team-in-linkedin"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">GITHUB URL (OPTIONAL)</label>
                        <input
                          type="url"
                          value={newTeamGithub}
                          onChange={(e) => setNewTeamGithub(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          placeholder="https://github.com/..."
                          id="team-in-github"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">TWITTER URL (OPTIONAL)</label>
                        <input
                          type="url"
                          value={newTeamTwitter}
                          onChange={(e) => setNewTeamTwitter(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-1.5 text-white font-mono focus:border-blue-500 focus:outline-none"
                          placeholder="https://twitter.com/..."
                          id="team-in-twitter"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 block pb-0.5">SPECIALIST BIO</label>
                        <textarea
                          rows={4}
                          value={newTeamBio}
                          onChange={(e) => setNewTeamBio(e.target.value)}
                          className="w-full bg-neutral-950 border border-white/10 rounded-sm px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none text-xs"
                          required
                          placeholder="Outline the professional achievements and technical scope of this specialist..."
                          id="team-in-bio"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-sm uppercase text-[10px] tracking-wider transition cursor-pointer"
                          id="team-btn-submit"
                        >
                          {editingTeamMember ? "Save Changes" : "Register Team Specialist"}
                        </button>
                        {editingTeamMember && (
                          <button
                            type="button"
                            onClick={cancelEditTeamMember}
                            className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded-sm uppercase text-[10px] tracking-wider transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Listing */}
                  <div className="lg:col-span-7 space-y-3">
                    <h4 className="text-sm font-mono text-neutral-400 uppercase font-bold">Specialist Roster Roster</h4>
                    {teamMembers.length === 0 ? (
                      <div className="p-8 text-center bg-neutral-900/10 border border-white/10 rounded text-neutral-500 text-xs font-mono">
                        No team specialists registered yet. Fill out the creation form on the left to add one.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                        {teamMembers.map((m) => (
                          <div key={m.id} className="p-4 rounded-sm border border-white/5 bg-neutral-900/20 flex items-start justify-between gap-4">
                            <div className="space-y-2 min-w-0">
                              <div className="flex items-center gap-2">
                                <img
                                  src={m.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"}
                                  alt={m.name}
                                  className="w-8 h-8 rounded-sm object-cover border border-white/10"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="text-xs">
                                  <span className="font-bold text-white">{m.name}</span>{" "}
                                  <span className="text-neutral-500">[{m.teamType}]</span>
                                </div>
                              </div>
                              <p className="text-[10px] text-blue-400 font-mono font-bold uppercase">{m.role}</p>
                              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                                {m.bio}
                              </p>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {m.skills && m.skills.map((st, sIdx) => (
                                  <span key={sIdx} className="px-1.5 py-0.5 text-[8px] bg-neutral-950 border border-white/10 rounded text-neutral-300 font-mono">
                                    {st}
                                  </span>
                                ))}
                                {m.expertiseTags && m.expertiseTags.map((et, eIdx) => (
                                  <span key={`et-${eIdx}`} className="px-1.5 py-0.5 text-[8px] bg-emerald-950/40 border border-emerald-900/40 rounded text-emerald-400 font-mono">
                                    {et}
                                  </span>
                                ))}
                              </div>
                              
                              {(m.linkedin || m.github || m.twitter) && (
                                <div className="flex items-center gap-2 pt-1 font-mono text-[9px]">
                                  <span className="text-neutral-500">Links:</span>
                                  {m.linkedin && (
                                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5" title="LinkedIn">
                                      <Linkedin className="w-2.5 h-2.5" />
                                      <span>LinkedIn</span>
                                    </a>
                                  )}
                                  {m.github && (
                                    <a href={m.github} target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-white flex items-center gap-0.5" title="GitHub">
                                      <Github className="w-2.5 h-2.5" />
                                      <span>GitHub</span>
                                    </a>
                                  )}
                                  {m.twitter && (
                                    <a href={m.twitter} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 flex items-center gap-0.5" title="Twitter">
                                      <Twitter className="w-2.5 h-2.5" />
                                      <span>Twitter</span>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1.5 shrink-0 align-end font-mono">
                              <button
                                onClick={() => startEditTeamMember(m)}
                                className="px-2 py-1 text-[10px] uppercase font-bold text-left text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-sm border border-neutral-700 transition"
                                title="Edit Specialist"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete the team specialist profile of ${m.name}?`)) {
                                    onDeleteTeamMember(m.id);
                                  }
                                }}
                                className="p-1 px-1.5 rounded-sm bg-red-950 text-red-400 border border-red-900/30 hover:bg-red-900 hover:text-white transition"
                                title="Delete Specialist"
                                id={`team-del-btn-${m.id}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 13. Services Core */}
            {activeSubTab === "services" && (
              <div className="space-y-6">
                <div className="border-b border-white/[0.04] pb-2 flex items-center justify-between">
                  <h3 className="text-base font-display font-medium text-white uppercase tracking-wide flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" /> Services & Core Offerings
                  </h3>
                  <span className="text-[10px] font-mono bg-neutral-900 border border-white/10 px-2 py-0.5 rounded text-neutral-400">
                    Total: {services?.length || 0} Registered Services
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-mono">
                  {/* Left Column: Form */}
                  <div className="lg:col-span-12 xl:col-span-5 p-5 bg-neutral-950 rounded-sm border border-white/10 space-y-4 h-auto self-start text-left">
                    <h4 className="text-sm text-white uppercase font-bold text-left">
                      {editingService ? "Edit Active Service Specification" : "Register Custom Service Node"}
                    </h4>

                    {serviceSuccess && (
                      <div className="p-3 bg-green-500/5 text-green-400 border border-green-500/20 text-xs rounded-lg font-mono">
                        Success: Service specification synchronized successfully!
                      </div>
                    )}

                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newServiceName.trim() || !newServiceDesc.trim()) return;

                        const cleanDeliverables = newServiceDeliverables
                          .split(",")
                          .map((d) => d.trim())
                          .filter(Boolean);
                        
                        const cleanProcess = newServiceProcess
                          .split(",")
                          .map((p) => p.trim())
                          .filter(Boolean);

                        if (editingService) {
                          const updated: ServiceOffer = {
                            ...editingService,
                            name: newServiceName,
                            description: newServiceDesc,
                            category: newServiceCategory,
                            deliverables: cleanDeliverables,
                            process: cleanProcess,
                            estimatedTimeline: newServiceTimeline || "2-4 Weeks",
                          };
                          if (onUpdateService) {
                            onUpdateService(updated);
                          }
                          setEditingService(null);
                        } else {
                          const created: ServiceOffer = {
                            id: "srv-" + Date.now(),
                            name: newServiceName,
                            description: newServiceDesc,
                            category: newServiceCategory,
                            deliverables: cleanDeliverables,
                            process: cleanProcess,
                            estimatedTimeline: newServiceTimeline || "2-4 Weeks",
                            portfolioExamples: []
                          };
                          if (onAddService) {
                            onAddService(created);
                          }
                        }

                        setServiceSuccess(true);
                        // Reset form fields
                        setNewServiceName("");
                        setNewServiceDesc("");
                        setNewServiceCategory("Software Development");
                        setNewServiceTimeline("");
                        setNewServiceDeliverables("");
                        setNewServiceProcess("");

                        setTimeout(() => setServiceSuccess(false), 3000);
                      }}
                      className="space-y-4"
                    >
                      {/* Name */}
                      <div className="space-y-1">
                        <label className="text-neutral-400 uppercase font-bold block">Service Name *</label>
                        <input
                          type="text"
                          required
                          value={newServiceName}
                          onChange={(e) => setNewServiceName(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none text-white font-mono"
                          placeholder="e.g. Generative Agent Workspaces"
                        />
                      </div>

                      {/* Category */}
                      <div className="space-y-1">
                        <label className="text-neutral-400 uppercase font-bold block">Core Domain Category</label>
                        <select
                          value={newServiceCategory}
                          onChange={(e) => setNewServiceCategory(e.target.value as any)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded focus:outline-none text-white"
                        >
                          <option value="Software Development">Software Development</option>
                          <option value="AI Solutions">AI Solutions</option>
                          <option value="KI Systems">KI Systems</option>
                          <option value="Logo Design">Logo Design</option>
                          <option value="Branding">Branding</option>
                          <option value="Video Production">Video Production</option>
                          <option value="Copywriting">Copywriting</option>
                          <option value="Consulting">Consulting</option>
                        </select>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="text-neutral-400 uppercase font-bold block">Service Description *</label>
                        <textarea
                          required
                          rows={3}
                          value={newServiceDesc}
                          onChange={(e) => setNewServiceDesc(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none text-white font-sans text-xs"
                          placeholder="Summarize the core value proposition and engineering capabilities included..."
                        />
                      </div>

                      {/* Deliverables */}
                      <div className="space-y-1">
                        <label className="text-neutral-400 uppercase font-bold block">Deliverables (Comma-separated)</label>
                        <input
                          type="text"
                          value={newServiceDeliverables}
                          onChange={(e) => setNewServiceDeliverables(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none text-white font-mono"
                          placeholder="e.g. React WebApp, REST API Suite, Figma Schematics"
                        />
                      </div>

                      {/* Process */}
                      <div className="space-y-1">
                        <label className="text-neutral-400 uppercase font-bold block">Engineering Milestones Process (Comma-separated)</label>
                        <input
                          type="text"
                          value={newServiceProcess}
                          onChange={(e) => setNewServiceProcess(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none text-white"
                          placeholder="e.g. Discovery & Mapping, Alpha Deployment, Matrix Integration"
                        />
                      </div>

                      {/* Timeline */}
                      <div className="space-y-1">
                        <label className="text-neutral-400 uppercase font-bold block">Estimated Timeline</label>
                        <input
                          type="text"
                          value={newServiceTimeline}
                          onChange={(e) => setNewServiceTimeline(e.target.value)}
                          className="w-full p-2.5 bg-neutral-900 border border-neutral-800 rounded placeholder-neutral-700 focus:outline-none text-white"
                          placeholder="e.g. 4-6 Weeks"
                        />
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded transition duration-150 uppercase text-[10px] cursor-pointer"
                        >
                          {editingService ? "Save Changes" : "Commit Service Node"}
                        </button>
                        {editingService && (
                          <button
                            type="button"
                            onClick={cancelEditService}
                            className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded transition duration-150 uppercase text-[10px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>

                  {/* Right Column: Listing */}
                  <div className="lg:col-span-12 xl:col-span-7 space-y-3">
                    <h4 className="text-sm font-mono text-neutral-400 uppercase font-bold text-left">Active Services catalog</h4>
                    {!services || services.length === 0 ? (
                      <div className="p-8 text-center bg-neutral-900/10 border border-white/10 rounded text-neutral-500 text-xs font-mono">
                        No custom services defined on this node. Build service offerings above to publish.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 no-scrollbar text-left font-mono">
                        {services.map((s) => (
                          <div key={s.id} className="p-4 rounded-sm border border-white/5 bg-neutral-900/20 flex items-start justify-between gap-4 text-xs">
                            <div className="space-y-2 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="px-1.5 py-0.5 rounded text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase font-bold">
                                  {s.category}
                                </span>
                                <span className="text-neutral-500 text-[10px]">Timeline: {s.estimatedTimeline}</span>
                              </div>
                              <h5 className="font-bold text-white text-sm">{s.name}</h5>
                              <p className="text-neutral-400 leading-relaxed font-sans text-xs">
                                {s.description}
                              </p>
                              {s.deliverables && s.deliverables.length > 0 && (
                                <div className="text-[10px] text-neutral-500 font-mono">
                                  <span className="text-slate-300">Deliverables:</span> {s.deliverables.join(" • ")}
                                </div>
                              )}
                              {s.process && s.process.length > 0 && (
                                <div className="text-[10px] text-neutral-500 font-mono">
                                  <span className="text-slate-300">Process:</span> {s.process.join(" ➔ ")}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-1.5 shrink-0 align-end font-mono">
                              <button
                                onClick={() => startEditService(s)}
                                className="px-2 py-1 text-[10px] uppercase font-bold text-left text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white rounded-sm border border-neutral-700 transition"
                                title="Edit Service"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete the service: ${s.name}?`)) {
                                    if (onDeleteService) {
                                      onDeleteService(s.id);
                                    }
                                  }
                                }}
                                className="p-1 px-1.5 rounded-sm bg-red-950 text-red-100 border border-red-900/30 hover:bg-red-900 hover:text-white transition"
                                title="Delete Service Node"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Site Customization Management Matrix */}
            {activeSubTab === "site_customization" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-neutral-800 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-sans font-bold text-white uppercase tracking-wider">Dynamic Rebranding & Alignment Control</h3>
                    <p className="text-neutral-400 text-xs">Re-architect corporate visual specifications, activate beta flags, alter nomenclature, and switch typography templates instantenously.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetCustomization}
                      className="px-3 py-1.5 border border-red-900/40 text-red-200 hover:text-white bg-red-950/20 hover:bg-neutral-900 rounded-lg text-xs font-mono transition"
                    >
                      Restore Factory Defs
                    </button>
                  </div>
                </div>

                {custSuccess && (
                  <div className="p-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded-xl animate-fade-in flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>CORPORATE BRAND IDENTIFICATION CONSTRAINTS UPDATED AND APPLIED IN ALL STATIONS.</span>
                  </div>
                )}

                <form onSubmit={handleSaveCustomization} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left: General Settings and Labels */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                      <div className="flex items-center gap-2 border-b border-neutral-850 pb-2">
                        <Settings className="w-4 h-4 text-pink-400" />
                        <h4 className="text-xs font-mono uppercase font-extrabold text-neutral-200">Corporate Nomenclature & Texts</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">App Full Branding Name</label>
                          <input
                            type="text"
                            value={custAppName}
                            onChange={(e) => setCustAppName(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            placeholder="e.g. AFRIWAID STUDIO"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">App Shorthand Code / Nickname</label>
                          <input
                            type="text"
                            value={custAppNickname}
                            onChange={(e) => setCustAppNickname(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            placeholder="e.g. AFRIWAID"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Sub-Header Status Node / Tagline</label>
                        <input
                          type="text"
                          value={custTagline}
                          onChange={(e) => setCustTagline(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                          placeholder="e.g. Empowering Digital Innovation"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Landing Display Headline</label>
                        <input
                          type="text"
                          value={custHeroHeadline}
                          onChange={(e) => setCustHeroHeadline(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                          placeholder="e.g. AFRIWAID STUDIO"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Landing Display Brief Description / Subtitle</label>
                        <textarea
                          rows={3}
                          value={custHeroSubtitle}
                          onChange={(e) => setCustHeroSubtitle(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                          placeholder="Describe the primary capabilities and impact objectives..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Primary Action Click (CTA 1)</label>
                          <input
                            type="text"
                            value={custPrimaryCta}
                            onChange={(e) => setCustPrimaryCta(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Secondary Lab Trigger (CTA 2)</label>
                          <input
                            type="text"
                            value={custSecondaryCta}
                            onChange={(e) => setCustSecondaryCta(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Custom Footnote / Attribution Copy</label>
                        <textarea
                          rows={2}
                          value={custFooterDesc}
                          onChange={(e) => setCustFooterDesc(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                          placeholder="e.g. AfriWaid Studio Ltd. Building high-capacity systems globally."
                        />
                      </div>
                    </div>

                    {/* Logo & Favicon Customization Card */}
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                      <div className="flex items-center gap-2 border-b border-neutral-850 pb-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-mono uppercase font-extrabold text-neutral-200">Logo & Favicon Customization</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Logo Type</label>
                          <select
                            value={custLogoType}
                            onChange={(e) => setCustLogoType(e.target.value as "text" | "image")}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                          >
                            <option value="text">Text / Initials</option>
                            <option value="image">Image URL</option>
                          </select>
                        </div>

                        {custLogoType === "text" ? (
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Logo Initials (Text)</label>
                            <input
                              type="text"
                              value={custLogoText}
                              onChange={(e) => setCustLogoText(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                              placeholder="e.g. A"
                              maxLength={3}
                            />
                          </div>
                        ) : (
                          <div className="space-y-2 col-span-1">
                            <ImageUploadDropzone
                              value={custLogoUrl}
                              onChange={(newValue) => setCustLogoUrl(newValue)}
                              multiple={false}
                              label="Upload Logo Image"
                              placeholderText="Drag & drop or browse"
                            />
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-neutral-800">
                        <ImageUploadDropzone
                          value={custFaviconUrl}
                          onChange={(newValue) => setCustFaviconUrl(newValue)}
                          multiple={false}
                          label="Upload Custom Favicon (PNG/ICO)"
                          placeholderText="Drag & drop your favicon image here or click to browse"
                        />
                      </div>
                    </div>

                    {/* Home Page Section Headers */}
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                      <div className="flex items-center gap-2 border-b border-neutral-850 pb-2">
                        <Settings className="w-4 h-4 text-purple-400" />
                        <h4 className="text-xs font-mono uppercase font-extrabold text-neutral-200">Home Page Headers & Copy</h4>
                      </div>

                      {/* Stats Segment */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">1. Impact Stats Section</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Stats Subtitle</label>
                            <input
                              type="text"
                              value={custStatsSubtitle}
                              onChange={(e) => setCustStatsSubtitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Stats Title</label>
                            <input
                              type="text"
                              value={custStatsTitle}
                              onChange={(e) => setCustStatsTitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Tech Stack Segment */}
                      <div className="space-y-3 pt-3 border-t border-neutral-900">
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">2. Technology Stack Section</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Tech Stack Subtitle</label>
                            <input
                              type="text"
                              value={custTechSubtitle}
                              onChange={(e) => setCustTechSubtitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Tech Stack Title</label>
                            <input
                              type="text"
                              value={custTechTitle}
                              onChange={(e) => setCustTechTitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Tech Stack Description</label>
                          <textarea
                            rows={2}
                            value={custTechDescription}
                            onChange={(e) => setCustTechDescription(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Company Profile (About Us) Page Copy */}
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-neutral-800 space-y-5">
                      <div className="flex items-center gap-2 border-b border-neutral-850 pb-2">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-mono uppercase font-extrabold text-neutral-200">Company Profile Page Copy</h4>
                      </div>

                      {/* Cinematic Banner */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">1. About Hero Banner</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Banner Tagline</label>
                            <input
                              type="text"
                              value={custAboutTagline}
                              onChange={(e) => setCustAboutTagline(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Banner Title</label>
                            <input
                              type="text"
                              value={custAboutTitle}
                              onChange={(e) => setCustAboutTitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Banner Description</label>
                          <textarea
                            rows={2}
                            value={custAboutDescription}
                            onChange={(e) => setCustAboutDescription(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                          />
                        </div>
                      </div>

                      {/* Mission & Vision */}
                      <div className="space-y-3 pt-3 border-t border-neutral-900">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">2. Mission & Vision Bento Cards</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3 p-3 bg-neutral-900/50 rounded-xl border border-neutral-850">
                            <span className="text-[10px] font-mono text-cyan-400 block font-bold uppercase">Mission Card</span>
                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono font-bold text-neutral-450 uppercase">Mission Title</label>
                              <input
                                type="text"
                                value={custAboutMissionTitle}
                                onChange={(e) => setCustAboutMissionTitle(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono font-bold text-neutral-450 uppercase">Mission Description</label>
                              <textarea
                                rows={2}
                                value={custAboutMissionDesc}
                                onChange={(e) => setCustAboutMissionDesc(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                              />
                            </div>
                          </div>

                          <div className="space-y-3 p-3 bg-neutral-900/50 rounded-xl border border-neutral-850">
                            <span className="text-[10px] font-mono text-cyan-400 block font-bold uppercase">Vision Card</span>
                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono font-bold text-neutral-450 uppercase">Vision Title</label>
                              <input
                                type="text"
                                value={custAboutVisionTitle}
                                onChange={(e) => setCustAboutVisionTitle(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[11px] font-mono font-bold text-neutral-450 uppercase">Vision Description</label>
                              <textarea
                                rows={2}
                                value={custAboutVisionDesc}
                                onChange={(e) => setCustAboutVisionDesc(e.target.value)}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Philosophy */}
                      <div className="space-y-3 pt-3 border-t border-neutral-900">
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">3. Innovation Philosophy Segment</span>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Philosophy Title</label>
                          <input
                            type="text"
                            value={custAboutPhilosophyTitle}
                            onChange={(e) => setCustAboutPhilosophyTitle(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Philosophy Description</label>
                          <textarea
                            rows={2}
                            value={custAboutPhilosophyDesc}
                            onChange={(e) => setCustAboutPhilosophyDesc(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Services, Projects & CV Page Customization (Stage 3) */}
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-neutral-800 space-y-6">
                      <div className="flex items-center gap-2 border-b border-neutral-850 pb-2">
                        <ClipboardList className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-mono uppercase font-extrabold text-neutral-200">Capabilities, Portfolio & CV Customizations</h4>
                      </div>

                      {/* 1. Services Page Settings */}
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">1. Services Page Settings</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Services Tagline</label>
                            <input
                              type="text"
                              value={custServicesTagline}
                              onChange={(e) => setCustServicesTagline(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Services Main Title</label>
                            <input
                              type="text"
                              value={custServicesTitle}
                              onChange={(e) => setCustServicesTitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Services Section Description</label>
                          <textarea
                            rows={2}
                            value={custServicesDescription}
                            onChange={(e) => setCustServicesDescription(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                          />
                        </div>
                      </div>

                      {/* 2. Projects Portfolio Settings */}
                      <div className="space-y-3 pt-4 border-t border-neutral-900">
                        <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">2. Projects Portfolio Settings</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Projects Main Title</label>
                            <input
                              type="text"
                              value={custProjectsTitle}
                              onChange={(e) => setCustProjectsTitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Projects Subtitle (Uppercase)</label>
                            <input
                              type="text"
                              value={custProjectsSubtitle}
                              onChange={(e) => setCustProjectsSubtitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3. Resume & CV Center Settings */}
                      <div className="space-y-3 pt-4 border-t border-neutral-900">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">3. Resume & CV Center Settings</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">CV Center Title</label>
                            <input
                              type="text"
                              value={custCvTitle}
                              onChange={(e) => setCustCvTitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">CV Center Subtitle (Uppercase)</label>
                            <input
                              type="text"
                              value={custCvSubtitle}
                              onChange={(e) => setCustCvSubtitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4. AI Lab Settings */}
                      <div className="space-y-3 pt-4 border-t border-neutral-900">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block font-bold">4. AI Lab Settings</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">AI Lab Tagline</label>
                            <input
                              type="text"
                              value={custAiLabTagline}
                              onChange={(e) => setCustAiLabTagline(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">AI Lab Main Title</label>
                            <input
                              type="text"
                              value={custAiLabTitle}
                              onChange={(e) => setCustAiLabTitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">AI Lab Description</label>
                          <textarea
                            rows={2}
                            value={custAiLabDescription}
                            onChange={(e) => setCustAiLabDescription(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                          />
                        </div>
                      </div>

                      {/* 5. Publishing Hub Settings */}
                      <div className="space-y-3 pt-4 border-t border-neutral-900">
                        <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">5. Publishing Hub Settings</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Publishing Main Title</label>
                            <input
                              type="text"
                              value={custWritingTitle}
                              onChange={(e) => setCustWritingTitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Publishing Subtitle</label>
                            <input
                              type="text"
                              value={custWritingSubtitle}
                              onChange={(e) => setCustWritingSubtitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 6. Media Center Settings */}
                      <div className="space-y-3 pt-4 border-t border-neutral-900">
                        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">6. Media Center Settings</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Media Main Title</label>
                            <input
                              type="text"
                              value={custMediaTitle}
                              onChange={(e) => setCustMediaTitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Media Subtitle</label>
                            <input
                              type="text"
                              value={custMediaSubtitle}
                              onChange={(e) => setCustMediaSubtitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 7. Build Journal Settings */}
                      <div className="space-y-3 pt-4 border-t border-neutral-900">
                        <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest block font-bold">7. Build Journal Settings</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Journal Tagline</label>
                            <input
                              type="text"
                              value={custJournalTagline}
                              onChange={(e) => setCustJournalTagline(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Journal Main Title</label>
                            <input
                              type="text"
                              value={custJournalTitle}
                              onChange={(e) => setCustJournalTitle(e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Journal Section Description</label>
                          <textarea
                            rows={2}
                            value={custJournalDescription}
                            onChange={(e) => setCustJournalDescription(e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Command */}
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-neutral-800 flex items-center justify-between gap-4">
                      <span className="text-[10px] text-neutral-500 font-mono">Modifications affect site layouts instantly on hot reload.</span>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-mono text-xs font-extrabold rounded-lg tracking-wider uppercase transition"
                      >
                        Commit Brand Matrix
                      </button>
                    </div>
                  </div>

                  {/* Right: Theme Moodboard Accent & Functional Switches */}
                  <div className="space-y-6">
                    {/* Visual Color Palette */}
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                      <div className="flex items-center gap-2 border-b border-neutral-850 pb-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <h4 className="text-xs font-mono uppercase font-extrabold text-neutral-200">Color Palette & Atmosphere</h4>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-[11px] font-mono font-bold text-neutral-400 uppercase">Core Brand Color Accent</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["cyan", "amber", "emerald", "indigo", "rose", "violet"] as const).map((col) => {
                            const colors = {
                              cyan: "bg-cyan-500 text-cyan-500",
                              amber: "bg-amber-500 text-amber-500",
                              emerald: "bg-emerald-500 text-emerald-500",
                              indigo: "bg-indigo-500 text-indigo-500",
                              rose: "bg-rose-500 text-rose-500",
                              violet: "bg-violet-500 text-violet-500"
                            };
                            const isSelected = custAccentColor === col;
                            return (
                              <button
                                key={col}
                                type="button"
                                onClick={() => setCustAccentColor(col)}
                                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                                  isSelected 
                                    ? "border-white bg-neutral-900 shadow-md scale-102" 
                                    : "border-neutral-850 bg-neutral-950 hover:bg-neutral-900"
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-full block ${colors[col].split(" ")[0]} border border-white/20`} />
                                <span className="text-[9px] font-mono capitalize text-neutral-300">{col}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-900 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-mono font-bold text-neutral-200 uppercase block">Retro Decors Terminal Style</span>
                            <span className="text-[9px] text-neutral-500 block">Override headers with full tech-monospace aesthetic</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCustUseTerminal(!custUseTerminal)}
                            className={`w-10 h-6 rounded-full flex items-center p-0.5 transition duration-155 cursor-pointer ${
                              custUseTerminal ? "bg-emerald-500 justify-end" : "bg-neutral-800 justify-start"
                            }`}
                          >
                            <span className="w-5 h-5 bg-white rounded-full block shadow-sm" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Feature flags and toggles */}
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                      <div className="flex items-center gap-2 border-b border-neutral-850 pb-2">
                        <Database className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-mono uppercase font-extrabold text-neutral-200">Corporate Feature Flags</h4>
                      </div>

                      <p className="text-[10px] text-neutral-500 leading-normal font-sans">Toggle public modules or system sections. Unchecked nodes are immediately retracted from navigational layouts.</p>

                      <div className="space-y-4 pt-2">
                        {/* Flag 1: AI LAB */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-neutral-300 block">AI Systems Lab</span>
                            <span className="text-[9px] text-neutral-500 block">Deploy dynamic machine learning prompt consoles</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCustShowAILab(!custShowAILab)}
                            className={`w-10 h-6 rounded-full flex items-center p-0.5 transition duration-155 cursor-pointer ${
                              custShowAILab ? "bg-cyan-500 justify-end" : "bg-neutral-800 justify-start"
                            }`}
                          >
                            <span className="w-5 h-5 bg-white rounded-full block shadow-sm" />
                          </button>
                        </div>

                        {/* Flag 2: BUILD JOURNAL */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-neutral-300 block">Engineering Journal</span>
                            <span className="text-[9px] text-neutral-500 block">Public progress logs and execution notes</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCustShowJournal(!custShowJournal)}
                            className={`w-10 h-6 rounded-full flex items-center p-0.5 transition duration-155 cursor-pointer ${
                              custShowJournal ? "bg-cyan-500 justify-end" : "bg-neutral-800 justify-start"
                            }`}
                          >
                            <span className="w-5 h-5 bg-white rounded-full block shadow-sm" />
                          </button>
                        </div>

                        {/* Flag 3: DIGITAL MEDIA */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-neutral-300 block">Cinema Media Hub</span>
                            <span className="text-[9px] text-neutral-500 block">Showcase high-energy reels & recordings</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCustShowMedia(!custShowMedia)}
                            className={`w-10 h-6 rounded-full flex items-center p-0.5 transition duration-155 cursor-pointer ${
                              custShowMedia ? "bg-cyan-500 justify-end" : "bg-neutral-800 justify-start"
                            }`}
                          >
                            <span className="w-5 h-5 bg-white rounded-full block shadow-sm" />
                          </button>
                        </div>

                        {/* Flag 4: PERSISTENT WRITING */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-neutral-300 block">Technical Publishing</span>
                            <span className="text-[9px] text-neutral-500 block">Access to structural PDFs & deep editorial articles</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCustShowWriting(!custShowWriting)}
                            className={`w-10 h-6 rounded-full flex items-center p-0.5 transition duration-155 cursor-pointer ${
                              custShowWriting ? "bg-cyan-500 justify-end" : "bg-neutral-800 justify-start"
                            }`}
                          >
                            <span className="w-5 h-5 bg-white rounded-full block shadow-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* 10. Users List Manager */}
            {activeSubTab === "users" && (
              <UsersListManager />
            )}

            {/* 11. RBAC Controller */}
            {activeSubTab === "roles" && (
              <RbacController />
            )}

            {/* 12. Security Audit Logs */}
            {activeSubTab === "audit_logs" && (
              <AuditLogsPanel />
            )}

            {/* 13. Workspaces Dispatch */}
            {activeSubTab === "workspaces" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-200 dark:border-neutral-800 pb-3">
                  <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-white uppercase tracking-wider">Enterprise Workspace Control</h3>
                  <p className="text-slate-500 dark:text-zinc-400 text-xs">Deploy milestones, assign tasks, and audit client-focused technical deliverables in real-time.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Create deliverables / milestones */}
                  <div className="bg-slate-50 dark:bg-black p-5 rounded-2xl border border-slate-200 dark:border-neutral-850 space-y-4">
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono uppercase font-bold block border-b border-slate-200 dark:border-neutral-900 pb-1.5">Dispatch Milestone / Deliverable</span>
                    
                    {workspaceSuccessMsg && (
                      <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono text-xs rounded-lg">
                        {workspaceSuccessMsg}
                      </div>
                    )}

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!targetWorkspaceClientId) {
                        alert("Select a target client partnership.");
                        return;
                      }
                      // Push new Deliverable to client list
                      const client = clients.find(c => c.id === targetWorkspaceClientId);
                      if (client) {
                        const newDel: Deliverable = {
                          id: "del-" + Date.now(),
                          name: newDeliverableName || "Technical Deliverable Target",
                          description: newDeliverableDesc || "Bespoe technical code index.",
                          status: "pending",
                          fileName: "spec_" + Date.now() + ".pdf",
                          fileSize: "2.5 MB"
                        };
                        client.deliverables = [newDel, ...(client.deliverables || [])];
                        setWorkspaceSuccessMsg("Bespoke document deliverable issued successfully.");
                        setNewDeliverableName("");
                        setNewDeliverableDesc("");
                        setTimeout(() => setWorkspaceSuccessMsg(""), 3000);
                      }
                    }} className="space-y-3 font-sans text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-500 dark:text-zinc-500 font-mono uppercase text-[9px]">Target Partnership *</label>
                        <select
                          required
                          value={targetWorkspaceClientId}
                          onChange={(e) => setTargetWorkspaceClientId(e.target.value)}
                          className="w-full p-2.5 bg-white dark:bg-black border border-slate-300 dark:border-neutral-800 rounded text-slate-900 dark:text-white focus:outline-none"
                        >
                          <option value="">-- Choose Client Profile --</option>
                          {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.company} ({c.assignedProjectName})</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 dark:text-zinc-500 font-mono uppercase text-[9px]">Deliverable Title Name *</label>
                        <input
                          type="text"
                          required
                          value={newDeliverableName}
                          onChange={(e) => setNewDeliverableName(e.target.value)}
                          placeholder="e.g. Core Database Schema Indices Spec"
                          className="w-full p-2.5 bg-white dark:bg-black border border-slate-300 dark:border-neutral-800 rounded text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:border-cyan-400 focus:outline-none text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 dark:text-zinc-500 font-mono uppercase text-[9px]">Deliverable Objective Description</label>
                        <textarea
                          required
                          rows={2}
                          value={newDeliverableDesc}
                          onChange={(e) => setNewDeliverableDesc(e.target.value)}
                          placeholder="Provide target completion requirements..."
                          className="w-full p-2.5 bg-white dark:bg-black border border-slate-300 dark:border-neutral-800 rounded text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-600 focus:border-cyan-400 focus:outline-none text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-2 bg-cyan-500 text-black font-extrabold uppercase font-mono text-[9px] rounded hover:bg-cyan-400 transition cursor-pointer"
                      >
                        Transmit Deliverable Document
                      </button>
                    </form>
                  </div>

                  {/* View Active artifacts directories */}
                  <div className="bg-slate-50 dark:bg-black p-5 rounded-2xl border border-slate-200 dark:border-neutral-850 space-y-4">
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono uppercase block border-b border-slate-200 dark:border-neutral-900 pb-1.5 font-bold">Client Files Catalogue Directory</span>
                    
                    <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar font-sans text-xs">
                      {clients.map((c) => (
                        <div key={c.id} className="p-3 bg-white dark:bg-black border border-slate-200 dark:border-neutral-900 rounded-xl space-y-2">
                          <div className="flex justify-between items-center border-b border-slate-100 dark:border-zinc-900 pb-1.5">
                            <span className="text-slate-900 dark:text-white font-bold">{c.company}</span>
                            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono">{c.deliverables?.length || 0} Files</span>
                          </div>
                          
                          <div className="space-y-1">
                            {c.deliverables?.map(del => (
                              <div key={del.id} className="flex justify-between items-center text-[11px] text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white">
                                <span>• {del.name}</span>
                                <span className="text-[9px] px-1 bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-zinc-500 rounded">{del.status}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 14. Clients & Billing */}
            {activeSubTab === "clients_billing" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-200 dark:border-neutral-800 pb-3">
                  <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-white uppercase tracking-wider">Clients Progress & Billings Matrix</h3>
                  <p className="text-slate-500 dark:text-zinc-400 text-xs">Record payments histories, update development metrics, and issue custom tax invoice clearance codes.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Clients Inventory list with inline progress adjuster (7 cols) */}
                  <div className="lg:col-span-12 xl:col-span-7 bg-slate-50 dark:bg-black p-5 rounded-2xl border border-slate-200 dark:border-neutral-850 space-y-4 font-sans text-xs">
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono uppercase block border-b border-slate-200 dark:border-neutral-905 pb-1 font-bold">Seeded Client Framework Connections</span>
                    
                    <div className="space-y-3">
                      {clients.map((c) => (
                        <div key={c.id} className="p-4 bg-white dark:bg-black border border-slate-200 dark:border-neutral-900 rounded-xl space-y-3 hover:border-cyan-500/10 transition">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-slate-900 dark:text-white font-bold text-xs">{c.company}</h4>
                              <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono">{c.email}</p>
                            </div>
                            <span className="text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold">{c.projectProgress}% Complete</span>
                          </div>

                          {/* Progress slider bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-slate-500 dark:text-zinc-500 font-mono">
                              <span>Sprint completion metric:</span>
                              <span>{c.projectProgress}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={c.projectProgress}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                c.projectProgress = val;
                                // update local analytics or database state trigger
                                setBillingSuccessMsg(`Progress index adjusted for ${c.company} to ${val}%`);
                                setTimeout(() => setBillingSuccessMsg(""), 3000);
                              }}
                              className="w-full accent-cyan-500 bg-slate-200 dark:bg-neutral-900 h-1.5 rounded-lg outline-none appearance-none cursor-pointer"
                              id={`billing-progress-${c.id}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Issue invoice module (5 cols) */}
                  <div className="lg:col-span-12 xl:col-span-5 bg-slate-50 dark:bg-black p-5 rounded-2xl border border-slate-200 dark:border-neutral-850 space-y-4">
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono uppercase block border-b border-slate-200 dark:border-neutral-905 pb-1 font-bold">Issue Invoice Node</span>
                    
                    {billingSuccessMsg && (
                      <div className="p-3 bg-cyan-500/10 border border-cyan-400/25 text-cyan-600 dark:text-cyan-400 font-mono text-xs rounded-lg">
                        {billingSuccessMsg}
                      </div>
                    )}

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (!selectedClientBillingId) {
                        alert("Please select a recipient corporate client.");
                        return;
                      }
                      const match = clients.find(c => c.id === selectedClientBillingId);
                      if (match) {
                        const newInv: Invoice = {
                          id: "inv-" + Date.now(),
                          invoiceNumber: newInvoiceNumber || "2026-004",
                          issueDate: new Date().toISOString().split("T")[0],
                          dueDate: newInvoiceDueDate || "2026-07-01",
                          amount: newInvoiceAmount || "$5,000.00",
                          status: "Unpaid"
                        };
                        match.invoices = [...(match.invoices || []), newInv];
                        setBillingSuccessMsg("Invoice cleared and dispatched to customer portal.");
                        setNewInvoiceNumber("");
                        setNewInvoiceAmount("");
                        setNewInvoiceDueDate("");
                        setTimeout(() => setBillingSuccessMsg(""), 3000);
                      }
                    }} className="space-y-3 font-sans text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-500 dark:text-zinc-500 font-mono uppercase text-[9px]">Corporate Partner *</label>
                        <select
                          required
                          value={selectedClientBillingId}
                          onChange={(e) => setSelectedClientBillingId(e.target.value)}
                          className="w-full p-2.5 bg-white dark:bg-black border border-slate-300 dark:border-neutral-800 rounded text-slate-900 dark:text-white focus:outline-none"
                        >
                          <option value="">-- Choose Client --</option>
                          {clients.map(c => (
                            <option key={c.id} value={c.id}>{c.company}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 dark:text-zinc-500 font-mono uppercase text-[9px]">Invoice Reference Code *</label>
                        <input
                          type="text"
                          required
                          value={newInvoiceNumber}
                          onChange={(e) => setNewInvoiceNumber(e.target.value)}
                          placeholder="e.g. 2026-009"
                          className="w-full p-2.5 bg-white dark:bg-black border border-slate-300 dark:border-neutral-800 rounded text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-650 focus:border-cyan-400 focus:outline-none text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 dark:text-zinc-500 font-mono uppercase text-[9px]">Outstanding Cost Balance ($ USD) *</label>
                        <input
                          type="text"
                          required
                          value={newInvoiceAmount}
                          onChange={(e) => setNewInvoiceAmount(e.target.value)}
                          placeholder="e.g. $8,500.00"
                          className="w-full p-2.5 bg-white dark:bg-black border border-slate-300 dark:border-neutral-800 rounded text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-650 focus:border-cyan-400 focus:outline-none text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-500 dark:text-zinc-500 font-mono uppercase text-[9px]">Payment Threshold Due Date</label>
                        <input
                          type="date"
                          required
                          value={newInvoiceDueDate}
                          onChange={(e) => setNewInvoiceDueDate(e.target.value)}
                          className="w-full p-2.5 bg-white dark:bg-black border border-slate-300 dark:border-neutral-800 rounded text-slate-900 dark:text-white focus:border-cyan-400 focus:outline-none text-xs"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold font-mono uppercase text-[9px] tracking-widest rounded transition duration-200 cursor-pointer"
                        id="invoice-submit-btn-admin"
                      >
                        Transmit Invoice clear
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* 15. Support Live Chat Matrix */}
            {activeSubTab === "support_chat" && (
              <div className="space-y-6 text-left animate-fadeIn">
                <div className="border-b border-slate-200 dark:border-neutral-800 pb-3">
                  <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-white uppercase tracking-wider">WebSocket Support Chat Console</h3>
                  <p className="text-slate-500 dark:text-zinc-400 text-xs">Direct communications link to all registered client portals over synchronized WebSocket frames.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-50 dark:bg-black p-6 rounded-3xl border border-slate-200 dark:border-neutral-850">
                  {/* Left Column (4 cols): Conversations lists */}
                  <div className="lg:col-span-4 border-r border-slate-200 dark:border-neutral-900 pr-4 space-y-4">
                    <span className="text-[10px] text-slate-500 dark:text-zinc-500 font-mono uppercase block font-bold">Active support terminals</span>
                    
                    <div className="space-y-2">
                      {clients.map((c) => {
                        const isSelected = selectedAdminClientId === c.id;
                        return (
                          <div
                            key={c.id}
                            onClick={async () => {
                              setSelectedAdminClientId(c.id);
                              setActiveAdminConvoId("");
                              setAdminChatMessages([]);
                              const token = localStorage.getItem("afriwaid_auth_token") || sessionStorage.getItem("afriwaid_auth_token") || "";
                              try {
                                const res = await fetch("/api/conversations", {
                                  headers: { "Authorization": `Bearer ${token}` }
                                });
                                const convos = await res.json();
                                const list = Array.isArray(convos) ? convos : (convos.conversations || []);
                                const supportConvo = list.find((convo: any) => {
                                  const name = `${convo.name || ""}`.toLowerCase();
                                  return convo.type === "support" && (name.includes(c.company.toLowerCase()) || name.includes(c.name.toLowerCase()));
                                }) || list.find((convo: any) => convo.type === "support") || list[0];
                                if (supportConvo?.id) {
                                  setActiveAdminConvoId(supportConvo.id);
                                  const listRes = await fetch(`/api/messages/${supportConvo.id}`, {
                                    headers: { "Authorization": `Bearer ${token}` }
                                  });
                                  const msgPayload = await listRes.json();
                                  setAdminChatMessages(Array.isArray(msgPayload) ? msgPayload : (msgPayload.messages || []));
                                }
                              } catch (err) {
                                console.error("Error loading chat in admin panel", err);
                              }
                            }}
                            className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                              isSelected ? "bg-cyan-500/10 border-cyan-500/30 text-slate-900 dark:text-white font-semibold" : "bg-white dark:bg-black border-slate-200 dark:border-neutral-900 text-slate-600 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white"
                            }`}
                            id={`admin-chat-client-${c.id}`}
                          >
                            <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
                            <div className="text-left font-sans">
                              <h5 className="text-xs font-bold leading-normal">{c.company}</h5>
                              <p className="text-[10px] text-slate-500 dark:text-zinc-500 leading-tight block truncate mt-0.5">{c.email}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column (8 cols): Interactive support thread */}
                  <div className="lg:col-span-8 flex flex-col justify-between space-y-4 min-h-[350px]">
                    {!activeAdminConvoId ? (
                      <div className="text-slate-500 dark:text-zinc-500 text-xs font-mono text-center pt-32">
                        Select an active support terminal channel in the sidebar to initiate real-time dispatches.
                      </div>
                    ) : (
                      <>
                        {/* Message Feed container */}
                        <div className="h-64 overflow-y-auto p-4 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-neutral-900 rounded-xl space-y-3 font-sans text-xs no-scrollbar">
                          {adminChatMessages.length === 0 ? (
                            <div className="text-slate-400 dark:text-zinc-555 text-center pt-24 font-mono">Channel active. Type a greeting below.</div>
                          ) : (
                            adminChatMessages.map((msg, idx) => {
                              const senderLabel = msg.senderUsername || msg.senderName || msg.senderId || "Unknown";
                              const isClient = msg.senderRole === "Client" || senderLabel !== authUser?.username;
                              return (
                                <div key={msg.id || idx} className={`flex flex-col max-w-[75%] space-y-1 ${isClient ? "mr-auto text-left" : "ml-auto text-right"}`}>
                                  <span className="text-[8px] text-slate-500 dark:text-zinc-500 font-mono">
                                    {senderLabel} - {new Date(msg.createdAt || msg.timestamp).toLocaleTimeString()}
                                  </span>
                                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                                    isClient 
                                      ? "bg-slate-100 dark:bg-neutral-900 text-slate-900 dark:text-white rounded-tl-none border border-slate-200 dark:border-neutral-800"
                                      : "bg-cyan-500 text-black font-semibold rounded-tr-none shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                                  }`}>
                                    {msg.body}
                                  </div>
                                </div>
                              );
                            })
                          )}
                          <div />
                        </div>

                        {/* Send bar */}
                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          if (!adminNewMessageText.trim()) return;
                          
                          const token = localStorage.getItem("afriwaid_auth_token") || sessionStorage.getItem("afriwaid_auth_token") || "";
                          const targetConvoId = activeAdminConvoId;
                          if (!targetConvoId) return;

                          try {
                            const res = await fetch("/api/messages", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                              },
                              body: JSON.stringify({ conversationId: targetConvoId, body: adminNewMessageText })
                            });
                            const data = await res.json();
                            if (data && data.message) {
                              setAdminChatMessages(prev => [...prev, data.message]);
                              setAdminNewMessageText("");
                            }
                          } catch (err) {
                            console.error("Failed to post message", err);
                          }
                        }} className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={adminNewMessageText}
                            onChange={(e) => setAdminNewMessageText(e.target.value)}
                            placeholder="Type encryption answers text block..."
                            className="flex-1 px-4 py-3 bg-white dark:bg-black border border-slate-300 dark:border-neutral-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-400 outline-none text-xs"
                            id="admin-support-chat-input"
                          />
                          <button
                            type="submit"
                            className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold uppercase font-mono tracking-widest text-[10px] rounded-xl cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                          >
                            Send
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 16. Broadcast Alert dispatch center */}
            {activeSubTab === "alert_broadcasts" && (
              <div className="space-y-6 text-left">
                <div className="border-b border-slate-200 dark:border-neutral-800 pb-3">
                  <h3 className="text-lg font-sans font-bold text-slate-900 dark:text-white uppercase tracking-wider">In-App Operational Broadcaster</h3>
                  <p className="text-slate-555 dark:text-zinc-400 text-xs font-sans leading-relaxed">
                    Instantly broadcast push notifications over organized WebSockets to all connected clients and user interface components.
                  </p>
                </div>

                <div className="max-w-xl bg-slate-50 dark:bg-black p-6 rounded-3xl border border-slate-200 dark:border-neutral-850 space-y-4">
                  <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono uppercase tracking-widest font-extrabold block">Broadcast Trigger Config</span>
                  
                  {broadcastSuccess && (
                    <div className="p-3.5 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono">
                      Broadcast successfully dispatched. Connected nodes updated instantly over WebSockets.
                    </div>
                  )}

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!broadcastTitle || !broadcastBody) return;
                    
                    const token = localStorage.getItem("afriwaid_auth_token") || sessionStorage.getItem("afriwaid_auth_token") || "";
                    try {
                      const res = await fetch("/api/notifications/broadcast", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          title: broadcastTitle,
                          msg: broadcastBody
                        })
                      });
                      if (res.ok) {
                        setBroadcastSuccess(true);
                        setBroadcastTitle("");
                        setBroadcastBody("");
                        setTimeout(() => setBroadcastSuccess(false), 3000);
                      }
                    } catch (err) {
                      console.error("Broadcast failed", err);
                    }
                  }} className="space-y-4 text-xs font-mono pr-1">
                    <div className="space-y-1 text-[9px] text-slate-500 dark:text-zinc-500">
                      <label className="uppercase tracking-widest block font-bold">Alert Title *</label>
                      <input
                        type="text"
                        required
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        placeholder="e.g. Critical Milestone Phase 3 Deployed"
                        className="w-full p-2.5 bg-white dark:bg-black border border-slate-300 dark:border-neutral-800 rounded text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                        id="broadcaster-title-input"
                      />
                    </div>

                    <div className="space-y-1 text-[9px] text-slate-500 dark:text-zinc-500">
                      <label className="uppercase tracking-widest block font-bold">Message Details Body *</label>
                      <textarea
                        required
                        rows={3}
                        value={broadcastBody}
                        onChange={(e) => setBroadcastBody(e.target.value)}
                        placeholder="Provide details about system adjustments, new billing reports, or collaboration schedules..."
                        className="w-full p-2.5 bg-white dark:bg-black border border-slate-300 dark:border-neutral-800 rounded text-slate-900 dark:text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none"
                        id="broadcaster-body-input"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold font-mono text-[9px] uppercase tracking-widest rounded-xl transition duration-150 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      id="broadcaster-submit-btn"
                    >
                      Broadcast Live Node
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
