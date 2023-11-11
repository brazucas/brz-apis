resource "aws_s3_bucket" "brz_terraform_state" {
  bucket = "brztech-terraform-state"

  tags = {
    Name        = "brz"
    Environment = "Production"
  }
}
