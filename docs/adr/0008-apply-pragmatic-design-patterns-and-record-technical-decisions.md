# ADR-0008: Apply Pragmatic Design Patterns and Record Technical Decisions

## Status

Accepted

## Context

CityQuest is being built as a portfolio-grade product with multiple runtimes, bounded contexts, and a growing architecture surface.

To keep the codebase professional as it evolves, the project needs two explicit working rules:

- apply design patterns when they clarify responsibilities, composition, extensibility, or testability;
- record technical decisions so architectural intent is visible and future work stays aligned.

Without this, the repository could drift into ad-hoc implementations, hidden assumptions, and inconsistent structure across apps and packages.

## Decision

CityQuest will follow these rules:

- prefer pragmatic design patterns whenever they add real clarity or maintainability;
- avoid pattern ceremony when there is no meaningful benefit yet;
- use patterns such as composition root, providers, factory functions, view models, adapters, repositories, strategies, and use-case orchestration where appropriate to the layer and use case;
- capture every meaningful technical decision in an ADR, especially decisions related to architecture, frameworks, runtime setup, tooling, integration strategy, testing, security, and cross-cutting conventions.

## Consequences

Positive:

- the codebase keeps a more intentional and readable structure as features are added;
- design choices become easier to explain in a portfolio context;
- future contributors or model-assisted sessions can infer the intended style more reliably;
- important technical decisions remain traceable instead of living only in code.

Tradeoffs:

- engineers must exercise judgment instead of applying patterns mechanically;
- the team must maintain ADR discipline as the repository grows;
- some small tasks may include a bit more structure than a purely throwaway prototype would.
