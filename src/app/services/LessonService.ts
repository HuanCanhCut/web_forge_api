import { Op } from 'sequelize'
import { z } from 'zod'

import { BadRequestError, ConflictError, ForBiddenError, NotFoundError, UnauthorizedError } from '../errors/errors'
import {
    Chapter,
    Course,
    LessonCoding,
    LessonCodingFile,
    LessonQuestion,
    LessonVideo,
    TestCase,
    UserCourse,
    UserLessonCode,
    UserLessonProgress,
} from '../models'
import Lesson from '../models/LessonModel'
import { createLessonSchema } from '../validators/api/lessonSchema'
import S3Service from './S3Service'
import { sequelize } from '~/config/database'
import handleServiceError from '~/utils/handleServiceError'

class LessonService {
    createLesson = async (
        data: {
            course_id: string
            chapter_id: string
            currentUserId: string
        } & z.infer<typeof createLessonSchema>['body'],
    ) => {
        try {
            const { type, content, title, course_id, chapter_id, currentUserId } = data
            // validate course_id and chapter_id
            const [hasCourse, hasChapter] = await Promise.all([
                Course.findByPk(course_id),
                Chapter.findOne({
                    where: {
                        id: chapter_id,
                        course_id,
                    },
                }),
            ])

            if (!hasCourse) {
                throw new NotFoundError({ message: 'Khóa học không tồn tại' })
            }

            if (!hasChapter) {
                throw new NotFoundError({ message: 'Chương không tồn tại' })
            }

            //validate title
            const hasTitle = await Lesson.findOne({
                where: {
                    title,
                    chapter_id,
                },
            })

            if (hasTitle) {
                throw new ConflictError({ message: 'Bài học đã tồn tại' })
            }

            //get last lesson to get order
            const lastLesson = await Lesson.findOne({
                where: { chapter_id },
                order: [['order', 'DESC']],
                attributes: ['order'],
            })

            const lesson = await sequelize.transaction(async (t) => {
                // crete lesson
                const lesson = await Lesson.create(
                    {
                        type,
                        content,
                        title,
                        chapter_id,
                        order: (lastLesson?.get('order') || 0) + 10,
                        uploaded_by: currentUserId,
                    },
                    {
                        transaction: t,
                    },
                )

                switch (type) {
                    case 'VIDEO':
                        {
                            const { video_path, duration, upload_id, video_provider } = data.detail

                            const objectKey = await S3Service.verifyUploadId({
                                uploadId: upload_id,
                                currentUserId,
                                folder: 'lessons',
                            })

                            await LessonVideo.create(
                                {
                                    thumbnail_path: objectKey,
                                    lesson_id: lesson.id,
                                    video_path,
                                    duration,
                                    video_provider,
                                },
                                {
                                    transaction: t,
                                },
                            )
                        }

                        break
                    case 'CODING':
                        {
                            const { files, hints, test_cases } = data.detail

                            const codingDetail = await LessonCoding.create(
                                {
                                    lesson_id: lesson.id,
                                    hints,
                                },
                                {
                                    transaction: t,
                                },
                            )

                            const codingId = codingDetail.get('id')

                            if (codingId) {
                                const bulkData = files.map((file) => ({
                                    coding_id: codingId,
                                    file_name: file.file_name,
                                    code: file.code || '',
                                    read_only: file.read_only || false,
                                }))

                                await LessonCodingFile.bulkCreate(bulkData, {
                                    transaction: t,
                                })

                                if (test_cases) {
                                    const testCaseData = test_cases.map((testCase) => ({
                                        assertion: testCase.assertion,
                                        name: testCase.name,
                                        lesson_coding_id: codingId,
                                    }))

                                    await TestCase.bulkCreate(testCaseData, {
                                        transaction: t,
                                    })
                                }
                            }
                        }
                        break
                    case 'QUESTION':
                        {
                            const { options } = data.detail

                            const bulkData = options.map((opt) => ({
                                lesson_id: lesson.id,
                                option: opt.option,
                                is_correct: opt.is_correct,
                                explanation: opt.explanation || null,
                            }))

                            // check only one option is correct
                            const isOnlyOneOptionCorrect = bulkData.filter((opt) => opt.is_correct).length === 1

                            if (!isOnlyOneOptionCorrect) {
                                throw new BadRequestError({ message: 'Phải có duy nhất 1 đáp án đúng' })
                            }

                            await LessonQuestion.bulkCreate(bulkData, {
                                transaction: t,
                            })
                        }
                        break
                    default:
                        break
                }

                return lesson
            })

            return lesson
        } catch (error) {
            return handleServiceError(error)
        }
    }

