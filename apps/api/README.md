# API

This workspace contains the CityQuest backend foundation built with Node.js and TypeScript, prepared to evolve into an AWS Lambda and API Gateway runtime.

Its role in the monorepo is to expose transport concerns, compose bounded-context application services, and keep business logic outside the delivery layer.

## Initial Scope

The current bootstrap intentionally includes:

- a Lambda-friendly TypeScript structure
- a minimal health-style handler example
- a local development runner for backend smoke tests
- unit and integration test wiring for backend evolution

It intentionally does not include:

- business endpoints
- database access
- Cognito integration
- S3, Rekognition, or AI integrations
- infrastructure deployment logic
