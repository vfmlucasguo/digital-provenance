## Why

Users need a clear overview of app features to discover what the digital-provenance app offers. A feature list page provides a central hub for navigation and feature discovery, improving UX and making the app more approachable.

## What Changes

- New feature list page reachable via route
- Button on Tab1 that navigates to the feature list page
- Feature list page displays app features as an overview/list
- No persistence or backend — display-only static content

## Capabilities

### New Capabilities

- `feature-list-page`: Provides the feature list screen, layout, and display of app features. Entry point from Tab1; presents a browsable list or grid of features for discovery.

### Modified Capabilities

- (none — no existing specs to modify)

## Impact

- **Routing**: Add feature list route under tabs (e.g. `/tabs/features`)
- **Pages**: New page component `src/app/pages/feature-list/` (or `src/src/app/pages/feature-list/` per project layout)
- **UI**: Button on Tab1; Ionic components for feature list layout (e.g. `ion-list`, `ion-item`, `ion-card`)
- **Dependencies**: No new npm packages; uses existing Ionic/Angular stack
