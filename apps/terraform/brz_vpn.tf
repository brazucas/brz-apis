resource "aws_key_pair" "openvpn" {
  provider = aws.us-east-1
  key_name   = "openvpn-key"
  public_key = var.public_key
}

resource "aws_security_group" "openvpn" {
  provider = aws.us-east-1
  name        = "openvpn_sg"
  description = "Allow traffic needed by openvpn"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 943
    to_port     = 943
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 1194
    to_port     = 1194
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0", aws_vpc.main.cidr_block]
  }
}

resource "aws_instance" "openvpn" {
  provider = aws.us-east-1
  ami                         = "ami-0f95ee6f985388d58"
  instance_type               = "t2.micro"
  key_name                    = aws_key_pair.openvpn.key_name
  subnet_id                   = aws_subnet.public_subnets[0].id
  vpc_security_group_ids      = [aws_security_group.openvpn.id]
  associate_public_ip_address = true

  # `admin_user` and `admin_pw` need to be passed in to the appliance through `user_data`, see docs -->
  # https://docs.openvpn.net/how-to-tutorialsguides/virtual-platforms/amazon-ec2-appliance-ami-quick-start-guide/
  user_data = <<USERDATA
admin_user=brz
admin_pw=${var.openvpn_admin_password}
USERDATA
}

resource "aws_route53_record" "vpn" {
  zone_id = aws_route53_zone.brz_gg.id
  name    = local.vpn_domain
  type    = "A"
  ttl     = "60"
  records = [aws_instance.openvpn.public_ip]
}

resource "aws_acm_certificate" "vpn_brz_cert" {
  provider = aws.us-east-1
  domain_name       = local.vpn_domain
  validation_method = "DNS"
  subject_alternative_names = ["www.${local.vpn_domain}"]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "vpn_brz_cert_validation" {
  name = "${aws_acm_certificate.vpn_brz_cert.domain_validation_options.*.resource_record_name[0]}"
  type = "${aws_acm_certificate.vpn_brz_cert.domain_validation_options.*.resource_record_type[0]}"
  zone_id = aws_route53_zone.brz_gg.id
  records = ["${aws_acm_certificate.vpn_brz_cert.domain_validation_options.*.resource_record_value[0]}"]
  ttl = 60
} 

resource "aws_route53_record" "vpn_brz_www_cert_validation" {
  name = "${aws_acm_certificate.vpn_brz_cert.domain_validation_options.*.resource_record_name[1]}"
  type = "${aws_acm_certificate.vpn_brz_cert.domain_validation_options.*.resource_record_type[1]}"
  zone_id = aws_route53_zone.brz_gg.id
  records = ["${aws_acm_certificate.vpn_brz_cert.domain_validation_options.*.resource_record_value[1]}"]
  ttl = 60
} 

resource "aws_acm_certificate_validation" "vpn_brz_cert" {
  provider = aws.us-east-1
  certificate_arn         = aws_acm_certificate.vpn_brz_cert.arn
  validation_record_fqdns = ["${aws_route53_record.vpn_brz_cert_validation.fqdn}", "${aws_route53_record.vpn_brz_www_cert_validation.fqdn}"]
}