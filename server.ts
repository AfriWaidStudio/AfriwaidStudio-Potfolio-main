import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import bcrypt from "bcrypt";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { WebSocketServer, WebSocket } from "ws";

dotenv.config();

const DATA_FILE = path.join(process.cwd(), "data-store.json");
const SALT_ROUNDS = 12;
const IS_PRODUCTION_RUNTIME = process.env.NODE_ENV === "production" || process.argv.includes("--production");
const OFFICIAL_ROLES = [
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

type OfficialRole = typeof OFFICIAL_ROLES[number];

function isOfficialRole(role: string): role is OfficialRole {
  return (OFFICIAL_ROLES as readonly string[]).includes(role);
}

function mergeOfficialRoles(existing: any[] | undefined): any[] {
  const roles = Array.isArray(existing) ? [...existing] : [];
  DEFAULT_ROLES.forEach((defaultRole) => {
    const current = roles.find((role) => role.name === defaultRole.name);
    if (!current) {
      roles.push(defaultRole);
    } else {
      current.slug = current.slug || defaultRole.slug;
      current.description = current.description || defaultRole.description;
      current.permissions = Array.isArray(current.permissions) && current.permissions.length > 0
        ? current.permissions
        : defaultRole.permissions;
    }
  });
  return roles.filter((role) => isOfficialRole(role.name));
}

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, SALT_ROUNDS);
}

function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

function isPasswordBcryptHash(hash: string): boolean {
  return hash.startsWith("$2b$") || hash.startsWith("$2a$") || hash.startsWith("$2y$");
}

// Default Databases Seeding for Dynamic RBAC
const DEFAULT_PERMISSIONS = [
  { id: "p-1", module: "users", action: "create", description: "Create new platform users" },
  { id: "p-2", module: "users", action: "edit", description: "Modify user accounts and status" },
  { id: "p-3", module: "users", action: "delete", description: "Permanently delete user accounts" },
  { id: "p-4", module: "users", action: "view", description: "View list of platform users" },
  { id: "p-5", module: "projects", action: "create", description: "Initiate and publish showcase projects" },
  { id: "p-6", module: "projects", action: "edit", description: "Update project artifacts and statuses" },
  { id: "p-7", module: "projects", action: "delete", description: "Remove projects from registry" },
  { id: "p-8", module: "chat", action: "send", description: "Dispatch portal chat messages" },
  { id: "p-9", module: "chat", action: "manage", description: "Configure system chat channels and groups" },
  { id: "p-10", module: "invoice", action: "view", description: "Observe and download billing invoices" },
  { id: "p-11", module: "invoice", action: "manage", description: "Generate, edit, or delete client invoices" },
  { id: "p-12", module: "system", action: "monitoring", description: "Access server operational telemetry and logs" },
  { id: "p-13", module: "system", action: "settings", description: "Alter core site metadata and modules configuration" }
];

const DEFAULT_ROLES = [
  { id: "r-1", name: "Super Admin", slug: "super-admin", description: "Absolute control over entire system.", permissions: ["p-1", "p-2", "p-3", "p-4", "p-5", "p-6", "p-7", "p-8", "p-9", "p-10", "p-11", "p-12", "p-13"] },
  { id: "r-2", name: "Admin", slug: "admin", description: "Administrative platform operations without owner override.", permissions: ["p-1", "p-2", "p-4", "p-5", "p-6", "p-8", "p-9", "p-10", "p-11", "p-12"] },
  { id: "r-3", name: "Moderator", slug: "moderator", description: "Moderates workspace communication and user support.", permissions: ["p-4", "p-8", "p-9", "p-10"] },
  { id: "r-4", name: "Developer", slug: "developer", description: "Developer access to assigned projects and diagnostics.", permissions: ["p-5", "p-6", "p-8", "p-10", "p-12"] },
  { id: "r-5", name: "Operator", slug: "operator", description: "Project operations and deliverable management.", permissions: ["p-5", "p-6", "p-8", "p-10"] },
  { id: "r-6", name: "Auditor", slug: "auditor", description: "Read-only compliance and audit visibility.", permissions: ["p-4", "p-10", "p-12"] },
  { id: "r-7", name: "Team Member", slug: "team-member", description: "Team member for client communication and project support.", permissions: ["p-5", "p-6", "p-8", "p-9", "p-10"] },
  { id: "r-8", name: "Client", slug: "client", description: "Client partner with access to assigned workspaces.", permissions: ["p-8", "p-10"] },
  { id: "r-9", name: "User", slug: "user", description: "Standard portal user.", permissions: ["p-8", "p-10"] }
];

const DEFAULT_USERS = [
  {
    id: "u-1",
    firstName: "Waid",
    lastName: "Soko",
    username: "alasiri_waid",
    email: "waidsoko@gmail.com",
    passwordHash: hashPassword(process.env.DEFAULT_ADMIN_PASSWORD || crypto.randomBytes(16).toString("hex")),
    role: "Super Admin",
    isEmailVerified: true,
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "u-2",
    firstName: "Aero",
    lastName: "Logistics",
    username: "aeroglobal",
    email: "logistics@aeroglobal.com",
    passwordHash: hashPassword("waidpulse"),
    role: "Client",
    isEmailVerified: true,
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "u-3",
    firstName: "Demo",
    lastName: "Client",
    username: "demo_client",
    email: "demo@afriwaid.com",
    passwordHash: hashPassword("demo123"),
    role: "User",
    isEmailVerified: true,
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "u-4",
    firstName: "Team",
    lastName: "Member",
    username: "team_member",
    email: "team@afriwaid.com",
    passwordHash: hashPassword("team123"),
    role: "Team Member",
    isEmailVerified: true,
    status: "active",
    createdAt: new Date().toISOString()
  },
  {
    id: "u-5",
    firstName: "User",
    lastName: "Demo",
    username: "user_demo",
    email: "user@afriwaid.com",
    passwordHash: hashPassword("user123"),
    role: "User",
    isEmailVerified: true,
    status: "active",
    createdAt: new Date().toISOString()
  }
];

// Database Schema Extension for Stage 2 Features
interface DatabaseSchema {
  users: any[];
  roles: any[];
  permissions: any[];
  sessions: any[];
  password_resets: any[];
  email_verifications: any[];
  login_attempts: any[];
  audit_logs: any[];
  clients: any[];
  projects: any[];
  project_members: any[];
  milestones: any[];
  tasks: any[];
  files: any[];
  conversations: any[];
  conversation_participants: any[];
  messages: any[];
  notifications: any[];
  feedback: any[];
  deliverables: any[];
  project_activities: any[];
  invoices: any[];
  team_members: any[];
}

const INITIAL_CLIENTS = [
  {
    id: "cl-1",
    name: "AeroGlobal Logistics",
    company: "AeroGlobal Inc.",
    email: "logistics@aeroglobal.com",
    userId: "u-2",
    assignedProjectName: "WaidPulse AI Integrations",
    projectProgress: 65,
    archived: false,
    createdAt: "2026-06-01T08:00:00.000Z"
  }
];

const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    name: "WaidPulse AI Integrations",
    category: "AI Middleware",
    coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
    description: "An advanced orchestration middleware that connects enterprise databases with autonomous LLM agents to automate cross-departmental operations.",
    technologiesUsed: ["React", "Express", "@google/genai", "TypeScript", "Tailwind CSS"],
    problemSolved: "Enterprise companies struggle to allow AI agents to safely access cross-departmental operations.",
    features: ["Dynamic Multi-Agent Orchestration", "Secure SQL metadata pipelines", "Unified feedback routing"],
    projectStatus: "In Development",
    completionDate: "2026-07-05",
    tags: ["Agentic AI", "Enterprise", "Secure Core"],
    clientProgPercent: 65,
    clientId: "cl-1",
    createdAt: "2026-06-01T08:30:00.000Z"
  }
];

const INITIAL_PROJECT_MEMBERS = [
  { id: "pm-1", projectId: "proj-1", userId: "u-2", role: "Client" },
  { id: "pm-2", projectId: "proj-1", userId: "u-1", role: "Super Admin" },
  { id: "pm-3", projectId: "proj-1", userId: "u-9", role: "Team Member" },
  { id: "pm-4", projectId: "proj-1", userId: "u-7", role: "Developer" }
];

const INITIAL_MILESTONES = [
  { id: "mils-1", projectId: "proj-1", title: "Technical Discovery", phase: "Research", status: "completed", date: "2026-06-01" },
  { id: "mils-2", projectId: "proj-1", title: "API Safe Guard Architecture Draft", phase: "Design", status: "completed", date: "2026-06-05" },
  { id: "mils-3", projectId: "proj-1", title: "Middleware Core Module Integration", phase: "Development", status: "active", date: "2026-06-10" },
  { id: "mils-4", projectId: "proj-1", title: "Staging Pipeline Load Testing", phase: "Testing", status: "planned", date: "2026-06-25" },
  { id: "mils-5", projectId: "proj-1", title: "System Hot-Deploy Deployment", phase: "Launch", status: "planned", date: "2026-07-05" }
];

const INITIAL_TASKS = [
  { id: "task-1", projectId: "proj-1", milestoneId: "mils-3", title: "Integrate database filters", desc: "Set up security gateway filters for model interactions.", status: "completed", assignee: "u-1" },
  { id: "task-2", projectId: "proj-1", milestoneId: "mils-3", title: "Configure Gemini tool specs", desc: "Build strictly schema-bound type constraints.", status: "active", assignee: "u-1" },
  { id: "task-3", projectId: "proj-1", milestoneId: "mils-4", title: "Verify edge latency", desc: "Test query latency bottlenecks on Cloud Run.", status: "planned", assignee: "u-1" }
];

const INITIAL_FILES = [
  { id: "file-1", projectId: "proj-1", name: "Requirements_Blueprint.pdf", size: "2.4 MB", uploadedBy: "u-1", category: "Documents", tags: ["Spec", "Discovery"], version: 1, uploadedAt: "2026-06-02T11:00:00.000Z" },
  { id: "file-2", projectId: "proj-1", name: "UX_Interactive_Map.fig", size: "15.8 MB", uploadedBy: "u-1", category: "Design", tags: ["Mockup", "Figma"], version: 2, uploadedAt: "2026-06-06T14:20:00.000Z" },
  { id: "file-3", projectId: "proj-1", name: "WaidPulse_Alpha_Core.zip", size: "4.1 MB", uploadedBy: "u-1", category: "Source Code", tags: ["Build", "Archived"], version: 1, uploadedAt: "2026-06-11T12:00:00.000Z" }
];

const INITIAL_CONVERSATIONS = [
  { id: "conv-1", name: "AeroGlobal ↔ AfriWaid Core Team", type: "support", projectId: "proj-1" },
  { id: "conv-proj-general", name: "General Channel", type: "channel", projectId: "proj-1", category: "General" },
  { id: "conv-proj-files", name: "Files Sync Channel", type: "channel", projectId: "proj-1", category: "Files" },
  { id: "conv-proj-payments", name: "Payments / Billing Support", type: "channel", projectId: "proj-1", category: "Payments" },
  { id: "conv-proj-feedback", name: "Deliverables / Client Feedback", type: "channel", projectId: "proj-1", category: "Feedback" },
  { id: "conv-proj-support", name: "Developer Support Desk", type: "channel", projectId: "proj-1", category: "Support" },
  { id: "conv-team-internal", name: "Internal Engineering Node", type: "group" }
];

const INITIAL_CONVERSATION_PARTICIPANTS = [
  { id: "cp-1", conversationId: "conv-1", userId: "u-1" },
  { id: "cp-2", conversationId: "conv-1", userId: "u-2" },
  { id: "cp-3", conversationId: "conv-proj-general", userId: "u-1" },
  { id: "cp-4", conversationId: "conv-proj-general", userId: "u-2" },
  { id: "cp-5", conversationId: "conv-proj-files", userId: "u-1" },
  { id: "cp-6", conversationId: "conv-proj-files", userId: "u-2" },
  { id: "cp-7", conversationId: "conv-proj-payments", userId: "u-1" },
  { id: "cp-8", conversationId: "conv-proj-payments", userId: "u-2" },
  { id: "cp-9", conversationId: "conv-proj-feedback", userId: "u-1" },
  { id: "cp-10", conversationId: "conv-proj-feedback", userId: "u-2" },
  { id: "cp-11", conversationId: "conv-proj-support", userId: "u-1" },
  { id: "cp-12", conversationId: "conv-proj-support", userId: "u-2" },
  { id: "cp-13", conversationId: "conv-team-internal", userId: "u-1" },
  { id: "cp-14", conversationId: "conv-1", userId: "u-9" },
  { id: "cp-15", conversationId: "conv-proj-general", userId: "u-9" },
  { id: "cp-16", conversationId: "conv-proj-support", userId: "u-9" }
];

