import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import AdminDashboard from "../../components/AdminDashboard";
import SecuritySettings from "../../components/SecuritySettings";
import { Project, Article, JournalEntry, CV, ClientProfile, Inquiry, TrackedAnalytics, ServiceOffer, MediaItem, HomepageStats, TechStackItem, Testimonial, TeamMember, CustomizationSettings } from "../../types";
import { AdminWorkspaceLayout } from "../../workspaces/admin/AdminWorkspaceLayout";
import { ClientWorkspaceLayout } from "../../workspaces/client/ClientWorkspaceLayout";
import { ModeratorWorkspaceLayout } from "../../workspaces/moderator/ModeratorWorkspaceLayout";
import { AuditorWorkspaceLayout } from "../../workspaces/auditor/AuditorWorkspaceLayout";
import ModeratorDashboard from "../../components/ModeratorDashboard";
import AuditorDashboard from "../../components/AuditorDashboard";
import DeveloperDashboard from "../../components/DeveloperDashboard";
import OperatorDashboard from "../../components/OperatorDashboard";

interface AppRouterProps {
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
  onViewIncrement: (id: string) => void;
  onReadIncrement: (id: string) => void;
  onPlayIncrement: (id: string) => void;
  onDownloadIncrement: (id: string) => void;
  onFeedbackAdd: (id: string, text: string) => void;
  onInquirySubmitted: (inq: Inquiry) => void;
  wsSocket?: WebSocket | null;
}

const ROLE_REDIRECTS: Record<string, string> = {
  "Super Admin": "/admin/dashboard",
  "Admin": "/admin",
  "Developer": "/developer",
  "Operator": "/operator",
  "Moderator": "/moderator",
  "Auditor": "/auditor",
  "Client": "/client",
  "User": "/dashboard"
};

function getRedirectPathByRole(role: string): string {
  return ROLE_REDIRECTS[role] || "/studio";
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={getRedirectPathByRole(user.role)} replace />;
  }
  return <>{children}</>;
}

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  if (requiredRole && user.role !== requiredRole && !(user.role === "Super Admin" && requiredRole === "admin")) {
    return <Navigate to={getRedirectPathByRole(user.role)} replace />;
  }
  
  return <>{children}</>;
}

export function AppRouter({
  projects, articles, journal, cvs, clients, inquiries, analytics, services, media,
  homepageStats, techStack, testimonials, teamMembers, customization,
  onViewIncrement, onReadIncrement, onPlayIncrement, onDownloadIncrement,
  onFeedbackAdd, onInquirySubmitted, wsSocket
}: AppRouterProps) {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        <PublicRoute>
          <div className="space-y-16 py-4 md:py-8">
            <h1 className="text-4xl md:text-7xl font-bold text-center">{customization.heroHeadline || "AFRIWAID STUDIO"}</h1>
            <p className="text-slate-600 text-center max-w-3xl mx-auto">
              {customization.heroSubtitle || "A world-class technology, portfolio, AI innovation, and client management node."}
            </p>
          </div>
        </PublicRoute>
      } />
      
      <Route path="/login" element={
        <PublicRoute>
          <div>Login Page</div>
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <div>Register Page</div>
        </PublicRoute>
      } />
      
      <Route path="/studio" element={
        <ProtectedRoute>
          <div>Studio Dashboard</div>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <div>User Dashboard</div>
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminWorkspaceLayout>
            <AdminDashboard
              projects={projects} articles={articles} journal={journal} cvs={cvs}
              clients={clients} inquiries={inquiries} analytics={analytics} services={services}
              media={media} techStack={techStack} testimonials={testimonials} teamMembers={teamMembers}
              customization={customization}
              onUpdateCustomization={() => {}}
              homepageStats={homepageStats}
              onAddProject={() => {}} onUpdateProject={() => {}} onDeleteProject={() => {}}
              onAddArticle={() => {}} onDeleteArticle={() => {}}
              onAddJournal={() => {}} onToggleCV={() => {}} onUpdateCV={() => {}} onAddCV={() => {}} onDeleteCV={() => {}}
              onAddMedia={() => {}} onDeleteMedia={() => {}} onUpdateTechStack={() => {}}
              onAddTestimonial={() => {}} onDeleteTestimonial={() => {}}
              onAddTeamMember={() => {}} onDeleteTeamMember={() => {}} onUpdateTeamMember={() => {}}
              onAddService={() => {}} onUpdateService={() => {}} onDeleteService={() => {}}
              onUpdateInquiryStatus={() => {}} onUpdateHomepageStats={() => {}}
            />
          </AdminWorkspaceLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requiredRole="admin">
          <AdminWorkspaceLayout>
            <AdminDashboard
              projects={projects} articles={articles} journal={journal} cvs={cvs}
              clients={clients} inquiries={inquiries} analytics={analytics} services={services}
              media={media} techStack={techStack} testimonials={testimonials} teamMembers={teamMembers}
              customization={customization}
              onUpdateCustomization={() => {}}
              homepageStats={homepageStats}
              onAddProject={() => {}} onUpdateProject={() => {}} onDeleteProject={() => {}}
              onAddArticle={() => {}} onDeleteArticle={() => {}}
              onAddJournal={() => {}} onToggleCV={() => {}} onUpdateCV={() => {}} onAddCV={() => {}} onDeleteCV={() => {}}
              onAddMedia={() => {}} onDeleteMedia={() => {}} onUpdateTechStack={() => {}}
              onAddTestimonial={() => {}} onDeleteTestimonial={() => {}}
              onAddTeamMember={() => {}} onDeleteTeamMember={() => {}} onUpdateTeamMember={() => {}}
              onAddService={() => {}} onUpdateService={() => {}} onDeleteService={() => {}}
              onUpdateInquiryStatus={() => {}} onUpdateHomepageStats={() => {}}
            />
          </AdminWorkspaceLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/moderator" element={
        <ProtectedRoute requiredRole="moderator">
          <ModeratorWorkspaceLayout>
            <ModeratorDashboard clientProfiles={clients} inquiries={inquiries} />
          </ModeratorWorkspaceLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/auditor" element={
        <ProtectedRoute requiredRole="auditor">
          <AuditorWorkspaceLayout>
            <AuditorDashboard clientProfiles={clients} />
          </AuditorWorkspaceLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/developer" element={
        <ProtectedRoute requiredRole="developer">
          <div className="p-6">
            <DeveloperDashboard clientProfiles={clients} />
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/operator" element={
        <ProtectedRoute requiredRole="operator">
          <div className="p-6">
            <OperatorDashboard clientProfiles={clients} />
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <SecuritySettings />
        </ProtectedRoute>
      } />
      
      <Route path="/news" element={<div>News Page</div>} />
      <Route path="/news/:slug" element={<div>News Article</div>} />
    </Routes>
  );
}