    getLessonById = async ({ lessonId, currentUserId }: { lessonId: string; currentUserId?: string }) => {
        try {
            if (!currentUserId) {
                throw new UnauthorizedError({ message: 'Unauthorized' })
            }

            // check user progress status
            const userLessonProgress = await UserLessonProgress.findOne({
                where: {
                    user_id: currentUserId,
                    lesson_id: lessonId,
                },
            })

            if (!userLessonProgress) {
                const firstLesson = await Lesson.findOne({
                    order: [['id', 'ASC']],
                })

                // if this lesson is the first lesson of the course, auto create user lesson progress
                if (firstLesson?.getDataValue('id') === lessonId) {
                    await UserLessonProgress.create({
                        user_id: currentUserId,
                        lesson_id: lessonId,
                        status: 'IN_PROGRESS',
                    })
                } else {
                    throw new ForBiddenError({ message: 'Bài học này chưa mở khóa, vui lòng học các bài trước.' })
                }
            }

            const lesson = await Lesson.findByPk(lessonId, {
                include: [
                    {
                        model: LessonVideo,
                        as: 'video',
                    },
                    {
                        model: LessonCoding,
                        as: 'coding',
                        include: [
                            {
                                model: LessonCodingFile,
                                as: 'files',
                            },
                            {
                                model: TestCase,
                                as: 'test_cases',
                            },
                        ],
                    },
                    {
                        model: LessonQuestion,
                        as: 'answers',
                    },
                    {
                        model: UserLessonProgress,
                        as: 'progress',
                        where: {
                            user_id: currentUserId,
                        },
                        required: false,
                    },
                ],
            })

            if (!lesson) {
                throw new NotFoundError({ message: 'Không tìm thấy bài học' })
            }

            const { prevLesson, nextLesson } = await this.getPrevAndNextLesson(lessonId)

            lesson.setDataValue('prev_lesson_id', prevLesson?.getDataValue('id') ?? null)
            lesson.setDataValue('next_lesson_id', nextLesson?.getDataValue('id') ?? null)

            if (lesson.type === 'CODING') {
                const userLessonCode = await UserLessonCode.findAll({
                    where: {
                        user_id: currentUserId,
                        lesson_id: lessonId,
                    },
                })

                lesson.setDataValue('user_codes', userLessonCode)
            }

            // check user is joined course
            const chapter = await Chapter.findByPk(lesson.get('chapter_id'))

            const courseId = chapter?.get('course_id')

            const joinedCourse = await UserCourse.findOne({
                where: {
                    user_id: currentUserId,
                    course_id: courseId,
                },
            })

            if (!joinedCourse) {
                throw new ForBiddenError({ message: 'Bạn chưa đăng ký khóa học này' })
            }

            return lesson
        } catch (error) {
            return handleServiceError(error)
        }
    }

    saveLessonCode = async ({
        files,
        lessonId,
        currentUserId,
    }: {
        files: {
            file_name: string
            code: string
        }[]
        lessonId: string
        currentUserId?: string
    }) => {
        try {
            if (!currentUserId) {
                throw new UnauthorizedError({ message: 'Unauthorized' })
            }

            // Validate that the filenames match the original filenames.
            const originalFiles = await LessonCodingFile.findAll({
                include: {
                    model: LessonCoding,
                    as: 'coding',
                    where: { lesson_id: lessonId },
                },
                attributes: ['file_name', 'code'],
            })

            const fileNameMap = new Map(
                originalFiles.map((file) => {
                    return [file.file_name, file.code]
                }),
            )

            const invalidFiles = files.filter((file) => {
                return !fileNameMap.has(file.file_name)
            })

            if (invalidFiles.length) {
                throw new BadRequestError({ message: 'Tên file không khớp với file gốc', error: invalidFiles })
            }

            /**
             * Upsert files within a transaction to avoid race conditions.
             * Relies on unique constraint on (user_id, lesson_id, file_name).
             */
            await UserLessonCode.bulkCreate(
                files.map((file) => ({
                    user_id: currentUserId,
                    lesson_id: lessonId,
                    file_name: file.file_name,
                    code: file.code,
                })),
                {
                    updateOnDuplicate: ['code'],
                },
            )

            return await UserLessonCode.findAll({
                where: {
                    user_id: currentUserId,
                    lesson_id: lessonId,
                },
            })
        } catch (error) {
            return handleServiceError(error)
        }
    }

