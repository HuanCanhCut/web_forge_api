import { NextFunction, Response } from 'express'

import { clearCookie } from '../../utils/cookiesManager'
import { NotFoundError } from '../errors/errors'
import UserService from '../services/UserService'
import { IRequest } from '~/type'

class MeController {
    // [GET] /auth/me
    getCurrentUser = async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const decoded = req.decoded

            const user = await UserService.getUserById(decoded.sub)

            res.json({ data: user })
        } catch (error: any) {
            if (error instanceof NotFoundError) {
                clearCookie({ res, cookies: ['access_token', 'refresh_token'], req })
            }

            return next(error)
        }
    }
}

export default new MeController()
