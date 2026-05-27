# ADR-0002: Use a TypeScript Monorepo Structure

- Status: Accepted
- Date: 2026-05-27

## Context

CityQuest needs to host multiple deliverables in the same repository:

- a mobile app
- an admin panel
- a serverless API
- cloud infrastructure
- shared packages

The repository must stay clean and scalable for solo development while still matching the structure of a professional product codebase.

## Decision

The project will use a TypeScript monorepo structure with top-level separation between applications, shared packages, infrastructure, and technical documentation.

Initial structure:

```text
apps/
  mobile/
  admin/
  api/
packages/
  shared/
  config/
infra/
docs/
```

The initial package manager baseline is `npm workspaces`.

## Consequences

- Applications can evolve independently without mixing concerns.
- Shared configuration and contracts have a clear home.
- The structure is ready for Expo, Next.js, and serverless backend bootstrapping without repository reorganization.
- Future DDD-oriented packaging can build on top of this baseline rather than replacing it.
