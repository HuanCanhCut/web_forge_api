import { NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { clearCookie } from '../../utils/cookiesManager'
import { User } from '../models'
import redisClient from '~/config/redis/redisClient'
import { IRequest, JwtPayload } from '~/type'

const verifyToken = async (req: IRequest, res: any, next: NextFunction) => {
    try {
        const { access_token } = req.cookies

        const tokenInvalid = await redisClient.get(`blacklist_token:${access_token}`)

        if (tokenInvalid) {
            clearCookie({ res, cookies: ['access_token', 'refresh_token'], req })

            return res.status(401).json({
                message: ' Xác thực thất bại do thông tin đăng nhập sai hoặc cookies xác thực không hợp lệ',
                status: 401,
            })
        }

        try {
            const decoded = jwt.verify(access_token, process.env.JWT_SECRET as string) as JwtPayload

            req.decoded = decoded

            const userId = decoded.sub as string

            // check user in redis
            const userCache = await redisClient.get(`user:${userId}`)

            let user: User | null = null

            if (userCache) {
                user = userCache
            } else {
                user = await User.findByPk(userId)

                if (user) {
                    await redisClient.set(`user:${userId}`, user, {
                        EX: 60 * 5, // 5 minutes
                    })
                }
            }

            if (user?.is_blocked) {
                clearCookie({ res, cookies: ['access_token', 'refresh_token'], req })

                return res.status(401).json({
                    message: 'Tài khoản của bạn đã bị chặn.',
                    status: 401,
                })
            }

            if (!user?.is_active) {
                clearCookie({ res, cookies: ['access_token', 'refresh_token'], req })

                return res.status(403).json({
                    message: 'Tài khoản của bạn chưa xác thực. Vui lòng xác thực tài khoản.',
                    status: 401,
                })
            }

            next()
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                if (error.name === 'TokenExpiredError') {
                    return res.status(401).set('x-refresh-token-required', 'true').json({
                        error: 'Xác thực thất bại do token hết hạn.',
                        code: 'TOKEN_EXPIRED',
                    })
                } else {
                    clearCookie({ res, cookies: ['access_token', 'refresh_token'], req })

                    return res.status(401).json({
                        error: 'Xác thực thất bại do thông tin đăng nhập sai hoặc cookies xác thực không hợp lệ',
                        code: 'TOKEN_VERIFICATION_FAILED',
                    })
                }
            } else {
                throw error
            }
        }
    } catch (_) {
        clearCookie({ res, cookies: ['access_token', 'refresh_token'], req })

        return res.status(401).json({
            message: 'Token signature could not be verified.',
            status: 401,
        })
    }
}

export default verifyToken
