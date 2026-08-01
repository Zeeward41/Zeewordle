# Issue: Sudo Privilege with `aws_ssm`

## Problem

Using AWS SSM to connect to our instances and run Ansible playbooks is critical for our project's security posture. 
To achieve this, we initially used the `amazon.aws.aws_ssm` Ansible plugin. While the connection was successfully established, we hit a blocker: using `become: true` in playbooks broke Ansible's normal execution. After trying several fixes without success, we decided to pivot.

## Resolution

To resolve this issue and eliminate the dependency on an external Ansible plugin, we opted for **SSH over SSM** (`ProxyCommand`). 
The idea is to initiate the session via SSM and then establish an SSH connection inside the SSM tunnel. This removes the need for the plugin and resolves all privilege escalation (`sudo`) issues with our playbooks.

## Trade-offs

- **Code refactoring:** Updated our playbooks to remove the plugin configuration.
- **Terraform cleanup:** Removed the S3 bucket resource previously required by the `aws_ssm` plugin for script transfers.
- **Key management:** Requires generating and pushing SSH keys to instances, adding a small configuration step upfront.
