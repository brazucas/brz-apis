resource "aws_acm_certificate" "website_api_brz_gg_cert" {
  provider = aws.us-east-1
  domain_name       = "website-api.brz.gg"
  validation_method = "DNS"
  subject_alternative_names = ["www.website-api.brz.gg"]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "website_api_brz_gg_cert_validation" {
  name = "${aws_acm_certificate.website_api_brz_gg_cert.domain_validation_options.*.resource_record_name[0]}"
  type = "${aws_acm_certificate.website_api_brz_gg_cert.domain_validation_options.*.resource_record_type[0]}"
  zone_id = data.terraform_remote_state.brz_state.outputs.brz_gg_zone_id
  records = ["${aws_acm_certificate.website_api_brz_gg_cert.domain_validation_options.*.resource_record_value[0]}"]
  ttl = 60
} 

resource "aws_route53_record" "website_api_brz_gg_www_cert_validation" {
  name = "${aws_acm_certificate.website_api_brz_gg_cert.domain_validation_options.*.resource_record_name[1]}"
  type = "${aws_acm_certificate.website_api_brz_gg_cert.domain_validation_options.*.resource_record_type[1]}"
  zone_id = data.terraform_remote_state.brz_state.outputs.brz_gg_zone_id
  records = ["${aws_acm_certificate.website_api_brz_gg_cert.domain_validation_options.*.resource_record_value[1]}"]
  ttl = 60
} 

resource "aws_acm_certificate_validation" "website_api_brz_gg_cert" {
  provider = aws.us-east-1
  certificate_arn         = aws_acm_certificate.website_api_brz_gg_cert.arn
  validation_record_fqdns = ["${aws_route53_record.website_api_brz_gg_cert_validation.fqdn}", "${aws_route53_record.website_api_brz_gg_www_cert_validation.fqdn}"]
}
