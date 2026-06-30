# Portal Production Readiness Audit

Date: 2026-06-30  
Route audited: `http://localhost:3000/portal`  
Scope: frontend route ownership, client portal UX, API auth/data exposure, server architecture, dependencies, operations.

## Executive Summary

The project compiles (`npm run lint` / `tsc --noEmit`) and the server returns the SPA shell for `/portal`. Authenticated smoke checks for the main portal APIs returned HTTP 200 with the seeded client account.

The app is not production-ready. The biggest blockers are:

1. The live app mounts `src/App.tsx`; `src/app/router/AppRouter.tsx` is unused dead routing code.
2. Several client APIs return private seeded client data without authentication by falling back to user `u-2`.
3. The frontend contains offline/static auth bypasses and visible seed credential shortcuts.
4. The backend exposes debug verification and reset tokens in API responses.
5. Auth token storage/naming is inconsistent, breaking WebSocket auth and shared API service auth.
6. Critical route links in the sidebar point to sub-routes that the live `App.tsx` does not render, creating blank portal screens.
7. The API is backed by a mutable JSON file with no transactional safety, locking, migration strategy, or production persistence.

## Verification Performed

- `npm run lint`: passed.
- `npm audit --json`: 2 high vulnerabilities through `@mapbox/node-pre-gyp` / `tar`, likely via native `bcrypt`.
- `GET http://localhost:3000/portal`: HTTP 200 SPA shell.
- Authenticated seeded client smoke test:
  - `/api/auth/me`: 200
  - `/api/projects`: 200
  - `/api/deliverables`: 200
  - `/api/approvals`: 200
  - `/api/invoices`: 200
  - `/api/meetings`: 200
  - `/api/team`: 200
  - `/api/reports`: 200
  - `/api/settings`: 200
  - `/api/files`: 200
- Unauthenticated smoke test:
  - `/api/deliverables`: 200, leaks deliverables.
  - `/api/approvals`: 200, leaks approvals using fallback `u-2`.
  - `/api/meetings`: 200, leaks meetings using fallback `u-2`.
  - `/api/team`: 200, leaks team/client data.
  - `/api/reports`: 200, leaks report/project data using fallback `u-2`.
  - `/api/projects`, `/api/files`, `/api/invoices`, `/api/settings`: 401.

## P0 Production Blockers

1. `src/main.tsx` mounts `App.tsx`, so `AppRouter.tsx` is unused.
2. There are two routing models: tab-state routing in `App.tsx` and React Router routes in `AppRouter.tsx`.
3. `AppRouter.tsx` imports `useAuth` from `components/AuthContext`, but the rest of the newer feature tree partly uses `features/auth`, creating auth context drift.
4. `App.tsx` redirects admin/moderator/auditor/developer/operator to `/workspace/...`.
5. The live portal rendering in `App.tsx` only handles a small hardcoded set of exact paths.
6. Sidebar children link to many paths not handled by `App.tsx`, causing blank workspace content.
7. `Sidebar.tsx` parent buttons with no children do not navigate, so top-level nav items such as Dashboard/Files/Team/Reports can be inert.
8. `src/app/navigation.ts` defines child routes such as `/portal/projects/archived`, `/portal/projects/templates`, `/portal/projects/calendar`, `/portal/projects/analytics` that are not rendered by `App.tsx`.
9. `/portal/deliverables/pending`, `/portal/deliverables/in-progress`, `/portal/deliverables/completed`, `/portal/deliverables/rejected`, `/portal/deliverables/history` are linked but not rendered.
10. `/portal/approvals/pending`, `/portal/approvals/approved`, `/portal/approvals/rejected` are linked but not rendered.
11. `/portal/invoices/receipts`, `/portal/invoices/payments` are linked but not rendered.
12. `/portal/meetings/upcoming`, `/portal/meetings/calendar`, `/portal/meetings/agenda`, `/portal/meetings/recordings` are linked but not rendered.
13. `/portal/messages/inbox`, `/portal/messages/unread`, `/portal/messages/channels`, `/portal/messages/files`, `/portal/messages/pinned`, `/portal/messages/search` are linked but not rendered.
14. `/portal/settings/profile`, `/portal/settings/notifications`, `/portal/settings/sessions`, `/portal/settings/api-keys`, `/portal/settings/appearance`, `/portal/settings/billing`, `/portal/settings/integrations` are linked but not rendered.
15. `server.ts` exposes `/api/deliverables` without requiring `req.user`.
16. `server.ts` exposes `/api/approvals` without requiring `req.user`.
17. `server.ts` exposes `/api/meetings` without requiring `req.user`.
18. `server.ts` exposes `/api/team` without requiring `req.user`.
19. `server.ts` exposes `/api/reports` without requiring `req.user`.
20. Several endpoints use `(req.user?.id || "u-2")`, leaking a seeded client account to anonymous users.
21. Frontend auth contains static offline bypass credentials for client and super admin.
22. Login UI exposes "Developers Quick Access Seed Checks" buttons.
23. Backend seeds hardcoded production-like passwords: `waidpulse`, `userpass`, `admin123`, `mod123`, `audit123`, `dev123`, `op123`.
24. Registration returns `debugVerificationToken`.
25. Forgot-password returns `debugResetToken`.
26. Resend-verification returns `debugVerificationToken`.
27. Google login endpoint accepts arbitrary email/name input and creates/logs in users without validating a real Google identity token.
28. Password update compares `user.passwordHash !== hashPassword(currentPassword)`, which is incorrect for bcrypt because hashes include random salts.
29. Auth tokens are stored in localStorage/sessionStorage, increasing XSS blast radius.
30. `AuthContext` stores non-remembered sessions in both sessionStorage and localStorage.
31. `App.tsx` WebSocket auth reads `auth_token` or `token`, but login writes `afriwaid_auth_token`, so live notifications likely never authenticate.
32. `src/services/api.ts` also reads `auth_token` or `token`, not `afriwaid_auth_token`, so shared service calls would miss auth.
33. Workspace logout manually deletes multiple localStorage keys and navigates by `window.location.href`, bypassing provider state and router flow.
34. `server.ts` uses `data-store.json` as a production datastore.
35. Database writes use whole-file read/write with no lock, transaction, or concurrency protection.
36. No CSRF protection for state-changing endpoints.
37. No security headers/CSP/Helmet configuration.
38. No global rate limiting on auth, AI, or mutation endpoints.
39. No upload body/file validation suitable for production.
40. `npm audit` reports 2 high vulnerabilities.

