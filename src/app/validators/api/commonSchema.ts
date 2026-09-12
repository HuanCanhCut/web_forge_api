import { z } from 'zod'

import { TypedRequest } from '~/app/validators/types/request.type'
import { decodeCursor } from '~/utils/cursor'

export const emailSchema = z.email('Email không hợp lệ')

export const paginationSchema = z.object({
    query: z.object({
        page: z.coerce.number({ error: 'Page không hợp lệ' }).min(1).transform(String),
        per_page: z.coerce.number({ error: 'Per page không hợp lệ' }).min(1).transform(String),
    }),
})

export const idSchema = z.object({
    params: z.object({
        id: z.uuidv7({ error: 'id phải là uuidv7' }),
    }),
})

export const cursorField = <T extends z.ZodTypeAny>(cursorSchema: T) =>
    z
        .base64url({ error: 'cursor phải là base64url' })
        .superRefine((val, ctx) => {
            const addInvalidError = () =>
                ctx.addIssue({
                    code: 'custom',
                    message: 'cursor phải là base64url',
                })

            try {
                const decoded = decodeCursor(val)

                if (typeof decoded !== 'object' || decoded === null || Array.isArray(decoded)) {
                    return addInvalidError()
                }

                const result = cursorSchema.safeParse(decoded)

                if (!result.success) {
                    result.error.issues.forEach((issue) => {
                        ctx.addIssue({
                            code: 'custom',
                            message: issue.message,
                            path: issue.path,
                        })
                    })
                }
            } catch {
                addInvalidError()
            }
        })
        .optional()

export const lastIdSchema = z.object({
    last_id: z.uuidv7({ error: 'last_id phải là uuidv7' }),
})

export type PaginationRequest = TypedRequest<any, any, z.infer<typeof paginationSchema>['query']>
export type IdRequest = TypedRequest<any, z.infer<typeof idSchema>['params']>
