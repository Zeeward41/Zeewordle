# ==============================================================================
# SECURITY GROUPS
# ==============================================================================

# Security group applied to EC2 instances allowing egress traffic for SSM management
resource "aws_security_group" "ssm_instances_sg" {
  name        = "ssm-managed-instances-sg"
  description = "Security group for instances managed via AWS Systems Manager and Ansible"
  vpc_id      = aws_vpc.this.id

  tags = {
    Name = "ssm-instances-sg"
  }
}

# ==============================================================================
# SECURITY GROUP RULES - INBOUND
# ==============================================================================

# No inbound rules required. SSM operates via outbound HTTPS polling.

# ==============================================================================
# SECURITY GROUP RULES - OUTBOUND
# ==============================================================================

# Allow outbound HTTPS traffic for SSM Agent to communicate with AWS SSM endpoints
resource "aws_vpc_security_group_egress_rule" "allow_ssm_https_outbound" {
  security_group_id = aws_security_group.ssm_instances_sg.id
  description       = "Allow outbound HTTPS traffic for SSM Agent communication"

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port   = 443
  to_port     = 443
}
