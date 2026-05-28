# ADR 0004: Technology Choice for Unit Testing and Quality Metrics

Status: ✅ Accepted
Date: 2026-05-27

## Context

The project aims to adopt Test-Driven Development (TDD) to ensure high code quality and long-term maintainability.

## Decision

I will use **Vitest** as my primary unit testing framework. 
In complement, i will integrate **Stryker** to perform mutation testing and ensure my assertions are meaningful.

## Consequences

### Pros (+)

* **Vite Ecosystem:** Vitest integrates seamlessly with my frontend and backend setup.
* **Test Confidence:** Stryker allows me to go beyond simple code coverage by checking if my tests actually catch bugs (mutants).

### Cons (-)

* **Execution Time:** Mutation testing with Stryker is CPU-intensive and will significantly increase pipeline execution times if run on every commit.
* **Learning Curve:** This is my first real-world implementation of unit testing, TDD, and mutation testing.
Velocity might temporarily decrease during the first iterations.
