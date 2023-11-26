resource "aws_security_group" "subnet_sg" {
  name        = "notifications_sg"
  description = "Security Group for notifications service"
  vpc_id      = data.terraform_remote_state.brz_state.outputs.brz_vpc_id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [data.terraform_remote_state.brz_state.outputs.brz_vpc_private_subnet_0_cidr_block]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [data.terraform_remote_state.brz_state.outputs.brz_vpc_private_subnet_0_cidr_block]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = [data.terraform_remote_state.brz_state.outputs.brz_vpc_private_subnet_0_cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}