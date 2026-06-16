# ADR 0008: Choice of OpenAPI and Redocly

**Status:** ✅ Accepted  
**Date:** 2026-06-16

## Context

After creating the website wireframes, we needed tools to design, organize, and structure our API. Since one of the core goals of this project is to maintain high-quality documentation, it was the perfect time to introduce an API specification standard.

## Decision

We chose to use **OpenAPI**, which is the industry standard for describing and documenting REST APIs.

To visualize and consume this documentation in a clean, professional, and integrated way, we selected **Redocly CLI**. The tool will be installed on the backend side to validate (lint) the specification, while the `openapi.yaml` file will remain accessible to the entire project.

## Consequences

### Pros (+)
- **Standardization:** OpenAPI is a universally recognized standard.
- **Visual Quality:** Redocly provides a modern, clean (3-column interface), and highly readable documentation layout.
- **Validation (Linting):** Redocly allows us to validate the YAML file structure directly within our development workflow to prevent syntax errors.

### Cons (-)
- **Learning Curve:** New tools and concepts to learn (OpenAPI syntax, Redocly CLI), which might slightly impact development velocity at the beginning.
- **Maintenance:** Requires keeping the specification file up to date whenever API routes are modified.

