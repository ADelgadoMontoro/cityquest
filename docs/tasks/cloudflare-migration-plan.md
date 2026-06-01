# Cloudflare Migration Plan

## Objective

Migrate the CityQuest cloud strategy from the current AWS-oriented foundation to a Cloudflare-first MVP stack focused on lower operational cost, simpler hosting, and more predictable early-stage spend.

The target platform direction becomes:

- `Cloudflare Workers` for backend execution
- `Cloudflare Pages` for the admin web deployment target
- `Cloudflare D1` for primary structured MVP data
- `Cloudflare R2` for media and asset storage
- `Cloudflare KV` only for auxiliary low-risk use cases such as flags, lightweight lookup data, or cache-style state

## Why This Change Makes Sense

The main driver is cost control and operational simplicity during the MVP.

For the current CityQuest scope, the Cloudflare stack offers a strong fit because:

- the mobile app does not depend on AWS specifically
- the admin panel can be hosted naturally through Pages
- the backend is still in an early foundation stage and can still pivot cleanly
- storage, static delivery, and edge execution can be kept under one platform

This change is architectural, but it is not a full restart. Most of the product structure, monorepo design, DDD boundaries, and application organization still remain valid.

## Migration Summary

### Keep As-Is

These parts of the repository remain valid and should be preserved:

- monorepo structure
- DDD boundaries
- ADR discipline
- shared development configuration
- Expo mobile app foundation
- Next.js admin panel foundation
- test-guided development approach
- most documentation structure

### Rework

These parts should be adapted rather than discarded:

- `apps/api` should move from a Lambda-oriented runtime to a Worker-oriented runtime
- transport adapters and request/response mapping should be rewritten for the Cloudflare runtime
- asset upload and access strategy should move from the previous AWS assumptions to R2-compatible flows
- auth strategy should move away from Cognito assumptions

### Deprecate or Freeze

These parts should be treated as no longer strategic:

- AWS CDK infrastructure direction under `infra/`
- API Gateway-first assumptions
- Lambda-specific backend direction
- DynamoDB, S3, CloudFront, and Cognito as default MVP targets

The AWS work already done should not be treated as wasted. It remains useful as:

- architectural exploration
- portfolio evidence of cloud design thinking
- a reference point for the pivot decision

## Target Cloudflare Architecture

### Backend

Use `Cloudflare Workers` as the main backend execution model.

Target outcome:

- lightweight HTTP entry points
- route handlers mapped to application services
- no permanent Node.js server requirement
- deployment through Cloudflare tooling instead of AWS CDK

Design guidance:

- keep application logic independent from the delivery layer
- preserve the existing separation between transport and services
- replace Lambda-specific adapters with Worker-specific ones

### Admin Panel

Use `Cloudflare Pages` as the target deployment platform for the admin app.

Implications:

- the current Next.js foundation remains useful
- deployment assumptions change
- future environment variable and deployment documentation should target Cloudflare Pages

### Data

Use `D1` as the default primary database for structured MVP data.

Use it for:

- destinations
- routes
- POIs
- objectives
- unlockable content metadata
- progress
- validation attempts
- analytics event persistence if the load remains modest

Do not use `KV` as the primary source of truth for core product data.

Use `KV` only for:

- feature flags
- lightweight configuration
- cache-style or eventually consistent helper data

### Assets

Use `R2` for:

- images
- media
- uploaded assets
- future admin-managed content files

## Migration Phases

### Phase 1 - Strategic Pivot and Documentation

Goal:

- lock the platform change explicitly

Work:

- add an ADR for the Cloudflare platform decision
- update project context and readmes
- add a migration plan document
- treat AWS as legacy direction unless a later decision reverses the pivot

### Phase 2 - Infrastructure Direction Reset

Goal:

- stop growing the AWS path

Work:

- freeze the AWS CDK work as exploratory infrastructure
- avoid adding new AWS resources
- document that the future deploy path is Cloudflare-based

Expected outcome:

- `infra/` remains as historical/legacy groundwork until replaced or archived

### Phase 3 - Backend Runtime Migration

Goal:

- move `apps/api` from Lambda-oriented code to Worker-oriented code

Work:

- replace Lambda-specific handler types and adapters
- define Worker request/response adapters
- preserve service-layer logic where possible
- update tests to cover the Worker runtime entry points

Expected outcome:

- backend foundation runs in the Cloudflare model without redesigning domain/application intent

### Phase 4 - Data and Asset Strategy Migration

Goal:

- align persistence and storage with Cloudflare services

Work:

- define D1 schema direction for MVP entities
- define R2 asset storage approach
- reserve KV for secondary use cases only
- update documentation and future task assumptions

### Phase 5 - Deployment and Environment Alignment

Goal:

- make the project operational on Cloudflare

Work:

- define Cloudflare deployment configuration for admin and backend
- document required credentials and environments
- add deployment validation steps
- add cost-monitoring notes appropriate for Cloudflare

## Recommended Task-Level Reinterpretation

The existing AWS-focused tasks should be reinterpreted carefully rather than blindly continued.

Recommended handling:

- keep finished AWS foundation tasks as completed historical steps
- do not continue deep AWS implementation unless there is a deliberate reversal
- create new tasks or replace phase-2 infra tasks with Cloudflare-aligned equivalents

Examples:

- API Gateway task should not continue as the main path
- Lambda integration tasks should be replaced with Worker route integration tasks
- Cognito tasks should be replaced by a Cloudflare-compatible auth strategy later

## Risks and Tradeoffs

### Benefits

- better cost posture for an MVP
- simpler operational story
- good fit for static admin hosting plus edge/backend execution
- smaller risk of surprise charges from multiple AWS services

### Tradeoffs

- existing AWS-specific work loses strategic relevance
- backend adapters must be rewritten
- some future AWS-native integrations from the original concept must be rethought
- image validation and AI integration choices may need a different implementation path later

## Recommended Next Steps

The recommended immediate next steps are:

1. record the Cloudflare platform decision in an ADR
2. update context and README-level documentation
3. stop adding new AWS implementation work
4. plan a Worker-oriented replacement for the current API foundation
5. define the first Cloudflare-specific backend task before touching the runtime code

## Working Assumption Going Forward

Until another ADR supersedes it, CityQuest should be treated as:

- mobile app on Expo
- admin app intended for Cloudflare Pages
- backend intended for Cloudflare Workers
- structured data intended for D1
- media intended for R2
- KV reserved for non-critical helper use cases
