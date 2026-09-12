import express from 'express'

import CourseController from '~/app/controllers/CourseController'
import { validate } from '~/app/middlewares/validate'
import VerifyAdmin from '~/app/middlewares/verifyAdmin'
import verifyToken from '~/app/middlewares/verifyToken'
import { createChapterSchema } from '~/app/validators/api/chapterSchema'
import {
    createCourseSchema,
    getCourseBySlugSchema,
    getCoursesSchema,
    registerCourseSchema,
} from '~/app/validators/api/courseSchema'

const router = express.Router()

router.get('/', validate(getCoursesSchema), CourseController.getCourses)
router.post('/', verifyToken, VerifyAdmin, validate(createCourseSchema), CourseController.createCourse)
router.get('/categories', CourseController.getCategories)
router.get('/tags', CourseController.getAllTags)
router.get('/:slug', validate(getCourseBySlugSchema), CourseController.getCourseBySlug)
router.post('/:course_id/register', verifyToken, validate(registerCourseSchema), CourseController.registerCourse)

// chapter
router.post(
    '/:course_id/chapters',
    verifyToken,
    VerifyAdmin,
    validate(createChapterSchema),
    CourseController.createChapter,
)

export default router
