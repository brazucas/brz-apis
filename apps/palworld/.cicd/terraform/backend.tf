terraform {
    backend "s3" {
        bucket = "brztech-brz-gg-state"
        key    = "terraform/palworld.tfstate"
        region = "sa-east-1"
    }
}