# Architecture Decision Records

This directory stores the project's `ADR` files (`Architecture Decision Records`).

## What is an ADR?

An ADR is a short document that captures an important technical decision, the context behind it, the chosen option, and its consequences.

## Naming Convention

Files follow this format:

```text
0001-short-kebab-case-title.md
0002-another-decision.md
```

## Status Values

Recommended statuses:

- `Proposed`
- `Accepted`
- `Superseded`
- `Deprecated`

## When to Write an ADR

Create an ADR when a decision has architectural or long-term impact, for example:

- repository structure
- package management
- frontend framework selection
- backend runtime selection
- DDD boundaries
- infrastructure approach
- persistence strategy
- authentication strategy

As a CityQuest rule, any meaningful technical decision with architectural, tooling, runtime, or long-term maintenance impact should be reflected in an ADR.

## ADR Index

- [ADR-0001: Use Architecture Decision Records](./0001-use-architecture-decision-records.md)
- [ADR-0002: Use a TypeScript Monorepo Structure](./0002-use-a-typescript-monorepo-structure.md)
- [ADR-0003: Adopt a Lightweight DDD Structure](./0003-adopt-a-lightweight-ddd-structure.md)
- [ADR-0004: Adopt a Test-Guided Development Strategy](./0004-adopt-a-test-guided-development-strategy.md)
- [ADR-0005: Define a Shared Development Configuration](./0005-define-a-shared-development-configuration.md)
- [ADR-0006: Adopt Expo for the Mobile Application](./0006-adopt-expo-for-the-mobile-application.md)
- [ADR-0007: Adopt Next.js for the Admin Panel](./0007-adopt-nextjs-for-the-admin-panel.md)
- [ADR-0008: Apply Pragmatic Design Patterns and Record Technical Decisions](./0008-apply-pragmatic-design-patterns-and-record-technical-decisions.md)
- [ADR-0009: Adopt a Lambda-Oriented TypeScript Backend Foundation](./0009-adopt-a-lambda-oriented-typescript-backend-foundation.md)
- [ADR-0010: Use HTTP API for the First Public API Gateway Foundation](./0010-use-http-api-for-the-first-public-api-gateway-foundation.md)
- [ADR-0011: Adopt a Cloudflare-First MVP Platform Direction](./0011-adopt-a-cloudflare-first-mvp-platform-direction.md)
- [ADR-0012: Adopt Cloudflare Workers as the Active API Runtime](./0012-adopt-cloudflare-workers-as-the-active-api-runtime.md)
- [ADR-0013: Adopt an Initial D1 Persistence and Migration Strategy](./0013-adopt-an-initial-d1-persistence-and-migration-strategy.md)
