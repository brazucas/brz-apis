terraform {
    backend "s3" {
        bucket = "brztech-terraform-state"
        key    = "terraform.tfstate"
        region = "sa-east-1"
    }
}