output "elasticsearch_samp_kibana_url" {
    value = aws_elasticsearch_domain.es.kibana_endpoint
}

output "elasticsearch_samp_domain" {
    value = aws_elasticsearch_domain.es.domain_name
}