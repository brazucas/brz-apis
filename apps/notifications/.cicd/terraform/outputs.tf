output "notifications_sg_id" {
  value = aws_security_group.subnet_sg.id
}

output "brz_vpc_private_subnet_0_id" {
  value = data.terraform_remote_state.brz_state.outputs.brz_vpc_private_subnet_0_id
}

output "brz_vpn_private_ip" {
  value = data.terraform_remote_state.brz_state.outputs.brz_vpn_private_ip
}

output "brz_vpn_public_ip" {
  value = data.terraform_remote_state.brz_state.outputs.brz_vpn_public_ip
}

output "brz_vpc_nat_gateway_public_ip" {
  value = data.terraform_remote_state.brz_state.outputs.brz_vpc_nat_gateway_public_ip
}

output "brz_vpc_nat_gateway_private_ip" {
  value = data.terraform_remote_state.brz_state.outputs.brz_vpc_nat_gateway_private_ip
}