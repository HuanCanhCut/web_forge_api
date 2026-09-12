import { z } from 'zod'

import { TypedRequest } from '../types/request.type'

export const createChapterSchema = z.object({
    body: z.object({
        title: z.string({ error: 'Tiêu đề không được để trống' }),
    }),
    params: z.object({
        course_id: z.uuidv7({ error: 'Course id phải là uuidv7 hợp lệ' }),
    }),
})

export type CreateChapterRequest = TypedRequest<
    z.infer<typeof createChapterSchema>['body'],
    z.infer<typeof createChapterSchema>['params']
>
