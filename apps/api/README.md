# API

This workspace contains the active CityQuest backend foundation built for `Cloudflare Workers` with TypeScript.

Its role in the monorepo is to expose transport concerns, compose application services, and keep business logic outside the delivery layer.

## Current Scope

The current bootstrap intentionally includes:

- a Worker-native TypeScript runtime
- a minimal initialization response at the root route
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

To validate the runtime foundation:

```bash
curl http://localhost:8787/
```

Expected response shape:

```json
{
  "service": "cityquest-api",
  "status": "initialized",
  "environment": "development"
}
```
