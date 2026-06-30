# Prebuilt, Demo, Fake, Not-Working Inventory

Date: 2026-06-30  
Scope: UI primitives, composed components, pages, routes, auth, backend, data, demos, fake/simulated behavior, production gaps.

## A. UI Primitives And Design System

1. `Button` imports `typography` but does not use it.
2. `Input` has no `id` auto-linking when a `label` is provided.
3. `Select` has no `id` auto-linking when a `label` is provided.
4. `Textarea` needs the same label/error conventions as `Input`.
5. `Button` has no built-in loading state.
6. `Button` has no visible disabled styling beyond browser defaults.
7. `Button` has no icon-only accessible-name guard.
8. `Button` cannot render as a `Link`, forcing mixed button/link styling.
9. `Button` hardcodes rounded-lg, inconsistent with the 8px-radius product requirement in places.
10. `Button` focus ring has no dark-mode ring-offset handling.
11. `Button` variants are too few for destructive, warning, success, and neutral actions.
12. `Button` uses cyan as primary everywhere, ignoring app accent configuration.
13. `Button` left/right icon spacing is fixed and can misalign compact icon buttons.
14. `Button` does not expose `aria-busy`.
15. `Card` accepts `title` but originally typed it as string while callers pass React nodes.
16. `Card` wraps children in odd negative margin when title exists.
17. `Card` has no `description` slot layout when action is present.
18. `Card` has no compact/dense mode for dashboard surfaces.
19. `Card` has no loading/skeleton variant.
20. `Card` has no semantic element option such as `section`, `article`, or `button`.
21. `Card` styling is not connected to the global customization/accent system.
22. `Badge` has no neutral outline variant.
23. `Badge` does not normalize unknown statuses.
24. `Badge` has no icon support.
25. `Badge` uses color only for status meaning.
26. `Input` does not set `aria-invalid` when `error` is present.
27. `Input` does not bind helper/error text with `aria-describedby`.
28. `Input` has no left/right icon slots.
29. `Input` lacks clear button support for search fields.
30. `Input` has no loading/autocomplete state.
31. `Input` labels use text-base, too large for compact workspaces.
32. `Input` does not expose a full-width/inline layout mode.
33. `Input` has no password visibility pattern despite multiple password forms needing it.
34. `Select` uses a custom SVG background that may not work consistently in forced-colors mode.
35. `Select` has no placeholder option pattern.
36. `Select` has no multi-select or searchable select pattern.
37. `Select` does not expose `aria-invalid`.
38. `Select` does not bind helper/error text with `aria-describedby`.
39. `Select` does not support grouped options.
40. `Tabs` uses plain buttons but no `role="tablist"`.
41. `Tabs` buttons lack `role="tab"`.
42. `Tabs` lacks `aria-selected`.
43. `Tabs` lacks keyboard arrow navigation.
44. `Tabs` lacks panel linkage via `aria-controls`.
45. `Tabs` does not scroll horizontally on narrow screens.
46. `Tabs` has no disabled tab state.
47. `Tabs` has no count/badge support.
48. `Tabs` has no route-link mode.
49. `Table` uses `Record<string, any>[]`, losing type safety.
50. `Table` has no sorting support.
51. `Table` has no pagination support.
52. `Table` has no column width control.
53. `Table` has no row action slot.
54. `Table` has no loading state.
55. `Table` has no error state.
56. `Table` has no sticky header option.
57. `Table` does not support custom cell renderers.
58. `Table` does not declare `scope="col"` for headers.
59. `Modal` does not trap focus.
60. `Modal` does not restore focus after close.
61. `Modal` lacks `role="dialog"`.
62. `Modal` lacks `aria-modal`.
63. `Modal` lacks `aria-labelledby`.
64. `Modal` closes on backdrop click without configurable confirmation.
65. `Modal` has no close button in its own primitive.
66. `Modal` body scroll locking is missing.
67. `Modal` has no nested-modal strategy.
68. `Modal` z-index could conflict with overlays and search.
69. `Avatar` fallback is generic and not consistently derived from user names.
70. `Spinner` usage is inconsistent with custom inline spinners.
71. UI primitives do not share a central spacing scale.
72. UI primitives do not share a central radius scale.
73. UI primitives do not share a central color-token system.
74. UI primitives do not expose test ids consistently.
75. UI primitives are not documented with examples.

