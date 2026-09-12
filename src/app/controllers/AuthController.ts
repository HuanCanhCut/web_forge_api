import { NextFunction, Request, Response } from 'express'

import { clearCookie, setCookie } from '../../utils/cookiesManager'
import { BadRequestError, NotFoundError } from '../errors/errors'
import { RefreshToken } from '../models'
import AuthService from '../services/AuthService'
import {
    LoginRequest,
    LoginWithTokenRequest,
    RegisterRequest,
    ResetPassRequest,
    sendResetPassEmailRequest,
    SendVerifyCodeRequest,
    VerifyAccountRequest,
    VerifyAuthChallengeIdRequest,
    VerifyForgotPasswordTokenRequest,
} from '../validators/api/authSchema'
import { User } from '~/app/models'
import { IRequest } from '~/type'

class AuthController {
    async sendToClient({
        res,
        user,
        token,
        refreshToken,
        status = 200,
        req,
    }: {
        res: Response
        user: User
        token: string
        refreshToken: string
        status?: number
        req: Request
    }) {
        await RefreshToken.create({
            user_id: user.id,
            refresh_token: refreshToken,
        })

        setCookie({
            res,
            cookies: [
                { name: 'access_token', value: token },
                { name: 'refresh_token', value: refreshToken },
            ],
            req,
        })

        res.status(status).json({
            data: user,
        })
    }

    // [POST] /auth/register
    register = async (req: RegisterRequest, res: Response, next: NextFunction) => {
        const { full_name, email, password } = req.body

        try {
            const { user, auth_challenge_id } = await AuthService.register({ full_name, email, password })

            res.status(201).json({
                data: user,
                meta: {
                    auth_challenge_id,
                },
            })
        } catch (error) {
            return next(error)
        }
    }

    // [POST] /auth/login
    login = async (req: LoginRequest, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body

            const { token, refreshToken, user, auth_challenge_id } = await AuthService.login({ email, password })

            if (user.is_active) {
                this.sendToClient({ res, user, token, refreshToken, req })
            } else {
                res.status(200).json({
                    data: user,
                    meta: {
                        auth_challenge_id,
                    },
                })
            }
        } catch (error) {
            return next(error)
        }
    }

    // [POST] /auth/logout
    logout = async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { access_token, refresh_token } = req.cookies

            await AuthService.logout({ access_token, refresh_token })

            clearCookie({ res, cookies: ['access_token', 'refresh_token'], req })

            res.sendStatus(204)
        } catch (error) {
            return next(error)
        }
    }

    // [POST] /auth/loginwithtoken
    loginWithToken = async (req: LoginWithTokenRequest, res: Response, next: NextFunction) => {
        try {
            const { token } = req.body

            const { token: accessToken, refreshToken, user } = await AuthService.loginWithToken({ token })

            this.sendToClient({ res, user, token: accessToken, refreshToken, req })
        } catch (error) {
            return next(error)
        }
    }

    // [GET] /auth/refresh
    refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refresh_token } = req.cookies

            const { newAccessToken, newRefreshToken } = await AuthService.refreshToken({ refresh_token })

            setCookie({
                res,
                cookies: [
                    { name: 'access_token', value: newAccessToken },
                    { name: 'refresh_token', value: newRefreshToken },
                ],
                req,
            })

            res.sendStatus(204)
        } catch (error) {
            clearCookie({ res, cookies: ['access_token', 'refresh_token'], req })

            return next(error)
        }
    }

    // [GET] /auth/verification/send
    sendVerifyCode = async (req: SendVerifyCodeRequest, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body

            const user = await User.findOne({ where: { email }, attributes: ['is_active'] })

            if (user?.is_active) {
                return next(new BadRequestError({ message: 'Tài khoản đã được xác thực' }))
            }

            await AuthService.sendVerifyCode({ email, type: 'activate_account' })

            res.sendStatus(202)
        } catch (error: any) {
            if (error?.parent?.errno === 1452) {
                return next(new NotFoundError({ message: 'Email không tồn tại' }))
            }

            return next(error)
        }
    }

    // [GET] /auth/forgot-password
    sendResetPassEmail = async (req: sendResetPassEmailRequest, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body

            await AuthService.sendResetPasswordEmail({ email })

            res.sendStatus(202)
        } catch (error: any) {
            if (error?.parent?.errno === 1452) {
                return next(new NotFoundError({ message: 'Email not found' }))
            }

            return next(error)
        }
    }

    // [POST] /auth/reset-password
    resetPassword = async (req: ResetPassRequest, res: Response, next: NextFunction) => {
        try {
            const { email, token, password } = req.body

            await AuthService.resetPassword({ email, token, password })

            res.json({ message: 'Password reset successfully' })
        } catch (error) {
            return next(error)
        }
    }

    // [POST] /auth/verification/active
    verifyAccount = async (req: VerifyAccountRequest, res: Response, next: NextFunction) => {
        try {
            const { email, code } = req.body

            const { token, refreshToken } = await AuthService.verifyAccount({ email, code })

            setCookie({
                res,
                cookies: [
                    { name: 'access_token', value: token },
                    { name: 'refresh_token', value: refreshToken },
                ],
                req,
            })

            res.status(200).json({ message: 'Account verified successfully' })
        } catch (error) {
            return next(error)
        }
    }

    // [GET] /auth/verification/challenge/:auth_challenge_id
    verifyAuthChallengeId = async (req: VerifyAuthChallengeIdRequest, res: Response, next: NextFunction) => {
        try {
            const { auth_challenge_id } = req.params
            const { email } = req.query

            const payload = await AuthService.verifyAuthChallengeId({ auth_challenge_id, email: email as string })

            res.json({ data: payload })
        } catch (error) {
            return next(error)
        }
    }

    // [POST] /auth/forgot-password/verify
    verifyForgotPasswordToken = async (req: VerifyForgotPasswordTokenRequest, res: Response, next: NextFunction) => {
        try {
            const { token, email } = req.body

            await AuthService.verifyForgotPasswordToken({ token, email })

            res.sendStatus(204)
        } catch (error) {
            return next(error)
        }
    }
}

export default new AuthController()
