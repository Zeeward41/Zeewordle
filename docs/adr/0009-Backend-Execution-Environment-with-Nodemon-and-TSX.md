# ADR 0009: Backend Execution Environment with Nodemon and TSX

**Status:** ✅ Accepted  
**Date:** 20/06/2026

## 1. Context & Problem Statement

The project was initially scaffolded as a `pnpm` monorepo using **Vite** to manage both the frontend and backend applications.

While Vite is an exceptional bundler for frontend applications and Server-Side Rendering (SSR) architectures, it introduces significant friction when applied to a standard, decoupled REST API built with Express.js.

Specifically, we encountered major configuration pain points:

* **Environment Variables & Secrets:** Vite abstracts environment loading, making it highly complex to enforce a single source of truth for variables (like the server `PORT`) coming from decrypted SOPS files (`.env`) without adding heavy, custom configuration hooks.
* **Process Lifecycles:** Vite relies on Hot Module Replacement (HMR). However, a backend Express server requires a full process restart upon file changes to properly flush memory, rebind database connections, and register new routing layers.

## 2. Decision Drivers

* **Architectural Simplicity:** The backend development workflow must remain intuitive, predictable, and rely on standard Node.js behaviors.
* **Isolation of Concerns:** The backend API execution must be fully decoupled from frontend bundler constraints.
* **Secret Management Compatibility:** Seamless integration with our current `dotenv` and SOPS-encrypted workflow without bundler-specific filtering or overrides.

## 3. Considered Options

* **Option 1: Maintain Vite for the backend.** Invest time in tweaking `vite-plugin-node` and custom environment loaders to play nice with our SOPS workflow.
* **Option 2: Bypass Vite for backend execution.** Revert to a standard backend runtime stack using **Nodemon** and **TSX** (TypeScript Execute).

## 4. Decision Outcome

We chose **Option 2 (Nodemon + TSX)**.

### Implementation Strategy:

* **Development:** We use `nodemon -L --exec tsx server.ts`. This provides instant TypeScript compilation (powered by Esbuild under the hood), native Node.js execution, and reliable full-process restarts.
* **Production:** The backend will be compiled to native JavaScript using the official TypeScript compiler (`tsc`) into a `dist/` directory, and executed using `node dist/server.js`.
* **Pragmatic Preservation:** Existing Vite configuration files (`vite.config.ts`, etc.) within the backend workspace **will be preserved but kept dormant**. Completely removing Vite at this stage introduces a high risk of breaking shared path mappings, pipeline tooling, or root scripts within the `pnpm` monorepo. Bypassing execution is the safest approach.

## 5. Consequences

### Positive (What we gain)

* **Zero Configuration Friction:** The backend now behaves exactly like a standard, predictable Node.js app.
* **Seamless Secrets Loading:** Node reads our decrypted `.env` files directly via `dotenv`, matching local and production pipeline behaviors perfectly.
* **Performance:** TSX offers the same sub-millisecond compilation speeds as Vite during development thanks to Esbuild, without the added configuration layer.
* **Monorepo Stability:** Keeping Vite configurations dormant ensures we do not break workspace-wide scripts or dependencies.

### Negative (What we lose / Risks)

* **Configuration Deadweight:** Retaining unused Vite files adds minor visual clutter in the backend folder structure, which is mitigated by this documentation.

