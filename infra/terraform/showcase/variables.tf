variable "region" {
  description = "The AWS region where resources will be deployed"
  type        = string
}

variable "name" {
  description = "The name of the resource creator"
  type        = string
}

variable "project_name" {
  description = "The name of the project"
  type        = string
}

variable "ami_id" {
  description = "Amazon Linux 2 AMI ID for eu-west-3 (Paris) region"
  type        = string
  default     = "ami-0e1c4170d9c01184b"
}

