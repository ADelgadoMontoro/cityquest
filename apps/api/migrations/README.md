# D1 Migrations

This directory is reserved for future `Cloudflare D1` SQL migrations owned by the active API workspace.

`EVO-0009` prepares the D1 binding and the repository location for migrations. It does not introduce the schema yet.

`EVO-0070` introduces the first real schema migration:

```text
0001_initial_content_schema.sql
0002_enforce_content_sibling_ordering.sql
0003_seed_jaen_and_route.sql
0004_clear_external_jaen_cover_image.sql
0005_add_visual_objectives_indoor_mode.sql
0006_seed_catedral_de_jaen_poi_and_objectives.sql
```

## Purpose

Use this folder for versioned SQL migrations once schema work begins in later EVOs such as `EVO-0070`.

Recommended naming style:

```text
0001_create_destinations_table.sql
0002_create_routes_table.sql
```

The current baseline migration deliberately covers only the first content slice:

- `destinations`
- `routes`
- `pois`
- `visual_objectives`
- `hints`
- `unlockable_contents`

The first baseline content seed now introduces:

- destination `Jaén`
- route `Jaén: Echoes of Stone`

The next follow-up migration clears the temporary third-party `cover_image_url` so the destination no longer depends on an external asset placeholder.

The next schema refinement adds `indoor_mode` to `visual_objectives` so interior and exterior objectives can coexist inside the same POI.

The next content seed introduces:

- POI `Cathedral of Jaén`
- five first visual objectives for that stop

It intentionally defers:

- users
- progress
- achievements
- analytics
- demo-mode persistence

## Commands

From the repository root:

```bash
npm run d1:list
npm run d1:migrations:apply:local
npm run d1:migrations:apply:remote
```

From the API workspace directly:

```bash
npm run d1:list
npm run d1:migrations:apply:local
npm run d1:migrations:apply:remote
```

Do not add ad-hoc SQL files outside this folder once D1 schema work begins.

Do not add seed inserts into `0001_initial_content_schema.sql`. Product data loading belongs to later EVOs.

If a migration has already been applied to local or remote D1, do not rewrite it in place. Add a new numbered migration instead.
