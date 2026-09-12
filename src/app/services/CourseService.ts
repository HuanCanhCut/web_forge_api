import { pickBy } from 'lodash'
import slugify from 'slugify'

import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../errors/errors'
import {
    Chapter,
    Course,
    CourseCategory,
    CourseTag,
    LessonVideo,
    User,
    UserCourse,
    UserLessonProgress,
} from '../models'
import Lesson from '../models/LessonModel'
import S3Service from './S3Service'
import { sequelize } from '~/config/database'
import handleServiceError from '~/utils/handleServiceError'

class CourseService {
    createCourse = async ({
        title,
        description,
        category_id,
        level,
        upload_id,
        currentUserId,
        slug,
        tag_id,
        detail,
    }: {
        title: string
        description: string
        category_id: string
        level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
        upload_id: string
        currentUserId: string
        slug: string
        tag_id: string
        detail?: string
    }) => {
        try {
            /**
             * check category is exist
             */
            const [category, tag] = await Promise.all([
                CourseCategory.findByPk(category_id),
                CourseTag.findByPk(tag_id),
            ])

            if (!category) {
                throw new NotFoundError({ message: 'Danh mục không tồn tại' })
            }

            if (!tag) {
                throw new NotFoundError({ message: 'Tag không tồn tại' })
            }

            /**
             * validate upload id
             */
            const objectKey = await S3Service.verifyUploadId({ uploadId: upload_id, currentUserId, folder: 'courses' })

            /**
             * check if title and slug is exist
             */

            const [hasTitle, hasSlug] = await Promise.all([
                Course.findOne({
                    where: {
                        title,
                    },
                }),
                Course.findOne({
                    where: {
                        slug,
                    },
                }),
            ])

            if (hasTitle) {
                throw new BadRequestError({ message: 'Tiêu đề khóa học đã tồn tại' })
            }

            if (hasSlug) {
                throw new BadRequestError({ message: 'Slug khóa học đã tồn tại' })
            }

            /**
             * get last course to get sort_order
             */
            const lastCourse = await Course.findOne({
                order: [['sort_order', 'DESC']],
                attributes: ['sort_order'],
            })

            /**
             * create course
             */
            const createdCourse = await Course.create(
                {
                    title,
                    description,
                    category_id,
                    level,
                    thumbnail_path: objectKey,
                    status: 'PUBLISHED',
                    sort_order: (lastCourse?.get('sort_order') || 0) + 10,
                    slug: slugify(slug, { lower: true, locale: 'vi', strict: true }),
                    tag_id,
                    detail: detail ?? null,
                },
                {
                    logging: console.log,
                },
            )

            return createdCourse
        } catch (error) {
            console.log(error)

            return handleServiceError(error)
        }
    }

    getCourses = async ({
        page,
        per_page,
        trending,
        level,
        category_id,
        tag_id,
        q,
        currentUserId,
    }: {
        page: number
        per_page: number
        trending: boolean
        level?: string
        category_id?: string
        tag_id?: string
        q?: string
        currentUserId?: string
    }) => {
        try {
            const { rows: courses, count: total } = await Course.findAndCountAll({
                limit: per_page,
                offset: (page - 1) * per_page,
                ...(trending && {
                    order: [['student_count', 'DESC']],
                }),
                attributes: {
                    include: [
                        [
                            sequelize.literal(`
                                (
                                    SELECT EXISTS (
                                        SELECT 1
                                        FROM user_courses
                                        WHERE user_courses.course_id = Course.id
                                        AND user_courses.user_id = ${sequelize.escape(currentUserId || '')}
                                    )
                                )
                            `),
                            'is_joined',
                        ],
                    ],
                },
                include: [
                    {
                        model: CourseCategory,
                        as: 'category',
                    },
                    {
                        model: CourseTag,
                        as: 'tag',
                    },
                ],
                where: pickBy(
                    {
                        level,
                        category_id,
                        tag_id,
                        title: q
                            ? sequelize.literal(
                                  `MATCH(title, description) AGAINST(${sequelize.escape(q + '*')} IN BOOLEAN MODE)`,
                              )
                            : undefined,
                    },
                    (value) => value !== undefined && value !== null,
                ),
            })

            return { courses, total }
        } catch (error) {
            return handleServiceError(error)
        }
    }

