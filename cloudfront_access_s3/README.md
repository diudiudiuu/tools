## cloudfront加密访问S3不公开资源
- S3资源不对外公开
- cloudfront加载S3资源要有一定的安全性
- 访问cloudfront uri构成
   - {timestamp}/{encrypt_string}/{s3_key}
   - 这个自定义的一个规则,最后只要加密信息正确,返回的uri指向真正的s3_key即可