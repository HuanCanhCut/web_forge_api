import { z } from 'zod'

import { emailSchema } from './commonSchema'
import { TypedRequest } from '~/app/validators/types/request.type'

const passwordSchema = z.string().min(6, 'Mật khẩu phải chứa ít nhất 6 ký tự')

export const registerSchema = z.object({
    body: z.object({
        full_name: z
            .string({ error: 'Vui lòng nhập đầy đủ họ và tên' })
            .trim()
            .refine((v) => v.length >= 2, 'Tên đầy đủ phải chứa ít nhất 2 ký tự'),
        email: emailSchema,
        password: passwordSchema,
    }),
})

export const loginSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: passwordSchema,
    }),
})

export const loginWithTokenSchema = z.object({
    body: z.object({
        token: z.string().trim(),
    }),
})

export const sendVerifyCodeSchema = z.object({
    body: z.object({
        email: emailSchema,
    }),
})

export const sendResetPassEmailSchema = sendVerifyCodeSchema.extend({})

export const resetPassSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: passwordSchema,
        token: z.string({ error: 'Token is required' }).trim(),
    }),
})

export const verifyAccountSchema = z.object({
    body: z.object({
        email: emailSchema,
        code: z.string().trim().length(6),
    }),
})

export const verifyAuthChallengeIdSchema = z.object({
    params: z.object({
        auth_challenge_id: z.uuidv4(),
    }),
    query: z.object({
        email: emailSchema,
    }),
})

export const verifyForgotPasswordTokenSchema = z.object({
    body: z.object({
        email: emailSchema,
        token: z.string({ error: 'Token is required' }),
    }),
})

export type RegisterRequest = TypedRequest<z.infer<typeof registerSchema>['body']>
export type LoginRequest = TypedRequest<z.infer<typeof loginSchema>['body']>
export type LoginWithTokenRequest = TypedRequest<z.infer<typeof loginWithTokenSchema>['body']>
export type SendVerifyCodeRequest = TypedRequest<z.infer<typeof sendVerifyCodeSchema>['body']>
export type sendResetPassEmailRequest = TypedRequest<z.infer<typeof sendResetPassEmailSchema>['body']>
export type ResetPassRequest = TypedRequest<z.infer<typeof resetPassSchema>['body']>
export type VerifyAccountRequest = TypedRequest<z.infer<typeof verifyAccountSchema>['body']>
export type VerifyAuthChallengeIdRequest = TypedRequest<
    any,
    z.infer<typeof verifyAuthChallengeIdSchema>['params'],
    z.infer<typeof verifyAuthChallengeIdSchema>['query']
>
export type VerifyForgotPasswordTokenRequest = TypedRequest<z.infer<typeof verifyForgotPasswordTokenSchema>['body']>
