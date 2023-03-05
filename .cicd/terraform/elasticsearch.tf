resource "aws_iam_service_linked_role" "es" {
    aws_service_name = "es.amazonaws.com"
    description      = "Allows Amazon ES to manage AWS resources for a domain on your behalf."
}

# data "aws_iam_policy" "esuser_policy" {
#   arn = "arn:aws:iam::aws:policy/AmazonAdminFullAccess"
# }

# resource "aws_iam_policy_attachment" "esuser-policy" {
#   name       = "esuser-policy-attachment"
#   users      = [aws_iam_user.esuser.name]
#   policy_arn = data.aws_iam_policy.esuser_policy.arn
# }

resource "aws_security_group" "es" {
  name        = "${local.vpc}-elasticsearch-${local.domain}"
#   vpc_id      = data.aws_vpc.es.id

  ingress {
    from_port = 443
    to_port   = 443
    protocol  = "tcp"
  }
}

resource "aws_elasticsearch_domain" "es" {
  domain_name           = local.domain
  elasticsearch_version = "7.10"
 
  cluster_config {
    instance_type = local.instance_type
  }

  snapshot_options {
    automated_snapshot_start_hour = 23
  }

  # vpc_options {
  #   subnet_ids = [
  #       data.terraform_remote_state.samp_server_state.outputs.samp_server_subnet_id
  #   ]

  #   security_group_ids = [aws_security_group.es.id]
  # }

  ebs_options {
    ebs_enabled = local.ebs_volume_size > 0 ? true : false
    volume_size = local.ebs_volume_size
    volume_type = local.volume_type
  }

  tags = {
    Domain = local.tag_domain
  }

  depends_on = [aws_iam_service_linked_role.es]
}
 
# Creating the AWS Elasticsearch domain policy
 
resource "aws_elasticsearch_domain_policy" "main" {
  domain_name = aws_elasticsearch_domain.es.domain_name
  access_policies = <<POLICIES
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "es:*",
            "Principal": "*",
            "Effect": "Allow",
            "Resource": "${aws_elasticsearch_domain.es.arn}/*"
        }
    ]
}
POLICIES
}