## B. Layout, Navigation, And Route Composition

76. `main.tsx` mounts `App.tsx`, leaving `AppRouter.tsx` effectively unused.
77. There are two route systems: tab-state rendering and React Router routes.
78. Public pages are rendered from `activeTab`, not true URL routes.
79. `/workspace/*` redirects exist in `App.tsx`, but `AppRouter.tsx` defines different route paths.
80. `AppRouter.tsx` can drift from live behavior because it is dead code.
81. Client portal has both `DashboardLayout` and `ClientWorkspaceLayout`.
82. `ClientWorkspaceLayout` is not the active live client portal layout.
83. Admin/moderator/auditor layouts duplicate logout logic.
84. Workspace layouts manually delete localStorage keys.
85. Workspace layouts use `window.location.href` instead of router/provider logout.
86. Topbar profile links previously pointed to `/dashboard/settings/*`.
87. Topbar language control is visual-only.
88. Topbar command button is visual-only.
89. Topbar notification bell is visual-only.
90. Topbar notification red dot is hardcoded.
91. Topbar profile dropdown has no outside-click close handler.
92. Topbar profile dropdown has no escape-key close behavior.
93. Topbar profile dropdown lacks menu roles.
94. Dashboard shell uses `h-screen`, which can clip mobile browser layouts.
95. Dashboard layout has no route-level error boundary.
96. Breadcrumb starts at home `/`, which can take client users out of the portal.
97. Breadcrumb does not include every generated route edge case.
98. Breadcrumb can show generic labels for unknown paths.
99. Sidebar nav and App route handling are separate source-of-truth systems.
100. Sidebar does not derive permissions from auth roles.
101. Sidebar child badges are hardcoded.
102. Sidebar active matching for parent routes can over-highlight broad paths.
103. Sidebar width is fixed and can feel heavy on medium screens.
104. Mobile drawer has no focus trap.
105. Mobile drawer has no close button inside the drawer.
106. Mobile drawer does not close on escape.
107. Mobile drawer duplicates sidebar DOM instead of moving one instance.
108. Workspace shell does not persist collapsed sidebar state.
109. Workspace shell has no skip-to-content link.
110. Workspace shell lacks page-level metadata/title updates.
111. `/portal/projects/templates` currently displays an intentional empty state, not real templates.
112. `/portal/projects/calendar` is a filtered list, not a real calendar.
113. `/portal/projects/kanban` is a filtered list, not a real kanban board.
114. `/portal/projects/analytics` is a list view, not analytics.
115. `/portal/meetings/calendar` is a list view, not a calendar.
116. `/portal/meetings/recordings` filters completed meetings, not actual recordings.
117. `/portal/messages/*` subroutes all render the same messages screen.
118. `/portal/settings/sessions` shows explanatory copy, not actual sessions.
119. `/portal/settings/api-keys` shows copy, not key management.
120. `/portal/settings/integrations` shows copy, not integrations.
121. `App.tsx` has duplicated portal rendering blocks.
122. `App.tsx` handles client full-portal takeover separately from later `activeTab` portal rendering.
123. Redirect behavior can surprise admins who try to view public pages while logged in.
124. Developer/operator workspace routes are redirected but no proper workspace pages are wired.
125. Catch-all behavior varies between `App.tsx` and `AppRouter.tsx`.

## C. Client Portal Pages

