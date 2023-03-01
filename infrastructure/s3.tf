###########################
# S3 RESOURCES
###########################

resource "aws_s3_bucket" "react_with_aws_app_s3_bucket" {
  bucket        = "${local.prefix}-app"
  force_destroy = true

  tags = local.common_tags
}

resource "aws_s3_bucket_acl" "react_with_aws_app_bucket_acl" {
  bucket = aws_s3_bucket.react_with_aws_app_s3_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_public_access_block" "public_block" {
  bucket = aws_s3_bucket.react_with_aws_app_s3_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  restrict_public_buckets = true
  ignore_public_acls      = true
}

resource "aws_s3_bucket_versioning" "react_with_aws_app_bucket_versioning" {
  bucket = aws_s3_bucket.react_with_aws_app_s3_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_policy" "react_with_aws_app_bucket_policy" {
  bucket = aws_s3_bucket.react_with_aws_app_s3_bucket.id
  policy = data.aws_iam_policy_document.react_with_aws_app_bucket_policy_document.json
}

resource "aws_s3_bucket_website_configuration" "react_with_aws_app_bucket_website" {
  bucket = aws_s3_bucket.react_with_aws_app_s3_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

data "aws_iam_policy_document" "react_with_aws_app_bucket_policy_document" {
  statement {
    actions = ["s3:GetObject"]

    resources = [
      aws_s3_bucket.react_with_aws_app_s3_bucket.arn,
      "${aws_s3_bucket.react_with_aws_app_s3_bucket.arn}/*"
    ]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.react_with_aws_app_origin_access.iam_arn]
    }
  }
}
