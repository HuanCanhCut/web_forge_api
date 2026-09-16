import { NextFunction } from 'express'

import { AppError, BadRequestError, InternalServerError } from '../errors/errors'
import { IRequest } from '~/type'

const VerifyAdmin = async (req: IRequest, res: any, next: NextFunction) => {
    try {
        const decoded = req.decoded

        if (decoded.role !== 'admin') {
            throw new BadRequestError({ message: 'You are not permission to access this resource.' })
        }

        next()
    } catch (error: any) {
        if (error instanceof AppError) {
            return next(error)
        }

        return next(new InternalServerError({ message: error?.message }))
    }
}

export default VerifyAdmin
