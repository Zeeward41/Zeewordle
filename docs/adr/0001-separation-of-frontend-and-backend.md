# ADR 0001: Separation of Frontend and Backend

- **Status**: ✅ Accepted
- **Date**: 21/05/2026

## Context
I am starting the Zeewordle project and need to define the core architectural pattern. I want a clear separation of concerns to allow independent development, testing, and deployment of the user interface and the business logic. And to practice what i know...

## Decision
I choose a decoupled architecture by separating the project into two distinct blocks inside a Monorepo:
1. A **Frontend** application (responsible for the UI and user interaction).
2. A **Backend** application (responsible for game logic, data management, and authentication).
3. A **Infra** structure for CICD.

The specific frameworks, libraries, and databases will be decided and documented in dedicated ADRs when i initialize each application.

## Consequences
- **Pros (+)**: Strict separation of concerns, easier to test, matches my C4 Level 2 initial layout.
- **Cons (-)**: Requires configuring communication between the two apps (CORS, proxy) from the start.
