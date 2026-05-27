# Development Conventions

This document defines the shared development conventions for the CityQuest monorepo.

## TypeScript

- Shared domain packages should extend the shared library baseline.
- Node-specific runtimes should extend the shared node baseline.
- React-based applications should extend the shared react baseline.
- Cross-package imports should use the `@cityquest/*` aliases defined at the repository level.

## Formatting

- Prettier is the single source of truth for formatting.
- Use 2-space indentation.
- Use single quotes.
- Use semicolons.
- Keep trailing commas where valid.

## Linting

- ESLint provides the shared code-quality baseline.
- The initial ruleset stays intentionally lightweight.
- Framework-specific lint rules should be added when Expo, Next.js, and the API runtime are initialized.

## Imports and Aliases

- Use `@cityquest/<context>` for cross-context or cross-package imports.
- Prefer relative imports only for nearby files inside the same package boundary.
- Keep shared-kernel imports rare and intentional.
- Do not place app-specific logic in `shared-kernel` or `contracts`.

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
