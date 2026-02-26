## Why

Users need a way to authenticate before accessing the app. Adding a login page is the first step to enable session-based access and future protected features. This establishes the auth surface for the digital-provenance app.

## What Changes

- New login page with email/password form
- Route `/tabs/login` (or similar) for the login screen
- Basic form validation and submission handling
- Placeholder for future auth service integration (no real backend yet)
- Add login entry point to app navigation (e.g. from tabs or a dedicated auth flow)

## Capabilities

### New Capabilities

- `auth-login`: Handles login UI, form state, and submission. Covers the login screen layout, validation, and readiness for later backend wiring.

### Modified Capabilities

- (none — no existing specs to modify)

## Impact

- **Routing**: Add login route under tabs or at app level
- **Pages**: New page component `src/app/pages/login/` (or similar)
- **UI**: Ionic form components (`ion-input`, `ion-button`), `ion-card` for layout
- **Dependencies**: No new npm packages; uses existing Ionic/Angular stack
