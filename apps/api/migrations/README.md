# D1 Migrations

This directory is reserved for future `Cloudflare D1` SQL migrations owned by the active API workspace.

`EVO-0009` prepares the D1 binding and the repository location for migrations. It does not introduce the schema yet.

## Purpose

Use this folder for versioned SQL migrations once schema work begins in later EVOs such as `EVO-0070`.

Recommended naming style:

```text
0001_create_destinations_table.sql
0002_create_routes_table.sql
```

## Commands

From the repository root:

```bash
npm run d1:list --workspace @cityquest/api
npm run d1:migrations:apply:local --workspace @cityquest/api
npm run d1:migrations:apply:remote --workspace @cityquest/api
```

From the API workspace directly:

```bash
npm run d1:list
npm run d1:migrations:apply:local
npm run d1:migrations:apply:remote
```

Do not add ad-hoc SQL files outside this folder once D1 schema work begins.