const INITIAL_MESSAGES = [
  { id: "msg-1", conversationId: "conv-1", senderId: "u-1", body: "Hello AeroGlobal Logistics! Welcome to your secure AfriWaid Workspace. We have loaded your requirements draft files.", timestamp: "2026-06-12T10:00:00.000Z", readBy: ["u-2"], pinned: true, reactions: [] },
  { id: "msg-2", conversationId: "conv-1", senderId: "u-2", body: "Thank you, Waid! The node tracking system looks extremely clear. I scanned the requirements and everything tracks perfectly.", timestamp: "2026-06-12T10:05:00.000Z", readBy: ["u-1"], reactions: [{ userId: "u-1", emoji: "👍" }] },
  { id: "msg-3", conversationId: "conv-1", senderId: "u-1", body: "Splendid! We completed the design phase and have started the core middleware integration. Feel free to monitor milestones directly.", timestamp: "2026-06-12T10:10:00.000Z", readBy: ["u-2"], reactions: [] }
];

const INITIAL_NOTIFICATIONS = [
  { id: "nt-1", userId: "u-2", title: "New Deliverable Completed", msg: "AeroGlobal UX Interactive Map has been compiled and is ready for client review.", category: "deliverable", read: false, createdAt: "2026-06-14T05:00:00.000Z" },
  { id: "nt-2", userId: "u-2", title: "Milestone Update", msg: "Middleware Core Module Integration phase is now ACTIVE.", category: "milestone", read: false, createdAt: "2026-06-14T05:15:00.000Z" },
  { id: "nt-3", userId: "u-2", title: "New Invoice Issued", msg: "Invoice INV-2026-088 of $30,000 USD for Phase 2 integration has been released.", category: "invoice", read: true, createdAt: "2026-06-12T08:00:00.000Z" }
];

const INITIAL_FEEDBACK = [
  { id: "fb-1", projectId: "proj-1", clientId: "cl-1", text: "The node tracking mockups look extremely clear. Our compliance directors immediately understood how the model filters run.", rating: 5, date: "2026-06-13T12:00:00.000Z" }
];

const INITIAL_DELIVERABLES = [
  { id: "del-1", projectId: "proj-1", name: "Requirements_Blueprint.pdf", desc: "Comprehensive analysis of AeroGlobal data structures.", status: "approved", fileName: "Requirements_Blueprint.pdf", fileSize: "2.4 MB" },
  { id: "del-2", projectId: "proj-1", name: "UX_Interactive_Map.fig", desc: "Interactive figma layout maps.", status: "completed", fileName: "UX_Interactive_Map.fig", fileSize: "15.8 MB" },
  { id: "del-3", projectId: "proj-1", name: "WaidPulse_Alpha_Core.zip", desc: "Initial module structure.", status: "pending", fileName: "WaidPulse_Alpha_Core.zip", fileSize: "4.1 MB" }
];

const INITIAL_PROJECT_ACTIVITIES = [
  { id: "act-1", projectId: "proj-1", title: "Project Initiated", details: "WaidPulse AI Integrations workspace created with AeroGlobal client allocation.", timestamp: "2026-06-01T09:00:00.000Z", userId: "u-1" },
  { id: "act-2", projectId: "proj-1", title: "Requirements Blueprint Uploaded", details: "Senior architect uploaded standard discovery PDF.", timestamp: "2026-06-02T11:00:00.000Z", userId: "u-1" },
  { id: "act-3", projectId: "proj-1", title: "Milestone Approved", details: "Client entity approved Technical Discovery milestone.", timestamp: "2026-06-10T14:30:00.000Z", userId: "u-2" }
];

const INITIAL_INVOICES = [
  { id: "inv-1", projectId: "proj-1", invoiceNo: "INV-2026-088", amount: 30000, currency: "USD", company: "AeroGlobal Inc.", description: "Phase 2 Integration Deliverables", status: "paid", issueDate: "2026-06-12", dueDate: "2026-06-26" },
  { id: "inv-2", projectId: "proj-1", invoiceNo: "INV-2026-089", amount: 25000, currency: "USD", company: "AeroGlobal Inc.", description: "Phase 3 Client Handover Operations", status: "unpaid", issueDate: "2026-06-14", dueDate: "2026-06-28" }
];

const INITIAL_TEAM_MEMBERS = [
  {
    "id": "tm-1", "projectId": "proj-1", "userId": "u-3", "role": "Developer", "status": "active"
  },
  {
    "id": "tm-2", "projectId": "proj-1", "userId": "u-4", "role": "Designer", "status": "active"
  },
  {
    "id": "tm-3", "projectId": "proj-1", "userId": "u-9", "role": "Team Member", "status": "active"
  }
];

function loadDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_FILE)) {
    const freshDb: DatabaseSchema = {
      users: DEFAULT_USERS,
      roles: DEFAULT_ROLES,
      permissions: DEFAULT_PERMISSIONS,
      sessions: [],
      password_resets: [],
      email_verifications: [],
      login_attempts: [],
      audit_logs: [],
      clients: INITIAL_CLIENTS,
      projects: INITIAL_PROJECTS,
      project_members: INITIAL_PROJECT_MEMBERS,
      milestones: INITIAL_MILESTONES,
      tasks: INITIAL_TASKS,
      files: INITIAL_FILES,
      conversations: INITIAL_CONVERSATIONS,
      conversation_participants: INITIAL_CONVERSATION_PARTICIPANTS,
      messages: INITIAL_MESSAGES,
      notifications: INITIAL_NOTIFICATIONS,
      feedback: INITIAL_FEEDBACK,
      deliverables: INITIAL_DELIVERABLES,
      project_activities: INITIAL_PROJECT_ACTIVITIES,
      invoices: INITIAL_INVOICES,
      team_members: INITIAL_TEAM_MEMBERS
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(freshDb, null, 2));
    return freshDb;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users || DEFAULT_USERS,
      roles: mergeOfficialRoles(parsed.roles),
      permissions: parsed.permissions || DEFAULT_PERMISSIONS,
      sessions: parsed.sessions || [],
      password_resets: parsed.password_resets || [],
      email_verifications: parsed.email_verifications || [],
      login_attempts: parsed.login_attempts || [],
      audit_logs: parsed.audit_logs || [],
      clients: parsed.clients || INITIAL_CLIENTS,
      projects: parsed.projects || INITIAL_PROJECTS,
      project_members: parsed.project_members || INITIAL_PROJECT_MEMBERS,
      milestones: parsed.milestones || INITIAL_MILESTONES,
      tasks: parsed.tasks || INITIAL_TASKS,
      files: parsed.files || INITIAL_FILES,
      conversations: parsed.conversations || INITIAL_CONVERSATIONS,
      conversation_participants: parsed.conversation_participants || INITIAL_CONVERSATION_PARTICIPANTS,
      messages: parsed.messages || INITIAL_MESSAGES,
      notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
      feedback: parsed.feedback || INITIAL_FEEDBACK,
      deliverables: parsed.deliverables || INITIAL_DELIVERABLES,
      project_activities: parsed.project_activities || INITIAL_PROJECT_ACTIVITIES,
      invoices: parsed.invoices || INITIAL_INVOICES,
      team_members: parsed.team_members || INITIAL_TEAM_MEMBERS
    };
  } catch (e) {
    console.error("Failed to parse local database. Resetting schema...", e);
    return {
      users: DEFAULT_USERS,
      roles: DEFAULT_ROLES,
      permissions: DEFAULT_PERMISSIONS,
      sessions: [],
      password_resets: [],
      email_verifications: [],
      login_attempts: [],
      audit_logs: [],
      clients: INITIAL_CLIENTS,
      projects: INITIAL_PROJECTS,
      project_members: INITIAL_PROJECT_MEMBERS,
      milestones: INITIAL_MILESTONES,
      tasks: INITIAL_TASKS,
      files: INITIAL_FILES,
      conversations: INITIAL_CONVERSATIONS,
      conversation_participants: INITIAL_CONVERSATION_PARTICIPANTS,
      messages: INITIAL_MESSAGES,
      notifications: INITIAL_NOTIFICATIONS,
      feedback: INITIAL_FEEDBACK,
      deliverables: INITIAL_DELIVERABLES,
      project_activities: INITIAL_PROJECT_ACTIVITIES,
      invoices: INITIAL_INVOICES,
      team_members: INITIAL_TEAM_MEMBERS
    };
  }
}

function saveDatabase(db: DatabaseSchema) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

