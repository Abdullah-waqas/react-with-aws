output "react_with_aws_app_bucket_name" {
  value = aws_s3_bucket.react_with_aws_app_s3_bucket.id
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.s3_distribution.id
}