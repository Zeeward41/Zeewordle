data "aws_ssm_parameter" "acm_certificate_arn" {
  name = "/${var.project_name}/secrets/acm_certificate"
}

data "aws_route53_zone" "main" {
  name         = "${var.name}.com"
  private_zone = false
}
