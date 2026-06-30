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
import Login from "../../components/Login";
import Register from "../../components/Register";
import ForgotPassword from "../../components/ForgotPassword";
import ResetPassword from "../../components/ResetPassword";
import VerifyEmail from "../../components/VerifyEmail";
import { Project, Article, JournalEntry, CV, ClientProfile, Inquiry, TrackedAnalytics, ServiceOffer, MediaItem, HomepageStats, TechStackItem, Testimonial, TeamMember, CustomizationSettings } from "../../types";
import { AdminWorkspaceLayout } from "../../workspaces/admin/AdminWorkspaceLayout";
import { ClientWorkspaceLayout } from "../../workspaces/client/ClientWorkspaceLayout";
import { ModeratorWorkspaceLayout } from "../../workspaces/moderator/ModeratorWorkspaceLayout";
import { AuditorWorkspaceLayout } from "../../workspaces/auditor/AuditorWorkspaceLayout";
import ModeratorDashboard from "../../components/ModeratorDashboard";
import AuditorDashboard from "../../components/AuditorDashboard";
import DeveloperDashboard from "../../components/DeveloperDashboard";
import OperatorDashboard from "../../components/OperatorDashboard";
import ClientDashboard from "../../pages/client/DashboardPage";
import ClientProjects from "../../pages/client/ProjectsPage";
import ClientDeliverablesPage from "../../pages/client/DeliverablesPage";
import ClientApprovalsPage from "../../pages/client/ApprovalsPage";
import ClientInvoicesPage from "../../pages/client/InvoicesPage";
import ClientMeetingsPage from "../../pages/client/MeetingsPage";
import ClientMessagesPage from "../../pages/client/MessagesPage";
import ClientFilesPage from "../../pages/client/FilesPage";
import ClientTeamPage from "../../pages/client/TeamPage";
import ClientReportsPage from "../../pages/client/ReportsPage";
import ClientSettingsPage from "../../pages/client/SettingsPage";
import TimelinePage from "../../pages/client/TimelinePage";

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
  "Super Admin": "/admin",
  "Admin": "/admin",
  "Developer": "/developer",
  "Operator": "/operator",
  "Moderator": "/moderator",
  "Auditor": "/auditor",
  "Client": "/portal",
  "User": "/dashboard"
};

function getRedirectPathByRole(role: string): string {
  return ROLE_REDIRECTS[role] || "/";
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={getRedirectPathByRole(user.role)} replace />;
  }
  return <>{children}</>;
}

const ROLE_HIERARCHY: Record<string, string[]> = {
  "admin": ["Super Admin", "Admin"],
  "moderator": ["Super Admin", "Admin", "Moderator"],
  "auditor": ["Super Admin", "Admin", "Auditor"],
  "developer": ["Super Admin", "Admin", "Developer"],
  "operator": ["Super Admin", "Admin", "Operator"],
  "client": ["Super Admin", "Admin", "Client"],
  "user": ["Super Admin", "Admin", "User"],
};

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requiredRole) {
    const roleKey = requiredRole.toLowerCase();
    const allowedRoles = ROLE_HIERARCHY[roleKey] || [requiredRole];
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to={getRedirectPathByRole(user.role)} replace />;
    }
  }

  return <>{children}</>;
}

