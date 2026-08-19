# ADR 0017: Database Persistence and Backup Strategy

**Status:** ✅ Accepted  
**Date:** 19/08/2026

## 1. Context

In standard production environments, database backups and persistent storage are critical to preserve application state and user data. However, as established in previous decision records, this project operates as a low-cost showcase environment with strict budget constraints.

We needed to evaluate whether implementing persistent storage or managed database backups (via AWS EBS or RDS) was justified given our deployment model.

## 2. Decision

We have decided **not to implement database backups or persistent storage volumes (EBS/RDS)**. The database will run using ephemeral storage within its container lifecycle.

This decision is driven by the following architectural constraints:
* **AWS Spot Instance Constraints:** Attaching a persistent EBS volume requires the EC2 instance and the volume to reside in the same Availability Zone (AZ). Because our infrastructure relies on AWS Spot instances to minimize costs, restricting provisioning to a single AZ severely limits Spot availability.
* **Cross-AZ Complexity:** Synchronizing or replicating EBS snapshots across multiple AZs to maintain Spot flexibility introduces excessive operational overhead for a low-traffic showcase site.
* **Cost Constraints:** Provisioning a managed database service like AWS RDS is cost-prohibitive for the scope of this project.

## 3. Consequences

### Positive (Pros)
* **Maximum Spot Flexibility:** Allows EC2 Spot instances to spin up in any available AZ without storage attachment blockers.
* **Cost Efficiency:** Eliminates all AWS costs associated with RDS instances, EBS storage volumes, and snapshot transfer fees.
* **Minimal Maintenance:** Zero backup pipelines, retention policies, or disaster recovery procedures to manage.

### Negative / Risks (Cons)
* **Data Ephemerality:** Any database state (e.g., registered users) is lost upon container or instance termination.
* **Automated Bootstrapping Required:** Provisioning playbooks (Ansible) must automatically seed the database schema and inject initial required data (e.g., default admin user) upon container startup.
