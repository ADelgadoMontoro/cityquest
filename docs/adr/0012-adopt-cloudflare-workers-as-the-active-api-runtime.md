# ADR-0012: Adopt Cloudflare Workers as the Active API Runtime

## Status

Accepted

## Context

CityQuest originally established `apps/api` as a Lambda-oriented TypeScript backend foundation.

The project has since adopted a Cloudflare-first MVP platform direction for cost and operational reasons. Keeping the active backend runtime aligned with that platform decision now matters more than preserving the earlier AWS-specific runtime foundation.

The backend still needs to:

- live cleanly inside the monorepo
- keep delivery concerns separate from application services
- support local development and testing with minimal ceremony
- remain ready for future D1, R2, KV, authentication, and route expansion work

## Decision

Adopt `Cloudflare Workers` as the active runtime for `apps/api`.

This backend foundation will:

- expose a Worker-native `fetch` entry point instead of Lambda handlers
- use `Wrangler` for local development and deployment workflows
- keep application logic separated from transport concerns through small composition and adapter layers
- continue using TypeScript and `Vitest`
- treat the earlier Lambda-oriented code path as superseded for the active backend implementation

## Consequences

Positive:

- the active backend now matches the Cloudflare-first MVP direction
- local backend development becomes closer to the real target runtime
- the API foundation stays lightweight without introducing a traditional server
- future Cloudflare platform integrations can build on the correct runtime model

Tradeoffs:

- the earlier Lambda-oriented backend foundation becomes historical rather than active
- transport adapters and tests must move away from AWS event types
- some AWS-oriented documentation and mental models need to be updated to avoid confusion
