resource "aws_route53_record" "blog" { # https://lightsail.aws.amazon.com/ls/webapp/domains/blog-brz-gg
    name = "blog.brz.gg"
    zone_id = data.terraform_remote_state.brz_state.outputs.brz_gg_zone_id
    type = "NS"
    records = [
        "ns-798.awsdns-35.net",
        "ns-1369.awsdns-43.org",
        "ns-243.awsdns-30.com",
        "ns-1857.awsdns-40.co.uk",
    ]
    ttl = 60
}