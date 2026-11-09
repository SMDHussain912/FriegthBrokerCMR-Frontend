# Frontend Engineering Rules

These rules apply to the FreightBrokerCMR Next.js web client.

## Approved stack
- Framework: existing Next.js 16.4.1 App Router.
- Language: TypeScript; preserve strict type checking.
- UI: use the repository's existing React and styling/component conventions before adding another UI system.
- Data access: existing API/BFF layer and typed fetch helpers; do not connect directly to MongoDB.
- Forms/schema validation: reuse current project conventions; propose a single established validator before introducing a new one.
- Tests: use the repository's existing test setup and add component/integration coverage for critical workflows.
- Package manager: follow the committed lockfile and use `npm ci` in CI.

## Architecture
1. Keep page components focused on composition; extract reusable domain components and hooks.
2. Keep API access in shared typed client modules, not scattered raw fetch calls.
3. Treat API responses as untrusted runtime data; handle errors and validate critical payload shapes.
4. Server components are preferred for server-only data when compatible with the existing auth architecture; client components are for interaction.
5. Keep secrets and privileged tokens server-side. Never expose secrets through `NEXT_PUBLIC_*`.
6. Centralize route permission checks for UX, while the backend independently enforces authorization.
7. Use explicit loading, empty, error, success and forbidden states.
8. Use server pagination/filtering for large datasets.
9. Keep business calculations and state transitions on the backend.
10. Avoid duplicating components or parallel design systems.

## Security — must do
- Use the established authenticated BFF/session flow and secure cookie settings.
- Protect cookie-authenticated mutations against CSRF using the project's approved pattern.
- Never store privileged access tokens in localStorage or sessionStorage.
- Escape/render untrusted user content safely; do not use unsafe HTML injection.
- Validate form input and show safe server error messages.
- Prevent accidental duplicate mutations; use idempotency support where the API provides it.
- Do not rely on hidden navigation/buttons for authorization.

## Must not do
- Do not call database services directly from browser code.
- Do not hardcode localhost or production API URLs in source; use documented environment configuration.
- Do not put secrets in public environment variables.
- Do not fabricate dashboard metrics, carrier verification, load eligibility or financial totals.
- Do not use mock data as a silent production fallback.
- Do not bypass API permission errors by trying another endpoint.
- Do not add libraries without reviewing maintenance, licensing, security and bundle impact.
- Do not disable type checks/tests to get a successful build.

## UX and quality
- All interactive controls must work and have accessible names, focus states and keyboard behavior.
- Forms must show field-level validation and preserve values after recoverable errors.
- Tables need pagination, useful empty states and responsive behavior.
- Destructive actions require confirmation and clear feedback.
- Display dates, currencies, units and timezones consistently.
- Avoid giant client components and unnecessary global state.

## Required tests
- Route rendering and role-based navigation.
- API success, validation failure, network failure and expired-session behavior.
- Permission-denied and empty states.
- Critical forms and state transitions.
- Regression tests for tab/route switching and stale component state.
- Production build and accessibility checks where available.

## Completion checklist
- [ ] API contract and permissions confirmed.
- [ ] Loading/empty/error/forbidden states handled.
- [ ] Responsive and keyboard-accessible.
- [ ] No secrets or mock production fallback.
- [ ] Tests and typecheck pass.
- [ ] Production build passes.
- [ ] Staging workflow verified against real API behavior.
