# ADR-0007: Adopt Next.js for the Admin Panel

## Status

Accepted

## Context

CityQuest needs a dedicated administrative web application to manage destinations, routes, POIs, visual objectives, unlockable content, and future analytics workflows.

The admin panel must:

- fit cleanly inside the TypeScript monorepo
- support a professional React-based web experience
- work well with TypeScript and shared repository tooling
- provide a strong foundation for future authenticated back-office features

## Decision

Use `Next.js` with the App Router as the baseline framework for `apps/admin`.

The admin application will:

- live in `apps/admin`
- use TypeScript
- use the App Router under `src/app`
- keep delivery concerns in the app layer while composing domain capabilities from the bounded contexts

## Consequences

Positive:

- strong developer experience for a modern React-based admin panel
- clear route and layout structure from the beginning
- good long-term fit for authenticated dashboards, CRUD surfaces, and operational tooling
- easy alignment with shared linting, formatting, and TypeScript conventions

Tradeoffs:

- Next.js introduces framework-specific conventions that the repository must support intentionally
- server and client component boundaries will need to be handled carefully as the admin panel grows
- additional framework-specific tooling and testing choices may be added later when real admin features are implemented
