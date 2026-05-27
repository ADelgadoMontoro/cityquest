# ADR-0001: Use Architecture Decision Records

- Status: Accepted
- Date: 2026-05-27

## Context

CityQuest is being built as a portfolio-grade product with multiple technical areas: mobile app, admin panel, backend, infrastructure, and shared packages. As the project evolves, technical decisions need to remain explicit, reviewable, and easy to reference in future conversations and implementation tasks.

## Decision

The project will document important technical decisions using `Architecture Decision Records` (`ADR`).

All ADRs will live under `docs/adr/` and will follow a sequential numbering convention:

```text
0001-short-kebab-case-title.md
```

## Consequences

- Decisions become traceable over time.
- Tradeoffs remain visible even after implementation starts.
- Future conversations can refer to a specific ADR instead of restating old context.
- Superseded decisions can be replaced cleanly without losing project history.
