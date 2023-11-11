resource "aws_s3_bucket" "brz_gg" {
  bucket = "brztech-brz-gg-state"

  tags = {
    Name        = "brz"
    Environment = "Production"
  }
}

resource "aws_s3_bucket_versioning" "brz_gg" {
  bucket = aws_s3_bucket.brz_gg.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "brz_gg" {
  bucket = aws_s3_bucket.brz_gg.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}