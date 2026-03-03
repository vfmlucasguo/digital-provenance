## Context

The app is an Ionic/Angular multi-tab layout. Tabs and pages follow the pattern used for settings, login, ai-demo-list, etc. Tab1 currently shows an explore container and has a Settings button; adding a Features button provides another navigation entry point for feature discovery.

## Goals / Non-Goals

**Goals:**

- Add a standalone feature list page reachable via route
- Button on Tab1 that navigates to the feature list page
- Feature list page displays app features as an overview/list
- Use Ionic components for consistency

**Non-Goals:**

- No dynamic feature data (static/hardcoded for now)
- No backend or API for features
- No filtering, search, or categorization in this change

## Decisions

| Decision | Rationale |
|----------|-----------|
| New page under `src/app/pages/feature-list/` | Matches existing structure (settings, login, ai-demo-list, etc.) |
| Route `/tabs/features` | Keeps feature list under tabs layout; accessible from anywhere |
| Button on Tab1 as entry point | Explicit, discoverable; Tab1 is a natural "home" for app-level navigation |
| `ion-list` / `ion-item` or `ion-card` for feature display | Standard Ionic pattern for list-like UI; extensible for future feature details |
| Static feature items | Display structure now; wire dynamic content later if needed |

## Risks / Trade-offs

| Risk | Mitigation |
|------|-------------|
| Tab1 could become crowded with multiple buttons | Place Features and Settings buttons side-by-side or stack; consider a single "More" menu later |
| Feature list scope may grow | Start minimal; add categories, search, or links in future changes |
