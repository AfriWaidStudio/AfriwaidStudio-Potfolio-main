# AfriWaid Studio - Migration Plan & Directory Structure

**Created:** 2026-06-29
**Purpose:** Document empty directories and migration strategy

---

## Empty Directories Created (Phase 2)

These directories were created as part of the Strangler Pattern foundation:

### Application Structure
```
src/
├── app/                          # Application shell (PARTIAL - needs migration)
│   ├── guards/                   # Route guards (empty - workspace route created)
│   └── layouts/                  # Layout components (empty - using workspaces/)
├── pages/                        # Page components (empty - using App.tsx patterns)
├── features/                     # Feature modules (empty - using existing components)
│   ├── admin/
│   ├── ai/
│   ├── analytics/
│   ├── auth/
│   ├── chat/
│   ├── clients/
│   ├── media/
│   ├── notifications/
│   ├── projects/
│   ├── search/
│   └── services/
├── services/                     # API services (PARTIAL - api.ts, auth.ts, projects.ts created)
├── hooks/                        # Custom hooks (empty)
├── stores/                       # State management (empty)
├── utils/                        # Utility functions (empty)
├── constants/                    # Constants (empty)
├── lib/                          # Library code (empty)
├── api/                          # API client (empty)
├── animations/                   # Animation variants (empty)
├── components/
│   ├── layout/                   # Layout components (empty)
│   ├── navigation/               # Navigation components (empty)
│   ├── shared/                   # Shared components (empty)
│   ├── feedback/                 # Feedback components (empty)
│   ├── forms/                    # Form components (empty)
│   └── charts/                   # Chart components (empty)
└── theme/                        # Design system (PARTIAL - typography.ts created)
```

---

## Migration Strategy

### Approach: Strangler Pattern
- Old code coexists with new code
- No breaking changes during migration
- Incremental migration path

### Phase 1: Foundation (COMPLETED)
- [x] Create directory structure
- [x] Create workspace layouts
- [x] Create UI primitives
- [x] Create service layer

### Phase 2: Component Migration (IN PROGRESS)

#### Route: `/` (Home)
**Current:** `App.tsx` with tab state
**Target:** `pages/Home/Home.tsx`
**Status:** ✅ Home page components created
**Steps:**
1. ✅ Extract hero section to `Hero.tsx`
2. ✅ Extract statistics to `Statistics.tsx`
3. ✅ Create `pages/Home/index.tsx`
4. [ ] Update routing to use new Home page
5. [ ] Remove hero/stats from App.tsx

#### Route: `/projects`
**Current:** `ProjectsPage.tsx` component
**Target:** `pages/Projects/ProjectsPage.tsx`
**Status:** ✅ Projects page components created
**Steps:**
1. ✅ Extract project card to `ProjectCard.tsx`
2. [ ] Move to `pages/Projects/`

#### Route: `/services`
**Current:** `ServicesPage.tsx` component
**Target:** `pages/Services/ServicesPage.tsx`
**Steps:**
1. Extract service card to `ServiceCard.tsx`
2. Extract inquiry form to `InquiryForm.tsx`
3. Move to `pages/Services/`

#### Route: `/ai-lab`
**Current:** `AILab.tsx` component
**Target:** `pages/AILab/AILab.tsx`
**Steps:**
1. Extract chat message to `ChatMessage.tsx`
2. Extract prompt input to `PromptInput.tsx`
3. Move to `pages/AILab/`

#### Route: `/portal` (Client Workspace)
**Current:** `ClientPortal.tsx` with embedded tabs
**Target:** `pages/Client/ClientPortal.tsx` + `tabs/`
**Steps:**
1. Create `pages/Client/tabs/OverviewTab.tsx`
2. Create `pages/Client/tabs/ProjectsTab.tsx`
3. Create `pages/Client/tabs/TimelineTab.tsx`
4. Create `pages/Client/tabs/DeliverablesTab.tsx`
5. Create `pages/Client/tabs/ApprovalsTab.tsx`
6. Create `pages/Client/tabs/InvoicesTab.tsx`
7. Create `pages/Client/tabs/MeetingsTab.tsx`
8. Create `pages/Client/tabs/MessagesTab.tsx`
9. Create `pages/Client/tabs/SettingsTab.tsx`

