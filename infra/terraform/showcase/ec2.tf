## ==============================================================================
# EC2 INSTANCES (SPOT)
# ==============================================================================

# First Spot instance managed by SSM
resource "aws_instance" "instance_1" {
  ami                         = var.ami_id
  instance_type               = local.ec2_type
  subnet_id                   = aws_subnet.main.id
  iam_instance_profile        = aws_iam_instance_profile.ssm_instance_profile.name
  user_data                   = local.user_data_script
  associate_public_ip_address = true
  vpc_security_group_ids = [
    aws_security_group.ssm_instances_sg.id
  ]

  instance_market_options {
    market_type = "spot"
  }

  tags = {
    Name = "ssm-spot-instance-1"
  }
}

# Second Spot instance managed by SSM
# resource "aws_instance" "instance_2" {
#   ami                  = var.ami_id
#   instance_type        = local.ec2_type
#   subnet_id            = aws_subnet.main.id
#   iam_instance_profile = aws_iam_instance_profile.ssm_instance_profile.name
#   user_data            = local.user_data_script
#
#   vpc_security_group_ids = [
#     aws_security_group.ssm_instances_sg.id
#   ]
#
#   instance_market_options {
#     market_type = "spot"
#   }
#
#   tags = {
#     Name = "ssm-spot-instance-2"
#   }
# }