126. Dashboard stats still depend on best-effort fetches without loading/error UI.
127. Dashboard activity feed is generated from counts, not real activity records.
128. Dashboard active tasks count maps to project count, not task count.
129. Dashboard messages count is hardcoded to zero after refresh.
130. Dashboard quick stat "Team Members" shows text "Active" instead of a count.
131. Dashboard fetches multiple APIs directly instead of using a shared API client.
132. Dashboard uses `any` in project aggregation.
133. Dashboard has no retry for failed refresh.
134. Dashboard has no skeleton loading.
135. Dashboard has no empty-state actions.
136. Projects page request button dispatches a global tab event, not a portal-native workflow.
137. Projects page has no project detail route.
138. Projects page has no search.
139. Projects page has no sorting.
140. Projects page has no pagination.
141. Projects page has no status filter UI despite route filters.
142. Projects page templates route has no actual templates.
143. Projects page kanban route has no columns.
144. Projects page calendar route has no calendar component.
145. Projects page analytics route has no charting.
146. Projects page due-this-week depends on date parsing of mixed data.
147. Projects page does not show project owner/client.
148. Projects page does not expose milestone/task counts.
149. Projects page does not link to project workspace endpoint.
150. Projects page "Request Project" exits the portal mental model.
151. Deliverables page has no download action.
152. Deliverables page has no approve/reject action despite backend review endpoint.
153. Deliverables page has no preview.
154. Deliverables page has no search.
155. Deliverables page has no sort by status/date.
156. Deliverables page has no project-name resolution.
157. Deliverables page has no file type icon logic.
158. Deliverables page does not show description.
159. Deliverables page does not handle unauthorized access by logging out or prompting sign-in.
160. Deliverables page uses direct localStorage token access.
161. Approvals page has no approve/reject buttons.
162. Approvals page has no confirmation for approval actions.
163. Approvals page does not distinguish milestone vs deliverable visually.
164. Approvals page has no dates.
165. Approvals page has no project names.
166. Approvals page has no comments/review notes.
167. Approvals page has no audit trail.
168. Approvals page fetches from an API that currently leaks data unauthenticated.
169. Approvals page does not show count badges from real nav state.
170. Approvals page has no bulk actions.
171. Invoices page has no pay button.
172. Invoices page has no receipt download.
173. Invoices page has no PDF generation.
174. Invoices page uses company string matching from API.
175. Invoices page has no payment history.
176. Invoices page has no dispute/query flow.
177. Invoices page has no due/overdue categorization.
178. Invoices page has no currency formatting helper.
179. Invoices page has no invoice detail route.
180. Invoices page has no secure payment integration.
181. Meetings page has no schedule meeting action.
182. Meetings page has no join meeting action.
183. Meetings page recordings route has no actual recording URLs.
184. Meetings page agenda route is a list, not an agenda view.
185. Meetings page has no calendar grid.
186. Meetings page has no timezone handling.
187. Meetings page has no meeting notes/minutes.
188. Meetings page has no attendee list.
189. Meetings page has no reschedule/cancel flow.
190. Meetings page derives meetings from milestones server-side, not real meeting data.
191. Messages page uses static starter messages.
192. Messages page local send does not persist to backend.
193. Messages page does not load `/api/conversations`.
194. Messages page does not load `/api/messages/:convId`.
195. Messages page does not use WebSocket events.
196. Messages page attachments are icon-only placeholders.
197. Messages page image button is non-functional.
198. Messages page has no channel list.
199. Messages page subroutes inbox/unread/channels/files/pinned/search do not change content.
200. Messages page has no typing indicator.
201. Messages page has no read receipts.
202. Messages page has no empty channel state.
203. Messages page has no error state.
204. Messages page has no message validation beyond trim.
205. Messages page has no moderation/reporting affordance.
206. Files page copy/download/delete buttons are visual-only.
207. Files page delete button appears for clients without checking permission.
208. Files page copy action does not copy anything.
209. Files page download action does not download anything.
210. Files page has no upload action.
211. Files page has no folders.
212. Files page has no file version history.
213. Files page has no file preview.
214. Files page has no search.
215. Files page has no type filter.
216. Team page member detail button is visual-only.
217. Team page does not join team members to full user records reliably.
218. Team page has no contact actions.
219. Team page has no role descriptions.
220. Team page has no availability/status detail.
221. Team page has no project-specific filtering.
222. Team page has no avatars beyond generic icon.
223. Team page has no empty setup action.
224. Reports page progress chart is a simple bar placeholder.
225. Reports page financial overview is explanatory copy, not real financial chart.
226. Reports page invoice count is wrong if backend checks `clientId` on company-based invoices.
227. Reports page has no export.
228. Reports page has no date range.
229. Reports page has no KPI definitions.
230. Reports page has no drilldown.
231. Reports page has no report detail route.
232. Settings page session management is explanatory copy.
233. Settings page API keys view is explanatory copy.
234. Settings page integrations view is explanatory copy.
235. Settings page billing view points elsewhere instead of embedding settings.
236. Settings page security buttons do not open real flows.
237. Settings page notification preferences update local state only.
238. Settings page only saves profile fields.
239. Settings page does not refresh auth context after profile save.
240. Settings page has no password update form.
241. Settings page has no 2FA setup.
242. Settings page has no active session revocation UI.
243. Settings page has no appearance controls except copy.
244. Settings page has no integrations connect/disconnect flow.
245. Timeline page uses hardcoded milestones.
246. Timeline page does not fetch `/api/projects/:id/workspace`.
247. Timeline page does not reflect the selected project.
248. Timeline page has no project filter.
249. Timeline page has no dates from backend.
250. Timeline page has no milestone detail/action.

