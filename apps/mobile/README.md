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
- a live-backed current-objective screen prepared for the next gameplay slice
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

The destination selector, route detail screen, and current-objective screen now all read the live
Worker API. The current-objective view is still intentionally pre-gameplay: it shows the real
objective context and keeps hints/camera as honest placeholders until later EVOs add those
capabilities for real.

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
