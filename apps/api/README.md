# API

This workspace contains the active CityQuest backend foundation built for `Cloudflare Workers` with TypeScript.

Its role in the monorepo is to expose transport concerns, compose application services, and keep business logic outside the delivery layer.

## Current Scope

The current bootstrap intentionally includes:

- a Worker-native TypeScript runtime
- a formal `GET /health` endpoint for runtime checks
- a minimal initialization response at the root route
- a centralized HTTP routing and transport foundation for future API endpoints
- local development through `Wrangler`
- build-time Worker runtime verification through a local Wrangler smoke check
- unit and integration test wiring for backend evolution

It intentionally does not include:

- business endpoints
- database access
- Cloudflare D1, R2, or KV integrations
- authentication
- production deployment strategy

## Local Development

Install dependencies from the repository root or from this workspace, then run:

```bash
npm run dev --workspace @cityquest/api
```

The Worker should start locally on the standard Wrangler development port.

The repository runs `Wrangler` through a small wrapper that keeps local config under `.wrangler-home`. If `npm run whoami` reports that you are not authenticated, run `npm run login` from this workspace or `npm run cf:login` from the repository root.

If you need local variable overrides beyond the defaults committed in `wrangler.toml`, create a local `.dev.vars` file from `.dev.vars.example`.

`Wrangler` reads `.dev.vars` locally. Keep real secrets out of the repository.

To validate the runtime foundation:

```bash
curl http://localhost:8787/
```

If `8787` is already in use, `Wrangler` may start on a nearby port such as `8788`.

Expected response shape:

```json
{
  "service": "cityquest-api",
  "status": "initialized",
  "environment": "development"
}
```

Unknown routes return a controlled JSON error payload, and `OPTIONS` preflight handling is centralized so future endpoints can reuse the same transport conventions.

To validate the formal healthcheck endpoint:

```bash
curl http://localhost:8787/health
```

Expected response shape:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "cityquest-api",
    "environment": "development"
  },
  "meta": {
    "timestamp": "2026-06-03T12:00:00.000Z"
  }
}
```

## Naming and Platform Notes

- Worker resource naming follows the `cityquest-<environment>-<resource>` convention.
- The current dev Worker name is `cityquest-dev-api`.
- `Cloudflare Pages`, `D1`, and future `R2` resources are documented in [`docs/cloudflare-setup.md`](../../docs/cloudflare-setup.md).
- The AWS-oriented `infra/` workspace remains historical context only and is not part of the active backend workflow.
