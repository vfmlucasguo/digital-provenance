# Project Context

## Purpose
digital-provenance is an Ionic/Capacitor-based mobile application built with Angular for TKE Mobility. It supports field operations for quality management, enabling users to perform inspections, manage tasks, and view reports on both Android and iOS devices.

## Tech Stack
- **Framework**: Ionic Framework (@ionic/angular ^8.x)
- **Core**: Angular 17.x
- **Mobile Engine**: Capacitor 7.x
- **Language**: TypeScript 5.4.x
- **Runtime**: Node.js (Recommended v18.18.0)
- **State Management**: RxJS (Services + Observables)
- **Storage**: @ionic/storage-angular (SQLite/IndexedDB)

## Mandatory Functions
The following key functions must be present unless explicitly approved by the mobility architecture team:
- **Common login page**: Privacy Statement, OU/BU/Env list, configurable header color.
- **JWT integration** for secure API requests.
- **Multi-language support (i18n)** for target markets; at minimum, English must be provided.
  - All labels, helper text, prompts, warnings, and success/failure messages MUST reference keys in `src/assets/i18n` instead of hard-coded strings.
  - When adding a new translation key, add it to every locale file under `src/assets/i18n`, defaulting to English until other languages supply values.
- **Local SQLite/Storage upgrade compatibility** when schema or storage format changes.
- **App log**: Error/info log saving and upload to VIEW system for analysis.
- **MS365 (O365) login support** where required.
- **Voice dictation**: Ensure all text areas support system-level dictation (no extra development; must be tested).
- **Firebase integration** for performance and crash monitoring.

### App Versioning Standard
- Define both **app version** (visible to users) and **app build number** (used by OS/store).
- **App version format**: `[major].[minor].[revision]` (e.g., `2.10.23`), displayed in UI.
- **Build number format**: Must increase with each release or store submission (e.g., `2102301`).
- Set in: `package.json` (version), Android `android/app/build.gradle` (versionCode), iOS `ios/App/App/Info.plist` (CFBundleShortVersionString, CFBundleVersion).
- When releasing to stores or after rejection, increment the build number even if the app version does not change.

### App Log Standard
- Log files must save key user/device information for troubleshooting.
- **File names**: Start with date (device local time) and meaningful keywords, e.g.:
  - `20210605_Parameter_Login_Request.log`
  - `20210605_Error.log`
  - `20210605_Others_Network.log`
- **Record format**: Each log record starts with a date-time string to seconds, e.g. `2021-06-05 09:20:58: ******`
- **Language**: Only English in log files.
- **Forbidden**: Do not record user passwords or security keys (e.g., JWT refresh token) in logs; sensitive data must be encrypted or masked.

## Project Conventions

### Code Style
- **Indentation**: 2 spaces (Angular/TypeScript convention).
- **Linting**: ESLint with `@angular-eslint` and `@typescript-eslint`.
- **Formatting**: Adheres to Angular Style Guide; format code before committing.
- **Comments**: Add sufficient comments for classes, methods, logic blocks, and variables; write comments in English.
- **Naming Conventions**:
  - Variables/Methods: camelCase (e.g., `getUser`, `loginDto`)
  - Classes/Interfaces: PascalCase (e.g., `UserService`, `LoginComponentDto`)
  - Files: kebab-case (e.g., `user.service.ts`, `login-page.component.ts`)
  - Constants: UPPER_SNAKE_CASE (e.g., `STORAGE_KEY_CONSTANT`)
- **Compatibility**: All TypeScript and Angular syntax must remain compatible with the versions pinned in `package.json`.

### Architecture Patterns
- **Modular Design**: Uses Angular Modules (`AppModule`, Feature Modules) for organization.
- **Service-Repository**: Business logic and API calls encapsulated in Services (`src/app/services/`).
- **Data Transfer Objects (DTOs)**: Strict typing using interfaces/DTOs for API requests and responses.
- **Async Handling**: Extensive use of RxJS Observables and Promises/async-await.
- **Plugins**: Integration via Capacitor and Cordova plugins for native features (Camera, Geolocation, JPush, etc.).
- **Reuse**: Any method used in multiple components or services MUST be defined once in a shared service or utility and reused via that abstraction.

