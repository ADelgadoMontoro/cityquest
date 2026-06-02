# Cloudflare Setup

This document defines the active Cloudflare setup for the CityQuest MVP. It exists to keep the Cloudflare path explicit, lightweight, and consistent across repository work, local development, and later deployment tasks.

## Why Cloudflare Is the Active Path

CityQuest originally explored an AWS-oriented architecture. The MVP direction is now Cloudflare-first because it offers a simpler and more predictable path for:

- backend execution through `Cloudflare Workers`
- admin deployment through `Cloudflare Pages`
- structured data through `Cloudflare D1`
- media storage through `Cloudflare R2`

The `infra/` workspace still exists as historical AWS groundwork, but it is not the active delivery path for the MVP.

## Services in Scope

The active Cloudflare direction currently assumes:

- `Workers` for the backend runtime in `apps/api`
- `Pages` later for the admin deployment target
- `D1` later for primary structured data
- `R2` later for controlled media storage
- `KV` only later for helper or cache-style use cases

Only `Workers` are actively wired today. `Pages`, `D1`, `R2`, and `KV` are future-facing parts of the platform plan and are not provisioned by this repository yet.

## Naming Convention

Cloudflare resources should follow:

```text
cityquest-<environment>-<resource>
```

Current dev naming baseline:

```text
cityquest-dev-api
cityquest-dev-admin
cityquest-dev-db
cityquest-dev-assets
```

Future environments should stay aligned:

```text
cityquest-staging-api
cityquest-staging-admin
cityquest-staging-db
cityquest-prod-api
cityquest-prod-admin
cityquest-prod-db
```

## Environment Strategy

The repository currently prepares only the `dev` environment as an active concern.

Practical distinction:

- platform environment name: `dev`
- current backend runtime value: `development`

That means a Cloudflare resource can be named `cityquest-dev-api` while the Worker may still report `development` through its current runtime config.

`staging` and `prod` remain future decisions and should not be provisioned during `EVO-0006`.

## Active Files

The Cloudflare foundation currently lives mainly in:

```text
apps/api/wrangler.toml
apps/api/scripts/run-wrangler.mjs
apps/api/scripts/verify-worker-runtime.mjs
apps/api/.dev.vars.example
```

Key rules:

- keep the Worker configuration directly understandable from `apps/api`
- do not commit account-specific secrets
- do not commit account IDs or tokens into versioned files

## Authentication

Local Cloudflare authentication is expected through `Wrangler`.

The repository wraps `Wrangler` through local helper scripts in `apps/api/scripts/`. Those scripts set `XDG_CONFIG_HOME` to `apps/api/.wrangler-home`, so repository commands use a workspace-local auth/config context instead of assuming your global machine-wide `Wrangler` state.

From the repository root:

```bash
npm run cf:login
npm run cf:whoami
```

From the API workspace directly:

```bash
npm run login
npm run whoami
```

For normal local development in this phase, interactive `Wrangler` auth is sufficient. CI-oriented API tokens can be introduced later when deployment automation becomes part of scope.

Practical implication:

- if `npm run cf:whoami` says you are not authenticated, run `npm run cf:login`
- this can happen even if you previously logged in with a global `wrangler login` outside the repository wrapper flow

## Local Development Flow

Install dependencies from the repository root, then run:

```bash
npm install
npm run api:dev
```

Expected local Worker URL:

```text
http://127.0.0.1:8787/
```

If that port is already occupied, `Wrangler` may choose the next available local port instead. That is normal and does not indicate a repository problem.

Expected response shape:

```json
{
  "environment": "development",
  "service": "cityquest-api",
  "status": "initialized"
}
```

The repository also keeps `npm run dev`, which starts mobile, admin, and API together. `npm run api:dev` is the clearest command when validating only the active Cloudflare backend path.

## Local Variables

Committed defaults live in `apps/api/wrangler.toml`.

If local overrides are needed, copy the values from `apps/api/.dev.vars.example` into a local `apps/api/.dev.vars` file.

Guidance:

- use `.dev.vars` only for local non-committed overrides
- keep secrets out of `.dev.vars.example`
- prefer `CITYQUEST_` prefixes for backend-private settings

Current non-secret backend variables:

```text
CITYQUEST_API_NAME
CITYQUEST_APP_ENV
CITYQUEST_LOG_LEVEL
```

## Secrets Handling

Never commit real values for:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
OPENAI_API_KEY
JWT_SECRET
SESSION_SECRET
```

If a later task needs real Worker secrets, manage them through Cloudflare secret mechanisms or local non-versioned files, not through committed repository files.

## What This Foundation Intentionally Does Not Do Yet

This setup does not yet:

- provision `D1`
- provision `R2`
- create a `Pages` project
- implement business API routes
- implement authentication
- define CI/CD
- create production domains

Those concerns belong to later tasks.

## Manual Verification

The active Cloudflare foundation is considered ready when a developer can:

1. authenticate with `npm run cf:whoami`
2. start the Worker locally with `npm run api:dev`
3. `curl` the Worker locally and receive the initialization JSON
4. understand the dev naming convention without consulting ad-hoc notes

## Relationship to Legacy AWS Work

AWS-oriented assets remain in the repository for:

- historical context
- portfolio evidence
- architectural reference

Practical rule:

- do not extend the AWS path unless a future ADR explicitly reopens it

For current MVP implementation work, Cloudflare is the only active infrastructure direction.
