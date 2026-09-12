import { z } from 'zod'

import { TypedRequest } from '~/app/validators/types/request.type'

export const searchSchema = z.object({
    query: z.object({
        q: z.string().min(1, 'Query is required'),
    }),
})

export type SearchRequest = TypedRequest<any, any, z.infer<typeof searchSchema>['query']>
