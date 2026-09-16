import { CreateBucketCommand, HeadBucketCommand, S3Client } from '@aws-sdk/client-s3'

const s3 = new S3Client({
    endpoint: process.env.S3_ENDPOINT,
    region: 'auto', // Required by AWS SDK, not used by R2
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || 's3_access_key',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 's3_secret_access_key',
    },
})

export const initializeBucket = async () => {
    const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'h-nine-n'

    try {
        await s3.send(
            new HeadBucketCommand({
                Bucket: BUCKET_NAME,
            }),
        )

        console.log('\x1b[36m%s\x1b[0m', `==>>>>>Bucket ${BUCKET_NAME} already exists!!!`)
    } catch (_) {
        console.log('\x1b[33m%s\x1b[0m', `==>>>>>Creating bucket ${BUCKET_NAME}!!!`)

        await s3.send(
            new CreateBucketCommand({
                Bucket: BUCKET_NAME,
            }),
        )

        console.log('\x1b[36m%s\x1b[0m', `==>>>>>Bucket ${BUCKET_NAME} created successfully!!!`)
    }
}

export default s3
