resource "aws_s3_bucket" "cdn_brz_gg" {
  bucket = "cdn.brz.gg"

  tags = {
    Name        = "brz"
    Environment = "Production"
  }
}

resource "aws_s3_bucket_policy" "cdn_brz_gg" {
  bucket = aws_s3_bucket.cdn_brz_gg.id

  policy = data.aws_iam_policy_document.aws_s3_bucket_policy.json
}

data "aws_iam_policy_document" "aws_s3_bucket_policy" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
    ]

    resources = [
      aws_s3_bucket.cdn_brz_gg.arn,
      "${aws_s3_bucket.cdn_brz_gg.arn}/*",
    ]
  }
}

resource "aws_s3_bucket_versioning" "cdn_brz_gg" {
  bucket = aws_s3_bucket.cdn_brz_gg.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "cdn_brz_gg" {
  bucket = aws_s3_bucket.cdn_brz_gg.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}