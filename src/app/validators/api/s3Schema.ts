import { z } from 'zod'

import { TypedRequest } from '~/app/validators/types/request.type'
import { S3_CONTENT_TYPES, S3_FOLDERS } from '~/types/s3.type'

const fileSchema = z.object({
    folder: z.enum(S3_FOLDERS, {
        error: 'Folder không hợp lệ, chỉ chấp nhận: ' + S3_FOLDERS.join(', '),
    }),
    content_type: z.enum(S3_CONTENT_TYPES, {
        error: 'Chỉ chấp nhận các định dạng file: ' + S3_CONTENT_TYPES.join(', '),
    }),
})

export const getS3PresignedUrlSchema = z.object({
    body: z
        .array(fileSchema)
        .min(1, 'Phải có ít nhất 1 file để upload')
        .max(10, 'Không được upload quá 10 file cùng lúc'),
})

export type GetS3PresignedUrlRequest = TypedRequest<z.infer<typeof getS3PresignedUrlSchema>['body']>
