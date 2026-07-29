## ==============================================================================
# EC2 INSTANCES (SPOT)
# ==============================================================================

# First Spot instance managed by SSM
# Monitory and proxy
resource "aws_instance" "instance_1" {
  ami                         = var.ami_id
  instance_type               = local.ec2_type_monitoring_proxy
  subnet_id                   = aws_subnet.main.id
  iam_instance_profile        = aws_iam_instance_profile.ssm_instance_profile.name
  user_data                   = local.user_data_script
  key_name                    = aws_key_pair.ansible.key_name
  associate_public_ip_address = true
  vpc_security_group_ids = [
    aws_security_group.ssm_instances_sg.id,
    aws_security_group.monitoring_proxy.id
  ]

  instance_market_options {
    market_type = "spot"
  }

  tags = {
    Name = "ssm-spot-instance-1"
    Role = "monitoring_proxy"
  }
}

# Second Spot instance managed by SSM
resource "aws_instance" "instance_2" {
  ami                  = var.ami_id
  instance_type        = local.ec2_type_app
  subnet_id            = aws_subnet.main.id
  key_name             = aws_key_pair.ansible.key_name
  iam_instance_profile = aws_iam_instance_profile.ssm_instance_profile.name
  user_data            = local.user_data_script

  vpc_security_group_ids = [
    aws_security_group.ssm_instances_sg.id,
    aws_security_group.app.id
  ]

  instance_market_options {
    market_type = "spot"
  }

  tags = {
    Name = "ssm-spot-instance-2"
    Role = "app"
  }
}
