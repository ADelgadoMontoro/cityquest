# Infra

This directory contains the CityQuest cloud infrastructure workspace.

The current checked-in foundation is based on AWS CDK and was created as an early exploration step.

At this point, the preferred MVP cloud direction has shifted toward Cloudflare. That means the AWS/CDK work in this directory should be treated as legacy exploratory groundwork unless a future ADR reactivates it as the strategic path.

The current AWS-based foundation includes:

- environment-aware stacks
- HTTP API infrastructure
- future Lambda integrations
- later authentication, storage, and observability resources

If Cloudflare remains the chosen direction, future infrastructure work should introduce the replacement deployment path rather than continue deepening the AWS path.
