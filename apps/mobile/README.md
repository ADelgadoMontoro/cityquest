# Mobile App

This workspace contains the CityQuest Expo mobile application.

## Purpose

The mobile app is the main user-facing entry point of the MVP. It will eventually host flows such as welcome, login, province selection, route detail, current objective, camera, validation, and unlocked content.

## Current Scope

This bootstrap provides:

- Expo with TypeScript
- a clean starter screen branded for CityQuest
- a minimal in-app navigation flow for the next mobile slice
- a local MVP content adapter aligned with the current backend slugs
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

For now the mobile workspace uses a small in-memory service adapter to mirror the real seeded MVP
content. That keeps `EVO-0024` lightweight while leaving a clean swap point for `EVO-0026`,
`EVO-0027`, and `EVO-0028`, where the app should start consuming the live Worker endpoints.

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
