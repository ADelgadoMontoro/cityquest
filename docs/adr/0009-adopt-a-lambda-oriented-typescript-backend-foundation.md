# ADR-0009: Adopt a Lambda-Oriented TypeScript Backend Foundation

## Status

Accepted

## Context

CityQuest needs a backend foundation that can evolve into AWS Lambda and API Gateway without starting from a traditional always-on server architecture.

The backend must:

- fit inside the TypeScript monorepo cleanly
- keep transport concerns separate from application logic
- be easy to compile, test, and run locally during MVP development
- stay lightweight until real integrations with AWS services are added

## Decision

Use a `Node.js + TypeScript` backend foundation in `apps/api` with a Lambda-oriented structure.

This foundation will:

- expose Lambda-style handlers instead of a permanent HTTP server
- keep application logic in services separate from handler input/output
- compile with `tsc` into a deployable `dist/` output
- use `tsx` for local handler execution during development
- use `Vitest` for backend unit and integration tests

## Consequences

Positive:

- the backend starts aligned with the intended AWS serverless target
- handler logic stays easier to test and evolve
- local development remains simple without introducing framework-heavy abstractions
- the repository now has a concrete backend testing choice instead of a deferred placeholder

Tradeoffs:

- there is no full local HTTP emulation yet
- future API Gateway event variations will still need explicit adapters as real endpoints appear
- deployment packaging and infrastructure wiring remain future tasks
