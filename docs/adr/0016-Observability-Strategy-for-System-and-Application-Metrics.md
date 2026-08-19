# ADR 0016: Observability Strategy for System and Application Metrics

**Status:** ✅ Accepted  
**Date:** 19/08/2026  

## 1. Context

One of the key requirements for this project is establishing a basic monitoring layer. While a complete observability strategy typically relies on three core pillars (metrics, logs, and traces), implementing all three within this phase would introduce unnecessary architectural complexity and scope bloat.

Therefore, this project will focus exclusively on metric collection to maintain a lean infrastructure while laying the groundwork for future projects.

## 2. Decision

We will implement a light observability stack using **Prometheus** for data scraping and time-series storage, alongside **Grafana** for dashboard visualization.

* **System-level metrics** will be collected using `node_exporter`.
* **Application-level metrics** will be collected via the `prom-client` library integrated into the Node.js backend.
* **Data Persistence:** Long-term storage retention or cloud archiving (e.g., S3/Thanos) will **not** be implemented. Given the low traffic and limited lifespan of this project, default local TSDB retention is sufficient.

## 3. Consequences

### Positive (Pros)
* **Targeted Visibility:** Provides real-time insights into infrastructure health and Node.js application performance.
* **Low Operational Overhead:** Eliminates the maintenance cost, storage management, and complexity associated with long-term data archiving.
* **Fast Deployment:** Leverages standard Ansible patterns without over-engineering the pipeline.

### Negative / Risks (Cons)
* **Partial Observability:** Lacks centralized logging and distributed tracing, which may increase debugging time for complex runtime issues.
* **No Historical Trend Analysis:** The absence of long-term data persistence prevents multi-month capacity planning and trend evaluation.
