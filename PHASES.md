# Frontend Delivery Phases

This plan is aligned with the backend and mobile delivery plan. UI completion depends on stable API contracts and tenant/permission behavior.

## Phase 0 — UI and contract audit
**Work:** inventory routes, layouts, components, API helpers, environment variables, tests and deployment config. Compare each screen with real backend endpoints.  
**Outputs:** route/screen inventory, API gap list, UX defect list, design-system inventory, baseline build/test report.  
**Exit gate:** every existing screen is mapped to an API contract or explicitly marked as placeholder/deferred.

## Phase 1 — Authentication and tenant workspace
**Work:** login/register, company onboarding, invitation acceptance, membership/role-aware navigation and session expiry.  
**Outputs:** auth flows, tenant workspace selection/context, permission-aware navigation, error states and tests.  
**Exit gate:** users can access only their authorized workspace; API remains the enforcement boundary.

## Phase 2 — Carrier CRM and compliance
**Work:** carrier directory/search/detail/edit, contacts/equipment, document upload/view, insurance and review workflows.  
**Outputs:** responsive carrier pages, compliance queue, expiry indicators, evidence/reason display, upload handling and tests.  
**Exit gate:** no cross-tenant content; private documents are protected; stale/unavailable checks are not shown as verified.

## Phase 3 — Customers, loads and dispatch
**Work:** customer pages, load board/create/edit/detail, lifecycle timeline, eligibility reasons, offers and dispatch actions.  
**Outputs:** end-to-end web workflows, filters/pagination, conflict feedback, audit/activity display and tests.  
**Exit gate:** API-confirmed state changes work; invalid transitions and conflicts are clearly handled.

## Phase 4 — Finance, reporting and operations
**Work:** invoices, payables, charges, expenses, margin, settlements, reports and exports.  
**Outputs:** permission-aware finance screens, reconciled summaries, export UX, filters and tests.  
**Exit gate:** displayed totals match API fixtures; no client-side authoritative financial calculations.

## Phase 5 — Notifications and integrations UX
**Work:** notification center/preferences, provider connection status and integration workflows approved by product.  
**Outputs:** notification screens, delivery/connection states, retry/error UX and tests.  
**Exit gate:** pending, unavailable, failed and verified states are distinct; no fake integration success.

## Phase 6 — Quality and release hardening
**Work:** accessibility, responsive regression, performance, security review, error boundaries, analytics/privacy review and deployment configuration.  
**Outputs:** test report, performance/accessibility findings, release checklist, environment matrix and rollback notes.  
**Exit gate:** CI, production build, staging smoke tests and critical user journeys pass.

## Phase 7 — Release and feedback
**Work:** production smoke tests, monitor errors and usage, triage feedback and plan follow-up fixes.  
**Outputs:** release notes, verified screenshots/flows, known-issues list and prioritized next iteration.  
**Exit gate:** critical journeys remain healthy and no unresolved release-blocking defects exist.

## Required phase report
- Delivered screens and user journeys.
- Routes/API contracts consumed and any backend dependency.
- Tests and exact results.
- Accessibility/responsive checks.
- Permission and tenant behavior verified.
- Deployment evidence, known issues and next dependencies.

A passing build is not proof that a product workflow is complete.
