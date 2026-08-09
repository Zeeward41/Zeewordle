# ==============================================================================
# SSH OVER SSM
# ==============================================================================
# 1. Generate an ED25519 key pair
resource "tls_private_key" "ansible" {
  algorithm = "ED25519"
}

# 2. Register the public key on AWS
resource "aws_key_pair" "ansible" {
  key_name   = "ansible-ssm-key"
  public_key = tls_private_key.ansible.public_key_openssh
}

# 3. Save the private key locally on your PC (strict 0600 permissions)
resource "local_file" "ansible_private_key" {
  content         = tls_private_key.ansible.private_key_openssh
  filename        = "${path.module}/ansible_ssh_over_ssm"
  file_permission = "0600"
}

# 4. Save the private key in SSM Parameter Store (eu-west-3)
resource "aws_ssm_parameter" "ansible_private_key" {
  name        = "/zeewordle/secrets/sshKey"
  description = "Ansible SSH private key for SSH over SSM"
  type        = "SecureString"
  value       = tls_private_key.ansible.private_key_openssh
}