## D. Auth, Security, And Identity

251. Frontend `AuthContext` includes offline static login bypass.
252. Static client bypass uses `logistics@aeroglobal.com` and `waidpulse`.
253. Static super admin bypass uses `waidsoko@gmail.com` and `superpassword`.
254. Login screen exposes seed credential quick-access buttons.
255. Login screen labels quick access as developer seed checks.
256. Google login UI is a manual form, not real OAuth.
257. Backend Google login trusts arbitrary email/name input.
258. Backend Google login can create users without verifying a Google token.
259. Backend seeds multiple predictable passwords.
260. Backend returns `debugVerificationToken` on registration.
261. Backend returns `debugResetToken` on forgot password.
262. Backend returns `debugVerificationToken` on resend verification.
263. Forgot password UI displays debug token flow.
264. Register flow forwards debug verification token.
265. UnifiedAuthGate routes debug tokens to verification.
266. Password reset tokens appear stored plaintext.
267. Email verification tokens appear stored plaintext.
268. Token storage uses localStorage.
269. Non-remembered login still writes token to localStorage.
270. Different modules read different token keys.
271. `App.tsx` WebSocket reads `auth_token` or `token`.
272. Auth login writes `afriwaid_auth_token`.
273. `services/api.ts` reads `auth_token` or `token`.
274. Several pages bypass auth provider and read localStorage directly.
275. Workspaces delete auth keys manually.
276. Logout flow differs across layouts and provider.
277. Session timeout handling is missing on the frontend.
278. Token refresh handling is missing.
279. Password update endpoint compares bcrypt hash by re-hashing, which will fail for salted bcrypt.
280. Account lockout exists only narrowly around login attempts, not globally rate limited.
281. Admin roles endpoint is publicly readable to any request with middleware applied but no explicit permission.
282. Permissions endpoint is publicly readable to any request with middleware applied but no explicit permission.
283. Role editing lacks version/audit detail beyond one log.
284. CSRF protection is missing.
285. CSP headers are missing.
286. Helmet/security headers are missing.
287. HTTPS enforcement is missing.
288. Secure cookie sessions are not used.
289. Secrets validation at startup is missing.
290. Default admin password behavior is unclear for existing seeded users.
291. Suspended user handling is incomplete across all APIs.
292. Client ownership checks are inconsistent.
293. Invoice payment endpoint does not verify client owns invoice.
294. Deliverable review endpoint does not verify client owns deliverable.
295. Milestone approve endpoint does not verify milestone belongs to requesting client.
296. Task mutation endpoints do not consistently enforce project membership.
297. File delete is admin-only but no soft-delete/audit recovery.
298. File upload has no MIME validation.
299. File upload has no size limit specific to uploads.
300. File upload appears metadata-only, not actual secure file storage.

## E. Backend, API, And Data Layer

