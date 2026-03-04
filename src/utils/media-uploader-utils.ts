import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const createPresignedUrlWithClient = ({
  region,
  bucket,
  key,
}: {
  region: string
  bucket: string
  key: string
}) => {
  const client = new S3Client({
    region,
    credentials: {
      accessKeyId: process.env.APP_AWS_ACCESS_KEY!,
      secretAccessKey: process.env.APP_AWS_SECRET_KEY!,
    },
  })
  const command = new PutObjectCommand({ Bucket: bucket, Key: key })
  return getSignedUrl(client, command, { expiresIn: 3600 })
}
