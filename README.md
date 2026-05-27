# CityQuest

CityQuest is a gamified cultural tourism platform. This repository is organized as a TypeScript monorepo and adapted to a lightweight DDD structure so the mobile app, admin panel, serverless backend, cloud infrastructure, and domain packages can evolve with clear boundaries from the start.

## License

This repository is public for portfolio, evaluation, and reference purposes only. CityQuest is not currently distributed as an open-source project.

## Structure

```text
apps/
  mobile/   # MVP mobile application
  admin/    # Admin web panel
  api/      # Serverless backend and endpoints
packages/
  config/         # Shared repository configuration
  contracts/      # Cross-app DTOs and integration contracts
  shared-kernel/  # Truly shared primitives used across contexts
  contexts/
    exploration/  # Routes, progression, objectives, unlock flow
    content/      # Narrative content, hints, quizzes, adaptations
    identity/     # Users, roles, sessions, demo/admin access
    validation/   # Geolocation, image validation, attempt handling
    analytics/    # Events, metrics, reporting inputs
    authoring/    # Destination, route, POI, and publish management
infra/      # Cloud infrastructure and IaC
docs/       # Technical and architecture documentation
```

## DDD Baseline

The repository follows a lightweight DDD baseline:

- `apps/*` contain delivery mechanisms and composition roots.
- `packages/contexts/*` contain bounded contexts.
- each context is split into `domain`, `application`, and `infrastructure`.
- `packages/shared-kernel` is reserved for truly shared primitives only.
- `packages/contracts` contains cross-boundary contracts and DTOs.

This is intentionally lightweight for the MVP. The goal is to make architectural boundaries explicit early without filling the codebase with unnecessary abstractions before the main use cases exist.

## Package Manager

The monorepo uses `npm workspaces` as its initial package management baseline. This keeps the setup simple and sufficient for the next tasks without coupling the project to additional tooling too early.

## Base Scripts

- `npm run dev`
- `npm run build`
- `npm run format`
- `npm run format:check`
- `npm run lint`
- `npm run lint:fix`
- `npm run test`
- `npm run test:unit`
- `npm run test:integration`
- `npm run typecheck`
- `npm run clean`

The scripts are wired at repository and workspace level. Shared formatting, linting, and type-checking are available now. The mobile runtime has already been bootstrapped with Expo, the admin runtime is bootstrapped with Next.js, and the API runtime is bootstrapped with a Lambda-oriented Node.js and TypeScript foundation.

## Architecture Decisions

Technical decisions are documented as `ADR` files (`Architecture Decision Records`) under [`docs/adr`](./docs/adr/README.md).

The DDD structure and boundary rules are documented in:

- [`docs/architecture/ddd.md`](./docs/architecture/ddd.md)

The testing strategy is documented in:

- [`docs/architecture/testing.md`](./docs/architecture/testing.md)

The shared development conventions are documented in:

- [`docs/architecture/development-conventions.md`](./docs/architecture/development-conventions.md)

The mobile app runtime decision is documented in:

- [`docs/adr/0006-adopt-expo-for-the-mobile-application.md`](./docs/adr/0006-adopt-expo-for-the-mobile-application.md)

The admin panel runtime decision is documented in:

- [`docs/adr/0007-adopt-nextjs-for-the-admin-panel.md`](./docs/adr/0007-adopt-nextjs-for-the-admin-panel.md)

The backend runtime decision is documented in:

- [`docs/adr/0009-adopt-a-lambda-oriented-typescript-backend-foundation.md`](./docs/adr/0009-adopt-a-lambda-oriented-typescript-backend-foundation.md)
