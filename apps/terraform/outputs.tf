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