// Log system security event
function logAudit(db: DatabaseSchema, userId: string | undefined, username: string | undefined, ipAddress: string, action: string, module: string, status: "success" | "failure", details: string) {
  const newLog = {
    id: "l-" + crypto.randomUUID(),
    userId,
    username,
    ipAddress,
    action,
    module,
    status,
    details,
    timestamp: new Date().toISOString()
  };
  db.audit_logs.unshift(newLog);
  // Cap logs at 1000 items
  if (db.audit_logs.length > 1000) {
    db.audit_logs = db.audit_logs.slice(0, 1000);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const wss = new WebSocketServer({ noServer: true });

  app.set("trust proxy", 1);
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  }));
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false
  }));
  app.use("/api/auth/login", rateLimit({
    windowMs: 2 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false
  }));
  app.use((req, res, next) => {
    if (IS_PRODUCTION_RUNTIME && process.env.FORCE_HTTPS === "true" && req.headers["x-forwarded-proto"] === "http") {
      return res.redirect(301, `https://${req.headers.host}${req.originalUrl}`);
    }
    next();
  });
  app.use((req, res, next) => {
    const unsafe = !["GET", "HEAD", "OPTIONS"].includes(req.method);
    const hasBearerToken = typeof req.headers.authorization === "string" && req.headers.authorization.startsWith("Bearer ");
    const authBootstrapPath = req.path.startsWith("/api/auth/");
    if (unsafe && !hasBearerToken && !authBootstrapPath && req.headers["x-csrf-token"] !== "afriwaid-csrf-v1") {
      return res.status(403).json({ error: "CSRF validation failed." });
    }
    next();
  });
  app.use(express.json());

  // Middleware to resolve Client details via Authorization Header token
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    
    if (!token) {
      req.user = null;
      return next();
    }

    const db = loadDatabase();
    const session = db.sessions.find(s => s.token === token && s.isActive === true);
    
    if (!session || new Date(session.expiresAt) < new Date()) {
      if (session) {
        session.isActive = false;
        saveDatabase(db);
      }
      req.user = null;
      return next();
    }

    const matchedUser = db.users.find(u => u.id === session.userId);
    if (!matchedUser || matchedUser.status === "suspended") {
      req.user = null;
      return next();
    }

    req.user = {
      id: matchedUser.id,
      firstName: matchedUser.firstName,
      lastName: matchedUser.lastName,
      username: matchedUser.username,
      email: matchedUser.email,
      role: matchedUser.role,
      isEmailVerified: matchedUser.isEmailVerified,
      status: matchedUser.status,
      sessionToken: token
    };
    next();
  };

  app.use(authenticateToken);

  // AUTHENTICATION ENDPOINTS

  // Register Endpoint
  app.post("/api/auth/register", (req, res) => {
    const { firstName, lastName, username, email, password, role } = req.body;
    const ip = req.ip || "127.0.0.1";
    const db = loadDatabase();

    if (!firstName || !lastName || !username || !email || !password) {
      logAudit(db, undefined, username, ip, "REGISTER", "auth", "failure", "Missing register params");
      saveDatabase(db);
      return res.status(400).json({ error: "All account fields are strictly required." });
    }

    // Password validation rules (8+ chars, upper, lower, number, special symbol)
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passRegex.test(password)) {
      logAudit(db, undefined, username, ip, "REGISTER", "auth", "failure", "Password did not satisfy security complexity matrix rules");
      saveDatabase(db);
      return res.status(400).json({ error: "Password must be at least 8 characters long, containing uppercase letters, lowercase letters, numbers, and symbols." });
    }

    // Duplicate Check
    const existsEmail = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    const existsUser = db.users.some(u => u.username.toLowerCase() === username.toLowerCase());

    if (existsEmail || existsUser) {
      logAudit(db, undefined, username, ip, "REGISTER", "auth", "failure", "Username or email registry collision on sign up");
      saveDatabase(db);
      return res.status(400).json({ error: "An account with this email address or username is already registered." });
    }

    const finalRole = role === "Client" ? "Client" : "User";

    const newUser = {
      id: "u-" + crypto.randomUUID(),
      firstName,
      lastName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      role: finalRole,
      isEmailVerified: false,
      status: "active",
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    // Auto generate verification token
    const verifToken = crypto.randomBytes(32).toString("hex");
    db.email_verifications.push({
      id: "ev-" + crypto.randomUUID(),
      email: newUser.email,
      token: verifToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    });

    logAudit(db, newUser.id, newUser.username, ip, "REGISTER", "auth", "success", `Successfully registered user account with assigned role: ${finalRole}`);
    saveDatabase(db);

    res.json({
      success: true,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
        status: newUser.status
      }
    });
  });

  // Login Endpoint
  app.post("/api/auth/login", (req, res) => {
    const { loginCredential, password, rememberMe } = req.body;
    const ip = req.ip || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "unknown";
    const db = loadDatabase();

    if (!loginCredential || !password) {
      return res.status(400).json({ error: "Email or username and password are required." });
    }

    // Locked Account Safeguard Check
    const attempts = db.login_attempts.find(a => a.ip === ip || a.email === loginCredential.toLowerCase());
    if (attempts && attempts.lockedUntil && new Date(attempts.lockedUntil) > new Date()) {
      logAudit(db, undefined, loginCredential, ip, "LOGIN", "auth", "failure", "Sign-in attempt blocked: Account lock is active");
      saveDatabase(db);
      return res.status(423).json({ error: "Too many failed login attempts. This vector has been temporarily locked. Try again in 2 minutes." });
    }

    const matchedUser = db.users.find(u =>
      (u.email.toLowerCase() === loginCredential.toLowerCase() ||
       u.username.toLowerCase() === loginCredential.toLowerCase())
    );

    if (!matchedUser) {
      logAudit(db, undefined, loginCredential, ip, "LOGIN", "auth", "failure", "Invalid security passcode audit check failed");
      saveDatabase(db);
      return res.status(401).json({ error: "Error: Invalid security credentials. Reference lock states." });
    }

    let passwordValid = false;
    if (isPasswordBcryptHash(matchedUser.passwordHash)) {
      passwordValid = verifyPassword(password, matchedUser.passwordHash);
    } else {
      passwordValid = matchedUser.passwordHash === hashPassword(password);
    }

    if (!passwordValid) {
      // Record failed attempts matrix
      if (attempts) {
        attempts.count += 1;
        if (attempts.count >= 5) {
          attempts.lockedUntil = new Date(Date.now() + 2 * 60 * 1000).toISOString(); // 2 minute lock
        }
      } else {
        db.login_attempts.push({
          id: "la-" + crypto.randomUUID(),
          ip,
          email: loginCredential.toLowerCase(),
          count: 1,
          lockedUntil: null
        });
      }

      logAudit(db, undefined, loginCredential, ip, "LOGIN", "auth", "failure", "Invalid security passcode audit check failed");
      saveDatabase(db);
      return res.status(401).json({ error: "Error: Invalid security credentials. Reference lock states." });
    }

    if (matchedUser.status === "suspended") {
      logAudit(db, matchedUser.id, matchedUser.username, ip, "LOGIN", "auth", "failure", "Attempted sign-in against suspended user session");
      saveDatabase(db);
      return res.status(403).json({ error: "Security alert: Your account has been suspended by a Super Admin. Contradiction flagged." });
    }

    // Reset failed login attempts
    if (attempts) {
      attempts.count = 0;
      attempts.lockedUntil = null;
    }

    // Create session token
    const token = "token_" + crypto.randomBytes(40).toString("hex");
    const expiresMultiplier = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000; // 30 days vs 2 hours
    const expiresAt = new Date(Date.now() + expiresMultiplier).toISOString();

    const newSession = {
      id: "s-" + crypto.randomUUID(),
      userId: matchedUser.id,
      token,
      ipAddress: ip,
      userAgent,
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt
    };

    db.sessions.push(newSession);

    logAudit(db, matchedUser.id, matchedUser.username, ip, "LOGIN", "auth", "success", `Authorized secure logins session token. Current IP: ${ip}`);
    saveDatabase(db);

    res.json({
      success: true,
      token,
      user: {
        id: matchedUser.id,
        firstName: matchedUser.firstName,
        lastName: matchedUser.lastName,
        username: matchedUser.username,
        email: matchedUser.email,
        role: matchedUser.role,
        isEmailVerified: matchedUser.isEmailVerified,
        status: matchedUser.status
      }
    });
  });

  // Google Login Endpoint with Automatic Client Allocation & Auto-Provisioning
  app.post("/api/auth/google-login", (req, res) => {
    return res.status(501).json({ error: "Google sign-in is not configured for this deployment." });
    const { email, firstName, lastName, googleId, avatarUrl } = req.body;
    const ip = req.ip || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "unknown";
    const db = loadDatabase();

    if (!email) {
      return res.status(400).json({ error: "Google email parameter is required for federated authentication." });
    }

    // Try to find user by email
    let matchedUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!matchedUser) {
      // If user doesn't exist, we auto-create them as a client to immediately give them full power!
      const username = email.split("@")[0].toLowerCase() + "_google";
      matchedUser = {
        id: "u-" + crypto.randomUUID(),
        firstName: firstName || "Google",
        lastName: lastName || "User",
        username: username,
        email: email.toLowerCase(),
        passwordHash: hashPassword(crypto.randomBytes(16).toString("hex")), // secure random hash
        role: "Client", // Default role is Client so they can immediately access the client dashboard
        isEmailVerified: true,
        status: "active",
        createdAt: new Date().toISOString(),
        avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username)}`
      };
      
      db.users.push(matchedUser);

      // We should also check if they have a Client Profile in db.clients!
      // If not, auto-bootstrap one so the workspace is populated and fully functional.
      const hasClientProfile = db.clients.some(c => c.email.toLowerCase() === email.toLowerCase());
      if (!hasClientProfile) {
        const clientId = "cl-" + crypto.randomUUID();
        const clientProfile = {
          id: clientId,
          name: `${matchedUser.firstName} ${matchedUser.lastName}`,
          company: `${matchedUser.firstName} Project Corp`,
          email: matchedUser.email,
          userId: matchedUser.id,
          assignedProjectName: "Bespoke Orchestration Platform",
          projectProgress: 55,
          archived: false,
          createdAt: new Date().toISOString(),
          deliverables: [
            { id: "del-g1", name: "System_Requirements_Spec.pdf", description: "Google Workspaces Integration Spec", status: "approved", fileName: "System_Requirements_Spec.pdf", fileSize: "1.8 MB" },
            { id: "del-g2", name: "Cloud_Infrastructure_Mockups.fig", description: "Figma UX wireframe templates", status: "completed", fileName: "Cloud_Infrastructure_Mockups.fig", fileSize: "12.4 MB" }
          ],
          proposals: [
            { id: "prop-g1", title: "Comprehensive Security Orchestration Blueprint", date: new Date().toISOString().split("T")[0], value: "$45,000 USD", status: "Under Review" }
          ],
          invoices: [
            { id: "inv-g1", invoiceNumber: "INV-2026-G01", issueDate: new Date().toISOString().split("T")[0], dueDate: new Date(Date.now() + 14*24*60*60*1000).toISOString().split("T")[0], amount: "$15,000 USD", status: "Unpaid" }
          ],
          progressLog: [
            { date: new Date().toISOString().split("T")[0], title: "Client Onboarding", phase: "Research", status: "completed" }
          ],
          feedback: []
        };
        db.clients.push(clientProfile);

        // Also bootstrap a basic project for them so they see their dashboard fully populated!
        const projectId = "proj-" + crypto.randomUUID();
        const project = {
          id: projectId,
          name: "Bespoke Orchestration Platform",
          category: "AI",
          coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
          description: "A custom enterprise cloud integration connecting user workspace accounts with dynamic dashboards and security analysis tools.",
          technologiesUsed: ["React", "Express", "TypeScript", "Google Workspace APIs", "@google/genai"],
          problemSolved: "Manual operations tracking across separate Google spreadsheets and documents is tedious and non-scalable.",
          features: ["Secure client workspace", "Google Workspace sync", "Dynamic milestone audits"],
          projectStatus: "In Development",
          completionDate: "2026-08-15",
          tags: ["Cloud Sync", "Google Workspace", "Integrate Core"],
          clientProgPercent: 55,
          clientId: clientId,
          createdAt: new Date().toISOString(),
          milestones: [
            { id: "mil-g1", label: "Phase 1: Deep Discovery Protocol", progress: 100, status: "completed" },
            { id: "mil-g2", label: "Phase 2: Database Layer Design & ORMs", progress: 100, status: "completed" },
            { id: "mil-g3", label: "Phase 3: Real-Time Sockets Orchestration", progress: 65, status: "active" },
            { id: "mil-g4", label: "Phase 4: Multi-User Collaboration Portal", progress: 0, status: "pending" }
          ],
          tasks: [
            { id: "t-g1", label: "Complete REST API endpoints logic", completed: true, milestoneId: "mil-g2" },
            { id: "t-g2", label: "Mount WebSocket upgraded listeners", completed: true, milestoneId: "mil-g3" },
            { id: "t-g3", label: "Integrate dashboard state notification triggers", completed: false, milestoneId: "mil-g3" },
            { id: "t-g4", label: "Validate RBAC security compliance suite", completed: false, milestoneId: "mil-g4" }
          ]
        };
        db.projects.push(project);

        db.project_members.push(
          { id: "pm-" + crypto.randomUUID(), projectId: projectId, userId: matchedUser.id, role: "Client" },
          { id: "pm-" + crypto.randomUUID(), projectId: projectId, userId: "u-1", role: "Super Admin" }
        );

        db.milestones.push(
          { id: "mils-" + crypto.randomUUID(), projectId: projectId, title: "Onboarding & Alignment", phase: "Research", status: "completed", date: new Date().toISOString().split("T")[0] },
          { id: "mils-" + crypto.randomUUID(), projectId: projectId, title: "Environment Provisioning", phase: "Design", status: "active", date: new Date(Date.now() + 5*24*60*60*1000).toISOString().split("T")[0] },
          { id: "mils-" + crypto.randomUUID(), projectId: projectId, title: "Dashboard Live Testing", phase: "Launch", status: "planned", date: new Date(Date.now() + 15*24*60*60*1000).toISOString().split("T")[0] }
        );

        const convId = "conv-" + crypto.randomUUID();
        db.conversations.push(
          { id: convId, name: `${matchedUser.firstName} ↔ AfriWaid Core Team`, type: "support", projectId: projectId },
          { id: "conv-proj-general-" + matchedUser.id, name: "General Channel", type: "channel", projectId: projectId, category: "General" }
        );

        db.conversation_participants.push(
          { id: "cp-" + crypto.randomUUID(), conversationId: convId, userId: matchedUser.id },
          { id: "cp-" + crypto.randomUUID(), conversationId: convId, userId: "u-1" },
          { id: "cp-" + crypto.randomUUID(), conversationId: "conv-proj-general-" + matchedUser.id, userId: matchedUser.id },
          { id: "cp-" + crypto.randomUUID(), conversationId: "conv-proj-general-" + matchedUser.id, userId: "u-1" }
        );

        db.messages.push(
          { id: "msg-" + crypto.randomUUID(), conversationId: convId, senderId: "u-1", body: `Hello ${matchedUser.firstName}! Welcome to your brand-new secure AfriWaid Workspace, logged in via secure Google Auth. We have provisioned your system dashboard.`, timestamp: new Date().toISOString(), readBy: [matchedUser.id], pinned: true, reactions: [] }
        );
      }
    }

    // Now issue a standard session token so they are fully logged in!
    const token = "token_" + crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days expiration

    const newSession = {
      id: "s-" + crypto.randomUUID(),
      userId: matchedUser.id,
      token,
      ipAddress: ip,
      userAgent,
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt
    };

    db.sessions.push(newSession);
    logAudit(db, matchedUser.id, matchedUser.username, ip, "GOOGLE_LOGIN", "auth", "success", `Authorized secure federated Google Login for: ${matchedUser.email}`);
    saveDatabase(db);

    res.json({
      success: true,
      token,
      user: {
        id: matchedUser.id,
        firstName: matchedUser.firstName,
        lastName: matchedUser.lastName,
        username: matchedUser.username,
        email: matchedUser.email,
        role: matchedUser.role,
        isEmailVerified: matchedUser.isEmailVerified,
        status: matchedUser.status
      }
    });
  });

  // Get Current Profile ("me")
  app.get("/api/auth/me", (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized session vector state." });
    }
    res.json({ user: req.user });
  });

  // Revoke Specific Session (Logout Single)
  app.post("/api/auth/logout", (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Invalid active session." });
    }
    const db = loadDatabase();
    const sessionToken = req.user.sessionToken;

    const session = db.sessions.find(s => s.token === sessionToken);
    if (session) {
      session.isActive = false;
    }

    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "LOGOUT", "auth", "success", "Terminated login session client request");
    saveDatabase(db);
    res.json({ success: true });
  });

  // Logout All Sessions
  app.post("/api/auth/logout-all", (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized session state." });
    }
    const db = loadDatabase();
    db.sessions.forEach(s => {
      if (s.userId === req.user.id) {
        s.isActive = false;
      }
    });

    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "LOGOUT_ALL", "auth", "success", "Revoked security clearance across all other devices");
    saveDatabase(db);
    res.json({ success: true });
  });

  // Retrieve active session profiles for logged-in user
  app.get("/api/auth/sessions", (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const db = loadDatabase();
    const activeSessions = db.sessions
      .filter(s => s.userId === req.user.id && s.isActive && new Date(s.expiresAt) > new Date())
      .map(s => ({
        id: s.id,
        ipAddress: s.ipAddress,
        userAgent: s.userAgent,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
        isCurrent: s.token === req.user.sessionToken
      }));

    res.json({ sessions: activeSessions });
  });

  // Delete/Revoke selected session id
  app.delete("/api/auth/sessions/:id", (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const db = loadDatabase();
    const session = db.sessions.find(s => s.id === req.params.id && s.userId === req.user.id);

    if (session) {
      session.isActive = false;
      logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "SESSION_REVOKE", "auth", "success", `Successfully terminated specific node session: ${req.params.id}`);
      saveDatabase(db);
      return res.json({ success: true });
    }
    res.status(400).json({ error: "Specified session identifier not located." });
  });

  // Forgot Password Request
  app.post("/api/auth/forgot-password", (req, res) => {
    const { email } = req.body;
    const db = loadDatabase();

    if (!email) {
      return res.status(400).json({ error: "Email address is required." });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Security warning bypass: Always return successful text model to prevent email scraping
    if (!user) {
      logAudit(db, undefined, undefined, req.ip || "127.0.0.1", "FORGOT_PASSWORD", "auth", "failure", `Forgotten password triggered for unrecognized email: ${email}`);
      saveDatabase(db);
      return res.json({ success: true, message: "If matching account credentials are values in registry, forgot verification instructions have been generated." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    db.password_resets.push({
      id: "pr-" + crypto.randomUUID(),
      email: user.email,
      token: resetToken,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString() // 1 hour
    });

    logAudit(db, user.id, user.username, req.ip || "127.0.0.1", "FORGOT_PASSWORD", "auth", "success", `Generated password reset token for: ${user.username}`);
    saveDatabase(db);

    res.json({
      success: true,
      message: "If matching account credentials are values in registry, forgot verification instructions have been generated.",
    });
  });

  // Reset Password
  app.post("/api/auth/reset-password", (req, res) => {
    const { token, newPassword } = req.body;
    const db = loadDatabase();

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Reset token passcode and strong password are required." });
    }

    // Password validation rules
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passRegex.test(newPassword)) {
      return res.status(400).json({ error: "Password must be at least 8 characters long, containing uppercase letters, lowercase letters, numbers, and symbols." });
    }

    const resetRequest = db.password_resets.find(r => r.token === token && new Date(r.expiresAt) > new Date());
    if (!resetRequest) {
      return res.status(400).json({ error: "Password reset authorization token invalid or has expired." });
    }

    const user = db.users.find(u => u.email === resetRequest.email);
    if (!user) {
      return res.status(400).json({ error: "Matching email user profile not found." });
    }

    user.passwordHash = hashPassword(newPassword);
    
    // Revoke all existing sessions for safety!
    db.sessions.forEach(s => {
      if (s.userId === user.id) s.isActive = false;
    });

    // Clean up reset token
    db.password_resets = db.password_resets.filter(r => r.token !== token);

    logAudit(db, user.id, user.username, req.ip || "127.0.0.1", "RESET_PASSWORD", "auth", "success", "Successfully finalized reset passcode procedure");
    saveDatabase(db);

    res.json({ success: true, message: "Logins updated successfully. All active security screens cleared." });
  });

  // Verify Email Verification Token
  app.post("/api/auth/verify-email", (req, res) => {
    const { token } = req.body;
    const db = loadDatabase();

    if (!token) {
      return res.status(400).json({ error: "Verification token code is required." });
    }

    const verificationRecord = db.email_verifications.find(e => e.token === token && new Date(e.expiresAt) > new Date());
    if (!verificationRecord) {
      return res.status(400).json({ error: "Verification identity tag not established or expired." });
    }

    const user = db.users.find(u => u.email === verificationRecord.email);
    if (!user) {
      return res.status(404).json({ error: "Matching verified client target index fail." });
    }

    user.isEmailVerified = true;
    db.email_verifications = db.email_verifications.filter(e => e.token !== token);

    logAudit(db, user.id, user.username, req.ip || "127.0.0.1", "VERIFY_EMAIL", "auth", "success", "Successfully completed email address certification");
    saveDatabase(db);

    res.json({ success: true, message: "Verification completed successfully. Secure access authenticated." });
  });

  // Resend Email Verification Token
  app.post("/api/auth/resend-verification", (req, res) => {
    const { email } = req.body;
    const db = loadDatabase();

    if (!email) {
      return res.status(400).json({ error: "Email target address is required." });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ error: "Email target address is not registered." });
    }

    const verifToken = crypto.randomBytes(32).toString("hex");
    db.email_verifications.push({
      id: "ev-" + crypto.randomUUID(),
      email: user.email,
      token: verifToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

    logAudit(db, user.id, user.username, req.ip || "127.0.0.1", "EMAIL_VERIFICATION_RESEND", "auth", "success", "Enqueued standard address token reissue");
    saveDatabase(db);

    res.json({ success: true, message: "Verification instructions have been regenerated." });
  });

  // UPDATE PASSWORD INSIDE PROTECTED SETTINGS
  app.put("/api/auth/update-password", (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthenticated." });
    }
    const { currentPassword, newPassword } = req.body;
    const db = loadDatabase();
    const user = db.users.find(u => u.id === req.user.id);

    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "UPDATE_PASSWORD", "auth", "failure", "Failed current password verification");
      saveDatabase(db);
      return res.status(400).json({ error: "Current password validation parameters matching failed." });
    }

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passRegex.test(newPassword)) {
      return res.status(400).json({ error: "Password must be >= 8 characters with lowercase, uppercase, digits, and symbols." });
    }

    user.passwordHash = hashPassword(newPassword);
    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "UPDATE_PASSWORD", "auth", "success", "Updated logon security profile successfully");
    saveDatabase(db);
    res.json({ success: true });
  });

  // UPDATE PROFILE INFO
  app.put("/api/auth/profile", (req: any, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthenticated." });
    }
    const { firstName, lastName, username } = req.body;
    const db = loadDatabase();
    
    if (!firstName || !lastName || !username) {
      return res.status(400).json({ error: "Standard fields are valid parameter criteria." });
    }

    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User profile not found." });

    // Ensure username is not taken if changed
    if (username.toLowerCase() !== user.username.toLowerCase()) {
      const exists = db.users.some(u => u.username.toLowerCase() === username.toLowerCase());
      if (exists) {
        return res.status(400).json({ error: "This username has already been registered." });
      }
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username.toLowerCase();

    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "UPDATE_PROFILE", "auth", "success", "Successfully updated account profile details");
    saveDatabase(db);

    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        status: user.status
      }
    });
  });


  // ADMIN GATEWAYS: MIDDLEWARE PROTECTION
  const checkPermission = (action: string) => {
    return (req: any, res: any, next: any) => {
      if (!req.user) {
        return res.status(401).json({ error: "Logins session expired." });
      }

      const db = loadDatabase();
      const userRole = db.roles.find(r => r.name === req.user.role);
      
      if (!userRole) {
        return res.status(403).json({ error: "Designated role permissions indexing failed." });
      }

      const perm = db.permissions.find(p => p.action === action || `${p.module}.${p.action}` === action);
      if (!perm) {
        // Fallback for custom system permissions or Super Admin pass-through
        if (req.user.role === "Super Admin") {
          return next();
        }
        return res.status(403).json({ error: "Invalid dynamic systems permission requested." });
      }

      if (req.user.role === "Super Admin" || userRole.permissions.includes(perm.id)) {
        return next();
      }

      return res.status(403).json({ error: "Forbidden: Inadequate RBAC system clearance permissions." });
    };
  };

  // User Manager Operations
  app.get("/api/admin/users", checkPermission("users.view"), (req, res) => {
    const db = loadDatabase();
    const sanit = db.users.map(u => ({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      username: u.username,
      email: u.email,
      role: u.role,
      isEmailVerified: u.isEmailVerified,
      status: u.status,
      createdAt: u.createdAt
    }));
    res.json({ users: sanit });
  });

  app.post("/api/admin/users", checkPermission("users.create"), (req: any, res) => {
    const { firstName, lastName, username, email, password, role } = req.body;
    const db = loadDatabase();

    if (!firstName || !lastName || !username || !email || !password || !role) {
      return res.status(400).json({ error: "All properties are strictly required for creation." });
    }
    if (!isOfficialRole(role)) {
      return res.status(400).json({ error: "Role is not in the official RBAC registry." });
    }

    const emailTaken = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    const userTaken = db.users.some(u => u.username.toLowerCase() === username.toLowerCase());

    if (emailTaken || userTaken) {
      return res.status(400).json({ error: "Email or username registry collision." });
    }

    const newUser = {
      id: "u-" + crypto.randomUUID(),
      firstName,
      lastName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      role,
      isEmailVerified: true,
      status: "active",
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "USER_CREATE", "admin", "success", `Admin created user profile: ${newUser.username} as ${role}`);
    saveDatabase(db);

    res.json({ success: true, user: newUser });
  });

  app.put("/api/admin/users/:id", checkPermission("users.edit"), (req: any, res) => {
    const { firstName, lastName, role, status, isEmailVerified } = req.body;
    const db = loadDatabase();
    const user = db.users.find(u => u.id === req.params.id);

    if (!user) return res.status(404).json({ error: "User identifier not located." });

    // Block non-Super Admin from modifying a Super Admin
    if (user.role === "Super Admin" && req.user.role !== "Super Admin") {
      return res.status(403).json({ error: "Restrictions: Super Admin details cannot be altered by regular admins." });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role) {
      if (!isOfficialRole(role)) {
        return res.status(400).json({ error: "Role is not in the official RBAC registry." });
      }
      user.role = role;
    }
    if (status) user.status = status;
    if (isEmailVerified !== undefined) user.isEmailVerified = isEmailVerified;

    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "USER_UPDATE", "admin", "success", `Updated details of user account: ${user.username}`);
    saveDatabase(db);
    res.json({ success: true, user });
  });

  app.delete("/api/admin/users/:id", checkPermission("users.delete"), (req: any, res) => {
    const db = loadDatabase();
    const user = db.users.find(u => u.id === req.params.id);

    if (!user) return res.status(404).json({ error: "Target account target mismatch index." });

    if (user.id === req.user.id) {
      return res.status(400).json({ error: "Contradiction: You cannot self-delete your own active session account." });
    }

    if (user.role === "Super Admin") {
      return res.status(403).json({ error: "Forbidden: Super Admins are shielded from deletion operations." });
    }

    db.users = db.users.filter(u => u.id !== req.params.id);
    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "USER_DELETE", "admin", "success", `Deleted user account entry: ${user.username}`);
    saveDatabase(db);
    res.json({ success: true });
  });


  // RBAC Roles & Permissions Core Edit Gate
  app.get("/api/admin/roles", (req, res) => {
    const db = loadDatabase();
    res.json({ roles: db.roles });
  });

  app.get("/api/admin/permissions", (req, res) => {
    const db = loadDatabase();
    res.json({ permissions: db.permissions });
  });

  // Assign or upgrade a direct role permissions array
  app.put("/api/admin/roles/:id", checkPermission("system.settings"), (req: any, res) => {
    const { permissions } = req.body; // Array of permission ID keys
    const db = loadDatabase();
    const roleObj = db.roles.find(r => r.id === req.params.id);

    if (!roleObj) {
      return res.status(404).json({ error: "Role registry not located." });
    }

    roleObj.permissions = permissions;
    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "ROLE_PERMISSONS_UPDATE", "admin", "success", `Updated dynamic permission schema list for role group: ${roleObj.name}`);
    saveDatabase(db);
    res.json({ success: true, role: roleObj });
  });

  // Audit Logs endpoints
  app.get("/api/admin/audit-logs", checkPermission("users.view"), (req, res) => {
    const db = loadDatabase();
    res.json({ logs: db.audit_logs });
  });

  // ----------------------------------------------------
  // REAL-TIME WEBSOCKET INFRASTRUCTURE POOLS & HELPERS
  // ----------------------------------------------------
  const activeConnections = new Map<string, WebSocket>(); // userId -> websocket

  function sendToUser(userId: string, event: any) {
    const conn = activeConnections.get(userId);
    if (conn && conn.readyState === WebSocket.OPEN) {
      conn.send(JSON.stringify(event));
    }
  }

  function broadcast(event: any) {
    const data = JSON.stringify(event);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  function broadcastToConversation(conversationId: string, event: any) {
    const db = loadDatabase();
    const participants = db.conversation_participants
      .filter(p => p.conversationId === conversationId)
      .map(p => p.userId);
    
    participants.forEach(pId => {
      sendToUser(pId, event);
    });
  }

  // ----------------------------------------------------
  // CLIENTS API MODULE
  // ----------------------------------------------------
  app.get("/api/clients", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    
    if (req.user.role === "Super Admin" || req.user.role === "Admin") {
      res.json({ clients: db.clients.filter(c => !c.archived) });
    } else if (req.user.role === "Client") {
      res.json({ clients: db.clients.filter(c => c.userId === req.user.id && !c.archived) });
    } else {
      res.json({ clients: [] });
    }
  });

  app.post("/api/clients", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user || (req.user.role !== "Super Admin" && req.user.role !== "Admin")) {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    const { name, company, email, userId, assignedProjectName } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    const newClient = {
      id: "cl-" + crypto.randomUUID(),
      name,
      company: company || "",
      email: email.toLowerCase(),
      userId: userId || "",
      assignedProjectName: assignedProjectName || "",
      projectProgress: 0,
      archived: false,
      createdAt: new Date().toISOString()
    };
    db.clients.push(newClient);
    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "CLIENT_CREATE", "clients", "success", `Admins created client: ${name}`);
    saveDatabase(db);
    res.json({ success: true, client: newClient });
  });

  app.put("/api/clients/:id", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user || (req.user.role !== "Super Admin" && req.user.role !== "Admin")) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const client = db.clients.find(c => c.id === req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });

    const { name, company, email, userId, assignedProjectName, projectProgress } = req.body;
    if (name) client.name = name;
    if (company !== undefined) client.company = company;
    if (email) client.email = email.toLowerCase();
    if (userId !== undefined) client.userId = userId;
    if (assignedProjectName !== undefined) client.assignedProjectName = assignedProjectName;
    if (projectProgress !== undefined) client.projectProgress = Number(projectProgress);

    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "CLIENT_UPDATE", "clients", "success", `Updated client profile: ${client.name}`);
    saveDatabase(db);
    res.json({ success: true, client });
  });

  app.delete("/api/clients/:id", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user || (req.user.role !== "Super Admin" && req.user.role !== "Admin")) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const client = db.clients.find(c => c.id === req.params.id);
    if (!client) return res.status(404).json({ error: "Client not found" });

    client.archived = true;
    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "CLIENT_ARCHIVE", "clients", "success", `Archived client profile: ${client.name}`);
    saveDatabase(db);
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // PROJECTS & WORKSPACE API MODULE
  // ----------------------------------------------------
  app.get("/api/projects", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if (req.user.role === "Super Admin" || req.user.role === "Admin" || req.user.role === "Operator") {
      res.json({ projects: db.projects });
    } else if (req.user.role === "Client") {
      const clientProfile = db.clients.find(c => c.userId === req.user.id);
      if (clientProfile) {
        res.json({ projects: db.projects.filter(p => p.clientId === clientProfile.id) });
      } else {
        const allowedProjectIds = db.project_members.filter(m => m.userId === req.user.id).map(m => m.projectId);
        res.json({ projects: db.projects.filter(p => allowedProjectIds.includes(p.id)) });
      }
    } else {
      const allowedProjectIds = db.project_members.filter(m => m.userId === req.user.id).map(m => m.projectId);
      res.json({ projects: db.projects.filter(p => allowedProjectIds.includes(p.id)) });
    }
  });

  app.post("/api/projects", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user || (req.user.role !== "Super Admin" && req.user.role !== "Admin")) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { name, category, coverImage, description, technologiesUsed, problemSolved, features, projectStatus, completionDate, tags, clientId } = req.body;
    if (!name) return res.status(400).json({ error: "Project name is required" });

    const newProject = {
      id: "proj-" + crypto.randomUUID(),
      name,
      category: category || "General",
      coverImage: coverImage || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
      description: description || "",
      technologiesUsed: technologiesUsed || [],
      problemSolved: problemSolved || "",
      features: features || [],
      projectStatus: projectStatus || "Proposed",
      completionDate: completionDate || "",
      tags: tags || [],
      clientProgPercent: 0,
      clientId: clientId || "",
      createdAt: new Date().toISOString()
    };

    db.projects.push(newProject);
    
    db.project_activities.push({
      id: "act-" + crypto.randomUUID(),
      projectId: newProject.id,
      title: "Project Initialized",
      details: `Project workspace '${newProject.name}' created by admin.`,
      timestamp: new Date().toISOString(),
      userId: req.user.id
    });

    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "PROJECT_CREATE", "projects", "success", `Admins created project workspace: ${name}`);
    saveDatabase(db);
    res.json({ success: true, project: newProject });
  });

  app.put("/api/projects/:id", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role !== "Super Admin" && req.user.role !== "Admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const project = db.projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const { name, category, coverImage, description, technologiesUsed, problemSolved, features, projectStatus, completionDate, tags, clientProgPercent, clientId } = req.body;

    if (name) project.name = name;
    if (category) project.category = category;
    if (coverImage) project.coverImage = coverImage;
    if (description) project.description = description;
    if (technologiesUsed) project.technologiesUsed = technologiesUsed;
    if (problemSolved) project.problemSolved = problemSolved;
    if (features) project.features = features;
    if (projectStatus) {
      if (project.projectStatus !== projectStatus) {
        db.project_activities.unshift({
          id: "act-" + crypto.randomUUID(),
          projectId: project.id,
          title: "Status Updated",
          details: `Project status shifted from '${project.projectStatus}' to '${projectStatus}'.`,
          timestamp: new Date().toISOString(),
          userId: req.user.id
        });
      }
      project.projectStatus = projectStatus;
    }
    if (completionDate) project.completionDate = completionDate;
    if (tags) project.tags = tags;
    if (clientProgPercent !== undefined) project.clientProgPercent = Number(clientProgPercent);
    if (clientId !== undefined) project.clientId = clientId;

    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "PROJECT_UPDATE", "projects", "success", `Updated project workspace details: ${project.name}`);
    saveDatabase(db);
    res.json({ success: true, project });
  });

  app.get("/api/projects/:id/workspace", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const pId = req.params.id;
    const project = db.projects.find(p => p.id === pId);
    if (!project) return res.status(404).json({ error: "Workspace not found" });

    let hasAccess = req.user.role === "Super Admin" || req.user.role === "Admin" || req.user.role === "Operator";
    if (!hasAccess && req.user.role === "Client") {
      const clientProfile = db.clients.find(c => c.userId === req.user.id);
      if (clientProfile && project.clientId === clientProfile.id) {
        hasAccess = true;
      }
    }
    if (!hasAccess) {
      const isMember = db.project_members.some(m => m.projectId === pId && m.userId === req.user.id);
      if (isMember) hasAccess = true;
    }

    if (!hasAccess) {
      return res.status(403).json({ error: "Forbidden: Restricted access control" });
    }

    const milestones = db.milestones.filter(m => m.projectId === pId);
    const tasks = db.tasks.filter(t => t.projectId === pId);
    const files = db.files.filter(f => f.projectId === pId);
    const deliverables = db.deliverables.filter(d => d.projectId === pId);
    const feedback = db.feedback.filter(f => f.projectId === pId);
    const activities = db.project_activities.filter(a => a.projectId === pId);
    const invoices = db.invoices.filter(i => i.projectId === pId);

    res.json({
      project,
      milestones,
      tasks,
      files,
      deliverables,
      feedback,
      activities,
      invoices
    });
  });

  // ----------------------------------------------------
  // MILESTONES & TASKS API MODULE
  // ----------------------------------------------------
  app.get("/api/milestones", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if (req.user.role === "Super Admin" || req.user.role === "Admin" || req.user.role === "Operator") {
      return res.json({ milestones: db.milestones });
    }

    const clientProfile = db.clients.find(c => c.userId === req.user.id);
    const memberProjectIds = db.project_members
      .filter(pm => pm.userId === req.user.id)
      .map(pm => pm.projectId);
    const ownedProjectIds = clientProfile
      ? db.projects.filter(p => p.clientId === clientProfile.id).map(p => p.id)
      : [];
    const allowedProjectIds = Array.from(new Set([...memberProjectIds, ...ownedProjectIds]));

    res.json({ milestones: db.milestones.filter(m => allowedProjectIds.includes(m.projectId)) });
  });

  app.post("/api/projects/:id/milestones", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user || (req.user.role !== "Super Admin" && req.user.role !== "Admin")) {
      return res.status(403).json({ error: "Admins only" });
    }
    const { title, phase, date, status } = req.body;
    if (!title) return res.status(400).json({ error: "Milestone title is required" });

    const newMilestone = {
      id: "mils-" + crypto.randomUUID(),
      projectId: req.params.id,
      title,
      phase: phase || "Implementation",
      status: status || "planned",
      date: date || new Date().toISOString().split("T")[0]
    };
    db.milestones.push(newMilestone);

    db.project_activities.unshift({
      id: "act-" + crypto.randomUUID(),
      projectId: req.params.id,
      title: "Milestone Declared",
      details: `New milestone created: '${newMilestone.title}' (${newMilestone.phase})`,
      timestamp: new Date().toISOString(),
      userId: req.user.id
    });

    saveDatabase(db);
    res.json({ success: true, milestone: newMilestone });
  });

  app.put("/api/milestones/:id", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const milestone = db.milestones.find(m => m.id === req.params.id);
    if (!milestone) return res.status(404).json({ error: "Milestone not found" });

    const { title, phase, status, date } = req.body;
    if (title) milestone.title = title;
    if (phase) milestone.phase = phase;
    if (date) milestone.date = date;

    if (status && milestone.status !== status) {
      milestone.status = status;
      db.project_activities.unshift({
        id: "act-" + crypto.randomUUID(),
        projectId: milestone.projectId,
        title: "Milestone Shift",
        details: `Milestone '${milestone.title}' marked as '${status}'.`,
        timestamp: new Date().toISOString(),
        userId: req.user.id
      });

      const projectObj = db.projects.find(p => p.id === milestone.projectId);
      if (projectObj && projectObj.clientId) {
        const clientProfile = db.clients.find(c => c.id === projectObj.clientId);
        if (clientProfile && clientProfile.userId) {
          const nt = {
            id: "nt-" + crypto.randomUUID(),
            userId: clientProfile.userId,
            title: "Milestone Update",
            msg: `Milestone '${milestone.title}' on ${projectObj.name} is now ${status.toUpperCase()}.`,
            category: "milestone",
            read: false,
            createdAt: new Date().toISOString()
          };
          db.notifications.unshift(nt);
          sendToUser(clientProfile.userId, { type: "notification:receive", payload: nt });
        }
      }
    }

    saveDatabase(db);
    res.json({ success: true, milestone });
  });

  app.post("/api/milestones/:id/approve", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user || req.user.role !== "Client") {
      return res.status(403).json({ error: "Clients only can execute target approval" });
    }
    const milestone = db.milestones.find(m => m.id === req.params.id);
    if (!milestone) return res.status(404).json({ error: "Milestone not found" });

    milestone.status = "approved";

    db.project_activities.unshift({
      id: "act-" + crypto.randomUUID(),
      projectId: milestone.projectId,
      title: "Milestone Approved By Client",
      details: `Client approved completion phase for: '${milestone.title}'`,
      timestamp: new Date().toISOString(),
      userId: req.user.id
    });

    db.users.filter(u => u.role === "Super Admin" || u.role === "Admin").forEach(adm => {
      const nt = {
        id: "nt-" + crypto.randomUUID(),
        userId: adm.id,
        title: "Milestone Client Approval",
        msg: `Client approved the milestone '${milestone.title}'`,
        category: "milestone",
        read: false,
        createdAt: new Date().toISOString()
      };
      db.notifications.unshift(nt);
      sendToUser(adm.id, { type: "notification:receive", payload: nt });
    });

    saveDatabase(db);
    res.json({ success: true, milestone });
  });

  app.post("/api/projects/:id/tasks", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { title, desc, milestoneId, status, assignee } = req.body;
    if (!title) return res.status(400).json({ error: "Task title is required" });

    const newTask = {
      id: "task-" + crypto.randomUUID(),
      projectId: req.params.id,
      milestoneId: milestoneId || "",
      title,
      desc: desc || "",
      status: status || "planned",
      assignee: assignee || "u-1"
    };

    db.tasks.push(newTask);
    saveDatabase(db);
    res.json({ success: true, task: newTask });
  });

  app.put("/api/tasks/:id", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const task = db.tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const { title, desc, milestoneId, status, assignee } = req.body;
    if (title) task.title = title;
    if (desc !== undefined) task.desc = desc;
    if (milestoneId !== undefined) task.milestoneId = milestoneId;
    if (status) task.status = status;
    if (assignee) task.assignee = assignee;

    saveDatabase(db);
    res.json({ success: true, task });
  });

  // ----------------------------------------------------
  // FILE MANAGEMENT FOUNDATION
  // ----------------------------------------------------
  app.get("/api/files", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if (req.user.role === "Super Admin" || req.user.role === "Admin") {
      res.json({ files: db.files });
    } else {
      let allowedProjIds: string[] = [];
      if (req.user.role === "Client") {
        const clientProfile = db.clients.find(c => c.userId === req.user.id);
        if (clientProfile) {
          allowedProjIds = db.projects.filter(p => p.clientId === clientProfile.id).map(p => p.id);
        }
      } else {
        allowedProjIds = db.project_members.filter(m => m.userId === req.user.id).map(m => m.projectId);
      }
      res.json({ files: db.files.filter(f => allowedProjIds.includes(f.projectId)) });
    }
  });

  app.post("/api/files/upload", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { name, size, category, tags, projectId } = req.body;
    if (!name || !projectId) return res.status(400).json({ error: "File name and Project destination are required" });

    const existingCount = db.files.filter(f => f.projectId === projectId && f.name.toLowerCase() === name.toLowerCase()).length;

    const newFile = {
      id: "file-" + crypto.randomUUID(),
      projectId,
      name,
      size: size || "1.2 MB",
      uploadedBy: req.user.id,
      category: category || "Documents",
      tags: tags || [],
      version: existingCount + 1,
      uploadedAt: new Date().toISOString()
    };

    db.files.unshift(newFile);

    db.project_activities.unshift({
      id: "act-" + crypto.randomUUID(),
      projectId,
      title: "File Uploaded",
      details: `${req.user.username} uploaded file '${newFile.name}' (Version ${newFile.version})`,
      timestamp: new Date().toISOString(),
      userId: req.user.id
    });

    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "FILE_UPLOAD", "files", "success", `Uploaded workspace attachment: ${newFile.name}`);
    saveDatabase(db);
    res.json({ success: true, file: newFile });
  });

  app.delete("/api/files/:id", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user || (req.user.role !== "Super Admin" && req.user.role !== "Admin")) {
      return res.status(403).json({ error: "Restricted clearance context" });
    }
    const file = db.files.find(f => f.id === req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    db.files = db.files.filter(f => f.id !== req.params.id);
    
    db.project_activities.unshift({
      id: "act-" + crypto.randomUUID(),
      projectId: file.projectId,
      title: "File Purged",
      details: `Admin deleted database asset registry entry: '${file.name}'`,
      timestamp: new Date().toISOString(),
      userId: req.user.id
    });

    saveDatabase(db);
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // REAL-TIME CHAT & MESSAGING API MODULE
  // ----------------------------------------------------
  const enrichChatMessage = (db: DatabaseSchema, msg: any) => {
    const sender = db.users.find(u => u.id === msg.senderId);
    return {
      ...msg,
      senderUsername: sender?.username || "unknown",
      senderRole: sender?.role || "User",
      senderName: sender ? `${sender.firstName} ${sender.lastName}` : "Unknown User"
    };
  };

  app.get("/api/conversations", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const userConvIds = db.conversation_participants
      .filter(p => p.userId === req.user.id)
      .map(p => p.conversationId);

    let conversations = [];
    if (req.user.role === "Super Admin" || req.user.role === "Admin") {
      conversations = db.conversations;
    } else {
      conversations = db.conversations.filter(c => userConvIds.includes(c.id));
    }

    const formatted = conversations.map(c => {
      const messages = db.messages.filter(m => m.conversationId === c.id);
      const sorted = [...messages].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const latestMsg = sorted[sorted.length - 1] ? enrichChatMessage(db, sorted[sorted.length - 1]) : null;
      
      const unreadCount = messages.filter(m => m.senderId !== req.user.id && (!m.readBy || !m.readBy.includes(req.user.id))).length;

      return {
        ...c,
        latestMessage: latestMsg,
        unreadCount
      };
    });

    res.json({ conversations: formatted });
  });

  app.post("/api/conversations", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { name, type, projectId, category, participants } = req.body;
    if (!type) return res.status(400).json({ error: "Conversation Type is required" });

    const newConv = {
      id: "conv-" + crypto.randomUUID(),
      name: name || `Chat Channel-${Math.floor(Math.random()*1000)}`,
      type,
      projectId: projectId || "",
      category: category || "",
      archived: false,
      pinnedIdList: []
    };

    db.conversations.push(newConv);

    db.conversation_participants.push({
      id: "cp-" + crypto.randomUUID(),
      conversationId: newConv.id,
      userId: req.user.id
    });

    if (Array.isArray(participants)) {
      participants.forEach(pId => {
        if (pId !== req.user.id && db.users.some(u => u.id === pId)) {
          db.conversation_participants.push({
            id: "cp-" + crypto.randomUUID(),
            conversationId: newConv.id,
            userId: pId
          });
        }
      });
    }

    saveDatabase(db);
    res.json({ success: true, conversation: newConv });
  });

  app.get("/api/messages/:convId", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const convId = req.params.convId;
    const messages = db.messages.filter(m => m.conversationId === convId);

    let updated = false;
    messages.forEach(m => {
      if (m.senderId !== req.user.id) {
        if (!m.readBy) m.readBy = [];
        if (!m.readBy.includes(req.user.id)) {
          m.readBy.push(req.user.id);
          updated = true;
        }
      }
    });

    if (updated) {
      saveDatabase(db);
      broadcastToConversation(convId, { type: "chat:read", payload: { conversationId: convId, userId: req.user.id } });
    }

    res.json({ messages: messages.map(m => enrichChatMessage(db, m)) });
  });

  app.post("/api/messages", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { conversationId, body, attachment, pinned } = req.body;
    if (!conversationId || (!body && !attachment)) {
      return res.status(400).json({ error: "Context parameters mismatch" });
    }

    const newMsg = {
      id: "msg-" + crypto.randomUUID(),
      conversationId,
      senderId: req.user.id,
      body: body || "",
      timestamp: new Date().toISOString(),
      readBy: [],
      pinned: pinned || false,
      reactions: [],
      attachment: attachment ? {
        name: attachment.name,
        size: attachment.size || "1.1 MB",
        type: attachment.type || "Documents",
        url: attachment.url || ""
      } : undefined
    };

    db.messages.push(newMsg);
    saveDatabase(db);

    const enrichedNewMsg = enrichChatMessage(db, newMsg);

    broadcastToConversation(conversationId, { type: "chat:message", payload: { message: enrichedNewMsg } });

    const participants = db.conversation_participants
      .filter(p => p.conversationId === conversationId && p.userId !== req.user.id);

    participants.forEach(p => {
      const nt = {
        id: "nt-" + crypto.randomUUID(),
        userId: p.userId,
        title: "New Workspace Chat Message",
        msg: `${req.user.username}: ${newMsg.body.substring(0, 40)}${newMsg.body.length > 40 ? "..." : ""}`,
        category: "chat",
        read: false,
        createdAt: new Date().toISOString(),
        metadata: { conversationId }
      };
      db.notifications.unshift(nt);
      sendToUser(p.userId, { type: "notification:receive", payload: nt });
    });

    saveDatabase(db);
    res.json({ success: true, message: enrichedNewMsg });
  });

  app.put("/api/messages/:id", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const msg = db.messages.find(m => m.id === req.params.id);
    if (!msg) return res.status(404).json({ error: "Message not found" });

    const { body, reactions, pinned, deleted } = req.body;

    if (deleted) {
      db.messages = db.messages.filter(m => m.id !== req.params.id);
      broadcastToConversation(msg.conversationId, { type: "chat:delete", payload: { id: req.params.id, conversationId: msg.conversationId } });
    } else {
      if (body) {
        if (msg.senderId !== req.user.id) {
          return res.status(403).json({ error: "Forbidden: Cannot edit other accounts' communication logs" });
        }
        msg.body = body + " (edited)";
      }
      if (reactions) msg.reactions = reactions;
      if (pinned !== undefined) msg.pinned = pinned;

      broadcastToConversation(msg.conversationId, { type: "chat:update", payload: { message: msg } });
    }

    saveDatabase(db);
    res.json({ success: true, message: msg });
  });

  // ----------------------------------------------------
  // NOTIFICATION SYSTEM API MODULE
  // ----------------------------------------------------
  app.get("/api/notifications", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const list = db.notifications.filter(n => n.userId === req.user.id);
    res.json({ notifications: list });
  });

  app.put("/api/notifications/:id/read", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const nt = db.notifications.find(n => n.id === req.params.id && n.userId === req.user.id);
    if (nt) {
      nt.read = true;
      saveDatabase(db);
      res.json({ success: true, notification: nt });
    } else {
      res.status(404).json({ error: "Notification entry not located" });
    }
  });

  app.put("/api/notifications/read-all", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    db.notifications.forEach(n => {
      if (n.userId === req.user.id) n.read = true;
    });

    saveDatabase(db);
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // NOTIFICATION BROADCAST API MODULE
  // ----------------------------------------------------
  app.post("/api/notifications/broadcast", checkPermission("system.settings"), (req: any, res) => {
    const db = loadDatabase();
    const { title, msg } = req.body;
    
    if (!title || !msg) {
      return res.status(400).json({ error: "Title and message are required" });
    }

    const newNotification = {
      id: "nt-broadcast-" + crypto.randomUUID(),
      userId: "all",
      title,
      msg,
      category: "broadcast",
      read: false,
      createdAt: new Date().toISOString()
    };

    db.notifications.push(newNotification);
    saveDatabase(db);
    
    logAudit(db, req.user.id, req.user.username, req.ip || "127.0.0.1", "NOTIFICATION_BROADCAST", "notifications", "success", `Broadcast notification sent: ${title}`);
    res.json({ success: true, notification: newNotification });
  });

  // ----------------------------------------------------
  // FEEDBACK API MODULE
  // ----------------------------------------------------
  app.post("/api/feedback", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { projectId, text, rating } = req.body;
    if (!projectId || !text) return res.status(400).json({ error: "Project and review text are required" });

    const clientProfile = db.clients.find(c => c.userId === req.user.id);
    const clientId = clientProfile ? clientProfile.id : "anonymous";

    const newFeedback = {
      id: "fb-" + crypto.randomUUID(),
      projectId,
      clientId,
      text,
      rating: Number(rating) || 5,
      date: new Date().toISOString()
    };

    db.feedback.push(newFeedback);

    db.project_activities.unshift({
      id: "act-" + crypto.randomUUID(),
      projectId,
      title: "Client Feedback Registered",
      details: `Client submitted a ${newFeedback.rating}-star evaluation. Review: '${newFeedback.text.substring(0,30)}...'`,
      timestamp: new Date().toISOString(),
      userId: req.user.id
    });

    db.users.filter(u => u.role === "Super Admin" || u.role === "Admin").forEach(adm => {
      const nt = {
        id: "nt-" + crypto.randomUUID(),
        userId: adm.id,
        title: "New Client Feedback Received",
        msg: `Client rated project evaluation: ${newFeedback.rating}/5 stars.`,
        category: "milestone",
        read: false,
        createdAt: new Date().toISOString()
      };
      db.notifications.unshift(nt);
      sendToUser(adm.id, { type: "notification:receive", payload: nt });
    });

    saveDatabase(db);
    res.json({ success: true, feedback: newFeedback });
  });

  // ----------------------------------------------------
  // INVOICING & BILLING MODULE
  // ----------------------------------------------------
  app.get("/api/invoices", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if (req.user.role === "Super Admin" || req.user.role === "Admin" || req.user.role === "Operator") {
      res.json({ invoices: db.invoices });
    } else {
      const clientProfile = db.clients.find(c => c.userId === req.user.id);
      if (clientProfile) {
        res.json({ invoices: db.invoices.filter(i => i.company === clientProfile.company) });
      } else {
        res.json({ invoices: [] });
      }
    }
  });

  app.post("/api/invoices", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user || (req.user.role !== "Super Admin" && req.user.role !== "Admin")) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const { projectId, amount, company, description, dueDate } = req.body;
    if (!amount || !company) return res.status(400).json({ error: "Billing amount and Company target are required" });

    const newInv = {
      id: "inv-" + crypto.randomUUID(),
      projectId: projectId || "proj-1",
      invoiceNo: `INV-2026-${Math.floor(100 + Math.random()*900)}`,
      amount: Number(amount),
      currency: "USD",
      company,
      description: description || "AfriWaid Consulting Fees",
      status: "unpaid",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: dueDate || new Date(Date.now() + 14*24*60*60*1000).toISOString().split("T")[0]
    };

    db.invoices.unshift(newInv);

    const matchingClient = db.clients.find(c => c.company.toLowerCase() === company.toLowerCase() && c.userId);
    if (matchingClient) {
      const nt = {
        id: "nt-" + crypto.randomUUID(),
        userId: matchingClient.userId,
        title: "New Premium Invoice Issued",
        msg: `Invoice ${newInv.invoiceNo} representing $${newInv.amount} USD has been processed.`,
        category: "invoice",
        read: false,
        createdAt: new Date().toISOString()
      };
      db.notifications.unshift(nt);
      sendToUser(matchingClient.userId, { type: "notification:receive", payload: nt });
    }

    saveDatabase(db);
    res.json({ success: true, invoice: newInv });
  });

  app.post("/api/invoices/:id/pay", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const inv = db.invoices.find(i => i.id === req.params.id);
    if (!inv) return res.status(404).json({ error: "Invoice not found" });

    inv.status = "paid";

    db.users.filter(u => u.role === "Super Admin" || u.role === "Admin").forEach(adm => {
      const nt = {
        id: "nt-" + crypto.randomUUID(),
        userId: adm.id,
        title: "Invoice Settlement Complete",
        msg: `Payment receipt generated for ${inv.invoiceNo} ($${inv.amount} USD)`,
        category: "invoice",
        read: false,
        createdAt: new Date().toISOString()
      };
      db.notifications.unshift(nt);
      sendToUser(adm.id, { type: "notification:receive", payload: nt });
    });

    saveDatabase(db);
    res.json({ success: true, invoice: inv });
  });

  // DELIVERABLES MANAGER
  app.get("/api/deliverables", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    if (req.user.role === "Super Admin" || req.user.role === "Admin" || req.user.role === "Operator") {
      return res.json({ deliverables: db.deliverables });
    }

    const clientProfile = db.clients.find(c => c.userId === req.user.id);
    const memberProjectIds = db.project_members.filter(pm => pm.userId === req.user.id).map(pm => pm.projectId);
    const ownedProjectIds = clientProfile ? db.projects.filter(p => p.clientId === clientProfile.id).map(p => p.id) : [];
    const allowedProjectIds = Array.from(new Set([...memberProjectIds, ...ownedProjectIds]));
    res.json({ deliverables: db.deliverables.filter(d => allowedProjectIds.includes(d.projectId)) });
  });

  app.put("/api/deliverables/:id/review", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const del = db.deliverables.find(d => d.id === req.params.id);
    if (!del) return res.status(404).json({ error: "Deliverable not located" });

    const { status } = req.body;
    del.status = status;

    db.project_activities.unshift({
      id: "actact-" + crypto.randomUUID(),
      projectId: del.projectId,
      title: "Deliverable Reviewed",
      details: `${req.user.username} reviews deliverable '${del.name}' as ${status.toUpperCase()}`,
      timestamp: new Date().toISOString(),
      userId: req.user.id
    });

    if (req.user.role === "Client") {
      db.users.filter(u => u.role === "Super Admin" || u.role === "Admin").forEach(adm => {
        const nt = {
          id: "nt-" + crypto.randomUUID(),
          userId: adm.id,
          title: "Deliverable Status Review",
          msg: `Client responded to deliverable submission: ${del.name} ${status.toUpperCase()}`,
          category: "deliverable",
          read: false,
          createdAt: new Date().toISOString()
        };
        db.notifications.unshift(nt);
        sendToUser(adm.id, { type: "notification:receive", payload: nt });
      });
    }

    saveDatabase(db);
    res.json({ success: true, deliverable: del });
  });

  // APPROVALS API
  app.get("/api/approvals", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const clientProfile = db.clients.find(c => c.userId === req.user.id);
    const clientProjectIds = db.project_members
      .filter(pm => pm.userId === req.user.id)
      .map(pm => pm.projectId);
    if (clientProfile) {
      db.projects.filter(p => p.clientId === clientProfile.id).forEach(p => {
        if (!clientProjectIds.includes(p.id)) clientProjectIds.push(p.id);
      });
    }
    
    const deliverables = db.deliverables.filter(d => clientProjectIds.includes(d.projectId));
    const milestones = db.milestones.filter(m => clientProjectIds.includes(m.projectId));
    
    const approvals = [...deliverables.map(d => ({
      id: d.id,
      name: d.name,
      status: d.status,
      projectId: d.projectId,
      type: "deliverable"
    })), ...milestones.map(m => ({
      id: m.id,
      name: m.title,
      status: m.status === "completed" ? "approved" : m.status === "active" ? "pending" : "pending",
      projectId: m.projectId,
      type: "milestone"
    }))];
    
    res.json({ approvals });
  });

  // MEETINGS API
  app.get("/api/meetings", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const clientProfile = db.clients.find(c => c.userId === req.user.id);
    const clientProjectIds = db.project_members
      .filter(pm => pm.userId === req.user.id)
      .map(pm => pm.projectId);
    if (clientProfile) {
      db.projects.filter(p => p.clientId === clientProfile.id).forEach(p => {
        if (!clientProjectIds.includes(p.id)) clientProjectIds.push(p.id);
      });
    }
    
    const milestones = db.milestones.filter(m => clientProjectIds.includes(m.projectId));
    
    const meetings = milestones.map((m, i) => ({
      id: `mt-${i}`,
      title: `${m.title} Review Meeting`,
      date: m.date,
      startTime: "10:00",
      endTime: "11:00",
      projectId: m.projectId,
      status: m.status === "completed" ? "completed" : "upcoming"
    }));
    
    res.json({ meetings });
  });

  // TEAM API
  app.get("/api/team", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const clientProfile = db.clients.find(c => c.userId === req.user.id);
    const clientProjectIds = db.project_members
      .filter(pm => pm.userId === req.user.id)
      .map(pm => pm.projectId);
    if (clientProfile) {
      db.projects.filter(p => p.clientId === clientProfile.id).forEach(p => {
        if (!clientProjectIds.includes(p.id)) clientProjectIds.push(p.id);
      });
    }
    const teamMembers = db.team_members || [];
    const scopedTeam = req.user.role === "Super Admin" || req.user.role === "Admin"
      ? teamMembers
      : teamMembers.filter(tm => clientProjectIds.includes(tm.projectId));
    res.json({ team: scopedTeam, client: clientProfile || null });
  });

  // REPORTS API
  app.get("/api/reports", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const clientProfile = db.clients.find(c => c.userId === req.user.id);
    const clientProjectIds = db.project_members.filter(pm => pm.userId === req.user.id).map(pm => pm.projectId);
    if (clientProfile) {
      db.projects.filter(p => p.clientId === clientProfile.id).forEach(p => {
        if (!clientProjectIds.includes(p.id)) clientProjectIds.push(p.id);
      });
    }
    const projects = db.projects.filter(p => clientProjectIds.includes(p.id));
    const invoices = db.invoices.filter(i => clientProfile && (i.clientId === clientProfile.id || i.company === clientProfile.company));
    const deliverables = db.deliverables.filter(d => clientProjectIds.includes(d.projectId));
    res.json({ 
      summary: { projects: projects.length, invoices: invoices.length, deliverables: deliverables.length },
      projects, invoices, deliverables 
    });
  });

  // SETTINGS API
  app.get("/api/settings", (req: any, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    res.json({ settings: { profile: req.user, notifications: {} } });
  });

  app.put("/api/settings/profile", (req: any, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const { firstName, lastName, username } = req.body;
    const db = loadDatabase();
    const user = db.users.find(u => u.id === req.user.id);
    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.username = username || user.username;
      saveDatabase(db);
    }
    res.json({ success: true, user: { ...req.user, firstName, lastName, username } });
  });

  // FILES API
  app.get("/api/files", (req: any, res) => {
    const db = loadDatabase();
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const clientProfile = db.clients.find(c => c.userId === req.user.id);
    const clientProjectIds = db.project_members
      .filter(pm => pm.userId === req.user.id)
      .map(pm => pm.projectId);
    if (clientProfile) {
      db.projects.filter(p => p.clientId === clientProfile.id).forEach(p => {
        if (!clientProjectIds.includes(p.id)) clientProjectIds.push(p.id);
      });
    }
    
    const files = db.files
      .filter(f => clientProjectIds.includes(f.projectId))
      .map(f => ({ ...f, size: f.fileSize || "1.0 MB" }));
    
    res.json({ files });
  });

  app.get("/api/settings/security", (req: any, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    res.json({ security: { twoFactorEnabled: false, lastPasswordChange: new Date().toISOString() } });
  });


  // API Route - Consultant Chat Endpoint powered by Gemini
  app.post("/api/consultant", async (req, res) => {
    try {
      const { prompt } = req.body;
      const key = process.env.GEMINI_API_KEY;

      if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
        // Dynamic smart technical response when offline/no api key
        return res.json({
          text: `[AFRIWAID EXPERT CONSULTANT - OFFLINE SIMULATION]

Thank you for consulting AfriWaid. Your query: "${prompt?.length > 50 ? prompt.substring(0, 50) + "..." : prompt}" has been routed to our simulated architectural pipeline.

Here is custom guidance for your query:
1. **Decoupled System Model**: When deploying systems of this scale, prefer isolating backend logic into clean, context-specific microservices (e.g., Express + @google/genai for AI routing, and isolated workers for heavy math).
2. **Deterministic Safes**: Rather than feeding raw, unchecked results to client panels, wrap your endpoints in strict validation controllers with custom JSON schemas.
3. **Typography & Layout Priority**: Ensure interfaces scale systematically from dense mobile tracking portals to wide dual-monitor operational screens.

*To enable real, active live AI consulting powered by Google's Gemini 3.5 model, please declare your active gemini key in the **Settings > Secrets** panel in AI Studio.*`
        });
      }

      // Initialize modern GoogleGenAI client
      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are the lead AI systems and digital product consultant at AfriWaid Studio.
