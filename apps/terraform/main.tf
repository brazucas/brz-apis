provider "aws" {
  region = "sa-east-1"
}

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}
