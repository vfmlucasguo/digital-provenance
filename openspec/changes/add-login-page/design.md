## Context

The app is an Ionic/Angular multi-tab layout. Tabs are defined in `tabs-routing.module.ts`. Pages follow the pattern `src/app/pages/<name>/` with `*.page.ts`, `*.page.html`, `*.page.scss`, and a module/routing module. No auth layer exists yet.

## Goals / Non-Goals

**Goals:**

- Add a standalone login page reachable via route
- Email and password form with basic validation
- Form submit handler (placeholder; no real API)
- Use Ionic components for consistency

**Non-Goals:**

- No backend or real authentication yet
- No session/JWT handling
- No password reset or registration flows

## Decisions

| Decision | Rationale |
|----------|-----------|
| New page under `src/app/pages/login/` | Matches existing structure (ai-demo-list, whole-by-path, etc.) |
| Route `/tabs/login` | Keeps login under tabs layout; can add tab or link from other tabs |
| Ionic `ion-card`, `ion-input`, `ion-button` | Aligns with existing UI patterns |
| Form validation via Angular reactive forms or template-driven | Use simple template-driven for minimal surface; can refactor later |
| No auth service yet | Placeholder submit; will log or show message until backend exists |

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Route conflicts with future auth guard | Keep login as a normal tab route for now; guard can redirect unauthenticated users later |
| Form UX may need refinement | Start with basic validation; iterate after feedback |
