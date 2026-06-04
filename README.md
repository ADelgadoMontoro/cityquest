# CityQuest

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-Mobile_App-000020?logo=expo&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-Admin_Panel-000000?logo=nextdotjs&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![Cloudflare D1](https://img.shields.io/badge/Cloudflare-D1-F38020?logo=cloudflare&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-Tested-6E9F18?logo=vitest&logoColor=white)
![Status](https://img.shields.io/badge/MVP-In_Progress-2563EB)
![Architecture](https://img.shields.io/badge/Architecture-Lightweight_DDD-1F2937)

CityQuest is a gamified cultural tourism platform. This repository is organized as a TypeScript monorepo and adapted to a lightweight DDD structure so the mobile app, admin panel, serverless backend, cloud infrastructure, and domain packages can evolve with clear boundaries from the start.

The current preferred MVP platform direction is:

- `Cloudflare Workers` for backend execution
- `Cloudflare Pages` for the admin deployment target
- `Cloudflare D1` for structured data
- `Cloudflare R2` for media and asset storage

Some AWS-oriented foundations still exist in the repository as earlier exploratory groundwork, but Cloudflare is now the intended forward path for the MVP.

## Current MVP Slice

The current real product slice in the repository is:

- destination `Jaén`
- route `Jaén: Echoes of Stone`
- POI `Cathedral of Jaén`
- POI `Arab Baths of Jaén`
- published visual objectives for both POIs
- public `GET /destinations` endpoint
- public `GET /routes/jaen-echoes-of-stone` endpoint

That means the project has already moved beyond backend foundation only: the active API and D1 database now contain real MVP content that later endpoints and screens can consume.

## Progress Snapshot

These percentages are approximate engineering snapshots, not formal project accounting.

| Area | Progress | Notes |
| --- | --- | --- |
| Platform / Infra | `[########--] 80%` | Cloudflare direction, Worker runtime, D1 binding, migrations, and verification flow are in place. |
| API / Data | `[#######---] 70%` | Healthcheck, HTTP foundation, schema, seeds, destinations listing, and first route detail endpoint are done. |
| Mobile | `[##--------] 20%` | Expo foundation exists, but real backend-driven product flows are still pending. |
| Admin | `[##--------] 20%` | Next.js foundation exists, but real content management flows are still pending. |
| Overall MVP | `[#####-----] 50%` | Foundations and first public content endpoints are in place; the next gains come from real app consumption. |

## Start Here

For a quick repository handoff after cloning, read these in order:

1. [`docs/project-context.md`](./docs/project-context.md)
2. [`docs/cloudflare-setup.md`](./docs/cloudflare-setup.md)
3. [`docs/adr/README.md`](./docs/adr/README.md)
4. [`docs/architecture/development-conventions.md`](./docs/architecture/development-conventions.md)
5. [`docs/architecture/testing.md`](./docs/architecture/testing.md)

## License

This repository is public for portfolio, evaluation, and reference purposes only. CityQuest is not currently distributed as an open-source project.

## Structure

```text
apps/
  mobile/   # MVP mobile application
  admin/    # Admin web panel
  api/      # Cloudflare Workers backend and endpoints
packages/
  config/         # Shared repository configuration
  contracts/      # Cross-app DTOs and integration contracts
  shared-kernel/  # Truly shared primitives used across contexts
  contexts/       # Scaffolded bounded contexts for later domain growth
    exploration/  # Routes, progression, objectives, unlock flow
    content/      # Narrative content, hints, quizzes, adaptations
    identity/     # Users, roles, sessions, demo/admin access
    validation/   # Geolocation, image validation, attempt handling
    analytics/    # Events, metrics, reporting inputs
    authoring/    # Destination, route, POI, and publish management
infra/      # Historical AWS-oriented infrastructure and IaC groundwork
docs/       # Technical and architecture documentation
```

`infra/` currently remains as historical AWS-oriented groundwork. It is kept for reference and portfolio context, but it is not the active MVP delivery path.

## DDD Baseline

The repository follows a lightweight DDD baseline:

- `apps/*` contain delivery mechanisms and composition roots.
- `packages/contexts/*` contain bounded contexts.
- each context is split into `domain`, `application`, and `infrastructure`.
- `packages/shared-kernel` is reserved for truly shared primitives only.
- `packages/contracts` contains cross-boundary contracts and DTOs.

This is intentionally lightweight for the MVP. The goal is to make architectural boundaries explicit early without filling the codebase with unnecessary abstractions before the main use cases exist.

Important nuance:

- the bounded contexts under `packages/contexts/*` are tracked in the repository
- they are currently scaffolded rather than feature-complete
- the most mature runtime path today is `apps/api`, followed by the shared repo/configuration layer

## Package Manager

The monorepo uses `npm workspaces` as its initial package management baseline. This keeps the setup simple and sufficient for the next tasks without coupling the project to additional tooling too early.

## Base Scripts

- `npm run dev`
- `npm run api:dev`
- `npm run api:deploy`
- `npm run cf:login`
- `npm run cf:whoami`
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

The scripts are wired at repository and workspace level.

Current behavior:

- `npm run dev` starts the mobile app, admin panel, and API foundation together
- `npm run api:dev` starts the Cloudflare Worker foundation directly
- `npm run api:deploy` delegates deployment to the API workspace `Wrangler` workflow
- `npm run cf:login` and `npm run cf:whoami` expose the active Cloudflare auth flow from the repository root
- `npm run build` validates the active app workspaces and also keeps the legacy `infra` workspace buildable as historical groundwork
- the `api` build now includes a local Cloudflare Worker smoke validation instead of only a TypeScript emit step
- `npm run test` executes the implemented active backend test suite and the legacy infrastructure suite
- `npm run test:unit` executes the implemented active backend unit suite and the legacy infrastructure unit suite
- `npm run test:integration` currently executes the implemented backend integration suite
- shared formatting, linting, and type-checking run across the repository

Legacy AWS infrastructure scripts still exist under the `infra` workspace for historical reference. They are not the active MVP path, but they remain part of the default verification flow so the retained groundwork does not silently rot.

This keeps the root scripts honest: they represent the capabilities that are actually implemented today instead of passing through placeholder workspace commands.

## What Is Real Today

The repository already gives you:

- a running `Cloudflare Workers` backend in `apps/api`
- a formal `GET /health` endpoint
- a public `GET /destinations` endpoint
- a public `GET /routes/jaen-echoes-of-stone` endpoint
- D1 schema and migration flow
- real seeded MVP content for `Jaén: Echoes of Stone`
- backend unit and integration tests
- mobile and admin foundations ready to consume future public endpoints

The next high-value engineering step is no longer exposing the first public endpoints. It is consuming that real seeded content from mobile and admin, and then layering gameplay, progress, and unlock flows on top.

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

- [`docs/adr/0012-adopt-cloudflare-workers-as-the-active-api-runtime.md`](./docs/adr/0012-adopt-cloudflare-workers-as-the-active-api-runtime.md)

The earlier Lambda-oriented backend foundation remains documented as historical context in:

- [`docs/adr/0009-adopt-a-lambda-oriented-typescript-backend-foundation.md`](./docs/adr/0009-adopt-a-lambda-oriented-typescript-backend-foundation.md)

The earlier public API Gateway foundation decision remains documented as historical context in:

- [`docs/adr/0010-use-http-api-for-the-first-public-api-gateway-foundation.md`](./docs/adr/0010-use-http-api-for-the-first-public-api-gateway-foundation.md)

The Cloudflare platform pivot is documented in:

- [`docs/adr/0011-adopt-a-cloudflare-first-mvp-platform-direction.md`](./docs/adr/0011-adopt-a-cloudflare-first-mvp-platform-direction.md)
