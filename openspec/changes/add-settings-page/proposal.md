## Why

Users need a central place to view and adjust general app settings. Adding a settings page provides a clear entry point for configuration and future extensibility (theme, notifications, preferences). This improves discoverability and prepares the app for more settings as it grows.

## What Changes

- New settings page reachable via route
- Button on Tab1 that navigates to the settings page
- Settings page displays general app settings (UI shell; values can be placeholders for now)
- No persistence or backend yet — display-only or local state only

## Capabilities

### New Capabilities

- `settings-page`: Provides the settings screen, layout, and display of general app settings. Entry point from Tab1; ready for future wiring of real preferences.

### Modified Capabilities

- (none — no existing specs to modify)

## Impact

- **Routing**: Add settings route under tabs (e.g. `/tabs/settings`)
- **Pages**: New page component `src/app/pages/settings/` (or `src/src/app/pages/settings/` per project layout)
- **UI**: Button on Tab1; Ionic components for settings layout (e.g. `ion-list`, `ion-item`, `ion-toggle` for future use)
- **Dependencies**: No new npm packages; uses existing Ionic/Angular stack
