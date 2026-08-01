# ADR 0012: Selecting TanStack Router as the Primary Router

**Status:** ✅ Accepted  
**Date:** 20/07/2026

## 1. Context

Our React application requires a client-side routing solution to handle nested layouts, data loading, and URL state synchronization. 

To maintain high code quality standards and speed up development, we established strict project requirements from day one:
- 100% end-to-end type safety across all routing logic.
- Native validation and typing for URL search parameters.
- Existing team expertise with the tool to avoid onboarding friction.

## 2. Decision

We decided to use **TanStack Router** directly as the project's routing framework.

This choice is justified by:
1. **Prior Team Expertise:** The team already masters TanStack Router, allowing for immediate productivity without a learning curve.
2. **Built-in Type Safety:** Full TypeScript inference for routes, path parameters, navigation links, and search parameters out of the box.
3. **Robust Search Params Validation:** Native integration with validation schemas (e.g., Zod) to safely parse and type URL state.

## 3. Consequences

### Positive (Pros)
- **Immediate Team Velocity:** No time lost learning or evaluating alternative routing frameworks.
- **Compile-Time Safety:** Eliminates broken links and missing required parameters at build time.
- **URL State Integrity:** Search parameters are fully typed and validated at runtime via Zod schemas.

### Negative / Risks (Cons)
- **Tool Lock-in:** The codebase is tied to TanStack Router's paradigm and its code generation workflow (Vite plugin).
