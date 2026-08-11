# ==============================================================================
# SECURITY GROUPS Common
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

# ====================================================
# SECURITY GROUP RULES - INBOUND
# ====================================================

# No inbound rules required. SSM operates via outbound HTTPS polling.

# ====================================================
# SECURITY GROUP RULES - OUTBOUND
# ====================================================

# Allow outbound HTTPS traffic for SSM Agent to communicate with AWS SSM endpoints
resource "aws_vpc_security_group_egress_rule" "allow_ssm_https_outbound" {
  security_group_id = aws_security_group.ssm_instances_sg.id
  description       = "Allow outbound HTTPS traffic for SSM Agent communication"

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port   = 443
  to_port     = 443
}

# Allow outbound HTTP traffic for SSM Agent to communicate with AWS SSM endpoints
resource "aws_vpc_security_group_egress_rule" "allow_ssm_http_outbound" {
  security_group_id = aws_security_group.ssm_instances_sg.id
  description       = "Allow outbound HTTP traffic for SSM Agent communication"

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port   = 80
  to_port     = 80
}

# ==============================================================================
# Security Group for Proxy & Monitoring Host (Nginx + Prometheus)
# ==============================================================================

resource "aws_security_group" "monitoring_proxy" {
  name        = "monitoring-proxy-sg"
  description = "Security group for Nginx reverse proxy and Prometheus monitoring server"
  vpc_id      = aws_vpc.this.id

  tags = {
    Name = "monitoring-proxy-sg"
  }
}
# ====================================================
# Egress Rules (Outbound Traffic)
# ====================================================
resource "aws_vpc_security_group_egress_rule" "allow_node_exporter_outbound" {
  # Allow outbound traffic to Node Exporter (port 9100) on target SG
  security_group_id = aws_security_group.monitoring_proxy.id
  description       = "Allow outbound traffic to Node Exporter target"

  referenced_security_group_id = aws_security_group.app.id
  ip_protocol                  = "tcp"
  from_port                    = 9100
  to_port                      = 9100
}

resource "aws_vpc_security_group_egress_rule" "allow_outbound_traffic_to_app" {
  # Allow outbound traffic to APP (port 3000) on target SG
  security_group_id = aws_security_group.monitoring_proxy.id
  description       = "Allow outbound traffic to APP"

  referenced_security_group_id = aws_security_group.app.id
  ip_protocol                  = "tcp"
  from_port                    = 3000
  to_port                      = 3000
}

# ====================================================
# Ingress Rules (Inbound Traffic)
# ====================================================

# Allow Web UI access to Prometheus
resource "aws_vpc_security_group_ingress_rule" "allow_prometheus_ui_inbound" {
  security_group_id = aws_security_group.monitoring_proxy.id
  description       = "Allow inbound web traffic to Prometheus UI"

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port   = 9090
  to_port     = 9090
}

# Allow inbound HTTP web access to Nginx Proxy
resource "aws_vpc_security_group_ingress_rule" "allow_http_inbound_to_nginx" {
  security_group_id = aws_security_group.monitoring_proxy.id
  description       = "Allow inbound HTTP traffic from Internet to Nginx proxy"

  cidr_ipv4   = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port   = 80
  to_port     = 80
}

# ==============================================================================
# Security Group for APP (Frontend, Backend, DB)
# ==============================================================================

resource "aws_security_group" "app" {
  name        = "app-sg"
  description = "Security group for application layer (Frontend, Backend, DB)"
  vpc_id      = aws_vpc.this.id

  tags = {
    Name = "app-sg"
  }
}

# ====================================================
# Ingress Rules (Inbound Traffic)
# ====================================================

# Allow Allow Node Exporter
resource "aws_vpc_security_group_ingress_rule" "allow_node_exporter_from_monitoring" {
  security_group_id = aws_security_group.app.id
  description       = "Allow inbound traffic from monitoring_proxy on Port 9100 (Node Exporter)"

  referenced_security_group_id = aws_security_group.monitoring_proxy.id
  ip_protocol                  = "tcp"
  from_port                    = 9100
  to_port                      = 9100
}

resource "aws_vpc_security_group_ingress_rule" "allow_http_from_proxy" {
  security_group_id = aws_security_group.app.id
  description       = "Allow inbound HTTP traffic from monitoring_proxy"

  referenced_security_group_id = aws_security_group.monitoring_proxy.id
  ip_protocol                  = "tcp"
  from_port                    = 80
  to_port                      = 80
}

resource "aws_vpc_security_group_ingress_rule" "allow_traffic_from_proxy_on_frontend_app" {
  security_group_id = aws_security_group.app.id
  description       = "Allow inbound traffic from monitoring proxy on Frontend APP"

  referenced_security_group_id = aws_security_group.monitoring_proxy.id
  ip_protocol                  = "tcp"
  from_port                    = 3000
  to_port                      = 3000
}
