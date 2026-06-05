# CityQuest Testing Strategy

This document defines the testing baseline for CityQuest.

## Goals

- support test-guided development from the start;
- keep domain logic highly testable;
- make the intended test levels explicit before framework setup;
- allow each application bootstrap to choose the right tool without changing the architectural strategy.

## Testing Principles

- tests should follow the architecture, not fight it;
- most business confidence should come from fast tests around domain and application behavior;
- infrastructure should be tested through integrations, not mocked into false confidence;
- tool selection should stay pragmatic and be finalized when each runtime is bootstrapped.

## Test Levels

### Unit Tests

Primary targets:

- entities
- value objects
- domain services
- policies
- validation rules
- pure application orchestration logic

Expected properties:

- fast
- isolated
- deterministic

### Integration Tests

Primary targets:

- repositories
- persistence adapters
- cloud adapters
- authentication integrations
- image/location validation adapters
- API-to-application wiring where useful

Expected properties:

- verify real boundaries;
- catch configuration and serialization issues;
- use mocks sparingly compared to unit tests.

### Contract Tests

Primary targets:

- DTO shapes
- serialized payloads
- event contracts
- request/response compatibility across boundaries

These will become more important once the mobile app, admin panel, and API start sharing real contracts.

### End-to-End Tests

These are intentionally deferred until the applications exist.

Planned future targets:

- admin flows
- key API flows
- selected mobile critical paths if the MVP scope justifies them

## Mapping to DDD

### Domain

Prefer unit tests.

### Application

Use mostly unit tests, plus targeted integration tests where orchestration crosses meaningful boundaries.

### Infrastructure

Prefer integration tests over excessive mocking.

### Apps

Use composition, UI, and flow-oriented tests once each app is bootstrapped.

At the current stage of the repository:

- `apps/api` has real backend unit and integration tests around the active Cloudflare Workers foundation
- `infra/tests/unit` has real CDK unit tests
- `apps/mobile` now has real automated coverage for live-data adapters and the first MVP service flow
- `apps/admin` still mainly exposes future testing placeholders rather than feature-level coverage

## Repository Layout

Each bounded context reserves this structure:

```text
packages/contexts/<context>/
  tests/
    unit/
    integration/
```

This keeps test intent explicit from the start even before the concrete tooling is installed.

## Tooling Direction

Tooling is intentionally not finalized yet.

Current direction:

- `Vitest` for package-level tests and the backend unit/integration tests in `apps/api`
- `Vitest` with CDK assertions for infrastructure unit tests in `infra`
- `Vitest` for mobile service and lightweight integration-style tests in `apps/mobile`
- `Testing Library` for the admin web app
- `React Native Testing Library` for future mobile screen tests once the gameplay UI stabilizes further
- `Playwright` for admin end-to-end tests
- mobile end-to-end tooling to be decided later based on MVP needs

## Deferred Tool Decisions

The exact testing tools for:

- Expo
- Next.js

remain to be finalized when those applications start adding real feature tests. The active backend runtime decision is now documented in ADR-0012.

## Current Pragmatic Boundary

CityQuest now has enough real product flow that automated tests should protect:

- Worker response contracts
- D1-backed content assumptions
- mobile payload mapping
- first gameplay-to-reward orchestration paths

But it still does **not** justify a heavy end-to-end or BDD stack yet.

Current practical rule:

- prefer `Vitest` for backend and mobile
- prefer fast service/adapter tests before deep UI tests
- add UI and end-to-end tooling only when flows stop shifting every few EVOs
- keep Cucumber/BDD deferred until product scenarios become more stable and shared across roles
