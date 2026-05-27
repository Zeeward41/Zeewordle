# Anticipation - Matrix optimization for linter

## Problem

Since the CI pipeline utilizes a GitHub Actions matrix to run jobs dynamically, handling multiple separate linting commands (e.g., individual package.json scripts for CSS, HTML, and TS) would add unnecessary complexity. It would require complex conditional logic or multiple steps within the workflow file.

## Solution

To decouple the CI configuration from the project's tooling, I unified all frontend linters into a single command (`pnpm lint`). This standardizes the execution entry point across the repository, making it identical to the backend configuration.

### Benefits & Scalability

- **Simpler Workflow:** The GitHub Actions YAML remains clean, generic, and lightweight.
- **Fail-Fast Behavior:** Using the `&&` operator ensures the script exits immediately if any linter fails, saving CI computing time.
- **Future-Proof:** If a new linter is added or modified later, only the `package.json` needs an update; the CI matrix workflow will remain untouched and continue to work automatically.
