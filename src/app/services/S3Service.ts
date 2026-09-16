import crypto from 'crypto'

import { BadRequestError, NotFoundError } from '../errors/errors'
import { HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { redisClient } from '~/config/redis'
import s3 from '~/config/s3'
import { type S3ContentType, type S3Folder } from '~/types/s3.type'
import handleServiceError from '~/utils/handleServiceError'

class S3Service {
    getUploadPresignedUrl = async ({
        files,
        currentUserId,
    }: {
        files: {
            folder: S3Folder
            content_type: S3ContentType
        }[]
        currentUserId: string
    }) => {
        const extMap: Record<S3ContentType, string> = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
            'image/jpg': 'jpg',
            'image/gif': 'gif',
        }

        try {
            const promises = files.map(async ({ folder, content_type }) => {
                const ext = extMap[content_type]
                const key = `${folder}/${currentUserId}-${crypto.randomUUID()}.${ext}`

                const putPresignedUrl = await getSignedUrl(
                    s3,
                    new PutObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: key,
                        ContentType: content_type,
                    }),
                    { expiresIn: Number(process.env.S3_PRESIGNED_URL_EXP) },
                )

                const uploadId = crypto.randomUUID()

                redisClient.set(
                    `s3_upload_id:${uploadId}`,
                    {
                        user_id: currentUserId,
                        object_key: key,
                        folder,
                    },
                    { EX: Number(process.env.S3_PRESIGNED_URL_EXP) },
                )

                return {
                    presigned_url: putPresignedUrl,
                    upload_id: uploadId,
                }
            })

            return Promise.all(promises)
        } catch (error) {
            return handleServiceError(error)
        }
    }

    verifyUploadId = async ({
        uploadId,
        currentUserId,
        folder,
    }: {
        uploadId: string
        currentUserId: string
        folder: S3Folder
    }) => {
        try {
            const uploadInfo = await redisClient.get(`s3_upload_id:${uploadId}`)

            if (!uploadInfo) {
                throw new BadRequestError({ message: 'Invalid or expired upload ID' })
            }

            if (uploadInfo.user_id !== currentUserId) {
                throw new BadRequestError({ message: 'Unauthorized access to upload ID' })
            }

            if (uploadInfo.folder !== folder) {
                throw new BadRequestError({ message: 'Invalid upload directory' })
            }

            // check file exist in s3 bucket
            try {
                await s3.send(
                    new HeadObjectCommand({
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: uploadInfo.object_key,
                    }),
                )
            } catch (_) {
                throw new NotFoundError({ message: 'File not found on s3 bucket' })
            }

            return uploadInfo.object_key
        } catch (error) {
            return handleServiceError(error)
        }
    }
}

export default new S3Service()