## P1 Major Product/UX Issues

41. Portal dashboard uses hardcoded stats instead of API-backed values.
42. Dashboard recent activity is placeholder repeated "Task updated" rows.
43. Timeline page is explicitly "coming soon".
44. Messages page is static/local, not connected to conversations/messages APIs.
45. Client pages mostly fetch once on mount and do not refresh or subscribe to updates.
46. Client pages generally log errors to console instead of showing user-facing error states.
47. Loading states are plain text, not skeletons or layout-stable placeholders.
48. Empty states lack meaningful recovery actions.
49. No pagination on client lists.
50. No sorting on client lists.
51. No filtering on client lists.
52. No search within portal data views.
53. No export/download flows for reports, invoices, deliverables, or files.
54. No optimistic update behavior.
55. No retry/backoff for failed API calls.
56. No stale-session handling when an API returns 401 inside portal pages.
57. No centralized API client used consistently by client pages.
58. No React Query usage despite dependency being installed.
59. No form validation library or shared validation contracts.
60. No end-to-end test around login -> portal -> navigation.
61. No route-level error boundary.
62. No app-level error boundary.
63. No not-authorized UX.
64. No blank-route fallback inside `DashboardLayout` for unsupported portal subpaths.
65. No mobile sidebar drawer implementation; the overlay appears but sidebar itself is always desktop-sized.
66. Workspace sidebars are fixed `w-64`, consuming mobile viewports.
67. Header/topbar and nested layouts risk duplicated navigation because `App.tsx` has global shell plus workspace shell.
68. Layout uses `h-screen` in dashboard shell, risking mobile browser viewport and content clipping issues.
69. Many strings contain mojibake characters (`ResumÃ©`, `Â©`, `â€¢`, etc.).
70. Branding/name is inconsistent: `AfriWaid`, `AfrIwaid`, `Afriwaid`, `WaidPulse`, `AeroGlobal`.
71. `package.json` name is `react-example`, not the product name.
72. Login copy exposes internal/security jargon that will confuse normal clients.
73. Portal contains hardcoded "SYSTEM OVERSEER: ARCH-1".
74. Buttons/icons lack consistent accessible names/tooltips.
75. No visible user profile/account menu in portal workspace.
76. No notification bell/unread indicator in the active portal layout.
77. No breadcrumb for many portal pages outside `DashboardLayout`.
78. No confirmation for destructive or financial actions.
79. No invoice payment integration; marking paid can be a simple POST.
80. No real file storage/download URLs; file API appears metadata-only.

## P2 Backend/API Design Issues

81. `server.ts` is monolithic and very large.
82. Route registration, seed data, persistence, WebSocket, AI calls, and auth are all in one file.
83. Types are mostly `any` in server request handlers and database structures.
84. No database schema validation.
85. No request body validation/sanitization layer.
86. No response shape versioning.
87. No OpenAPI/Swagger contract.
88. No migrations.
89. No production database adapter.
90. No indexing/query strategy.
91. No per-tenant authorization helper reused across endpoints.
92. Inconsistent authorization rules across similar endpoints.
93. Duplicate `/api/files` route definitions exist.
94. Some endpoints return all rows to admins without pagination.
95. Some client endpoints filter by company name instead of stable IDs.
96. Reports endpoint checks `invoice.clientId`, but seeded invoices appear company-based, causing incorrect report invoice counts.
97. Project/task/milestone mutations do not consistently verify project membership.
98. Invoice payment endpoint does not verify invoice ownership for clients.
99. Deliverable review endpoint does not verify the client owns the deliverable/project.
100. File upload endpoint needs size/type/storage/security checks.
101. WebSocket auth exists but frontend token mismatch breaks it.
102. WebSocket reconnection is missing.
103. WebSocket authorization should re-check permissions per conversation/notification.
104. Audit logs are capped in memory/JSON with no retention/export policy.
105. Audit log IP handling is not proxy-aware/trusted-proxy configured.
106. Session tokens are opaque random strings in JSON storage; no rotation strategy.
107. Session invalidation only works within this single process/data file model.
108. Password reset tokens are stored in plaintext.
109. Email verification tokens are stored/returned without email delivery integration.
110. No email provider abstraction.
111. AI endpoints are callable without clear rate limits/cost controls.
112. AI prompts include product claims and static analytics values.
113. No secrets validation at startup.
114. No env-specific configuration for port, data path, CORS, trusted origin, or production mode.
115. No structured logging.
116. No health/readiness endpoint observed.
117. No graceful shutdown persistence policy.
118. No backup/restore strategy for `data-store.json`.
119. No admin permission audit around role updates beyond a coarse permission.
120. `checkPermission` depends on mutable runtime data and needs a typed policy model.