function AdminSection({ Component, ...props }: { Component: React.ComponentType<any> } & any) {
  return (
    <AdminWorkspaceLayout>
      <Component {...props} />
    </AdminWorkspaceLayout>
  );
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
      {/* Public Routes */}
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

      {/* Auth Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <div className="min-h-screen flex items-center justify-center p-4">
            <Login
              onNavigateToRegister={() => window.location.href = "/register"}
              onNavigateToForgot={() => window.location.href = "/forgot-password"}
              onLoginSuccess={() => window.location.href = user ? getRedirectPathByRole(user.role) : "/"}
            />
          </div>
        </PublicRoute>
      } />

      <Route path="/register" element={
        <PublicRoute>
          <div className="min-h-screen flex items-center justify-center p-4">
            <Register
              onNavigateToLogin={() => window.location.href = "/login"}
              onRegisterSuccess={() => window.location.href = "/login"}
            />
          </div>
        </PublicRoute>
      } />

      <Route path="/forgot-password" element={
        <PublicRoute>
          <div className="min-h-screen flex items-center justify-center p-4">
            <ForgotPassword
              onNavigateToLogin={() => window.location.href = "/login"}
              onNavigateToReset={(token) => window.location.href = `/reset-password?token=${token}`}
            />
          </div>
        </PublicRoute>
      } />

      <Route path="/reset-password" element={
        <PublicRoute>
          <div className="min-h-screen flex items-center justify-center p-4">
            <ResetPassword onNavigateToLogin={() => window.location.href = "/login"} />
          </div>
        </PublicRoute>
      } />

      <Route path="/verify-email" element={
        <PublicRoute>
          <div className="min-h-screen flex items-center justify-center p-4">
            <VerifyEmail onNavigateToLogin={() => window.location.href = "/login"} />
          </div>
        </PublicRoute>
      } />

      {/* User Dashboard */}
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="user">
          <div>User Dashboard</div>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
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

      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

      {/* Moderator Routes */}
      <Route path="/moderator" element={
        <ProtectedRoute requiredRole="moderator">
          <ModeratorWorkspaceLayout>
            <ModeratorDashboard clientProfiles={clients} inquiries={inquiries} />
          </ModeratorWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/moderator/*" element={<Navigate to="/moderator" replace />} />

      {/* Auditor Routes */}
      <Route path="/auditor" element={
        <ProtectedRoute requiredRole="auditor">
          <AuditorWorkspaceLayout>
            <AuditorDashboard clientProfiles={clients} />
          </AuditorWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/auditor/*" element={<Navigate to="/auditor" replace />} />

      {/* Developer Routes */}
      <Route path="/developer" element={
        <ProtectedRoute requiredRole="developer">
          <div className="p-6">
            <DeveloperDashboard clientProfiles={clients} />
          </div>
        </ProtectedRoute>
      } />

      <Route path="/developer/*" element={<Navigate to="/developer" replace />} />

      {/* Operator Routes */}
      <Route path="/operator" element={
        <ProtectedRoute requiredRole="operator">
          <div className="p-6">
            <OperatorDashboard clientProfiles={clients} />
          </div>
        </ProtectedRoute>
      } />

      <Route path="/operator/*" element={<Navigate to="/operator" replace />} />

      {/* Client Portal Routes */}
      <Route path="/portal" element={
        <ProtectedRoute requiredRole="client">
          <ClientWorkspaceLayout>
            <ClientDashboard />
          </ClientWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/portal/projects" element={
        <ProtectedRoute requiredRole="client">
          <ClientWorkspaceLayout>
            <ClientProjects />
          </ClientWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/portal/timeline" element={
        <ProtectedRoute requiredRole="client">
          <ClientWorkspaceLayout>
            <TimelinePage />
          </ClientWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/portal/deliverables" element={
        <ProtectedRoute requiredRole="client">
          <ClientWorkspaceLayout>
            <ClientDeliverablesPage />
          </ClientWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/portal/approvals" element={
        <ProtectedRoute requiredRole="client">
          <ClientWorkspaceLayout>
            <ClientApprovalsPage />
          </ClientWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/portal/invoices" element={
        <ProtectedRoute requiredRole="client">
          <ClientWorkspaceLayout>
            <ClientInvoicesPage />
          </ClientWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/portal/meetings" element={
        <ProtectedRoute requiredRole="client">
          <ClientWorkspaceLayout>
            <ClientMeetingsPage />
          </ClientWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/portal/messages" element={
        <ProtectedRoute requiredRole="client">
          <ClientWorkspaceLayout>
            <ClientMessagesPage />
          </ClientWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/portal/files" element={
        <ProtectedRoute requiredRole="client">
          <ClientWorkspaceLayout>
            <ClientFilesPage />
          </ClientWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/portal/team" element={
        <ProtectedRoute requiredRole="client">
          <ClientWorkspaceLayout>
            <ClientTeamPage />
          </ClientWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/portal/reports" element={
        <ProtectedRoute requiredRole="client">
          <ClientWorkspaceLayout>
            <ClientReportsPage />
          </ClientWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/portal/settings" element={
        <ProtectedRoute requiredRole="client">
          <ClientWorkspaceLayout>
            <ClientSettingsPage />
          </ClientWorkspaceLayout>
        </ProtectedRoute>
      } />

      <Route path="/portal/*" element={<Navigate to="/portal" replace />} />

      {/* Settings */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <SecuritySettings />
        </ProtectedRoute>
      } />

      {/* 404 Catch-all */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-slate-300 dark:text-zinc-700">404</h1>
            <p className="text-lg text-slate-500 dark:text-zinc-400 mt-2">Page not found</p>
            <a href="/" className="text-blue-500 hover:text-blue-600 mt-4 inline-block">Go Home</a>
          </div>
        </div>
      } />
    </Routes>
  );
}