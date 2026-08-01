# ADR 0014: SSH over SSM for Ansible & Remote Access

**Status:** ✅ Accepted  
**Date:** 27/07/2026  

## 1. Context

Our infrastructure requires secure remote management without exposing port 22 (SSH) publicly. Initially, we leveraged the native `amazon.aws.aws_ssm` Ansible connection plugin to run playbooks over AWS Systems Manager. 

However, as detailed in Issue [Issue 0008](../problems/0008-Sudo-Privilege-with-aws_ssm.md), the native `aws_ssm` plugin introduced major privilege escalation failures (`become: true` / `sudo`) during playbook execution, alongside dependency overhead (requiring a dedicated S3 bucket for file transport).

We needed a connection strategy that retains the security benefits of SSM (no open ingress ports) while restoring native Ansible SSH behavior and privilege escalation.

## 2. Decision

We decided to adopt **SSH over SSM** using SSH `ProxyCommand` (via AWS CLI `aws ssm start-session`).

Instead of using a custom Ansible connection plugin, Ansible communicates using its standard `ssh` connection driver, wrapped inside an SSM-established tunnel.

## 3. Consequences

### Positive (Pros)
- **Native Privilege Escalation:** Restores 100% standard Ansible functionality (`become`, `become_user`, `sudo`) without custom workarounds.
- **No Ingress Ports Required:** Security groups remain fully closed to incoming traffic (no open port 22).
- **Reduced Infrastructure Dependencies:** Removes the requirement for an S3 bucket to transfer temporary Ansible modules.
- **Standard Tooling:** Developers and operators can use standard `ssh` commands and configuration (`~/.ssh/config`) for direct terminal access.

### Negative / Risks (Cons)
- **Local Dependencies:** Client machines must have the AWS CLI and the `session-manager-plugin` installed locally.
- **SSH Key Management:** Requires managing and pushing SSH public keys to EC2 instances (e.g., via `user-data` or `EC2 Instance Connect`), adding a minor setup step.
