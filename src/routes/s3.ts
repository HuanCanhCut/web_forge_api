import express from 'express'

import S3Controller from '~/app/controllers/S3Controller'
import { validate } from '~/app/middlewares/validate'
import verifyToken from '~/app/middlewares/verifyToken'
import { getS3PresignedUrlSchema } from '~/app/validators/api/s3Schema'

const router = express.Router()

router.post('/presigned-url/upload', validate(getS3PresignedUrlSchema), verifyToken, S3Controller.getUploadPresignedUrl)

export default router
