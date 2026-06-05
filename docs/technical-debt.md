# Technical Debt and Future Hardening Notes

This document collects technical debt, hardening opportunities, and near-future engineering improvements that do not yet deserve a formal EVO.

Use it as a staging area for:

- implementation gaps we already know about
- improvements intentionally deferred to keep momentum
- items that may later become formal EVOs

Rules:

- keep entries concrete and actionable
- prefer short notes over long essays
- when an item becomes important enough to schedule, promote it into a dedicated EVO
- when an item is resolved, remove it or mark it as closed in the relevant EVO/commit

## Current Candidates

| Area | Topic | Why it matters | Suggested next step |
| --- | --- | --- | --- |
| API Hardening | D1 error handling in public endpoints | Current happy-path reads work, but D1 failures are not yet translated into controlled JSON error responses. | Introduce a small persistence-error handling pattern for Worker read endpoints once a second or third D1-backed endpoint exists. |
| API Hardening | Common strategy for persistence failures | We will soon have multiple D1-backed endpoints and do not want each one to invent its own failure handling. | Decide whether to add a shared error adapter or a small service-level exception translation layer. |
| API / Product Boundary | Decide whether hints stay separate or join route detail | Hints now have a dedicated endpoint, but later gameplay slices may still want to fetch them separately or nest them into richer route/objective payloads. | Revisit once the mobile hint-consumption flow is implemented and the fetch pattern is real. |
| Gameplay Boundary | Replace the temporary mocked-success validation step | The mobile flow now transitions from current objective into reward through an explicit temporary mocked-success step, but that still needs to be replaced with real validation. | Replace the temporary step later with real GPS, camera, demo, or progress-aware validation flow. |
| Data Model | Formalize `target_type` vocabulary | The current `target_type` values are convention-based, not DB-constrained. This is acceptable now, but drift could appear as more POIs are seeded. | Define and document the canonical vocabulary, and later decide whether to enforce it in schema. |
| Data Model | Review `POI.indoor_mode` vs `visual_objectives.indoor_mode` semantics | The model is now good enough, but frontend/backend consumers must rely on the objective-level field for precise filtering. | Document the rule in future route-detail and gameplay endpoint work. |
| API / Query Layer | Add deeper tests for real D1 read queries | Current integration tests validate endpoint contracts with stubs, while migration tests validate schema and seed state separately. | Consider service-level query tests against in-memory SQLite if D1-backed reads become more complex. |
| Mobile Gameplay | Consume hints in the current objective flow | Hints are real in D1 and exposed through the Worker, but the mobile objective screen still treats them as a placeholder. | Implement the mobile hint-consumption slice and then revisit whether hints stay separate or join richer route payloads. |
| Mobile Gameplay | Advance objective state after mocked success | The mocked-success transition correctly leads to reward, but the current objective does not change afterwards because no progression state exists yet. | Decide whether to add temporary local progression before full D1-backed completion arrives. |
| API / UX | Optional `/favicon.ico` handling | Browsers request `/favicon.ico` and the Worker returns `404`. This is harmless, but noisy in local logs. | Ignore for now, or add a tiny explicit handler later if log cleanliness becomes important. |
| API / Product Boundary | Locked future destinations strategy | Product may want “future blocked destinations”, but the API currently returns only real stored records. | Decide later whether blocked destinations must be seeded in D1 or modeled separately. |
| API / Product Boundary | Route detail payload expansion policy | The route detail endpoint still exposes route, POIs, and objectives only, even though hints and unlockable content now exist as separate endpoint-driven slices. | Decide later whether hints and reward-related content should stay separate or be nested into richer route/objective payloads. |
| Asset Ownership | Replace third-party placeholder asset strategy permanently | `cover_image_url` for `Jaén` was correctly cleared to `null`, but long-term media ownership still needs a real plan. | Revisit once the project is ready to adopt controlled assets, likely alongside future `R2` work. |
| Observability | Worker-level logging/diagnostics strategy | Runtime logs exist, but there is no explicit observability policy yet for API failures or content reads. | Revisit when public API surface grows beyond the first read endpoints. |

## Promotion Guidance

An item from this document should usually become a formal EVO when at least one of these is true:

- it blocks product delivery
- it affects multiple files or layers
- it needs explicit acceptance criteria
- it changes architecture or operating conventions
- it requires coordination with product/editorial decisions
