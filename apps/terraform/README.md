[![Apply configuration](https://github.com/brazucas/terraform/actions/workflows/terraform.yml/badge.svg)](https://github.com/brazucas/terraform/actions/workflows/terraform.yml)
## BRZ Terraform config files
Terraform configuration for general brz purposes like mail, routing, ebs, etc

## What's Terraform?
Terraform is an open-source infrastructure-as-code software tool created by HashiCorp. Users define and provide data center infrastructure using a declarative configuration language known as HashiCorp Configuration Language, or optionally JSON.

[Read more](https://www.terraform.io).

## Fresh init

1. Create `bzrtech-samp-server-state-production` and `brztech-terraform-state` buckets in S3.
2. Import them to terraform state:
```bash
terraform import aws_s3_bucket.brz_terraform_state brztech-terraform-state
```

```bash
terraform import aws_s3_bucket.samp_server_state_production brztech-samp-server-state-production
```

3. Apply the configuration:
```bash
terraform apply
```