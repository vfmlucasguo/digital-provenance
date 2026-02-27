## Context

The app is an Ionic/Angular multi-tab layout. Tabs and pages follow the pattern used for login (src/app/pages/<name>/). Tab1 currently shows an explore container; adding a settings button gives a clear navigation entry point. No settings persistence layer exists yet.

## Goals / Non-Goals

**Goals:**

- Add a standalone settings page reachable via route
- Button on Tab1 that navigates to the settings page
- Settings page displays general app settings (layout and placeholders for future options)
- Use Ionic components for consistency

**Non-Goals:**

- No persistence or backend for settings yet
- No complex preference toggles (can add later)
- No theme switching or notification prefs in this change

## Decisions

| Decision | Rationale |
|----------|-----------|
| New page under `src/app/pages/settings/` | Matches existing structure (login, ai-demo-list, etc.) |
| Route `/tabs/settings` | Keeps settings under tabs layout; accessible from anywhere |
| Button on Tab1 as entry point | Explicit, discoverable; Tab1 is a natural "home" for app-level actions |
| `ion-list` / `ion-item` for settings display | Standard Ionic pattern for settings-like UI; extensible |
| Placeholder settings items | Display structure now; wire real values later |

## Risks / Trade-offs

| Risk | Mitigation |
|------|-------------|
| Tab1 could become crowded | Single clear "Settings" button; can move to profile/menu later if needed |
| Settings scope may grow | Start minimal; add sections (General, Notifications, etc.) in future changes |
