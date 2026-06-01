# ADR-0011: Adopt a Cloudflare-First MVP Platform Direction

## Status

Accepted

## Context

CityQuest began with an AWS-oriented backend and infrastructure direction, including Lambda, API Gateway, and CDK-based foundations.

As the MVP scope and cost sensitivity became clearer, infrastructure spend predictability emerged as a stronger concern than deep AWS alignment.

The project needs a cloud direction that:

- reduces the risk of cost surprises
- remains strong enough for a portfolio-grade MVP
- still supports a mobile app, admin panel, backend runtime, structured data, and asset storage

## Decision

Adopt a Cloudflare-first MVP platform direction.

Target direction:

- `Cloudflare Workers` for backend execution
- `Cloudflare Pages` for the admin deployment target
- `Cloudflare D1` for primary structured MVP data
- `Cloudflare R2` for media and assets
- `Cloudflare KV` only for secondary helper use cases, not core product data

The existing AWS work remains useful as exploratory groundwork, but it is no longer the strategic path for the MVP unless a future ADR reverses this decision.

## Consequences

Positive:

- better cost posture for the MVP
- simpler cloud story for early deployment
- reduced need to manage multiple AWS services during the first product iteration
- good alignment with a lightweight, edge-friendly platform model

Tradeoffs:

- AWS-specific infrastructure work becomes legacy rather than forward path
- Lambda-oriented backend adapters will need to be replaced
- some original AWS-native assumptions, including infrastructure and auth strategy, must be reconsidered
