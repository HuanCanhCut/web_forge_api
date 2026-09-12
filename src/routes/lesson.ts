import express from 'express'

import LessonController from '~/app/controllers/LessonController'
import { validate } from '~/app/middlewares/validate'
import VerifyAdmin from '~/app/middlewares/verifyAdmin'
import verifyToken from '~/app/middlewares/verifyToken'
import {
    createLessonSchema,
    getLessonByIdSchema,
    passLessonSchema,
    saveLessonCodeSchema,
} from '~/app/validators/api/lessonSchema'

const router = express.Router()

router.post('/', verifyToken, VerifyAdmin, validate(createLessonSchema), LessonController.createLesson)
router.get('/:lesson_id', verifyToken, validate(getLessonByIdSchema), LessonController.getLessonById)
router.patch('/:lesson_id/code/save', verifyToken, validate(saveLessonCodeSchema), LessonController.saveLessonCode)
router.post('/:lesson_id/pass', verifyToken, validate(passLessonSchema), LessonController.passLesson)

export default router