AfriWaid is a premium, futuristic, global, enterprise-ready digital innovation hub, tech studio, and publishing sandbox.
Your communication style is highly professional, technical, direct, and elite. You speak with authority. 
Do NOT write promotional sales pitches, marketing fluff, or generic greetings. Avoid emojis entirely.
Use markdown effectively, specifically monospaced blocks (using backticks) for system terms, API endpoints, file structures, and coordinates.
Structure your answers with clean hierarchical sections. Give actual technical advice regarding software, systems design, digital strategy, branding, video editing workflows, or risk calculations depending on what the user asks.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text || "Consultation complete. Our microservices have concluded response formulation." });
    } catch (e: any) {
      console.error("Gemini API Error in /api/consultant", e);
      res.status(500).json({ error: e.message || "Failed to process consultation on the server side." });
    }
  });

  // API Route - Lab Chatbot Endpoint powered by Gemini (answer questions about projects and tech stack)
  app.post("/api/ai-lab/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const key = process.env.GEMINI_API_KEY;

      if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Message content is required" });
      }

      if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
        let simulatedText = "";
        const query = message.toLowerCase();
        if (query.includes("waidpulse") || query.includes("pulse")) {
          simulatedText = `**[AFRIWAID LAB BOT - OFFLINE SIMULATION]**\n\nThe **WaidPulse AI Engine** is our premier autonomous orchestration middleware. It seamlessly bridges enterprise SQL databases with Gemini models. \n\n**Core technologies used:** React, Express, @google/genai, TypeScript, and D3.js. It features a stunning real-time latency visualizer.\n\n*To enable real live Gemini-powered chats, configure your \`GEMINI_API_KEY\` in the **Settings > Secrets** panel in AI Studio.*`;
        } else if (query.includes("kortex") || query.includes("decision") || query.includes("matrix") || query.includes("mcda")) {
          simulatedText = `**[AFRIWAID LAB BOT - OFFLINE SIMULATION]**\n\nThe **KonsOSDecision Matrix** is our premium Multi-Criteria Decision Analysis (MCDA) risk calculation system. It combines weighted formulas with semantic vector collections.\n\n**Core technologies used:** React, Node.js, TypeScript, Recharts, and Vector databases.\n\n*To enable real live Gemini-powered chats, configure your \`GEMINI_API_KEY\` in the **Settings > Secrets** panel in AI Studio.*`;
        } else if (query.includes("tech") || query.includes("stack") || query.includes("languages") || query.includes("framework")) {
          simulatedText = `**[AFRIWAID LAB BOT - OFFLINE SIMULATION]**\n\nAfriWaid is built on enterprise-grade software standards:\n\n- **TypeScript 5.8**: For bulletproof type contracts.\n- **React 19 & Vite**: Ultra-fast component rendering.\n- **PostgreSQL 17**: Safe relational storage.\n- **Node & Express**: High-speed REST middleware.\n- **@google/genai**: Next-gen Gemini 3.5 integrations.\n\n*To enable real live Gemini-powered chats, configure your \`GEMINI_API_KEY\` in the **Settings > Secrets** panel in AI Studio.*`;
        } else if (query.includes("brand") || query.includes("canvas") || query.includes("design") || query.includes("style")) {
          simulatedText = `**[AFRIWAID LAB BOT - OFFLINE SIMULATION]**\n\nThe **AfriWaid Brand Canvas** is our flagship stylebook and motion design guideline. It establishes our iconic **Cosmic Slate Theme** with geometric alignments and micro-animations using Space Grotesk and Inter.\n\n*To enable real live Gemini-powered chats, configure your \`GEMINI_API_KEY\` in the **Settings > Secrets** panel in AI Studio.*`;
        } else {
          simulatedText = `**[AFRIWAID LAB BOT - OFFLINE SIMULATION]**\n\nWelcome to AfriWaid's AI Lab Assistant! I can help you with questions about our **WaidPulse AI Engine**, **KonsOSDecision Matrix**, **Brand Canvas**, or our premium **TypeScript & React 19 Tech Stack**.\n\nHow can I help you learn about our software capabilities today?\n\n*(Note: AI Chat is currently running in local offline simulation mode. Configure a \`GEMINI_API_KEY\` to enable real live chats).*`;
        }
        return res.json({ text: simulatedText });
      }

      // Initialize modern GoogleGenAI client
      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are AfriBot, the dedicated interactive AI Assistant situated within the Neural Architecture & Design Lab (AI Lab) of AfriWaid Studio.
