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
| API Hardening | Unknown route-slug coverage for route detail | The route detail endpoint already returns `404` for missing routes, but explicit automated coverage for unknown slugs would make regressions easier to catch. | Add a focused integration test for `/routes/<unknown-slug>` returning controlled `404`. |
| API / Product Boundary | Decide how hints should be delivered | The first real hints now exist in D1, but the API still does not expose a dedicated hint contract for mobile gameplay. | Decide whether hints should be nested in route/objective payloads or exposed through a separate endpoint. |
| Gameplay Boundary | Replace the temporary unlock validation assumption | The first unlock endpoint can return real narrative content, but it still relies on an explicit temporary assumption that validation already succeeded upstream. | Replace the assumption later with real GPS, camera, demo, or progress-aware validation flow. |
| Data Model | Formalize `target_type` vocabulary | The current `target_type` values are convention-based, not DB-constrained. This is acceptable now, but drift could appear as more POIs are seeded. | Define and document the canonical vocabulary, and later decide whether to enforce it in schema. |
| Data Model | Review `POI.indoor_mode` vs `visual_objectives.indoor_mode` semantics | The model is now good enough, but frontend/backend consumers must rely on the objective-level field for precise filtering. | Document the rule in future route-detail and gameplay endpoint work. |
| API / Query Layer | Add deeper tests for real D1 read queries | Current integration tests validate endpoint contracts with stubs, while migration tests validate schema and seed state separately. | Consider service-level query tests against in-memory SQLite if D1-backed reads become more complex. |
| API / UX | Optional `/favicon.ico` handling | Browsers request `/favicon.ico` and the Worker returns `404`. This is harmless, but noisy in local logs. | Ignore for now, or add a tiny explicit handler later if log cleanliness becomes important. |
| API / Product Boundary | Locked future destinations strategy | Product may want “future blocked destinations”, but the API currently returns only real stored records. | Decide later whether blocked destinations must be seeded in D1 or modeled separately. |
| API / Product Boundary | Route detail payload expansion policy | The route detail endpoint currently exposes only route, POIs, and objectives because hints and unlockable content are not seeded yet. | Decide later whether those pieces should be nested directly in the route payload or fetched separately. |
| Asset Ownership | Replace third-party placeholder asset strategy permanently | `cover_image_url` for `Jaén` was correctly cleared to `null`, but long-term media ownership still needs a real plan. | Revisit once the project is ready to adopt controlled assets, likely alongside future `R2` work. |
| Observability | Worker-level logging/diagnostics strategy | Runtime logs exist, but there is no explicit observability policy yet for API failures or content reads. | Revisit when public API surface grows beyond the first read endpoints. |

## Promotion Guidance

An item from this document should usually become a formal EVO when at least one of these is true:

- it blocks product delivery
- it affects multiple files or layers
- it needs explicit acceptance criteria
- it changes architecture or operating conventions
- it requires coordination with product/editorial decisions
