# ADR 0013: Showcase Environment Strategy

**Status:** ✅ Accepted  
**Date:** 25/07/2026

## 1. Context

The project aims to demonstrate high availability (HA). However, maintaining a fully resilient infrastructure continuously incurs significant AWS costs, which is not suitable for a showcase/portfolio project running 24/7.

## 2. Decision

We decided to split the architecture into two distinct environments:

1. **Showcase Environment (Cost-Optimized):** A minimal deployment running on a small cluster (2-3 nodes) secured via AWS Security Groups. It relies on **EC2 Spot instances** to drastically reduce running costs. High availability is handled simply via a Route 53 DNS health check, configured to fail over to a maintenance/status page whenever AWS Spot capacity changes.
2. **High-Availability Environment (Demo/Production-Ready):** A full-scale environment featuring multi-AZ resilience, auto-scaling, and redundant infrastructure, used specifically to demonstrate full production capabilities when needed.

## 3. Consequences

### Positive (Pros)
- Demonstrates the ability to build a highly resilient cloud infrastructure while keeping cost awareness in mind.
- Proves capability in architecture downscaling and cloud cost optimization (FinOps).

### Negative / Risks (Cons)
- Requires maintaining configuration for two environments instead of one. However, using Terraform modules and Ansible playbooks minimizes this maintenance overhead.
