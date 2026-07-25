# ==============================================================================
# DATA SOURCES
# ==============================================================================

# Retrieves the list of active AWS Availability Zones in the current region
data "aws_availability_zones" "this" {
  state = "available"
}

# Randomly shuffles the retrieved Availability Zones and selects 2 distinct zones
# to ensure high availability across subnets
resource "random_shuffle" "az" {
  input        = data.aws_availability_zones.this.names
  result_count = 1
}

# ==============================================================================
# NETWORKING INFRASTRUCTURE (VPC & ROUTING)
# ==============================================================================

# Creates the Virtual Private Cloud (VPC) with a /24 IPv4 CIDR block (256 addresses)
resource "aws_vpc" "this" {
  cidr_block = "10.10.10.0/24"
}

# Creates an Internet Gateway and attaches it to the VPC to enable internet access
resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
}

# Creates a custom Route Table directing all outbound traffic (0.0.0.0/0) 
# to the Internet Gateway
resource "aws_route_table" "this" {
  vpc_id = aws_vpc.this.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
}

# ==============================================================================
# SUBNETS & ASSOCIATIONS
# ==============================================================================

# Creates the first public subnet (128 IPs) in the first randomly selected AZ
resource "aws_subnet" "main" {
  vpc_id            = aws_vpc.this.id
  cidr_block        = "10.10.10.0/25"
  availability_zone = random_shuffle.az.result[0]
}

# Associates the first subnet with the Internet Gateway route table (making it public)
resource "aws_route_table_association" "main" {
  subnet_id      = aws_subnet.main.id
  route_table_id = aws_route_table.this.id
}

