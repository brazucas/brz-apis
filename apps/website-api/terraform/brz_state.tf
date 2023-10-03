data "terraform_remote_state" "brz_state" {
  backend = "s3"
  config = {
    bucket = "brztech-terraform-state"
    key    = "terraform.tfstate"
    region = "sa-east-1"
  }
}