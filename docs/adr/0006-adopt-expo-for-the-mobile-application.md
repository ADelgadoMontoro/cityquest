# ADR-0006: Adopt Expo for the Mobile Application

- Status: Accepted
- Date: 2026-05-28

## Context

CityQuest needs a mobile application as the main user-facing entry point of the MVP. The mobile app must support rapid iteration, local development, TypeScript, React Native, and a clean path toward future features such as onboarding, route exploration, camera-based validation, and unlocked content flows.

The project is being built as a portfolio-grade MVP with limited complexity tolerance during the early foundation phase. The mobile stack should therefore favor fast setup, low friction, and good developer experience without blocking later product growth.

## Decision

The mobile application will be initialized with `React Native` using `Expo`.

The initial Expo workspace lives in:

```text
apps/mobile
```

The mobile bootstrap includes:

- Expo with TypeScript
- a lightweight CityQuest starter screen
- a mobile-specific folder structure for future MVP flows
- alignment with monorepo formatting, linting, and type-checking scripts

## Consequences

- The MVP gets a fast and practical mobile foundation.
- Local development is simpler than starting from a bare React Native setup.
- Expo-specific configuration becomes part of the mobile app baseline and should be treated as an intentional exception where it differs from generic shared React configuration.
- Future mobile architecture decisions should build on this Expo baseline unless there is a strong reason to move away from it.
