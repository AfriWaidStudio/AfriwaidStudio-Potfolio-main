export interface CaseStudy {
  challenge: string;
  goal: string;
  research: string;
  designProcess: string;
  developmentProcess: string;
  results: string;
  lessonsLearned: string;
}

export interface Project {
  id: string;
  name: string;
  category: "Websites" | "SaaS" | "AI" | "KI" | "Mobile Apps" | "Design" | "Writing" | "Media" | "Research";
  coverImage: string;
  description: string;
  longSummary?: string;
  technologiesUsed: string[];
  problemSolved: string;
  features: string[];
  screenshots?: string[];
  videoDemo?: string; // Embed link or placeholder
  liveUrl?: string;
  gitHubUrl?: string;
  projectStatus: "Planning" | "In Development" | "QA" | "Active" | "Completed" | "Maintained";
  completionDate: string;
  tags: string[];
  caseStudy?: CaseStudy;
  views: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  images?: string[];
  links?: { label: string; url: string }[];
  category: "deployment" | "update" | "design" | "article" | "ai";
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string; // Markdown or plain text
  coverImage: string;
  category: "Articles" | "News" | "Research" | "Opinions" | "Guides" | "Case Studies";
  tags: string[];
  readingTime: string;
  date: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  views: number;
}

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  category: "Videos" | "Reels" | "Motion Graphics" | "Interviews" | "Productions";
  duration: string;
  thumbnail: string;
  externalLink: string;
  views: number;
}

export interface ServiceOffer {
  id: string;
  name: string;
  description: string;
  category: "Software Development" | "AI Solutions" | "KI Systems" | "Logo Design" | "Branding" | "Video Production" | "Copywriting" | "Consulting";
  deliverables: string[];
  process: string[];
  estimatedTimeline: string;
  portfolioExamples: { name: string; projectId?: string }[];
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface CV {
  id: string;
  slug: string; // e.g. "software-engineer"
  name: string;
  title: string;
  summary: string;
  skills: { category: string; list: string[] }[];
  experience: WorkExperience[];
  education: { institution: string; degree: string; period: string }[];
  certifications: string[];
  portfolioLinks: { label: string; url: string }[];
  isPublished: boolean;
  downloads: number;
}

export interface Deliverable {
  id: string;
  name: string;
  description: string;
  status: "pending" | "completed" | "approved";
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
}

export interface Proposal {
  id: string;
  title: string;
  date: string;
  value: string;
  status: "Under Review" | "Accepted" | "Revised";
  pdfUrl?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: string;
  status: "Paid" | "Unpaid" | "Overdue";
}

export interface ClientProgressLog {
  date: string;
  title: string;
  phase: "Research" | "Design" | "Development" | "Testing" | "Launch" | "Complete";
  status: "completed" | "active" | "planned";
}

export interface ClientProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  assignedProjectName: string;
  projectProgress: number; // 0 to 100
  deliverables: Deliverable[];
  proposals: Proposal[];
  invoices: Invoice[];
  progressLog: ClientProgressLog[];
  feedback: string[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  organization: string;
  message: string;
  type: "contact" | "service" | "collaboration" | "partnership";
  serviceCategory?: string;
  date: string;
  status: "new" | "reviewed" | "archived";
}

export interface TrackedAnalytics {
  visitorsLast30Days: number;
  totalViews: number;
  projectDownloads: number;
  contactCount: number;
  pageViews: { path: string; count: number }[];
  topProjects: { name: string; views: number }[];
  topArticles: { title: string; views: number }[];
}

export interface HomepageStats {
  projectsCompleted: string | number;
  applicationsBuilt: string | number;
  aiSystemsDeveloped: string | number;
  articlesPublished: string | number;
  brandsCreated: string | number;
  videosProduced: string | number;
  clientsServed: string | number;
}

export interface ConsultationCard {
  id: string;
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  targetTab: "Services" | "Projects" | "Build Journal" | "AI Lab" | "Client Access" | "Contact" | "Media" | "Publishing";
  systemGenerated?: boolean;
}

export interface CustomizationSettings {
  appName: string;
  appNickname: string;
  tagline: string;
  heroHeadline: string;
  heroSubtitle: string;
  accentColor: "cyan" | "amber" | "emerald" | "indigo" | "rose" | "violet";
  primaryCtaText: string;
  secondaryCtaText: string;
  showAILab: boolean;
  showJournal: boolean;
  showMedia: boolean;
  showWriting: boolean;
  useMonochromeTerminalTheme: boolean;
  footerDescription: string;
  logoType?: "text" | "image";
  logoText?: string;
  logoUrl?: string;
  statsSubtitle?: string;
  statsTitle?: string;
  techSubtitle?: string;
  techTitle?: string;
  techDescription?: string;
  aboutTagline?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutMissionTitle?: string;
  aboutMissionDesc?: string;
  aboutVisionTitle?: string;
  aboutVisionDesc?: string;
  aboutPhilosophyTitle?: string;
  aboutPhilosophyDesc?: string;
  servicesTagline?: string;
  servicesTitle?: string;
  servicesDescription?: string;
  projectsTitle?: string;
  projectsSubtitle?: string;
  cvTitle?: string;
  cvSubtitle?: string;
  aiLabTagline?: string;
  aiLabTitle?: string;
  aiLabDescription?: string;
  writingTitle?: string;
  writingSubtitle?: string;
  mediaTitle?: string;
  mediaSubtitle?: string;
  journalTagline?: string;
  journalTitle?: string;
  journalDescription?: string;
  founderPortraitUrl?: string;
  faviconUrl?: string;
  googleAnalyticsId?: string;
  consultationCards?: ConsultationCard[];
}

export interface TechStackItem {
  id: string;
  badge: string;
  name: string;
  description: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientCompany: string;
  clientRole: string;
  rating: number;
  text: string;
  avatar: string;
  category: string;
  isPublished: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  teamType: "Creative Node" | "Intelligence Node" | "Development Team" | "Management Core";
  bio: string;
  avatar: string;
  skills: string[];
  expertiseTags?: string[];
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export const OFFICIAL_ROLES = [
  "Super Admin",
  "Admin",
  "Moderator",
  "Developer",
  "Operator",
  "Auditor",
  "Team Member",
  "Client",
  "User"
] as const;

export type UserRole = typeof OFFICIAL_ROLES[number];

export interface Permission {
  id: string;
  module: string;
  action: string;
  description: string;
}

export interface Role {
  id: string;
  name: UserRole;
  slug: string;
  description: string;
  permissions: string[]; // List of permission IDs
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  status: "active" | "suspended" | "pending";
  createdAt: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  username?: string;
  ipAddress: string;
  action: string;
  module: string;
  status: "success" | "failure";
  details: string;
  timestamp: string;
}
