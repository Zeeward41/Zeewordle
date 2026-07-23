terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.55.0"
    }
  }

  backend "s3" {
    bucket  = "zeewordle-tfstate-zeeward41"
    key     = "terraform/state"
    region  = "eu-west-3"
    encrypt = true

    use_lockfile = true
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
