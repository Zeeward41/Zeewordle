# ADR 0019: Managed Secrets with AWS SSM Parameter Store

**Status:** ✅ Accepted
**Date:** 2026

## 1. Context

The project requires a way to manage secrets (API keys, credentials, configuration values) used both in CI/CD pipelines and at runtime on the deployed infrastructure.

GitHub Actions secrets are simple to use within GitHub workflows, but come with limitations: no fine-grained audit trail, no automatic rotation,
no versioning, and no easy way to share secrets across projects or consume them outside of a GitHub Actions context (e.g. directly on the EC2 instance at runtime).

Separately, [ADR/Guide 0006](../guides/0006-Managing-env-Files-&-Secrets-with-SOPS-Age-(Frontend-&-Backend).md) 
already covers SOPS + Age for encrypting local `.env` files committed to the repo. This ADR addresses a different scope:
secrets consumed during CI/CD and at runtime, not local development files.

The project already relies on AWS Systems Manager (Session Manager) for SSH access to EC2 instances,
so integrating with AWS was already a requirement rather than an additional dependency.

## 2. Decision

Use **AWS SSM Parameter Store** (Standard tier) as the source of truth for secrets consumed by CI/CD pipelines and by the application at runtime,
retrieved via the AWS CLI/SDK using the same IAM/SSM access already set up for SSH-over-SSM.

### Alternatives considered

- **GitHub Actions secrets**: simple within GitHub workflows, but no audit trail, no rotation, and not usable outside of GitHub Actions 
(e.g. on the instance itself at runtime).
- **AWS Secrets Manager**: offers automatic rotation and tighter secret lifecycle management, but costs ~$0.40/secret/month,
not justified for a solo showcase project with a small number of secrets and no rotation requirement.
- **HashiCorp Vault**: more powerful and self-hostable, but adds significant operational overhead (running and securing a Vault instance)
disproportionate to the project's scale.

### Why SSM Parameter Store

- **Cost**: Standard parameters are free, unlike Secrets Manager.
- **Architectural consistency**: the project already uses AWS SSM for SSH access; reusing SSM for secrets avoids introducing a second authentication/authorization
mechanism.
- **Simplicity**: GitHub Actions can fetch parameters directly via the AWS CLI/SDK using an existing IAM role, keeping the workflow simple without extra tooling.

## 3. Consequences

### Positive

- No additional cost for secret storage.
- One consistent AWS-based mechanism for both SSH access and secrets, reducing the number of tools/credentials to manage.
- Secrets can be consumed both in CI/CD and directly on the instance at runtime, unlike GitHub Actions secrets.

### Negative / Risks

- **No automatic rotation**: unlike Secrets Manager, Parameter Store does not rotate secrets automatically; rotation would need to be handled manually or scripted.
- **Size limit**: Standard parameters are capped at 4 KB, which is sufficient here but would not scale to larger secret payloads.
- **IAM complexity**: access must be carefully scoped (least privilege) to avoid overly broad permissions on parameters.
misconfiguration risk is on the team/individual, not mitigated by the tool itself.
- **Runtime dependency on AWS API availability**: fetching secrets at deploy/runtime introduces a dependency on SSM API availability and
network access from the instance, versus secrets injected statically at build time.
