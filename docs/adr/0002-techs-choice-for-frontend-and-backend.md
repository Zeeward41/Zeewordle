# ADR 0002: Techs choice for frontend and backend

- **Status**: ✅ Accepted
- **Date**: 22/05/2026

## Context
For the Zeewordle project, I want to use a tech stack I am already familiar with, while adding more type safety, code robustness, and standardization to improve my development skills.

## Decision
I choose a unified tooling and modern stack managed via `pnpm` workspace:
1. **Build Tool:** **Vite** will be used as the universal bundler/development server for both frontend and backend to ensure fast builds and a single toolchain.
2. **Frontend:** **React 18** with **TypeScript** for building a dynamic and type-safe user interface.
3. **Backend:** **Express** with **TypeScript** (powered by Vite) to handle game logic, routing, and APIs with strict type definitions.

## Consequences
- **Pros (+)**: Built on widely adopted technologies with massive ecosystem support. Fast development feedback loop thanks to Vite.
- **Cons (-)**: This will be the first time using TypeScript extensively in a full-stack project, introducing a learning curve.
