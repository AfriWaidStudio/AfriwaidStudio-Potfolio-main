import { ReactNode } from "react";
import { 
  BarChart3, Folder, FileText, Check, BadgeDollarSign, MessageSquare, 
  ShieldCheck, Settings, Calendar, Users, Receipt, PieChart, FolderGit,
  Layers, Globe, LifeBuoy, HelpCircle
} from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  icon: typeof BarChart3;
  path: string;
  permissions?: string[];
  children?: NavigationChildItem[];
}

export interface NavigationChildItem {
  id: string;
  label: string;
  path: string;
  icon?: typeof BarChart3;
  permissions?: string[];
  badge?: number;
}

export const CLIENT_NAVIGATION: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    path: "/portal",
  },
  {
    id: "projects",
    label: "Projects",
    icon: Folder,
    path: "/portal/projects",
    children: [
      { id: "all", label: "All Projects", path: "/portal/projects" },
      { id: "active", label: "Active", path: "/portal/projects/active" },
      { id: "archived", label: "Archived", path: "/portal/projects/archived" },
      { id: "templates", label: "Templates", path: "/portal/projects/templates" },
      { id: "kanban", label: "Kanban Board", path: "/portal/projects/kanban" },
      { id: "calendar", label: "Calendar", path: "/portal/projects/calendar" },
      { id: "analytics", label: "Analytics", path: "/portal/projects/analytics" },
    ],
  },
  {
    id: "deliverables",
    label: "Deliverables",
    icon: FileText,
    path: "/portal/deliverables",
    children: [
      { id: "overview", label: "Overview", path: "/portal/deliverables" },
      { id: "pending", label: "Pending", path: "/portal/deliverables/pending", badge: 5 },
      { id: "in-progress", label: "In Progress", path: "/portal/deliverables/in-progress" },
      { id: "completed", label: "Completed", path: "/portal/deliverables/completed" },
      { id: "rejected", label: "Rejected", path: "/portal/deliverables/rejected" },
      { id: "history", label: "History", path: "/portal/deliverables/history" },
    ],
  },
  {
    id: "approvals",
    label: "Approvals",
    icon: Check,
    path: "/portal/approvals",
    children: [
      { id: "pending", label: "Pending Review", path: "/portal/approvals/pending", badge: 3 },
      { id: "approved", label: "Approved", path: "/portal/approvals/approved" },
      { id: "rejected", label: "Rejected", path: "/portal/approvals/rejected" },
    ],
  },
  {
    id: "invoices",
    label: "Invoices",
    icon: BadgeDollarSign,
    path: "/portal/invoices",
    children: [
      { id: "overview", label: "Overview", path: "/portal/invoices" },
      { id: "ledger", label: "Ledger Desk", path: "/portal/invoices/ledger" },
      { id: "receipts", label: "Receipts", path: "/portal/invoices/receipts" },
      { id: "payments", label: "Payments", path: "/portal/invoices/payments" },
    ],
  },
  {
    id: "meetings",
    label: "Meetings",
    icon: Calendar,
    path: "/portal/meetings",
    children: [
      { id: "upcoming", label: "Upcoming", path: "/portal/meetings/upcoming" },
      { id: "calendar", label: "Calendar", path: "/portal/meetings/calendar" },
      { id: "agenda", label: "Agenda", path: "/portal/meetings/agenda" },
      { id: "recordings", label: "Recordings", path: "/portal/meetings/recordings" },
    ],
  },
  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    path: "/portal/messages",
    children: [
      { id: "inbox", label: "Inbox", path: "/portal/messages/inbox", badge: 7 },
      { id: "unread", label: "Unread", path: "/portal/messages/unread" },
      { id: "channels", label: "Channels", path: "/portal/messages/channels" },
      { id: "files", label: "Files", path: "/portal/messages/files" },
      { id: "pinned", label: "Pinned", path: "/portal/messages/pinned" },
      { id: "search", label: "Search", path: "/portal/messages/search" },
    ],
  },
  {
    id: "files",
    label: "Files",
    icon: Folder,
    path: "/portal/files",
  },
  {
    id: "team",
    label: "Team",
    icon: Users,
    path: "/portal/team",
  },
  {
    id: "reports",
    label: "Reports",
    icon: PieChart,
    path: "/portal/reports",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/portal/settings",
    children: [
      { id: "profile", label: "Profile", path: "/portal/settings/profile" },
      { id: "notifications", label: "Notifications", path: "/portal/settings/notifications" },
      { id: "security", label: "Security", path: "/portal/settings/security" },
      { id: "sessions", label: "Sessions", path: "/portal/settings/sessions" },
      { id: "api-keys", label: "API Keys", path: "/portal/settings/api-keys" },
      { id: "appearance", label: "Appearance", path: "/portal/settings/appearance" },
      { id: "billing", label: "Billing", path: "/portal/settings/billing" },
      { id: "integrations", label: "Integrations", path: "/portal/settings/integrations" },
    ],
  },
];

export const getNavigationByPath = (path: string): { item: NavigationItem | null; child: NavigationChildItem | null } => {
  const normalizedPath = path.replace(/\/$/, "");
  
  for (const item of CLIENT_NAVIGATION) {
    if (item.path === normalizedPath) {
      return { item, child: null };
    }
    if (item.children) {
      for (const child of item.children) {
        if (child.path === normalizedPath) {
          return { item, child };
        }
      }
    }
  }
  return { item: null, child: null };
};