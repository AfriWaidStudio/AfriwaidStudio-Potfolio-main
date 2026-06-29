# AfriWaid Studio - Migration Map

**Created:** 2026-06-29
**Purpose:** Track migration progress using the Strangler Pattern

---

## Migration Phases Overview

| Phase | Name | Status | Target |
|-------|------|--------|--------|
| 1 | Codebase Audit | ✅ DONE | audit-report.md |
| 2 | New Foundation | ⏳ PENDING | Directory structure |
| 3 | Routing Extraction | ⏳ PENDING | router.tsx |
| 4 | UI Primitives | ⏳ PENDING | components/ui/ |
| 5 | Feature Modularization | ⏳ PENDING | features/* |
| 6 | Service Layer | ⏳ PENDING | services/ |
| 7 | State Management | ⏳ PENDING | TanStack Query |
| 8 | Backend Refactor | ⏳ PENDING | backend/src/ |

---

## Completed Work (2026-06-29)

| Task | Status | Files |
|------|--------|-------|
| Security hardening - bcrypt passwords | ✅ DONE | server.ts, .env |
| AuthContext fallback user fix | ✅ DONE | src/components/AuthContext.tsx:80 |
| AdminDashboard authorizedRole fix | ✅ DONE | src/components/AdminDashboard.tsx:62-155 |
| ModeratorDashboard created | ✅ DONE | src/components/ModeratorDashboard.tsx |
| AuditorDashboard created | ✅ DONE | src/components/AuditorDashboard.tsx |
| DeveloperDashboard created | ✅ DONE | src/components/DeveloperDashboard.tsx |
| OperatorDashboard created | ✅ DONE | src/components/OperatorDashboard.tsx |
| All workspace logout handlers fixed | ✅ DONE | All workspace layouts |
| TypeScript compilation | ✅ PASSING | - |

---

## File Migration Map

### Frontend

| Original File | New Location | Status | Notes |
|---------------|--------------|--------|-------|
| `src/App.tsx` | `src/app/App.tsx` | PENDING | Split into providers + router |
| `src/main.tsx` | `src/app/main.tsx` | PENDING | Entry point |
| `src/components/AuthContext.tsx` | `src/features/auth/AuthContext.tsx` | PENDING | Auth provider |
| `src/components/AdminDashboard.tsx` | `src/pages/Admin/` | PENDING | Admin pages |
| `src/components/ClientPortal.tsx` | `src/pages/Client/` | PENDING | Client pages |
| `src/components/ProjectsPage.tsx` | `src/pages/Projects/` | PENDING | Project pages |
| `src/components/ServicesPage.tsx` | `src/pages/Services/` | PENDING | Service pages |
| `src/components/AILab.tsx` | `src/pages/AILab/` | PENDING | AI Lab pages |
| `src/components/WritingHub.tsx` | `src/pages/Publishing/` | PENDING | Publishing pages |
| `src/components/MediaHub.tsx` | `src/pages/Media/` | PENDING | Media pages |
| `src/components/CVCenter.tsx` | `src/pages/Resume/` | PENDING | CV pages |
| `src/components/AboutUs.tsx` | `src/pages/Company/` | PENDING | Company pages |
| `src/components/BuildJournal.tsx` | `src/pages/BuildJournal/` | PENDING | Journal pages |
| `src/components/Login.tsx` | `src/features/auth/Login.tsx` | PENDING | Auth component |
| `src/components/Register.tsx` | `src/features/auth/Register.tsx` | PENDING | Auth component |
| `src/components/ForgotPassword.tsx` | `src/features/auth/ForgotPassword.tsx` | PENDING | Auth component |
| `src/components/ResetPassword.tsx` | `src/features/auth/ResetPassword.tsx` | PENDING | Auth component |
| `src/components/VerifyEmail.tsx` | `src/features/auth/VerifyEmail.tsx` | PENDING | Auth component |
| `src/components/ContactForm.tsx` | `src/components/shared/ContactForm.tsx` | PENDING | Shared component |
| `src/components/ImageUploadDropzone.tsx` | `src/components/ui/ImageUploadDropzone.tsx` | PENDING | UI primitive |

### Backend

| Original File | New Location | Status | Notes |
|---------------|--------------|--------|-------|
| `server.ts` | `backend/src/server.ts` | PENDING | Entry point only |
| `server.ts` routes | `backend/src/routes/` | PENDING | Split by domain |
| `server.ts` DB logic | `backend/src/repositories/` | PENDING | Data access layer |
| `server.ts` auth | `backend/src/services/auth/` | PENDING | Auth service |

---

## Component Breakdown Plan

### App.tsx (1,544 lines) → Split into:

1. **`src/app/AppProviders.tsx`**
   - AuthProvider wrapper
   - ThemeProvider wrapper
   - QueryClientProvider wrapper

2. **`src/app/router.tsx`**
   - Route definitions
   - ProtectedRoute component
   - RoleProtectedRoute component

3. **`src/app/App.tsx`**
   - Minimal shell with Outlet

4. **`src/pages/Home/Home.tsx`**
   - Hero section
   - Statistics
   - Tech stack display

5. **`src/pages/Projects/ProjectsPage.tsx`**
   - Project grid
   - Filtering logic

6. **`src/pages/Services/ServicesPage.tsx`**
   - Service cards
   - Inquiry form

### AdminDashboard.tsx (1,520+ lines) → Split into:

1. **`src/pages/Admin/AdminDashboard.tsx`** - Shell only
2. **`src/pages/Admin/tabs/AnalyticsTab.tsx`**
3. **`src/pages/Admin/tabs/ProjectsTab.tsx`**
4. **`src/pages/Admin/tabs/ArticlesTab.tsx`**
5. **`src/pages/Admin/tabs/JournalTab.tsx`**
6. **`src/pages/Admin/tabs/CVTab.tsx`**
7. **`src/pages/Admin/tabs/MediaTab.tsx`**
8. **`src/pages/Admin/tabs/StatsTab.tsx`**
9. **`src/pages/Admin/tabs/TestimonialsTab.tsx`**
10. **`src/pages/Admin/tabs/TeamTab.tsx`**
11. **`src/pages/Admin/tabs/ServicesTab.tsx`**
12. **`src/pages/Admin/tabs/UsersTab.tsx`**
13. **`src/pages/Admin/tabs/RolesTab.tsx`**
14. **`src/pages/Admin/tabs/AuditLogsTab.tsx`**
15. **`src/pages/Admin/tabs/CustomizationTab.tsx`**

### ClientPortal.tsx (636 lines) → Split into:

1. **`src/pages/Client/ClientPortal.tsx`** - Shell only
2. **`src/pages/Client/tabs/WorkspaceTab.tsx`**
3. **`src/pages/Client/tabs/DriveTab.tsx`**
4. **`src/pages/Client/tabs/BillingTab.tsx`**
5. **`src/pages/Client/tabs/SupportTab.tsx`**
6. **`src/pages/Client/tabs/AdvisoryTab.tsx`**
7. **`src/pages/Client/tabs/CredentialsTab.tsx`**

---

## Feature Module Structure

```
src/features/
├── auth/
│   ├── AuthContext.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   ├── ResetPassword.tsx
│   └── api.ts
├── projects/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types.ts
├── services/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types.ts
├── ai/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types.ts
├── clients/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types.ts
└── notifications/
    ├── components/
    ├── hooks/
    └── services/
```

---

## UI Primitive Library

| Primitive | Status | File |
|-----------|--------|------|
| Button | PENDING | `src/components/ui/Button.tsx` |
| Card | PENDING | `src/components/ui/Card.tsx` |
| Input | PENDING | `src/components/ui/Input.tsx` |
| Textarea | PENDING | `src/components/ui/Textarea.tsx` |
| Select | PENDING | `src/components/ui/Select.tsx` |
| Modal | PENDING | `src/components/ui/Modal.tsx` |
| Dialog | PENDING | `src/components/ui/Dialog.tsx` |
| Badge | PENDING | `src/components/ui/Badge.tsx` |
| Avatar | PENDING | `src/components/ui/Avatar.tsx` |
| Table | PENDING | `src/components/ui/Table.tsx` |
| Tabs | PENDING | `src/components/ui/Tabs.tsx` |
| Toast | PENDING | `src/components/ui/Toast.tsx` |
| Skeleton | PENDING | `src/components/ui/Skeleton.tsx` |

---

## Backend Module Structure

```
backend/src/
├── server.ts           # Entry point only
├── app.ts              # Express app setup
├── config/
│   ├── database.ts
│   └── env.ts
├── routes/
│   ├── auth.routes.ts
│   ├── admin.routes.ts
│   ├── projects.routes.ts
│   ├── clients.routes.ts
│   └── ...
├── controllers/
│   ├── auth.controller.ts
│   ├── admin.controller.ts
│   └── ...
├── services/
│   ├── auth.service.ts
│   ├── ai.service.ts
│   ├── email.service.ts
│   └── ...
├── repositories/
│   ├── user.repository.ts
│   ├── project.repository.ts
│   └── ...
├── middleware/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   └── error.middleware.ts
├── websocket/
│   └── socket.service.ts
├── types/
│   └── index.ts
└── utils/
    ├── logger.ts
    └── crypto.ts
```

---

## Progress Tracking

### Phase 1: Codebase Audit
- [x] Analyze oversized components
- [x] Identify state management issues
- [x] Document API inconsistencies
- [x] Identify security risks
- [x] Generate audit-report.md
- [x] Generate migration-map.md

### Phase 1.5: Security Hardening
- [x] Create .env file with secure secrets
- [x] Replace SHA256 password hashing with bcrypt
- [x] Remove hardcoded admin password
- [x] Update server.ts with secure authentication
- [x] Install bcrypt dependencies
- [x] Verify TypeScript compilation

### Phase 2: Foundation Directories
- [x] Create `src/app/` directory
- [x] Create `src/pages/` directory
- [x] Create `src/features/` directory
- [x] Create `src/services/` directory
- [x] Create `src/hooks/` directory
- [x] Create `src/api/` directory
- [x] Create `src/utils/` directory
- [x] Create `src/constants/` directory
- [x] Create `src/lib/` directory
- [x] Create `src/components/ui/` directory
- [x] Create `src/components/shared/` directory
- [x] Create `src/workspaces/admin/` directory
- [x] Create `src/workspaces/client/` directory
- [x] Create `src/app/guards/` directory
- [x] Create `src/app/router/` directory

### Phase 3: Workspace Layouts
- [x] Create AdminWorkspaceLayout component
- [x] Create ClientWorkspaceLayout component
- [x] Integrate layouts with existing App.tsx
- [x] Preserve existing ClientPortal functionality
- [x] Preserve existing AdminDashboard functionality
- [x] Add BrowserRouter to main.tsx
- [x] Fix useLocation context error

### Phase 4: UI Primitives
- [x] Create Button primitive
- [x] Create Card primitive
- [x] Create Input primitive
- [x] Create Textarea primitive
- [x] Create Badge primitive
- [x] Create Modal primitive
- [x] Create typography tokens

### Phase 5: Service Layer
- [x] Create api.ts service
- [x] Create auth.ts service
- [x] Create projects.ts service

### Phase 1.6: Demo Accounts
- [x] Add Admin account (admin@afriwaid.com)
- [x] Add Moderator account (moderator@afriwaid.com)
- [x] Add Auditor account (auditor@afriwaid.com)
- [x] Add Developer account (dev@afriwaid.com)
- [x] Add Operator account (operator@afriwaid.com)
- [x] Document demo accounts in .kilo/DEMO-ACCOUNTS.md
- [x] Remove duplicate "Admin Dashboard" from WORKSPACE HUB dropdown
- [x] Test all 8 login accounts (all passing)

---

## Notes

- All migrations use the Strangler Pattern - old code coexists until fully migrated
- No functionality is removed until replacement is verified
- API contracts remain unchanged during migration
- TypeScript interfaces are preserved