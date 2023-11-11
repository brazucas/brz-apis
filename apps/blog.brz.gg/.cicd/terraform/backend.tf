terraform {
    required_providers {
        awslightsail = {
            source = "deyoungtech/awslightsail"
        }
    }

    backend "s3" {
        bucket = "brztech-brz-gg-state"
        key    = "terraform/blog.tfstate"
        region = "sa-east-1"
    }
}