Your sole mission is to assist visitors in understanding AfriWaid's projects, core technology stack, services, and engineering capabilities.

Here is the exact, unshakeable ground truth regarding our showcase projects:
1. WaidPulse AI Engine (Category: AI, Status: Active)
   - Description: An advanced orchestration middleware connecting enterprise databases with autonomous LLM agents to automate cross-departmental operations.
   - Core Concepts: Maps natural language queries safely to SQL metadata nodes and vector collections. Features an interactive node graph visualizer built with React and D3.js.
   - Tech Stack: React, Express, @google/genai, TypeScript, Tailwind CSS, D3.js.
   - Case Study: Solved rigid logistics pipelines by creating self-correcting logistic triggers, dropping dispatch friction from 3.5 hours to 12 minutes.
   - Key Features: Dynamic Multi-Agent Orchestration, Secure SQL filters, real-time operation latency analysis, diagnostic sandboxes, prompt injection safeguards.

2. KonsOSDecision Matrix (Category: KI - Konsmik Intelligence, Status: QA)
   - Description: A secure cognitive platform applying Multi-Criteria Decision Analysis (MCDA) algorithms paired with semantic memory indexes to evaluate risk vectors.
   - Core Concepts: Mathematically evaluates complex architectural risks, extracts intelligence from regulatory papers, maps dependencies as SVG nodes.
   - Tech Stack: TypeScript, Recharts, Node.js, Vector DB, React-Flow.
   - Case Study: Automated compliance checks for a leading fund, reducing screening duration by 92% and flagging hidden license contradictions.
   - Key Features: Interactive Matrix scoring, semantic memory searches across PDF files, SVG dependency graphs.

