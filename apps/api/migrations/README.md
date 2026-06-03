# D1 Migrations

This directory is reserved for future `Cloudflare D1` SQL migrations owned by the active API workspace.

`EVO-0009` prepares the D1 binding and the repository location for migrations. It does not introduce the schema yet.

`EVO-0070` introduces the first real schema migration:

```text
0001_initial_content_schema.sql
0002_enforce_content_sibling_ordering.sql
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
