# Mobile App

This workspace contains the CityQuest Expo mobile application.

## Purpose

The mobile app is the main user-facing entry point of the MVP. It will eventually host flows such as welcome, login, province selection, route detail, current objective, camera, validation, and unlocked content.

## Current Scope

This bootstrap provides:

- Expo with TypeScript
- a clean starter screen branded for CityQuest
- a minimal in-app navigation flow for the next mobile slice
- a live destination selector backed by the Worker API
- a live route detail screen backed by the Worker API
- a live-backed current-objective screen with real image capture/selection for gameplay input
- a live-backed unlocked-story screen fed by the Worker API
- an initial folder structure for app growth
- shared workspace scripts aligned with the monorepo

## Active Navigation Flow

The mobile app now carries a minimal internal navigation stack without introducing a navigation
framework yet:

1. `welcome`
2. `destinations`
3. `routeDetail`
4. `currentObjective`
5. `objectiveReward`

This flow is already aligned with the real backend slices implemented in `apps/api`:

- `GET /destinations`
- `GET /routes/jaen-echoes-of-stone`
- `GET /objectives/estatua-san-fernando/unlocks`

The destination selector, route detail screen, current-objective screen, and unlocked-story screen
now all read the live Worker API. The current-objective view is still intentionally pre-gameplay:
it shows the real objective context, allows the user to capture or choose a photo on device, and
then runs a mocked-success transition into the reward flow without pretending that visual
validation already exists.

## Local API Configuration

Mobile reads the backend from:

```txt
EXPO_PUBLIC_API_BASE_URL
```

Examples:

- web or local simulator:
  - `http://127.0.0.1:8787`
- physical device on the same network:
  - `http://192.168.x.x:8787`

The Worker must be running locally for the selector to load:

```bash
npm run api:dev
```

For a physical Android device using the development build, `adb reverse` is the simplest local
bridge:

```bash
adb reverse tcp:8787 tcp:8787
```

That lets the app keep using:

```txt
http://127.0.0.1:8787
```

from the phone while still reaching the Worker on the development machine.

## Testing

The mobile workspace now includes an initial automated test layer focused on live-data adapters.

Run everything:

```bash
npm run test --workspace @cityquest/mobile
```

Run only unit-level service tests:

```bash
npm run test:unit --workspace @cityquest/mobile
```

Run the lightweight integration-style service flow:

```bash
npm run test:integration --workspace @cityquest/mobile
```

Current emphasis:

- Worker payload mapping into mobile models
- current objective derivation
- unlocked content delivery flow
- edge cases such as `404` handling and safe defaults

UI-heavy testing is intentionally kept for later once the gameplay flow stabilizes further.

## Structure

```text
src/
  bootstrap/   # App-level composition
  components/  # Reusable UI pieces
  config/      # Mobile-specific configuration
  hooks/       # Reusable hooks
  navigation/  # Navigation composition and route contracts
  screens/     # Screen-level UI
  services/    # App-facing service adapters and temporary MVP data sources
  types/       # Mobile-specific types
tests/         # Mobile automated tests for service adapters and MVP flow checks
```
