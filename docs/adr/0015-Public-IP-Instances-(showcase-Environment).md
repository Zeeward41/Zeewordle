# ADR 0015: Public IP Instances (showcase Environment)

**Status:** ✅ Accepted  
**Date:** 29/07/2026

## 1. Context

For the *Showcase* environment (2-3 instances), nodes need outbound internet connectivity to fetch updates, install packages, and allow AWS SSM connectivity. Several solutions were considered:
- **NAT Gateway:** standard private subnet approach with outbound internet access.
- **VPC Interface Endpoints:** private access to SSM without internet access.
- **Pre-baked AMIs:** pre-installing dependencies to avoid internet calls at startup.
- **Public IP Instances:** placing instances in a public subnet with a direct Internet Gateway.

Since the primary objective of the Showcase environment is cost reduction, the financial impact of each approach was the deciding factor.

## 2. Decision

We decided to place the instances in public subnets with **public IPv4 addresses**. 

Even with AWS charging for public IPv4 addresses ($0.005/hour per IP), this option remains significantly cheaper than running a NAT Gateway or multiple VPC Endpoints (SSM, SSMMessages, EC2Messages). While pre-baked AMIs reduce update overhead, they add image pipeline maintenance constraints, whereas our goal is to leverage **Ansible** for configuration management.

Inbound traffic remains strictly blocked using **AWS Security Groups** (relying on SSM for access), ensuring baseline security without added infrastructure costs.

## 3. Consequences

### Positive (Pros)
- **Architectural Simplicity:** Simple VPC setup with standard routing tables to an Internet Gateway.
- **Cost Optimization:** Drastically reduces AWS fixed monthly costs compared to NAT Gateways or VPC Endpoints.

### Negative / Risks (Cons)
- **Reduced Network Isolation:** Instances have public IPs, increasing the attack surface if Security Groups are misconfigured.
