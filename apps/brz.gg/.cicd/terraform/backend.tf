terraform {
    backend "s3" {
        bucket = "brztech-brz-gg-state"
        key    = "terraform/terraform.tfstate"
        region = "sa-east-1"
    }
}