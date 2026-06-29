import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import AboutUs from "../../components/AboutUs";
import FounderProfile from "../../components/FounderProfile";
import AILab from "../../components/AILab";
import CVCenter from "../../components/CVCenter";
import MediaHub from "../../components/MediaHub";
import ProjectsPage from "../../components/ProjectsPage";
import ServicesPage from "../../components/ServicesPage";
import WritingHub from "../../components/WritingHub";
import BuildJournal from "../../components/BuildJournal";
import ContactForm from "../../components/ContactForm";
import ClientPortal from "../../components/ClientPortal";
import AdminDashboard from "../../components/AdminDashboard";
import SecuritySettings from "../../components/SecuritySettings";
import { Project, Article, JournalEntry, CV, ClientProfile, Inquiry, TrackedAnalytics, ServiceOffer, MediaItem, HomepageStats, TechStackItem, Testimonial, TeamMember, CustomizationSettings } from "../../types";

export type AppTab = 
  | "Home" 
  | "Projects" 
  | "Services" 
  | "Build Journal" 
  | "AI Lab" 
  | "Publishing" 
  | "Media" 
  | "Resumé CV" 
  | "Founder Profile" 
  | "Company Profile" 
  | "Client Access" 
  | "Admin Central" 
  | "Security Settings" 
  | "Contact";

interface AppRouterProps {
  activeTab: AppTab;
  projects: Project[];
  articles: Article[];
  journal: JournalEntry[];
  cvs: CV[];
  clients: ClientProfile[];
  inquiries: Inquiry[];
  analytics: TrackedAnalytics | null;
  services: ServiceOffer[];
  media: MediaItem[];
  homepageStats: HomepageStats | null;
  techStack: TechStackItem[];
  testimonials: Testimonial[];
  teamMembers: TeamMember[];
  customization: CustomizationSettings;
  onNavigate: (tab: AppTab) => void;
  onViewIncrement: (id: string) => void;
  onReadIncrement: (id: string) => void;
  onPlayIncrement: (id: string) => void;
  onDownloadIncrement: (id: string) => void;
  onFeedbackAdd: (id: string, text: string) => void;
  onInquirySubmitted: (inq: Inquiry) => void;
  wsSocket?: WebSocket | null;
}

export function AppRouter({
  activeTab,
  projects,
  articles,
  journal,
  cvs,
  clients,
  inquiries,
  analytics,
  services,
  media,
  homepageStats,
  techStack,
  testimonials,
  teamMembers,
  customization,
  onNavigate,
  onViewIncrement,
  onReadIncrement,
  onPlayIncrement,
  onDownloadIncrement,
  onFeedbackAdd,
  onInquirySubmitted,
  wsSocket,
}: AppRouterProps) {
  const { user, logout } = useAuth();

  if (activeTab === "Client Access" && user) {
    return <ClientPortal clientProfiles={clients} onFeedbackAdd={onFeedbackAdd} wsSocket={wsSocket} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {activeTab === "Home" && (
        <div className="space-y-16 py-4 md:py-8">
          <h1 className="text-4xl md:text-7xl font-bold text-center">{customization.heroHeadline || "AFRIWAID STUDIO"}</h1>
          <p className="text-slate-600 text-center max-w-3xl mx-auto">
            {customization.heroSubtitle || "A world-class technology, portfolio, AI innovation, and client management node."}
          </p>
        </div>
      )}
      
      {activeTab === "Projects" && (
        <ProjectsPage projects={projects} onViewIncrement={onViewIncrement} customization={customization} />
      )}
      
      {activeTab === "Services" && (
        <ServicesPage services={services} customization={customization} onSelectInquiryCategory={() => {}} onNavigateToTab={() => {}} />
      )}
      
      {activeTab === "Build Journal" && (
        <BuildJournal entries={journal} customization={customization} />
      )}
      
      {activeTab === "AI Lab" && <AILab customization={customization} />}
      
      {activeTab === "Publishing" && (
        <WritingHub articles={articles} onReadIncrement={onReadIncrement} customization={customization} />
      )}
      
      {activeTab === "Media" && (
        <MediaHub mediaItems={media} onPlayIncrement={onPlayIncrement} customization={customization} />
      )}
      
      {activeTab === "Resumé CV" && (
        <CVCenter cvs={cvs} onDownloadIncrement={onDownloadIncrement} customization={customization} />
      )}
      
      {activeTab === "Founder Profile" && (
        <FounderProfile cvs={cvs} onDownloadIncrement={onDownloadIncrement} onContactClick={() => onNavigate("Services")} />
      )}
      
      {activeTab === "Company Profile" && (
        <AboutUs testimonials={testimonials} teamMembers={teamMembers} customization={customization} />
      )}
      
      {activeTab === "Admin Central" && user && (user.role === "Super Admin" || user.role === "Admin") && (
        <AdminDashboard
          projects={projects}
          articles={articles}
          journal={journal}
          cvs={cvs}
          clients={clients}
          inquiries={inquiries}
          analytics={analytics || { 
            visitorsLast30Days: 0, 
            totalViews: 0, 
            projectDownloads: 0, 
            contactCount: 0, 
            pageViews: [],
            topProjects: [],
            topArticles: []
          }}
          services={services}
          media={media}
          techStack={techStack}
          testimonials={testimonials}
          teamMembers={teamMembers}
          customization={customization}
          onUpdateCustomization={() => {}}
          homepageStats={homepageStats || {
            projectsCompleted: 0,
            applicationsBuilt: 0,
            aiSystemsDeveloped: 0,
            articlesPublished: 0,
            brandsCreated: 0,
            videosProduced: 0,
            clientsServed: 0
          }}
          onAddProject={() => {}}
          onUpdateProject={() => {}}
          onDeleteProject={() => {}}
          onAddArticle={() => {}}
          onDeleteArticle={() => {}}
          onAddJournal={() => {}}
          onToggleCV={() => {}}
          onUpdateCV={() => {}}
          onAddCV={() => {}}
          onDeleteCV={() => {}}
          onAddMedia={() => {}}
          onDeleteMedia={() => {}}
          onUpdateTechStack={() => {}}
          onAddTestimonial={() => {}}
          onDeleteTestimonial={() => {}}
          onAddTeamMember={() => {}}
          onDeleteTeamMember={() => {}}
          onUpdateTeamMember={() => {}}
          onAddService={() => {}}
          onUpdateService={() => {}}
          onDeleteService={() => {}}
          onUpdateInquiryStatus={() => {}}
          onUpdateHomepageStats={() => {}}
        />
      )}
      
      {activeTab === "Security Settings" && user && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <SecuritySettings />
        </div>
      )}
      
      {activeTab === "Contact" && (
        <div className="max-w-4xl mx-auto py-10">
          <ContactForm onInquirySubmitted={onInquirySubmitted} />
        </div>
      )}
    </div>
  );
}