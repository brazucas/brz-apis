resource "aws_lightsail_lb" "blog" {
  name              = "blog-load-balancer"
  health_check_path = "/ghost"
  instance_port     = "80"
}

resource "aws_lightsail_lb_attachment" "blog" {
  lb_name       = aws_lightsail_lb.blog.name
  instance_name = aws_lightsail_instance.ghost.name
}

resource "aws_lightsail_lb_certificate" "blog" {
  name        = "blog-load-balancer-certificate"
  lb_name     = aws_lightsail_lb.blog.id
  domain_name = "blog.brz.gg"
}

resource "aws_lightsail_lb_certificate_attachment" "blog" {
  lb_name          = aws_lightsail_lb.blog.name
  certificate_name = aws_lightsail_lb_certificate.blog.name
}

resource "aws_lightsail_lb_https_redirection_policy" "blog" {
  lb_name = aws_lightsail_lb.blog.name
  enabled = true
}