resource "aws_lightsail_instance" "ghost" {
  name              = "blog_brz_gg"
  availability_zone = "us-east-1a"
  blueprint_id      = "ghost_bitnami"
  bundle_id         = "nano_2_0"
  key_pair_name     = aws_lightsail_key_pair.blog.name

  add_on {
    type  = "AutoSnapshot"
    snapshot_time = "06:00"
    status   = "Enabled" # Probably not required
  }
}

resource "aws_lightsail_key_pair" "blog" {
  name = "blog_brz_key"
  public_key = file("brz_key.pub")
}

data "aws_availability_zones" "available" {
  state = "available"

  filter {
    name   = "opt-in-status"
    values = ["opt-in-not-required"]
  }
}

resource "aws_lightsail_disk" "blog" {
  name              = "blog_brz_gg_disk"
  size_in_gb        = 8
  availability_zone = data.aws_availability_zones.available.names[0]
}

resource "aws_lightsail_disk_attachment" "blog" {
  disk_name     = aws_lightsail_disk.blog.name
  instance_name = aws_lightsail_instance.ghost.name
  disk_path     = "/dev/xvdf"
}