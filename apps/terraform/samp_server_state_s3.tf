resource "aws_s3_bucket" "samp_server_state_production" {
  bucket = "brztech-samp-server-state-production"

  tags = {
    Name        = "brz"
    Environment = "Production"
  }
}
