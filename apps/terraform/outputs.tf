output "brz_gg_nameservers" {
  value = aws_route53_zone.brz_gg.name_servers
}

output "brz_gg_zone_id" {
  value = aws_route53_zone.brz_gg.id
}

output "brz_gg_primary_nameserver" {
  value = aws_route53_zone.brz_gg.primary_name_server
}

output "terraform_s3_bucket_id" {
  value = aws_s3_bucket.brz_terraform_state.id
}

output "samp_server_producton_ebs_id" {
  value = aws_ebs_volume.samp_server_production_data.id
}

output "samp_server_production_ebs_availability_zone" {
  value = aws_ebs_volume.samp_server_production_data.availability_zone
}

output "brz_vpc_private_subnet_0_id" {
  value = aws_subnet.private_subnets[0].id
}

output "brz_vpc_public_subnet_0_id" {
  value = aws_subnet.public_subnets[0].id
}

output "brz_vpc_cidr_blocks" {
  value = aws_vpc.main.cidr_block
}

output "brz_vpc_private_subnet_0_cidr_block" {
  value = aws_subnet.private_subnets[0].cidr_block
}

output "brz_vpc_id" {
  value = aws_vpc.main.id
}

output "brz_vpc_arn" {
  value = aws_vpc.main.arn
}

output "brz_vpn_private_ip" {
  value = aws_instance.openvpn.private_ip
}

output "brz_vpn_public_ip" {
  value = aws_instance.openvpn.public_ip
}

output "brz_vpc_nat_gateway_public_ip" {
  value = aws_eip.nat_eip.public_ip
}

output "brz_vpc_nat_gateway_private_ip" {
  value = aws_eip.nat_eip.private_ip
}