3. AfriWaid Brand Canvas (Category: Design, Status: In Development)
   - Description: The complete visual identity, interactive guidelines, and premium motion system created for our own enterprise positioning.
   - Core Concepts: Establishes the 'Cosmic Slate' aesthetic combining deep off-black backdrops, responsive micro-interactions, custom geometric gridlines, and typographic hierarchy utilizing Space Grotesk.
   - Tech Stack: Figma, Motion, Tailwind CSS, SVG Animation, Blender.
   - Key Features: Generative vector particle backgrounds, dynamic typographies (Inter & Space Grotesk fonts), transitions.

Here is the exact ground truth regarding our Standard Technical Stack:
- TypeScript 5.8: For robust static analysis and bulletproof contract validation.
- React 19 & Vite: Powering atomic virtual layouts and blazing fast preview rendering.
- PostgreSQL 17: Providing durable, relational database persistence.
- Docker Containers: Enabling hermetic, multi-platform container deployments on Cloud Run.
- Node & Express: Handling high-throughput backend APIs and middle-tier security routing.
- Google GenAI SDK (@google/genai): For native integration of Gemini 3.5 LLMs and intelligent agent nodes.

Instructions for communication:
- Be highly helpful, technical, concise, and professional. Speak with executive-level clarity and tech confidence.
- Refer directly to these actual projects and tech stacks when asked.
- Avoid loose speculative answers when asked about tools, projects, or statistics; stick strictly to the facts above.
- If the user asks general technical, web development, or AI questions, you can answer them, but always tie back to how AfriWaid utilizes these tools (e.g. how we use TypeScript 5.8 or React 19 / @google/genai/Gemini 3.5 to construct these projects).
- Use clean Markdown and formatting in your answers. Keep your prose clean, readable, objective, and developer-friendly. Avoid excessive exclamation marks and fluff.`;

      // Structure historical conversation for @google/genai
      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((item: any) => {
          if (item.text && item.role) {
            contents.push({
              role: item.role === "user" ? "user" : "model",
              parts: [{ text: item.text }]
            });
          }
        });
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text || "Diagnostic query successfully resolved. No text payload received." });
    } catch (e: any) {
      console.error("Gemini API Error in /api/ai-lab/chat", e);
      res.status(500).json({ error: e.message || "Failed to process chat consultation on the server side." });
    }
  });

  // API Route - Google Analytics AI Report generation
  app.post("/api/analytics/ai-report", async (req, res) => {
    try {
      const { email, googleAnalyticsId } = req.body;
      const key = process.env.GEMINI_API_KEY;

      if (!key || key === "MY_GEMINI_API_KEY" || key.trim() === "") {
        // Return a beautifully detailed, simulated traffic report for AfriWaid Studio
        const simulatedReport = `### 📊 Google Analytics Intelligence Report for \`${googleAnalyticsId || "G-AFRIWAID99"}\`

