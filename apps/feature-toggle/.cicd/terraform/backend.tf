terraform {
    backend "s3" {
        bucket = "brztech-brz-gg-state"
        key    = "terraform/feature_toggle.tfstate"
        region = "sa-east-1"
    }
}