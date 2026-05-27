# ADR-0003: Adopt a Lightweight DDD Structure

- Status: Accepted
- Date: 2026-05-27

## Context

CityQuest is evolving into a product with multiple responsibilities:

- mobile gameplay
- content authoring
- image and location validation
- analytics
- identity and roles
- backend and cloud integration

Even in an MVP, these concerns can become tangled if the repository only separates by application and leaves domain logic without a clear home.

At the same time, the project is being built by a single developer and should avoid excessive ceremony or speculative abstractions.

## Decision

The repository will adopt a lightweight DDD structure based on bounded contexts.

Initial bounded contexts:

- exploration
- content
- identity
- validation
- analytics
- authoring

Each context will have a baseline split into:

- `domain`
- `application`
- `infrastructure`

The repository will also define:

- `packages/shared-kernel` for truly shared primitives
- `packages/contracts` for cross-boundary contracts

## Consequences

- Business logic gains a clear home outside UI and transport layers.
- The mobile app, admin app, and API can compose use cases from shared domain-oriented packages.
- Architectural boundaries become explicit early, while remaining light enough for the MVP.
- The old generic `shared` package is replaced by more intentional concepts: `shared-kernel` and `contracts`.