### Standard Service Format
- **Location**: Services in `src/app/services/` with `@Injectable()` decorator.
- **Dependency Injection**: Proper imports and constructor injection for Angular components.
- **Naming**: CamelCase class names ending with "Service" (e.g., `ApisService`, `StorageService`).
- **Patterns**: Follow existing services in `src/app/services/` for structure consistency; do not duplicate logic—reuse shared services or utilities.

### Database Guidelines (SQLite / local storage)
- **Table names**: Lowercase, singular, words separated by underscores (e.g., `inspection_task`).
- **Column names**: Follow project convention (e.g., UpperCamelCase for IDs/flags if aligned with backend).
- **Primary key**: Prefer auto-increment primary key named `Id` where applicable.
- **Types**: Use INTEGER (ids, flags) and TEXT for most fields; define default values for new columns.
- **Date/time**: Store as TEXT in format `"YYYY-MM-DD HH:MM:SS.SSS"`; format in UI/business logic.
- **Validation**: Enforce length and validation at UI/service layer, not only in SQLite schema.
- **Transactions**: Prefer transactions/batch for batch operations; avoid running SQL one-by-one in loops.

### UI Design Guidelines
- Follow TKE Mobility app standard UI templates for new pages.
- **Popup header**: Black (#262626); use accent color (e.g., orange #F16B08) only for special emphasis.
- **Clickable elements**: Buttons and icons must have visible state change on press (default / active / disabled).
- **Spacing**: Leave at least 12pt on left/right or follow Ionic safe area rules.
- **Action order**: Place primary actions (OK, Save, Submit) to the right of secondary actions (Cancel, Close).

### Testing Strategy
- **Unit Testing**: Karma and Jasmine.
- **Coverage**: Karma Coverage Istanbul Reporter.
- **Scope**: Critical business logic in Services and utility functions.
- **E2E**: Perform end-to-end testing for changes that affect user flows where practical.
- **Data migration**: Conduct full data comparison before and after schema/storage changes; do post-deployment verification.

### Git Workflow
- **Updates**: Use `git pull --rebase` for updates.
- **Commit Messages**: Enforced via Husky and Commitlint (Conventional Commits).
  - Format: `<type>(<scope>): <subject>` (e.g., `feat(auth): add sms login`)
  - Types: feat (new feature), fix (bug fix), docs, test, refactor, etc.
- **Branching**: Feature branches merged into `dev`/`main`; protected branches prohibit direct push/merge where configured.
- **Cherry-pick**: When moving changes between branches, use `cherry-pick -n` if avoiding auto-commit.
- **Git config** (recommended): `core.autocrlf input`, `pull.rebase true` for consistent line endings and history.

### Frontend / Backend Change Guidance
- **Terminology**: Refer to this Ionic app repository as **Mobility Client** and any separate API/service repository as **Mobility API** in designs and tasks.
- In `design.md` and `tasks.md`, use dedicated subsections (e.g., **Mobility Client** vs **Mobility API**) and number tasks (e.g., 1.x Client, 2.x API) so ownership is clear.
- In spec deltas, state whether each requirement is fulfilled by Mobility Client, Mobility API, or both.
- Cite concrete paths: e.g. `src/app/pages/...`, `src/app/services/...` for Client; API module/endpoint paths for backend.

## Domain Context
- **Organization**: TKE Mobility.
- **Key Capabilities**:
  - **Offline First**: Robust offline support using SQLite/Local Storage and synchronization mechanisms.
  - **Geolocation**: Integrated Baidu Map and device geolocation.
  - **Push Notifications**: JPush integration for real-time alerts.
  - **Media**: Camera integration, image compression, and file uploads.
  - **Analytics**: Firebase Analytics, Crashlytics, and Performance monitoring.

## Important Constraints
- **Platform Requirements**:
  - iOS: Xcode > 15
  - Android: Android Studio Hedgehog (2023.1.1+)
- **Network**: VPN required for accessing internal TKE repositories and APIs during development.
- **Local Plugins**: Custom or patched plugins located in `local_plugin/` (e.g., `tke-mobility-common`).

## External Dependencies
- **Firebase**: Analytics & Crashlytics.
- **Maps**: Baidu Map SDK.
- **Push**: JPush/JCore.
- **Microsoft**: O365 Authentication integration.
