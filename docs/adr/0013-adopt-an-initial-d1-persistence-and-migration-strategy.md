# ADR-0013: Adopt an Initial D1 Persistence and Migration Strategy

## Status

Accepted

## Context

CityQuest has already adopted:

- `Cloudflare Workers` as the active API runtime
- `Cloudflare D1` as the structured data direction for the MVP
- a repository-local `Wrangler` workflow for local development and cloud operations

After provisioning the development D1 database and binding it to the Worker, the project needed a persistence strategy that was:

- simple enough for a solo-built MVP
- compatible with `Cloudflare D1` and SQLite
- easy to inspect in a portfolio context
- compatible with a test-guided and migration-first workflow
- narrow enough to avoid over-freezing unrelated product concerns too early

The project also needed to decide whether to:

- adopt an ORM immediately
- model the full product schema at once
- or introduce persistence incrementally through SQL migrations

## Decision

Adopt an initial `D1` persistence strategy based on:

- explicit SQL migrations stored in `apps/api/migrations/`
- no ORM at this stage
- a first content-focused schema before identity, progress, analytics, or demo persistence
- repository-level commands that apply migrations through the existing `Wrangler` wrapper workflow

The first schema baseline should therefore focus on the core content hierarchy:

- `destinations`
- `routes`
- `pois`
- `visual_objectives`
- `hints`
- `unlockable_contents`

The following concerns are explicitly deferred to later schema evolutions:

- users and identity persistence
- route progress persistence
- achievements persistence
- analytics event persistence
- demo-mode-specific persistence

Operationally, the project treats migrations as forward-only numbered files. Once a migration has been applied to local or remote D1, it should not be rewritten in place. Later refinements should be introduced through new migration files.

## Consequences

Positive:

- persistence stays simple and inspectable
- the schema evolves in small, reviewable steps
- the first backend content endpoints can build on a stable relational backbone
- the repo avoids premature ORM, repository, or full-product modeling complexity
- applied migrations remain traceable and safer to reason about across local and remote environments

Tradeoffs:

- some schema decisions are deferred and will need later ADRs or migration steps
- SQL remains manual rather than abstracted through an ORM
- future identity, progress, and analytics work will require additional schema evolution rather than arriving pre-modeled
