resource "aws_ebs_volume" "samp_server_production_data" {
  availability_zone = "sa-east-1a"
  size              = 16
}