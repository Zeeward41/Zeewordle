resource "aws_cloudfront_distribution" "app_cdn" {
  origin {
    domain_name = "origin-${var.project_name}.${var.name}.com"
    origin_id   = "origin-EC2-${var.project_name}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled         = true
  is_ipv6_enabled = false
  aliases         = ["${var.project_name}.${var.name}.com"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "origin-EC2-${var.project_name}"

    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = data.aws_ssm_parameter.acm_certificate_arn.value
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}

### Creates the internal A record pointing to the EC2 instance's public IP, used by CloudFront to reach the origin server.

resource "aws_route53_record" "origin" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "origin-${var.project_name}.${var.name}.com"
  type    = "A"
  ttl     = 60
  records = [aws_instance.instance_1.public_ip]
}

### Creates the public-facing alias record that routes the main domain name to the CloudFront distribution.

resource "aws_route53_record" "viewer" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "${var.project_name}.${var.name}.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.app_cdn.domain_name
    zone_id                = aws_cloudfront_distribution.app_cdn.hosted_zone_id
    evaluate_target_health = false
  }
}
