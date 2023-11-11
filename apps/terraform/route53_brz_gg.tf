resource "aws_route53_zone" "brz_gg" {
    name = "brz.gg"
}

resource "aws_route53_record" "cdn" {
    name = "cdn.brz.gg"
    zone_id = aws_route53_zone.brz_gg.zone_id
    type = "CNAME"
    records = [
        aws_s3_bucket.cdn_brz_gg.bucket_domain_name,
    ]
    ttl = 60
}