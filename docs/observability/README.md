# Observability — Dashboards

Stack: Prometheus + Grafana. Custom application metrics exposed
via `prom-client` on `/metrics` (see [ADR-0016](../adr/0016-Observability-Strategy-for-System-and-Application-Metrics.md)).

## App Health
![App health](./screenshots/app-health.png)

## Auth — Login
![Login latency](./screenshots/auth-login-latency.png)

Separates bcrypt (hashing) latency from DB (lookup) latency, 
to isolate the source of slowdowns.

## /me — Synthetic view
![Synthetic view](./screenshots/me-synthetic-view.png)

Synthetic view: RPS, success rate, DB failures.

## Google OAuth — Executive overview
![OAuth overview](./screenshots/oauth-executive-overview.png)

## Google OAuth — Performance & latency
![OAuth performance](./screenshots/oauth-performance-latency.png)

Monitors the external dependency (Google) separately from 
application latency: DB lookup, end-to-end latency, dependency failures.

## Game API — Behavior
![Game behavior](./screenshots/game-behavior.png)

Games created, abandoned, winning attempts.
