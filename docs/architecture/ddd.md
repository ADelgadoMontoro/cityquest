# CityQuest DDD Baseline

This document defines the lightweight DDD baseline used by the CityQuest monorepo.

## Goals

- keep the MVP implementation organized from the start;
- make domain boundaries visible before the applications grow;
- avoid mixing product logic with UI, API transport, or infrastructure details;
- stay pragmatic and lightweight for a solo-built portfolio product.

## Architectural Style

CityQuest uses a `lightweight DDD` approach.

That means:

- bounded contexts are explicit;
- domain logic should live in context packages, not in apps;
- apps act as delivery and composition layers;
- infrastructure is allowed, but should stay behind context boundaries;
- abstractions should be added when they clarify real use cases, not just to satisfy patterns.

## Bounded Contexts

### Exploration

Owns:

- routes
- progression
- objectives
- unlock flow
- journals and achievements

### Content

Owns:

- narrative content
- hints
- quiz material
- adaptations by audience profile

### Identity

Owns:

- users
- roles
- sessions
- demo/admin access concerns

### Validation

Owns:

- location validation
- image validation
- validation attempts
- validation policies and thresholds

### Analytics

Owns:

- events
- product metrics
- reporting inputs

### Authoring

Owns:

- destinations
- routes and POIs administration
- objective setup
- content publication workflow

## Package Layout

Each bounded context follows this baseline:

```text
packages/contexts/<context>/
  src/
    domain/
    application/
    infrastructure/
  tests/
    unit/
    integration/
    index.ts
```

### Domain

Contains business concepts and rules, for example:

- entities
- value objects
- domain services
- domain events
- invariants

### Application

Contains use-case orchestration, for example:

- commands
- queries
- application services
- ports
- DTO mapping inside the context boundary

### Infrastructure

Contains technical adapters, for example:

- persistence adapters
- cloud service integrations
- external API integrations
- framework-specific glue

## Testing by Context

Each bounded context reserves:

- `tests/unit` for fast domain and application-level tests;
- `tests/integration` for adapter, persistence, and cross-boundary integration tests.

This keeps tests close to their context boundary while still separating them from production code.

## Dependency Rules

The intended dependency direction is:

```text
apps -> application/domain packages
application -> domain
infrastructure -> application and domain
domain -> no framework/infrastructure dependencies
```

Rules:

- `apps/*` must not become the home of domain rules.
- `domain` should not depend on infrastructure or UI frameworks.
- `application` can depend on `domain`.
- `infrastructure` can depend on `application` and `domain`.
- cross-context communication should go through explicit contracts, application ports, or published events, not ad-hoc imports.

## Shared Kernel

`packages/shared-kernel` is reserved for concepts that are truly shared across multiple contexts and are stable enough to justify reuse.

Examples:

- common identifiers
- generic result primitives
- strongly shared base types

It must not become a dump for unrelated utilities.

## Contracts

`packages/contracts` stores cross-app and cross-boundary contracts such as:

- transport DTOs
- serialized payload shapes
- event contract types
- shared request/response models

Business rules still belong to contexts, not to contracts.

## How Apps Should Use Contexts

### Mobile App

Primarily composes:

- exploration
- validation
- content
- identity

### Admin App

Primarily composes:

- authoring
- content
- identity
- analytics

### API

Acts as the transport and integration layer. It should expose endpoints and invoke application services from the relevant contexts.

## Pragmatic MVP Rule

Do not create deep abstractions before they support a real use case.

This DDD structure exists to guide growth, not to force ceremony. The MVP should stay understandable, fast to evolve, and easy to demonstrate.
