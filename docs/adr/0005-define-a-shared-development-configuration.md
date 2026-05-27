# ADR-0005: Define a Shared Development Configuration

- Status: Accepted
- Date: 2026-05-27

## Context

CityQuest is a multi-application monorepo with shared domain packages, future frontend runtimes, and a backend runtime that have not yet been fully initialized. Without a common development baseline, formatting, linting, typing, imports, and environment handling would drift quickly across the codebase.

The project needs a simple but professional shared configuration that improves consistency without introducing unnecessary complexity during the MVP phase.

## Decision

The project will define a shared development configuration with:

- shared TypeScript baselines for library, node, and react-style runtimes;
- a shared ESLint baseline;
- a shared Prettier baseline;
- root scripts for lint, format, and typecheck;
- `.env.example` files for the repository and each app workspace;
- explicit conventions for imports, aliases, naming, and environment variable prefixes.

Framework-specific linting and test-tool decisions will be added later when Expo, Next.js, and the API runtime are initialized.

## Consequences

- The monorepo gains a consistent development baseline before app bootstrapping begins.
- New code can follow a shared structure with less friction.
- Codex and other tooling can operate more reliably on a consistent repository setup.
- The configuration stays intentionally lightweight until framework-specific needs become concrete.
