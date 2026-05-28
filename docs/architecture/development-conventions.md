# Development Conventions

This document defines the shared development conventions for the CityQuest monorepo.

## TypeScript

- Shared domain packages should extend the shared library baseline.
- Node-specific runtimes should extend the shared node baseline.
- React-based applications should extend the shared react baseline.
- Expo-based applications may extend `expo/tsconfig.base` directly when Expo tooling requires it. When that happens, the exception should be intentional and documented.
- Cross-package imports should use the `@cityquest/*` aliases defined at the repository level.

## Formatting

- Prettier is the single source of truth for formatting.
- Use 2-space indentation.
- Use single quotes.
- Use semicolons.
- Keep trailing commas where valid.

## Repository Tooling

- Repository-level scripts should be cross-platform whenever practical.
- Long-running repository scripts should behave intentionally and must not rely on sequential workspace execution when concurrent behavior is expected.
- Versioned documentation should use relative links so it remains portable in GitHub, local clones, and other environments.
- Root verification scripts should reflect only the capabilities that are genuinely implemented; they must not report success by routing through placeholder workspace commands.

## Linting

- ESLint provides the shared code-quality baseline.
- The initial ruleset stays intentionally lightweight.
- Framework-specific lint rules should be added when they provide clear value after runtime initialization. Expo is currently using the shared baseline only, and framework-specific mobile linting can be added later if the app starts needing Expo- or React Native-specific rules.
- The admin panel uses Next.js-specific ESLint rules through the shared repository config so root-level linting stays consistent with the web runtime.

## Imports and Aliases

- Use `@cityquest/<context>` for cross-context or cross-package imports.
- Prefer relative imports only for nearby files inside the same package boundary.
- Keep shared-kernel imports rare and intentional.
- Do not place app-specific logic in `shared-kernel` or `contracts`.

## Design Patterns

- Apply design patterns whenever they add meaningful clarity, extensibility, or testability.
- Prefer pragmatic patterns over ceremonial ones.
- Composition root, provider composition, factory functions, view models, adapters, repositories, strategies, and use-case orchestration are preferred when they fit the problem.
- Do not introduce abstractions only to mimic textbook architecture.

## ADR Discipline

- Any meaningful technical decision should be reflected in `docs/adr`.
- This includes framework choices, runtime setup, shared tooling, testing strategy, cross-cutting conventions, and non-trivial architectural changes.

## Naming

- Use lowercase kebab-case for folders by default.
- Use PascalCase only where framework conventions require it, such as React components in future app code.
- Keep file names descriptive and aligned with the language of the project: English only.

## Environment Variables

- Never commit secrets.
- Commit only `.env.example` files.
- Use `CITYQUEST_` for shared or backend-private variables.
- Use `NEXT_PUBLIC_` for admin variables exposed to the browser.
- Use `EXPO_PUBLIC_` for mobile variables exposed to the Expo client.

## Shared vs App-Specific Code

- `packages/shared-kernel` is for truly shared primitives only.
- `packages/contracts` is for cross-boundary DTOs and serialized contracts.
- Business rules belong in bounded contexts.
- Delivery concerns belong in apps.