## P3 Frontend Architecture Issues

121. `App.tsx` is monolithic and owns routing, layout, data loading, WebSocket, tab state, and CRUD handlers.
122. `AdminDashboard.tsx` appears extremely large and mixes many domains.
123. Dead/parallel directories exist: `components/AuthContext.tsx` and `features/auth/AuthContext.tsx`.
124. Dead/parallel portal layouts exist: `DashboardLayout` and `ClientWorkspaceLayout`.
125. `ClientWorkspaceLayout` is not used by the live `App.tsx` portal.
126. `AppRouter.tsx` defines routes not used by the mounted app.
127. Public pages are tab-rendered instead of URL-rendered in the live app.
128. Global navigation uses imperative `setActiveTab` and custom events.
129. Several route changes use `window.location.href` instead of router navigation.
130. Components import raw localStorage token values instead of using auth provider/API client.
131. No lazy loading/code splitting.
132. No bundle budget.
133. No performance instrumentation.
134. No visual regression tests.
135. No storybook/component fixtures.
136. No consistent data fetching abstraction.
137. No consistent toast/notification UX for save/error feedback.
138. No accessible modal/focus management audit.
139. No consistent page title/meta management.
140. No route metadata/source of truth for nav and permissions.

## P4 Testing/Delivery/Docs Issues

141. No unit tests.
142. No integration tests.
143. No end-to-end tests.
144. No API contract tests.
145. No auth/security regression tests.
146. No accessibility tests.
147. No performance tests.
148. No CI pipeline observed.
149. No deployment pipeline observed.
150. No production build smoke script.
151. No environment variable documentation beyond minimal examples.
152. README is minimal and not production onboarding-ready.
153. No runbook.
154. No incident response notes.
155. No backup/restore documentation.
156. No threat model.
157. No data retention/privacy documentation.
158. No license file.
159. No changelog/release process.
160. No issue/PR templates.

## Recommended Fix Plan

### Phase 1: Stop Data Leaks and Auth Bypasses

1. Require auth on all private portal APIs.
2. Remove every `(req.user?.id || "u-2")` fallback.
3. Remove frontend static auth bypasses and quick-access seed buttons from production builds.
4. Stop returning debug reset/verification tokens outside local dev.
5. Replace fake Google login with real ID-token verification or remove it.
6. Fix password verification to use `bcrypt.compare`.
7. Standardize on one token storage key and one auth provider.
8. Make WebSocket auth read the same token as HTTP auth.

### Phase 2: Make Routing Coherent

1. Pick one router: preferably React Router route objects via `AppRouter`.
2. Mount `AppRouter` from `main.tsx` or refactor `App.tsx` into providers/layouts.
3. Delete or quarantine dead router/layout/auth modules.
4. Make navigation generated from the same route manifest.
5. Add unsupported sub-route fallbacks instead of blank portal screens.
6. Make parent sidebar items navigate as links.

### Phase 3: Portal Product Completion

1. Replace dashboard placeholders with API-backed stats/activity.
2. Implement or hide "coming soon" Timeline.
3. Connect Messages to conversations/messages APIs and WebSocket.
4. Add error, empty, loading, stale-session, retry states.
5. Add filters/search/sort/pagination where data can grow.
6. Add secure file download/upload flows.
7. Add invoice ownership checks and real payment state workflow.

### Phase 4: Production Backend

1. Move off JSON-file storage to a real database.
2. Split `server.ts` into auth, users, projects, portal, files, invoices, AI, websocket modules.
3. Add request validation and typed response contracts.
4. Add authorization helpers for tenant/project ownership.
5. Add Helmet/CSP, CSRF strategy, rate limits, structured logs, health checks.
6. Add migrations, backups, and env validation.

### Phase 5: Release Confidence

1. Add Vitest/unit tests for auth helpers and route guards.
2. Add API tests for auth-required endpoints.
3. Add Playwright e2e for login, portal navigation, invoice/deliverable flows.
4. Add CI with lint, build, tests, audit.
5. Add production build smoke test and deployment runbook.
