# ADR-0004: Adopt a Test-Guided Development Strategy

- Status: Accepted
- Date: 2026-05-27

## Context

CityQuest is being built as a portfolio-grade product with explicit architectural boundaries and multiple delivery applications. As the codebase grows, the project needs a testing strategy that:

- supports iterative development;
- protects domain and application logic from regressions;
- validates infrastructure boundaries realistically;
- remains flexible until the concrete application runtimes are bootstrapped.

## Decision

The project will adopt a test-guided development strategy with multiple explicit test levels:

- unit tests
- integration tests
- contract tests
- end-to-end tests later in the project lifecycle

The monorepo will be prepared up front with:

- repository-level test scripts;
- a testing strategy document;
- reserved `tests/unit` and `tests/integration` directories inside each bounded context.

Concrete tooling for Expo, Next.js, and the API runtime is intentionally deferred until those applications are initialized.

## Consequences

- Testing becomes part of the architectural baseline rather than an afterthought.
- Domain and application logic can be designed for fast feedback.
- Infrastructure concerns are expected to prove themselves through integration tests.
- Tool selection remains flexible until the real runtime constraints are known.
