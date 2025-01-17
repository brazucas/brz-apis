resource "aws_key_pair" "palworld_keypair" {
  key_name = "palworld_instance_keypair"
  public_key = file("palworld_keypair.pub")
  tags = {
    Name = "palworld"
  }
}

resource "aws_security_group" "palworld_server" {
    name = "palworld_instance"
    description = "Security group for palworld server"

    ingress {
        from_port = 22
        to_port = 22
        protocol = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    ingress {
        from_port = 8211
        to_port = 8211
        protocol = "udp"
        cidr_blocks = ["0.0.0.0/0"]
    }
    egress {
        from_port = 0
        to_port = 0
        protocol = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }
}

resource "aws_instance" "palworld_server" {
    ami = "ami-0c82688761c4e566f"
    
    availability_zone = "sa-east-1c"
    instance_type = "t2.2xlarge"
    key_name = aws_key_pair.palworld_keypair.key_name

    vpc_security_group_ids = [aws_security_group.palworld_server.id]

    root_block_device {
        volume_type           = "gp2"
        volume_size           = 32
        delete_on_termination = false
    }

    connection {
      type        = "ssh"
      host        = self.public_ip
      user        = "ubuntu"
      private_key = aws_key_pair.palworld_keypair.key_name
      timeout     = "4m"
   }
}

resource "aws_eip" "palworld_server" {
    instance = aws_instance.palworld_server.id
}

resource "aws_route53_record" "palworld" {
    name = "pal.brz.gg"
    zone_id = data.terraform_remote_state.brz_state.outputs.brz_gg_zone_id
    type = "A"
    records = [
        aws_eip.palworld_server.public_ip,
    ]
    ttl = "3600"
}

output "palworld_ip_address" {
  value = aws_eip.palworld_server.public_ip
}

output "palworld_instance_id" {
  value = aws_instance.palworld_server.id
}