terraform {
    backend "s3" {
        bucket = "brztech-brz-gg-state"
        key    = "terraform/notifications_service.tfstate"
        region = "sa-east-1"
    }
}