# FreightBrokerCMR — Product Requirements Document

**Status:** Working product baseline; implementation status must be verified in code  
**Product:** Multi-tenant freight brokerage operations platform  
**Web client:** Next.js 16.4.1  
**API:** Node.js/Express + MongoDB; the API is authoritative

## 1. Product vision
A responsive, secure workspace for brokerage teams to manage customers, carriers, compliance, loads, dispatch, communications and financial operations. The web app must support real operational work, not just display demo dashboards.

## 2. Goals
- Provide a clear tenant-aware workspace and role-specific navigation.
- Support carrier onboarding, compliance review, load management and dispatch.
- Surface trustworthy operational status, history, alerts and financial summaries.
- Keep all business rules and authorization enforced by the backend.
- Deliver accessible, responsive and resilient workflows.

## 3. Users
Platform administrator; company owner/admin; broker/dispatcher; compliance officer; finance user; read-only/auditor. The UI must reflect permissions returned by the API, but hiding controls is never a security boundary.

## 4. Product modules
1. Sign-in, registration, company onboarding and invitations.
2. Company workspace, membership and role management.
3. Dashboard with meaningful operational KPIs and actionable exceptions.
4. Carrier CRM, profile, contacts, equipment and document views.
5. Compliance workspace: insurance, expiry, review status, evidence and reason codes.
6. Customer directory and customer details.
7. Load board, load creation/editing, status timeline and detail.
8. Carrier eligibility, offers, assignment and dispatch workflow.
9. Notifications, activity feed and audit history.
10. Finance: invoices, payables, charges, expenses, margin and settlement.
11. Reports, filters, exports and settings.

## 5. UX requirements
- Responsive desktop/tablet/mobile layouts with accessible keyboard navigation and labels.
- Every data screen has loading, empty, error, permission-denied and success states.
- Lists use server pagination, filters and stable sorting; avoid loading unbounded collections.
- Destructive and irreversible actions require clear confirmation and explain consequences.
- Forms validate early for usability and rely on server validation for correctness.
- Statuses and timestamps must be explicit; show timezone where ambiguity matters.
- Preserve user input on recoverable failures and prevent accidental duplicate submissions.
- Avoid misleading placeholder KPIs, fake verification, dead buttons and demo content in production.

## 6. Business rules
- Tenant identity and permission decisions come from authenticated API context.
- The client never decides whether a carrier is compliant or a load is eligible.
- Load state and dispatch transitions are accepted only when the API confirms them.
- Compliance and financial history must be visible according to permission and must not be silently rewritten.
- External provider states must distinguish verified, unverified, stale, unavailable and pending.

## 7. Non-functional requirements
Security: secure cookie/session handling through the existing web BFF pattern where applicable, CSRF protection for cookie-authenticated mutations, no secrets in client bundles. Performance: route-level loading, pagination, caching only where safe, optimized assets. Accessibility: semantic HTML, focus states, contrast and screen-reader labels. Reliability: error boundaries, retry only safe operations and actionable errors.

## 8. Integrations and staged scope
External safety/insurance, load-board, GPS/ELD, OCR, accounting, SSO and AI capabilities require approved providers, backend adapters and explicit acceptance criteria. Do not present mocked responses as live integration results.

## 9. Out of scope for core
Autonomous dispatch decisions, claims of guaranteed safety/compliance, full shipper/driver portals and advanced telematics until the core workflows are secure and stable.

## 10. Success and acceptance
A feature is done only when permissions, API integration, responsive UI, loading/empty/error states, accessibility, automated tests and staging evidence are verified. A build passing alone is insufficient.

## 11. Frontend repository responsibilities
Own the web experience, route/layout structure, forms, client-side presentation state, API/BFF integration, typed UI contracts, accessibility, responsive behavior and web tests. Do not duplicate authoritative domain logic or access MongoDB directly.

## 12. Open decisions
Resolve tenant workspace switching, navigation by permission, dashboard KPI definitions, table/export behavior, notification preferences and finance display conventions with product/API owners before implementation.
