import { NextFunction, Response } from 'express'

import { UnauthorizedError } from '../errors/errors'
import { responseData } from '../schemas/response'
import S3Service from '../services/S3Service'
import { GetS3PresignedUrlRequest } from '../validators/api/s3Schema'

class S3Controller {
    getUploadPresignedUrl = async (req: GetS3PresignedUrlRequest, res: Response, next: NextFunction) => {
        try {
            const files = req.body

            const decoded = req.decoded

            if (!decoded) {
                throw new UnauthorizedError({ message: 'Unauthorized' })
            }

            const presignedUrls = await S3Service.getUploadPresignedUrl({
                files,
                currentUserId: decoded.sub,
            })

            res.status(201).json(responseData(presignedUrls))
        } catch (error) {
            return next(error)
        }
    }
}

export default new S3Controller()