**Linked Account:** \`${email || "waidsoko@gmail.com"}\`  
**Time Range:** Last 30 Days (Direct Stream Synchronized)

---

#### 📈 1. Traffic Performance Synthesis
* **Acquisition Surge (+14.2%):** Direct traffic and organic search remain your highest conviction acquisition vectors. Visitors showing interest in the **WaidPulse AI Engine** are converting to outbound inquiries at a **4.2%** rate.
* **Engagement Velocity:** Average session duration stands at **4m 12s**, with the highest dwell times recorded on the /publishing (Publishing Hub) deep-dive case studies.
* **Bounce Rate Optimality:** Your bounce rate is currently locked at **28.4%**, indicating a highly relevant user audience mapping perfectly to your tech-focused positioning.

---

#### 🚀 2. Strategic Growth Initiatives (AI Consultant Recommendations)
1. **Accelerate Agritech Case Studies:** Organic Google Search queries for \`African agritech agent systems\` have increased by **350%**. Reposition your agritech case study to the top of your landing page to capture this high-intent traffic immediately.
2. **Double-Down on LinkedIn Backlinks:** Your referral logs show **LinkedIn** accounts for **54%** of all social traffic. Share the live latency visualizer video directly on LinkedIn to prompt a viral engineering wave.
3. **Establish an API Docs Sandbox:** Dev traffic shows a **65%** exit rate on pages lacking interactive endpoints. Adding a live, mock Swagger sandbox or terminal playground inside the lab will drive active session length up to **6+ minutes**.`;
        
        return res.json({ text: simulatedReport });
      }

      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Generate a high-fidelity, professional Google Analytics 4 performance report and marketing recommendation analysis for AfriWaid Studio.
