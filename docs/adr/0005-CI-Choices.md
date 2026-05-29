# ADR 0005: Architectural Choices for the Continuous Integration (CI) Pipeline

**Status:** ✅ Accepted

**Date:** 2026-05-29

## Context

In an ecosystem where technologies evolve rapidly, implementing a robust CI (*Continuous Integration*) pipeline is essential. The objective is twofold: automate code quality validation and guarantee maximum security from the very start of the project (a *Shift-Left Security* approach).

## Decision

The CI pipeline is orchestrated via **GitHub Actions** using a parallelized matrix strategy to cleanly isolate the `frontend` and `backend` jobs. It consists of the following steps, executed in a specific logical order:

1. **`betterleaks`) :** Static analysis to ensure no sensitive information (API keys, credentials) is pushed into the repository.
2. **`Prettier` (Formatter) :** Code style validation to maintain a consistent codebase across the entire project.
3. **`ESLint` (Linter) :** Static code analysis for TypeScript/JavaScript to catch syntax errors and enforce best practices.
4. **`Vitest` (Unit Tests) :** Execution of automated tests to validate business logic and prevent regressions.
5. **`SonarQube Cloud` :** Deep-dive analysis of technical debt, code smells, and code duplication.
6. **`Trivy` (FS Scanner) :** Security scan of the project's file system to look for known vulnerabilities (CVEs).
7. **`Syft SBOM + GitHub Dependency Graph` :** Generation of a Software Bill of Materials (SBOM) and submission to the GitHub API, allowing **Dependabot** to perform continuous background security monitoring.

- **Fail-Fast Behavior:** The pipeline is configured to fail instantly if any single step or test fails. Furthermore, the GitHub Actions matrix is configured with `fail-fast: true` (default) so that if the `frontend` job fails, the `backend` job is automatically canceled (and vice versa) to save CI runner minutes.

## Consequences

### Pros (+)

* **Enhanced Quality & Security:** Code is thoroughly checked for bugs and vulnerabilities before it ever reaches the main branch.
* **Zero Infrastructure Cost:** Leveraging GitHub Actions (free runners for public repos/private quotas), SonarQube Cloud (free for open-source/personal tiers), and open-source CLI tools (Trivy, Syft) keeps the infrastructure cost at €0.
* **Performance:** The matrix architecture ensures that frontend and backend checks run concurrently, keeping build times low.

### Cons (-)

* **Initial Configuration Complexity:** Requires fine-tuning of workflow permissions (`contents: write`, `security-events: write`) and secure management of repository secrets (e.g., `SONAR_TOKEN`).
* **Dependency on GitHub Settings:** The pipeline relies on a few one-time manual clicks in the repository settings UI (*Dependency Graph, Dependabot alerts, Security & Grouped updates*) to function properly.
