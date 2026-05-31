# ADR 0004: Restricting SonarCloud Scans to the Main Branch Only

Status: ✅ Accepted
Date: 2026-05-31

## Context

As part of our Continuous Integration (CI) pipeline, we use SonarCloud to analyze our codebase for quality and security. However, because we are utilizing SonarCloud's Free Plan, the platform strictly limits analysis to the repository's primary branch (`main`). 

## Decision

We have decided to stick with SonarCloud's Free Plan and limit our automated code analysis exclusively to the `main` branch. 

We considered alternative paths, such as hosting a self-hosted SonarQube Server instance (which would support multi-branch analysis but requires significant maintenance and infrastructure overhead) or switching to GitHub CodeQL (which is free for open-source but lacks SonarCloud's comprehensive reporting on technical debt and code smells). 

Since this repository serves primarily as a showcase and demonstration project, scanning only the `main` branch is a practical and acceptable compromise.

## Consequences

### Pros (+)
* **Zero Infrastructure Overhead:** No need to host, secure, or maintain a dedicated SonarQube server.
* **Cost Efficiency:** The solution remains completely free ($0).
* **Development Momentum:** Avoids blocking project progress with complex CI refactoring.

### Cons (-)
* **Delayed Feedback Loop:** Code issues, duplications, and code smells will no longer be detected during the Pull Request (PR) stage on feature branches. They will only be discovered *after* or *during* the merge into the `main` branch.
* **Risk of Main Branch Pollution:** Bugs or security flaws might temporarily land on `main` before being flagged by the next scheduled scan, requiring post-merge fixes.
