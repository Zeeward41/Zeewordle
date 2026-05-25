# ADR 0003: Security Policy of secrets

- **Status**: ✅ Accepted
- **Date**: 25/05/2026

## Context

Before writing any core application code, we must establish a strategy to manage secrets throughout the software development lifecycle. Additionally, we need a rigorous process to prevent sensitive information from being leaked into the Git repository history.

## Decision

We implement a multi-layered security approach for secrets management:

1. **Encryption at Rest:** Use **SOPS** combined with **age** to directly encrypt configuration files containing sensitive data. Only the encrypted files (e.g., `secrets.enc.yaml`) will be committed to Git.
2. **Leak Prevention (Local Hooks):** Install **Talisman** and **BetterLeaks** as local Git hooks to capture human errors before code leaves the machine.
* `talisman` is configured as a `pre-commit` hook.
* `betterleaks` is configured as a `pre-push` hook.

## Consequences

* **Pros (+)**: Simple and lightweight to set up, easy key rotation, and complete independence from third-party SaaS platforms.
* **Cons (-)**: Introduces new tools to master and poses a critical risk if the `master key` (age secret key) is lost. Furthermore, local hooks rely on the developer's machine discipline and can be bypassed, or avoided during direct edits on GitHub.
*Note: This local limitation justifies doubling this security check on the server-side within the CI/CD pipeline (see ADR 0004).*
