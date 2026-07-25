# ==============================================================================
# LOCALS & USER DATA SCRIPTS
# ==============================================================================

# User data script to update packages and ensure the SSM agent is active on Debian/Ubuntu
locals {
  user_data_script = <<-EOF
    #!/bin/bash
    # Log output to user-data.log and syslog
    exec > >(tee /var/log/user-data.log|logger -t user-data) 2>&1

    echo "=== Starting user-data script execution ==="

    apt-get update -y
    apt-get upgrade -y

    # Ensure SSM Agent service is started and enabled (for apt-based packages)
    systemctl start amazon-ssm-agent || systemctl start snap.amazon-ssm-agent.amazon-ssm-agent.service
    systemctl enable amazon-ssm-agent || systemctl enable snap.amazon-ssm-agent.amazon-ssm-agent.service

    echo "=== User-data script executed successfully ==="
  EOF
}

# ==============================================================================
# EC2
# ==============================================================================

locals {
  ec2_type = "t3.nano"
}
