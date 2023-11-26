variable "public_subnet_cidrs" {
 type        = list(string)
 description = "Public Subnet CIDR values"
 default     = ["10.0.0.0/20"]
}
 
variable "private_subnet_cidrs" {
 type        = list(string)
 description = "Private Subnet CIDR values"
 default     = ["10.0.128.0/20"]
}

variable "azs" {
 type        = list(string)
 description = "Availability Zones"
 default     = ["us-east-1a"]
}

resource "aws_vpc" "main" {
 cidr_block = "10.0.0.0/16"
 provider = aws.us-east-1
 assign_generated_ipv6_cidr_block = true
 enable_dns_support = true
 enable_dns_hostnames = true
 
 tags = {
   Name = "BRZ VPC"
 }
}

resource "aws_subnet" "public_subnets" {
 count      = length(var.public_subnet_cidrs)
 vpc_id     = aws_vpc.main.id
 cidr_block = element(var.public_subnet_cidrs, count.index)
 availability_zone = element(var.azs, count.index)
 provider = aws.us-east-1
 
 tags = {
   Name = "BRZ VPC Public Subnet ${count.index + 1}"
 }
}
 
resource "aws_subnet" "private_subnets" {
 provider = aws.us-east-1
 count      = length(var.private_subnet_cidrs)
 vpc_id     = aws_vpc.main.id
 cidr_block = element(var.private_subnet_cidrs, count.index)
 availability_zone = element(var.azs, count.index)
 
 tags = {
   Name = "BRZ VPC Private Subnet ${count.index + 1}"
 }
}

resource "aws_internet_gateway" "gw" {
 provider = aws.us-east-1
 vpc_id = aws_vpc.main.id
 
 tags = {
   Name = "BRZ VPC IG"
 }
}

resource "aws_route_table" "second_rt" {
 provider = aws.us-east-1
 vpc_id = aws_vpc.main.id
 
 route {
   cidr_block = "0.0.0.0/0"
   gateway_id = aws_internet_gateway.gw.id
 }
 
 tags = {
   Name = "BRZ VPC Route Table"
 }
}

resource "aws_route_table_association" "public_subnet_asso" {
 provider = aws.us-east-1
 count = length(var.public_subnet_cidrs)
 subnet_id      = element(aws_subnet.public_subnets[*].id, count.index)
 route_table_id = aws_route_table.second_rt.id
}

resource "aws_eip" "nat_eip" {
  provider = aws.us-east-1
  vpc = true
}

resource "aws_nat_gateway" "ngw" {
  provider = aws.us-east-1
  subnet_id = aws_subnet.public_subnets[0].id
  connectivity_type = "public"
  allocation_id = aws_eip.nat_eip.id
}

resource "aws_route_table" "private_egress_rt" {
 provider = aws.us-east-1
 vpc_id = aws_vpc.main.id
 
 route {
   cidr_block = "0.0.0.0/0"
   nat_gateway_id = aws_nat_gateway.ngw.id
 }
}

resource "aws_route_table_association" "private_subnet_asso" {
 provider = aws.us-east-1
 count = length(var.public_subnet_cidrs)
 subnet_id      = element(aws_subnet.private_subnets[*].id, count.index)
 route_table_id = aws_route_table.private_egress_rt.id
}