    getPrevAndNextLesson = async (lesson_id: string) => {
        const lesson = await Lesson.findByPk(lesson_id, {
            attributes: ['id'],
            include: [
                {
                    model: Chapter,
                    as: 'chapter',
                    attributes: ['course_id'],
                },
            ],
        })

        if (!lesson) {
            throw new NotFoundError({ message: 'Không tìm thấy bài học' })
        }

        const courseId = lesson.getDataValue('chapter')?.getDataValue('course_id')

        // Get prev lesson and next lesson
        const [prevLesson, nextLesson] = await Promise.all([
            Lesson.findOne({
                where: {
                    id: {
                        [Op.lt]: lesson_id,
                    },
                },
                include: [
                    {
                        model: Chapter,
                        as: 'chapter',
                        where: {
                            course_id: courseId,
                        },
                        attributes: ['id'],
                    },
                ],
            }),
            Lesson.findOne({
                where: {
                    id: {
                        [Op.gt]: lesson_id,
                    },
                },
                include: [
                    {
                        model: Chapter,
                        as: 'chapter',
                        where: {
                            course_id: courseId,
                        },
                        attributes: ['id'],
                    },
                ],
            }),
        ])

        return { prevLesson, nextLesson }
    }

    passLesson = async ({ lessonId, currentUserId }: { lessonId: string; currentUserId?: string }) => {
        try {
            if (!currentUserId) {
                throw new UnauthorizedError({ message: 'Unauthorized' })
            }

            const { prevLesson, nextLesson } = await this.getPrevAndNextLesson(lessonId)

            // check prev lesson is completed
            if (prevLesson) {
                const prevLessonProgress = await UserLessonProgress.findOne({
                    where: {
                        user_id: currentUserId,
                        lesson_id: prevLesson.get('id'),
                    },
                })

                if (!prevLessonProgress) {
                    throw new ForBiddenError({ message: 'Bạn chưa hoàn thành bài học trước' })
                }
            }

            // check if lesson is already completed
            const lessonProgress = await UserLessonProgress.findOne({
                where: {
                    user_id: currentUserId,
                    lesson_id: lessonId,
                },
            })

            if (lessonProgress && lessonProgress.getDataValue('status') === 'COMPLETED') {
                throw new BadRequestError({ message: 'Bạn đã hoàn thành bài học này rồi.' })
            }

            const lessonProgressData = await sequelize.transaction(async (t) => {
                let lessonProgressData = null

                if (lessonProgress?.getDataValue('status') === 'IN_PROGRESS') {
                    lessonProgressData = await UserLessonProgress.update(
                        {
                            status: 'COMPLETED',
                            completed_at: new Date(),
                        },
                        {
                            where: {
                                user_id: currentUserId,
                                lesson_id: lessonId,
                            },
                            transaction: t,
                        },
                    )
                } else {
                    lessonProgressData = await UserLessonProgress.create(
                        {
                            user_id: currentUserId,
                            lesson_id: lessonId,
                            status: 'COMPLETED',
                            completed_at: new Date(),
                        },
                        { transaction: t },
                    )
                }

                // update next lesson status to IN_PROGRESS
                if (nextLesson) {
                    const nextLessonProgress = await UserLessonProgress.findOne({
                        where: {
                            user_id: currentUserId,
                            lesson_id: nextLesson.get('id'),
                        },
                    })

                    if (!nextLessonProgress) {
                        await UserLessonProgress.create(
                            {
                                user_id: currentUserId,
                                lesson_id: nextLesson.get('id'),
                                status: 'IN_PROGRESS',
                            },
                            { transaction: t },
                        )
                    }
                }

                return lessonProgressData
            })

            return lessonProgressData
        } catch (error) {
            return handleServiceError(error)
        }
    }
}

export default new LessonService()
