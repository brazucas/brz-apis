resource "aws_route53_record" "discord" {
    name = "discord.brz.gg"
    zone_id = aws_route53_zone.brz_gg.zone_id
    type = "CNAME"
    records = [
        "discord.gg.opts-path-f5tdmysnmq4e24zxhe.opts-https.redirect.center",
    ]
    ttl = 60
}