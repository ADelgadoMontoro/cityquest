# Mobile App

This workspace contains the CityQuest Expo mobile application.

## Purpose

The mobile app is the main user-facing entry point of the MVP. It will eventually host flows such as welcome, login, province selection, route detail, current objective, camera, validation, and unlocked content.

## Current Scope

This bootstrap provides:

- Expo with TypeScript
- a clean starter screen branded for CityQuest
- an initial folder structure for app growth
- shared workspace scripts aligned with the monorepo

## Structure

```text
src/
  bootstrap/   # App-level composition
  components/  # Reusable UI pieces
  config/      # Mobile-specific configuration
  hooks/       # Reusable hooks
  navigation/  # Navigation composition and route contracts
  screens/     # Screen-level UI
  services/    # App-facing service adapters
  types/       # Mobile-specific types
```
