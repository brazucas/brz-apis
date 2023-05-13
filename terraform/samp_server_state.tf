data "terraform_remote_state" "samp_server_state" {
  backend = "s3"
  config = {
    bucket = "brztech-samp-server-state-production"
    key    = "terraform/terraform.tfstate"
    region = "sa-east-1"
  }
}
