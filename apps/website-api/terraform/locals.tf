locals {
    vpc = "es-vpc"
    domain = "elasticsearch-samp"
    instance_type = "t3.small.elasticsearch"
    tag_domain = "samp-api.brz.gg"
    volume_type = "gp2"
    ebs_volume_size = 10
}