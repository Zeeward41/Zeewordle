# ==============================================================================
# IAM ROLES
# ==============================================================================

# IAM Role assumed by EC2 instances to allow SSM access
resource "aws_iam_role" "ssm_instance_role" {
  name        = "ec2-ssm-execution-role"
  description = "IAM role that allows EC2 instances to communicate with AWS Systems Manager"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "ec2-ssm-execution-role"
  }
}

# ==============================================================================
# IAM POLICY ATTACHMENTS
# ==============================================================================

# Attach the AWS managed policy providing least-privilege permissions required for SSM
resource "aws_iam_role_policy_attachment" "ssm_managed_policy" {
  role       = aws_iam_role.ssm_instance_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# ==============================================================================
# IAM INSTANCE PROFILES
# ==============================================================================

# Instance profile used to pass the IAM role to EC2 instances
resource "aws_iam_instance_profile" "ssm_instance_profile" {
  name = "ec2-ssm-instance-profile"
  role = aws_iam_role.ssm_instance_role.name
}
