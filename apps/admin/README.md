# Admin App

This workspace contains the CityQuest administrative web panel built with Next.js.

Its role in the monorepo is to provide the delivery layer for future destination, route, POI, visual objective, unlockable content, and analytics management workflows without placing domain logic inside the UI.

## Initial Scope

The current bootstrap intentionally includes:

- a working Next.js application with TypeScript
- a simple branded landing screen for the admin area
- a clear source structure for future admin features

It intentionally does not include:

- admin authentication
- backend integration
- CRUD forms
- analytics dashboards
- real content management flows
