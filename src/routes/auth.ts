import express, { Request } from 'express'
const router = express.Router()

import { rateLimit } from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'

import AuthController from '../app/controllers/AuthController'
import { validate } from '../app/middlewares/validate'
import {
    loginSchema,
    loginWithTokenSchema,
    registerSchema,
    resetPassSchema,
    sendResetPassEmailSchema,
    sendVerifyCodeSchema,
    verifyAccountSchema,
    verifyAuthChallengeIdSchema,
    verifyForgotPasswordTokenSchema,
} from '../app/validators/api/authSchema'
import { TooManyRequestsError } from '~/app/errors/errors'
import { ioRedis } from '~/config/redis'

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 1, // Limit each IP to 1 requests per `windowMs`
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    handler: (req: Request, _res, _next, options) => {
        const { resetTime } = req.rateLimit
        const msRemaining = resetTime ? resetTime.getTime() - Date.now() : options.windowMs

        throw new TooManyRequestsError({
            message: `Quá nhiều yêu cầu, vui lòng thử lại sau ${Math.ceil(msRemaining / 1000)} giây`,
        })
    },
    store: new RedisStore({
        sendCommand: (...args: [string, ...string[]]) => ioRedis.call(...args) as any,
    }),
    passOnStoreError: true,
})

router.post('/register', validate(registerSchema), AuthController.register)
router.post('/login', validate(loginSchema), AuthController.login)
router.post('/logout', AuthController.logout)
router.post('/loginwithtoken', validate(loginWithTokenSchema), AuthController.loginWithToken)
router.get('/refresh', AuthController.refreshToken)
router.post('/verification/send', limiter, validate(sendVerifyCodeSchema), AuthController.sendVerifyCode)
router.post('/verification/active', validate(verifyAccountSchema), AuthController.verifyAccount)
router.get(
    '/verification/challenge/:auth_challenge_id',
    validate(verifyAuthChallengeIdSchema),
    AuthController.verifyAuthChallengeId,
)
router.post('/forgot-password', validate(sendResetPassEmailSchema), AuthController.sendResetPassEmail)
router.post(
    '/forgot-password/verify',
    validate(verifyForgotPasswordTokenSchema),
    AuthController.verifyForgotPasswordToken,
)
router.post('/reset-password', validate(resetPassSchema), AuthController.resetPassword)

export default router