    getCategories = async () => {
        try {
            return await CourseCategory.findAll()
        } catch (error) {
            return handleServiceError(error)
        }
    }

    getAllTags = async () => {
        try {
            const tags = await CourseTag.findAll()

            return tags
        } catch (error) {
            return handleServiceError(error)
        }
    }

    createChapter = async ({ title, course_id }: { title: string; course_id: string }) => {
        try {
            const [hasChapter, hasCourse] = await Promise.all([
                Chapter.findOne({
                    where: {
                        title,
                        course_id,
                    },
                }),
                Course.findByPk(course_id),
            ])

            if (!hasCourse) {
                throw new NotFoundError({ message: 'Khóa học không tồn tại' })
            }

            if (hasChapter) {
                throw new ConflictError({ message: 'Chương đã tồn tại' })
            }

            const lastChapter = await Chapter.findOne({
                where: { course_id },
                order: [['order', 'DESC']],
                attributes: ['order'],
            })

            const chapter = await Chapter.create({
                title,
                course_id,
                order: (lastChapter?.get('order') || 0) + 10,
            })

            return chapter
        } catch (error) {
            return handleServiceError(error)
        }
    }

    getCourseById = async ({ slug, currentUserId }: { slug: string; currentUserId?: string }) => {
        try {
            const course = await Course.findOne({
                where: {
                    slug,
                },
                attributes: {
                    include: [
                        [
                            sequelize.literal(`
                            (
                                SELECT 1
                                FROM user_courses
                                WHERE user_courses.user_id = ${sequelize.escape(currentUserId || '')}
                                AND user_courses.course_id = Course.id
                            )
                        `),
                            'is_joined',
                        ],
                    ],
                },
                include: [
                    {
                        model: Chapter,
                        as: 'chapters',
                        order: [['order', 'ASC']],
                        include: [
                            {
                                model: Lesson,
                                as: 'lessons',
                                order: [['order', 'ASC']],
                                include: [
                                    {
                                        model: LessonVideo,
                                        as: 'video',
                                        attributes: ['duration'],
                                    },
                                    {
                                        model: UserLessonProgress,
                                        as: 'progress',
                                        where: {
                                            user_id: currentUserId || '',
                                        },
                                        required: false,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        model: User,
                        as: 'creator',
                    },
                ],
            })

            if (!course) {
                throw new NotFoundError({ message: 'Khóa học không tồn tại' })
            }

            // calc duration per chapter
            const chapters = course.getDataValue('chapters')

            chapters?.forEach((chapter) => {
                const lessons = chapter.getDataValue('lessons')

                const total_duration_in_seconds = lessons?.reduce((total, lesson) => {
                    return total + (lesson.video ? lesson.video.duration || 0 : 0)
                }, 0)

                chapter.setDataValue('duration', total_duration_in_seconds)
            })

            return course
        } catch (error) {
            return handleServiceError(error)
        }
    }

    registerCourse = async ({ course_id, currentUserId }: { course_id: string; currentUserId?: string }) => {
        try {
            if (!currentUserId) {
                throw new UnauthorizedError({ message: 'Unauthorized' })
            }

            // check if course is not exit

            const course = await Course.findByPk(course_id)

            if (!course) {
                throw new NotFoundError({ message: 'Khóa học không tồn tại' })
            }

            // check if user registered this course

            const userCourse = await UserCourse.findOne({
                where: {
                    user_id: currentUserId,
                    course_id,
                },
            })

            if (userCourse) {
                throw new ConflictError({ message: 'Bạn đã đăng ký khóa học này' })
            }

            await Promise.all([
                UserCourse.create({
                    user_id: currentUserId,
                    course_id,
                    status: 'ENROLLED',
                }),
                Course.increment('student_count', {
                    where: {
                        id: course_id,
                    },
                }),
            ])

            return course
        } catch (error) {
            return handleServiceError(error)
        }
    }
}

export default new CourseService()
