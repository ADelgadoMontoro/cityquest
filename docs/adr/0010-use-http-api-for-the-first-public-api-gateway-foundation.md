# ADR-0010: Use HTTP API for the First Public API Gateway Foundation

## Status

Accepted

## Context

CityQuest needs a public API entry point in AWS that can receive requests from the mobile app, admin panel, and future internal tools.

The first infrastructure task only needs to establish the API Gateway foundation:

- no business routes yet
- no authentication yet
- no custom domain yet
- no advanced edge security or throttling yet

This decision needs to favor simplicity, low operational overhead, and a clean path toward Lambda route integration during the MVP.

## Decision

Use `API Gateway HTTP API` as the first public API Gateway foundation for CityQuest.

The initial configuration will:

- target the `dev` environment only
- enable basic development CORS for known local origins
- expose the base API URL as a CDK output
- remain ready to connect Lambda-backed routes in later tasks

## Consequences

Positive:

- lower cost and simpler configuration than a REST API foundation
- good fit for Lambda-backed MVP endpoints
- cleaner initial setup for a solo-built portfolio project
- easy path to add auth and route integrations later

Tradeoffs:

- some advanced API Gateway features remain less flexible than in REST API
- if future requirements demand REST-specific capabilities, the decision may need to be revisited
- deploy-time AWS credentials and CDK bootstrap become prerequisites for full end-to-end validation