301. `server.ts` is monolithic.
302. Seed data, database access, auth, routes, AI, and WebSockets live in one file.
303. JSON file is used as a database.
304. JSON writes use whole-file write without lock.
305. Concurrent requests can overwrite each other.
306. There are no migrations.
307. There is no schema validation for stored data.
308. There is no request validation middleware.
309. There is no response contract/OpenAPI spec.
310. There is no centralized error handler.
311. Many request handlers use `any`.
312. There is no typed database model layer.
313. There is no transaction support.
314. There is no backup/restore workflow.
315. There is no production database adapter.
316. There is no database indexing.
317. There is no pagination in many list endpoints.
318. There is no filtering in many list endpoints.
319. There is no sorting in many list endpoints.
320. Duplicate `/api/files` GET routes exist.
321. Later `/api/files` route may be unreachable because an earlier one handles the path.
322. `/api/deliverables` does not require auth.
323. `/api/approvals` falls back to user `u-2`.
324. `/api/meetings` falls back to user `u-2`.
325. `/api/team` falls back to user `u-2`.
326. `/api/reports` falls back to user `u-2`.
327. `/api/files` later duplicate falls back to user `u-2`.
328. `clientProfile` variables are computed and unused in some endpoints.
329. Reports endpoint filters invoices by `clientId`, while invoices use `company`.
330. Invoice numbers use `Math.random`.
331. Chat channel names use `Math.random`.
332. AI endpoints have no clear auth requirements.
333. AI endpoints have no rate limiting.
334. AI endpoints have no cost budget controls.
335. Consultant endpoint returns simulated fallback text.
336. AI lab endpoint returns offline simulation text.
337. Analytics AI endpoint returns simulated GA report.
338. Static analytics prompt requests mock high-scale numbers.
339. Server hardcodes port `3000`.
340. Server has no health endpoint.
341. Server has no readiness endpoint.
342. Server has no graceful shutdown logic.
343. Server has no structured logging.
344. Server logs bootstrapping text only.
345. Audit logs cap at 1000 in JSON.
346. Audit logs have no export/retention policy.
347. Audit logs store IP without trusted proxy configuration.
348. Sessions are stored in JSON.
349. Session invalidation is single-instance only.
350. WebSocket auth depends on token matching JSON sessions.
351. WebSocket reconnection is missing on frontend.
352. WebSocket per-channel authorization needs review.
353. Conversation APIs do not expose a complete client chat UI yet.
354. Notifications APIs are not wired into portal topbar.
355. Broadcast notification endpoint lacks audience preview.
356. Admin user creation returns password-sensitive user object shape needing sanitization review.
357. Admin delete hard-deletes users.
358. Client delete archives clients but naming is delete.
359. Project delete/archive route is missing.
360. Milestone update allows broad status mutation without finite-state enforcement.
361. Deliverable review accepts any status string.
362. Invoice payment accepts POST without payment provider.
363. Feedback endpoint lacks rating bounds validation.
364. File upload endpoint does not store binary payload.
365. Static asset serving has no explicit cache headers.
366. Compression is missing.
367. CORS policy is missing.
368. Body size limits are default/global only.
369. There is no API version prefix.
370. There is no tenant isolation abstraction.
371. Client lookup by company string is fragile.
372. Seed company data drives real billing filtering.
373. Seed IDs are hardcoded throughout messages/participants.
374. Google-created project data is synthetic and automatic.
375. AI outputs mention PostgreSQL even app uses JSON file.

## F. Demo, Fake, Seed, And Content Authenticity

376. `package.json` name is `react-example`.
377. README appears to be generic Google AI starter content.
378. README hero image points to Google AI static asset.
379. Seed testimonial mentions mockups.
380. Data includes a Rickroll-style YouTube placeholder URL.
381. `videoDemo` type comment says embed link or placeholder.
382. App copy says no mock telemetry while app includes mock/simulated telemetry.
383. About copy claims no dummy content while multiple demo seeds exist.
384. Admin analytics includes fake visitor from Lagos.
385. AI report simulates Google Analytics numbers.
386. AI report references a fake GA ID fallback.
387. AI lab offline mode claims Gemini can be enabled by secrets panel that does not exist in this app.
388. AI simulated text claims PostgreSQL 17.
389. AI simulated text claims D3 latency visualizer.
390. AI simulated text uses product claims not backed by live features.
391. Login placeholders use real-looking personal email.
392. Google login defaults to a real-looking personal email/name.
393. Admin bypass IDs remain in UI.
394. Forgot password "Direct Reset With Token" is a test bypass.
395. Register can request roles from public UI.
396. Demo users include predictable emails and passwords.
397. Demo client project is AeroGlobal-specific.
398. Seed invoices use large dollar amounts as if real.
399. Seed notifications are static.
400. Seed messages are static.
401. Seed conversations are static.
402. Seed milestones are static.
403. Seed feedback is static.
404. Seed files are metadata-only.
405. Seed reports depend on static data.
406. Timeline hardcoded dates are still static.
407. Reports financial text admits richer charts are future work.
408. Settings API keys page admits no keys.
409. Integrations page admits none connected.
410. Sessions page admits future/session API work.
411. Templates route has no templates.
412. Recordings route has no recordings.
413. Calendar routes have no calendar UI.
414. Kanban route has no kanban UI.
415. Search result page is missing.
416. Help/support center is missing.
417. Notifications page is missing.
418. Profile page is only settings fragment.
419. Activity feed is synthetic.
420. Dashboard task count is not true task count.
421. Client portal title "AfriWaid Client" is generic.
422. Workspace "SYSTEM OVERSEER: ARCH-1" is staged copy.
423. Admin dashboard contains many example placeholders.
424. Admin forms include example GitHub/app URLs.
425. Contact form placeholders include fictional companies.

