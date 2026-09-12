import { z } from 'zod'

import { paginationSchema } from './commonSchema'
import { TypedRequest } from '~/app/validators/types/request.type'
import { COURSE_LEVELS } from '~/types/course.type'

export const createCourseSchema = z.object({
    body: z.object({
        title: z.string({ error: 'Vui lòng nhập tiêu đề khóa học' }).trim(),
        description: z.string({ error: 'Vui lòng nhập mô tả khóa học' }).trim(),
        slug: z.string({ error: 'Vui lòng nhập slug khóa học' }).trim(),
        tag_id: z.uuidv7({ error: 'Tag_id không hợp lệ' }),
        category_id: z.uuidv7({ error: 'Mã danh mục không hợp lệ' }),
        level: z.enum(COURSE_LEVELS, {
            error: `Cấp độ không hợp lệ, chỉ chấp nhận: ${COURSE_LEVELS.join(', ')}`,
        }),
        upload_id: z.string({ error: 'Vui lòng nhập upload_id' }), // get object_key from upload_id in redis
        detail: z.string({ error: 'Vui lòng nhập chi tiết khóa học' }).optional(),
    }),
})

export const getCourseBySlugSchema = z.object({
    params: z.object({
        slug: z.string({ error: 'Vui lòng nhập slug khóa học' }).trim(),
    }),
})

export const registerCourseSchema = z.object({
    params: z.object({
        course_id: z.uuidv7({ error: 'Mã khóa học không hợp lệ, phải là UUIDV7' }),
    }),
})

export const getCoursesSchema = z.object({
    query: paginationSchema.shape.query.extend({
        trending: z.coerce
            .boolean({ error: 'Giá trị trending không hợp lệ, vui lòng nhập true hoặc false' })
            .optional()
            .transform(String),
        level: z
            .enum(COURSE_LEVELS, {
                error: `Cấp độ không hợp lệ, chỉ chấp nhận: ${COURSE_LEVELS.join(', ')}`,
            })
            .optional(),
        category_id: z.uuidv7({ error: 'Mã danh mục không hợp lệ, phải là UUIDV7' }).optional(),
        tag_id: z.uuidv7({ error: 'Mã tag không hợp lệ, phải là UUIDV7' }).optional(),
        q: z.string({ error: 'Vui lòng nhập truy vấn' }).optional(),
    }),
})

export type CreateCourseRequest = TypedRequest<z.infer<typeof createCourseSchema>['body']>
export type GetCoursesRequest = TypedRequest<any, any, z.infer<typeof getCoursesSchema>['query']>
export type GetCourseByIdRequest = TypedRequest<any, z.infer<typeof getCourseBySlugSchema>['params']>
export type RegisterCourseRequest = TypedRequest<any, z.infer<typeof registerCourseSchema>['params']>
