import { z } from 'zod'

import { TypedRequest } from '../types/request.type'

const videoSchema = z.object({
    video_path: z.string(), // if provider is youtube, video path is video id on youtube, if provider is upload, video path is s3 object key
    video_provider: z.enum(['YOUTUBE', 'UPLOAD']),
    duration: z.coerce
        .number({ error: 'Thời lượng phải là số' })
        .positive({ error: 'Thời lượng video phải là số dương' })
        .min(0, { message: 'Vui lòng nhập thời lượng video' }),
    upload_id: z.uuidv4('upload id phải là uuidv4 hợp lệ'), // required for thumbnail or if video_provider is UPLOAD
})

const codingSchema = z.object({
    test_cases: z
        .array(
            z.object({
                name: z.string().optional(),
                assertion: z.string({ message: 'Vui lòng nhập logic của assertion' }),
            }),
        )
        .optional(),
    hints: z.string({ message: 'Vui lòng nhập chuỗi gợi ý' }).optional(),
    files: z
        .array(
            z.object({
                file_name: z.string().min(1),
                code: z.string().optional(),
                read_only: z.boolean().optional(),
            }),
        )
        .min(1, { message: 'Phải có ít nhất 1 file' }),
})

const questionSchema = z.object({
    options: z
        .array(
            z.object({
                option: z.string().min(1, { message: 'Nội dung lựa chọn không được để trống' }),
                is_correct: z.boolean(),
                explanation: z.string().optional().nullable(),
            }),
        )
        .min(2, { message: 'Phải có ít nhất 2 lựa chọn' }),
})

export const createLessonSchema = z.object({
    query: z.object({
        course_id: z.uuidv7('course id phải là uuidv7 hợp lệ'),
        chapter_id: z.uuidv7('chapter id phải là uuidv7 hợp lệ'),
    }),
    body: z.discriminatedUnion('type', [
        z.object({
            type: z.literal('VIDEO'),
            title: z.string().min(1, { message: 'Tiêu đề không được để trống' }),
            content: z.string().min(1, { message: 'Nội dung không được để trống' }),
            detail: videoSchema,
        }),
        z.object({
            type: z.literal('CODING'),
            title: z.string().min(1, { message: 'Tiêu đề không được để trống' }),
            content: z.string().min(1, { message: 'Nội dung không được để trống' }),
            detail: codingSchema,
        }),
        z.object({
            type: z.literal('QUESTION'),
            title: z.string().min(1, { message: 'Tiêu đề không được để trống' }),
            content: z.string().min(1, { message: 'Nội dung không được để trống' }),
            detail: questionSchema,
        }),
        z.object({
            type: z.literal('DOCUMENT'),
            title: z.string().min(1, { message: 'Tiêu đề không được để trống' }),
            content: z.string().min(1, { message: 'Nội dung không được để trống' }),
        }),
    ]),
})

export const getLessonByIdSchema = z.object({
    params: z.object({
        lesson_id: z.uuidv7('lesson id phải là uuidv7 hợp lệ'),
    }),
})

export const saveLessonCodeSchema = z.object({
    body: z.object({
        files: z
            .array(
                z.object({
                    file_name: z.string().min(1),
                    code: z.string(),
                }),
            )
            .min(1, { message: 'Phải có ít nhất 1 file' }),
    }),
    params: z.object({
        lesson_id: z.uuidv7('lesson id phải là uuidv7 hợp lệ'),
    }),
})

export const passLessonSchema = z.object({
    params: z.object({
        lesson_id: z.uuidv7('lesson id phải là uuidv7 hợp lệ'),
    }),
})

export type CreateLessonRequest = TypedRequest<z.infer<typeof createLessonSchema>['body']>
export type GetLessonByIdRequest = TypedRequest<any, z.infer<typeof getLessonByIdSchema>['params']>
export type SaveLessonCodeRequest = TypedRequest<
    z.infer<typeof saveLessonCodeSchema>['body'],
    z.infer<typeof saveLessonCodeSchema>['params']
>
export type PassLessonRequest = TypedRequest<any, z.infer<typeof passLessonSchema>['params']>