Associated account email: ${email || "waidsoko@gmail.com"}
Associated Measurement ID: ${googleAnalyticsId || "G-AFRIWAID99"}

The report should include:
1. Traffic Performance Synthesis (mock realistic high-scale numbers for AfriWaid's services like the WaidPulse AI Engine and KonsOSDecision Matrix)
2. Traffic channels breakdown (organic, social, direct, referral)
3. Actionable AI Recommendations for maximizing conversion rates on inquiries and CV downloads.

Return the response in a beautiful, structured Markdown format with bold highlights. Do not include introductory conversational fluff. Speak with absolute authority and elite consulting tone.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.6,
        }
      });

      res.json({ text: response.text || "Report generated." });
    } catch (e: any) {
      console.error("Gemini API Error in /api/analytics/ai-report", e);
      res.status(500).json({ error: e.message || "Failed to formulate GA4 AI report." });
    }
  });

  // Vite integration middleware
  if (!IS_PRODUCTION_RUNTIME) {
    const viteInstance = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(viteInstance.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // ----------------------------------------------------
  // WEBSOCKET SERVER LISTENERS
  // ----------------------------------------------------
  wss.on("connection", (ws: WebSocket, request: any) => {
    let currentUserId: string | null = null;

    ws.on("message", (msgString: string) => {
      try {
        const data = JSON.parse(msgString);
        if (data.type === "auth:init") {
          const { token } = data.payload || {};
          if (token) {
            const db = loadDatabase();
            const session = db.sessions.find(s => s.token === token && s.isActive);
            if (session && new Date(session.expiresAt) > new Date()) {
              currentUserId = session.userId;
              activeConnections.set(currentUserId, ws);
              
              ws.send(JSON.stringify({ 
                type: "auth:success", 
                payload: { userId: currentUserId, message: "Real-time communication bridge established successfully." } 
              }));

              const notifications = db.notifications.filter(n => n.userId === currentUserId && !n.read);
              ws.send(JSON.stringify({
                type: "notifications:sync",
                payload: { count: notifications.length, list: notifications }
              }));
            } else {
              ws.send(JSON.stringify({ type: "auth:fail", payload: { error: "Session expired or invalid" } }));
            }
          }
        } else if (data.type === "chat:typing") {
          const { conversationId, typing } = data.payload || {};
          if (currentUserId && conversationId) {
            broadcastToConversation(conversationId, {
              type: "chat:typing_broadcast",
              payload: { conversationId, userId: currentUserId, typing }
            });
          }
        }
      } catch (err) {
        console.error("WS Message Error", err);
      }
    });

    ws.on("close", () => {
      if (currentUserId) {
        activeConnections.delete(currentUserId);
      }
    });
  });

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AFRIWAID BOOTSTRAPPING] Full-stack engine securely running on port ${PORT}`);
  });

  server.on("upgrade", (request, socket, head) => {
    const url = request.url || "";
    // Do not intercept Vite HMR WebSockets
    if (url.includes("/vite") || url.includes("vite")) {
      return;
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });
}

startServer();