## G. Frontend Architecture, State, And Maintainability

426. `App.tsx` is very large and multi-responsibility.
427. `AdminDashboard.tsx` is extremely large.
428. `server.ts` is extremely large.
429. There are duplicate auth contexts in `components` and `features`.
430. There are duplicate project/client providers and local App state.
431. React Query is installed but not used for portal data fetching.
432. Many pages use direct `fetch`.
433. Error handling is repeated per page.
434. Token lookup is repeated per page.
435. Loading states are repeated per page.
436. There is no central API error shape.
437. There is no central unauthorized handler.
438. There is no app-wide toast system.
439. There is no form library or validation schema.
440. There is no route manifest shared by router/nav/breadcrumb.
441. There is no code splitting.
442. Build warns bundle is over 500 KB.
443. Admin dashboard likely dominates bundle size.
444. Motion library is loaded globally.
445. Font packages add many emitted font files.
446. Image assets are inside `src/assets` but some data paths reference `/src/assets/...`.
447. Static image paths may break in production builds.
448. No image optimization pipeline.
449. No lazy-loaded images.
450. No service worker/offline strategy.
451. No suspense boundaries.
452. No page-level error boundaries.
453. No strict feature flags.
454. No environment-based removal of dev/demo UI.
455. No tree-shaking boundary for admin-only code.
456. Global events like `app:goto-tab` are brittle.
457. `window.location.href` appears in routing/logout flows.
458. `window.location.reload` is used after logout in sidebar.
459. Recent search stored in localStorage has no schema version.
460. AI chat history stored in localStorage has no size cap.
461. Theme handling is duplicated.
462. Favicon handling mutates DOM manually.
463. Active tab and location can drift.
464. Role redirect effect can override intended navigation.
465. Public route behavior while authenticated is inconsistent across systems.
466. Dead `AppRouter.tsx` increases maintenance risk.
467. Dead `ClientWorkspaceLayout` increases maintenance risk.
468. Workspace pages for moderator/auditor are incomplete.
469. Developer/operator pages are legacy dashboard components.
470. No dependency boundary between public site and portal.

## H. Testing, Tooling, Release, And Production Ops

471. No unit tests.
472. No integration tests.
473. No end-to-end tests.
474. No API contract tests.
475. No accessibility tests.
476. No visual regression tests.
477. No performance budget tests.
478. No security regression tests.
479. No CI config observed.
480. No deployment pipeline observed.
481. No production smoke test script.
482. No linting beyond TypeScript compile.
483. No ESLint config observed.
484. No Prettier config observed.
485. No git hooks observed.
486. `npm audit` reports high vulnerabilities through `tar`/`node-pre-gyp`.
487. Native `bcrypt` duplicates in dependencies and devDependencies.
488. No dependency update policy.
489. No environment matrix documentation.
490. No `.env` secret validation.
491. No `.env.example` completeness verification.
492. No production runbook.
493. No incident response doc.
494. No data retention policy.
495. No privacy policy.
496. No license.
497. No changelog.
498. No API documentation.
499. No architecture diagram.
500. No documented definition of which demo features must be removed before launch.

## Suggested Fix Order

1. Remove/fence all demo auth, debug tokens, fake Google login, and seed quick-access UI.
2. Fix private API leaks and ownership checks.
3. Delete or wire the dead router/layout/auth duplicates.
4. Replace simulated portal features with real API-backed flows or hide them.
5. Harden UI primitives for accessibility, disabled/loading states, and consistent tokens.
6. Move data from JSON file to a real database with migrations.
7. Add route/API/e2e tests for every portal nav item and auth boundary.
