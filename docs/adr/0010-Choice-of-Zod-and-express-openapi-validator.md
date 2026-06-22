# ADR 0010: Choice of Zod and express-openapi-validator

**Status:** ✅ Accepted
**Date:** 22/06/2026

## 1. Context

During the backend development, two validation tools were considered: **Zod** and **express-openapi-validator**.

**Zod** is a standard tool in TypeScript API development. It allows creating schemas that automatically generate TypeScript interfaces and types, enabling runtime data validation while avoiding duplication between frontend and backend schemas. However, it has no direct link with the OpenAPI specification.

**express-openapi-validator** fills that gap — it validates incoming requests against the OpenAPI spec, ensuring routes stay in sync with the API documentation.

**Three options were considered:**
- **express-openapi-validator alone** — ensures consistency with the OpenAPI spec, but lacks the ability to handle business logic, data transformations, and custom rules.
- **Zod alone** — more robust for validation and transformations, but no guarantee that routes stay aligned with the OpenAPI spec.
- **Both together** — each tool handles what it does best.

## 2. Decision

Keep both tools with clearly separated responsibilities:
- **express-openapi-validator** — structural validation: field types, required fields, formats, and consistency with the OpenAPI spec. Acts as the first gate before the route is reached.
- **Zod** — business logic: uniqueness checks, custom rules, and data transformations before database insertion.

## 5. Consequences

### Positive
- Stronger validation coverage across two distinct layers.
- Routes are always guaranteed to match the OpenAPI documentation.
- Zod handles business rules that OpenAPI cannot express.

### Negative / Risks
- Two tools to maintain instead of one, which slightly increases development time.
- **Risk of divergence**: if the Zod schema and the OpenAPI spec are not updated together, they can go out of sync silently. This requires discipline when modifying either one.
