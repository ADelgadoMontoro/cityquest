# API

This workspace contains the active CityQuest backend foundation built for `Cloudflare Workers` with TypeScript.

Its role in the monorepo is to expose transport concerns, compose application services, and keep business logic outside the delivery layer.

## Current Scope

The current bootstrap intentionally includes:

- a Worker-native TypeScript runtime
- a formal `GET /health` endpoint for runtime checks
- a minimal initialization response at the root route
- a centralized HTTP routing and transport foundation for future API endpoints
- a public `GET /destinations` endpoint backed by D1
- a public `GET /routes/jaen-echoes-of-stone` endpoint backed by D1
- a public `GET /objectives/estatua-san-fernando/unlocks` endpoint backed by D1
- local development through `Wrangler`
- build-time Worker runtime verification through a local Wrangler smoke check
- unit and integration test wiring for backend evolution

It intentionally does not include:

- real validation workflows
- progress persistence
- Cloudflare R2 integrations
- Cloudflare KV integrations
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

To validate the public destinations listing:

```bash
curl http://localhost:8787/destinations
```

To validate the current real route detail payload:

```bash
curl http://localhost:8787/routes/jaen-echoes-of-stone
```

To validate the first unlockable-content payload:

```bash
curl http://localhost:8787/objectives/estatua-san-fernando/unlocks
```

## D1 Preparation

This workspace is the owner of the active `Cloudflare D1` integration path.

`EVO-0009` prepares:

- the `DB` Worker binding contract
- the `apps/api/migrations/` location
- D1 wrapper commands through the local `Wrangler` runner

Expected development database name:

```txt
cityquest-dev-db
```

Expected Worker binding name:

```txt
DB
```

Useful commands:

```bash
npm run whoami
npm run d1:list
npm run d1:migrations:apply:local
npm run d1:migrations:apply:remote
```

Future schema files should live in [`apps/api/migrations`](./migrations).

The first schema migration is [`0001_initial_content_schema.sql`](./migrations/0001_initial_content_schema.sql). It defines the initial content backbone only and intentionally defers users, progress, analytics, and demo-mode persistence.

The first baseline content seed is [`0003_seed_jaen_and_route.sql`](./migrations/0003_seed_jaen_and_route.sql). It inserts the `Jaén` destination and the `Jaén: Echoes of Stone` route, but still leaves POIs and deeper gameplay content for later EVOs.

[`0004_clear_external_jaen_cover_image.sql`](./migrations/0004_clear_external_jaen_cover_image.sql) then clears the temporary third-party `cover_image_url` by setting it to `null` until the project owns a stable asset.

[`0005_add_visual_objectives_indoor_mode.sql`](./migrations/0005_add_visual_objectives_indoor_mode.sql) lets the repository distinguish interior and exterior objectives inside the same POI.

[`0006_seed_catedral_de_jaen_poi_and_objectives.sql`](./migrations/0006_seed_catedral_de_jaen_poi_and_objectives.sql) introduces the first real POI slice for `Jaén: Echoes of Stone`: `Cathedral of Jaén` plus its first five published visual objectives.

[`0007_seed_banos_arabes_poi_and_objectives.sql`](./migrations/0007_seed_banos_arabes_poi_and_objectives.sql) then introduces the second real POI slice for `Jaén: Echoes of Stone`: `Arab Baths of Jaén` plus its first five published visual objectives.

[`0008_seed_statue_of_saint_ferdinand_unlockable_content.sql`](./migrations/0008_seed_statue_of_saint_ferdinand_unlockable_content.sql) introduces the first real unlockable narrative content for the objective `estatua-san-fernando`.

[`0009_seed_statue_of_saint_ferdinand_hints.sql`](./migrations/0009_seed_statue_of_saint_ferdinand_hints.sql) introduces the first three progressive hints for the same objective, making the gameplay-help layer real in D1 even before a dedicated hint-delivery endpoint exists.

The first public read endpoints now sit on top of that seeded baseline:

- `GET /destinations`
- `GET /routes/jaen-echoes-of-stone`
- `GET /objectives/estatua-san-fernando/unlocks`

Important nuance:

- this unlock endpoint does not claim to perform real validation yet
- it is the first backend-owned reward delivery path, ready for later gameplay slices to call after mocked or real validation succeeds
- seeded hints now exist in D1, but they are not yet exposed through a dedicated API contract

## Naming and Platform Notes

- Worker resource naming follows the `cityquest-<environment>-<resource>` convention.
- The current dev Worker name is `cityquest-dev-api`.
- The active Cloudflare platform flow, including D1 setup, is documented in [`docs/cloudflare-setup.md`](../../docs/cloudflare-setup.md).
- The AWS-oriented `infra/` workspace remains historical context only and is not part of the active backend workflow.
