variable "database_password" {
    type = string
}

resource "aws_db_instance" "feature_toggle" {
    allocated_storage    = 10
    engine               = "postgres"
    engine_version       = "15.3"
    instance_class       = "db.t3.micro"
    db_name              = "feature_toggle"
    username             = "brz"
    password             = var.database_password
    skip_final_snapshot  = true
    vpc_security_group_ids = [aws_security_group.database.id]
    publicly_accessible = true

    tags = {
        Name = "brz.gg"
    }
}

resource "aws_security_group" "database" {
  name        = "unleash_database_sg"
  description = "Security group for Unleash"

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "database_endpoint" {
    value = aws_db_instance.feature_toggle.endpoint
}