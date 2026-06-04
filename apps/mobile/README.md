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
- a small local adapter only for the route-detail and current-objective placeholders
- an initial folder structure for app growth
- shared workspace scripts aligned with the monorepo

## Active Navigation Flow

The mobile app now carries a minimal internal navigation stack without introducing a navigation
framework yet:

1. `welcome`
2. `destinations`
3. `routeDetail`
4. `currentObjective`

This flow is already aligned with the real backend slices implemented in `apps/api`:

- `GET /destinations`
- `GET /routes/jaen-echoes-of-stone`

The destination selector now reads the live Worker API, while the route-detail and
current-objective screens still use a small in-memory adapter that mirrors the real seeded MVP
content. That keeps `EVO-0026` lightweight while leaving a clean swap point for `EVO-0027` and
`EVO-0028`, where those screens should start consuming the live Worker endpoints too.

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
```
