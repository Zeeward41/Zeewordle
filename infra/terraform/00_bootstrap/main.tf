terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.55.0"
    }
  }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Creator = var.name
      Project = var.project_name
    }
  }
}
