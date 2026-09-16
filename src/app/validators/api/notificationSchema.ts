import { z } from 'zod'

import { TypedRequest } from '../types/request.type'
import { cursorField, lastIdSchema } from './commonSchema'

export const getNotificationSchema = z.object({
    query: z.object({
        limit: z.coerce.number({ error: 'Limit phải là số' }).transform(String),
        cursor: cursorField(lastIdSchema),
    }),
})

export type GetNotificationCursor = z.infer<typeof lastIdSchema>

export type GetNotificationRequest = TypedRequest<any, any, z.infer<typeof getNotificationSchema>['query']>