#### Route: `/admin` (Admin Workspace)
**Current:** `AdminDashboard.tsx` with 15+ tabs
**Target:** `pages/Admin/AdminDashboard.tsx` + `tabs/`
**Steps:**
1. Create `pages/Admin/tabs/AnalyticsTab.tsx`
2. Create `pages/Admin/tabs/ProjectsTab.tsx`
3. Create `pages/Admin/tabs/ArticlesTab.tsx`
4. Create `pages/Admin/tabs/JournalTab.tsx`
5. Create `pages/Admin/tabs/CVTab.tsx`
6. Create `pages/Admin/tabs/MediaTab.tsx`
7. Create `pages/Admin/tabs/StatsTab.tsx`
8. Create `pages/Admin/tabs/TestimonialsTab.tsx`
9. Create `pages/Admin/tabs/TeamTab.tsx`
10. Create `pages/Admin/tabs/ServicesTab.tsx`
11. Create `pages/Admin/tabs/UsersTab.tsx`
12. Create `pages/Admin/tabs/RolesTab.tsx`
13. Create `pages/Admin/tabs/AuditLogsTab.tsx`
14. Create `pages/Admin/tabs/CustomizationTab.tsx`

### Phase 3: Feature Modules (PLANNED)

#### Auth Feature
```
src/features/auth/
├── components/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ForgotPassword.tsx
│   ├── ResetPassword.tsx
│   └── VerifyEmail.tsx
├── hooks/
├── services/
└── types.ts
```

#### Projects Feature
```
src/features/projects/
├── components/
├── hooks/
├── services/
└── types.ts
```

---

## Service Layer Migration

### Current State
- `src/services/api.ts` - Base API client
- `src/services/auth.ts` - Authentication service
- `src/services/projects.ts` - Projects service

### Next Services to Create
1. `clients.ts` - Client management
2. `invoices.ts` - Invoice management
3. `deliverables.ts` - Deliverable management
4. `messages.ts` - Chat messages
5. `notifications.ts` - Notifications
6. `ai.ts` - AI chat
7. `analytics.ts` - Analytics data

---

## UI Component Migration

### Existing Components to Migrate
- `AdminDashboard.tsx` - 1520+ lines
- `ClientPortal.tsx` - 636 lines
- `App.tsx` - 1544 lines

### UI Primitives Available
- Button
- Card
- Input
- Textarea
- Badge
- Modal

### Next Primitives to Create
- Table
- Tabs
- Dialog
- Dropdown
- Pagination
- Skeleton
- Toast
- SearchBar

---

## State Management Plan

### Current State
- useState throughout App.tsx
- No global state management

### Migration Path
1. Add Zustand for lightweight global state
2. Add TanStack Query for server state
3. Migrate tab state to URL params
4. Migrate auth state to store

---

## Route Protection Plan

### Current State
- Basic role checks in components

### Target State
```tsx
<Route element={<ProtectedRoute />}>
  <Route path="/portal" element={<ClientWorkspaceLayout />} />
  <Route path="/admin" element={<AdminWorkspaceLayout />} />
</Route>

<Route element={<RoleRoute roles={["Super Admin", "Admin"]} />}>
  <Route path="/admin/users" element={<UsersTab />} />
</Route>
```

---

## Typography Migration

### Current State
- Mixed font sizes throughout codebase
- `text-xs`, `text-sm`, `text-[10px]`, etc.

### Migration Steps
1. Replace all `text-xs` with `text-[11px] font-mono` (timestamps, metadata)
2. Replace all `text-sm` with `text-xs` (helper text, captions)
3. Replace all `text-base` with `text-base lg:text-lg` (body)
4. Use typography tokens from `src/theme/typography.ts`

---

## Success Criteria

- [x] Home page components created
- [ ] All routes work without breaking changes
- [ ] TypeScript compiles without errors
- [ ] All components use UI primitives
- [ ] All API calls use service layer
- [ ] State management is consistent
- [ ] Route protection is implemented
- [ ] Typography is consistent