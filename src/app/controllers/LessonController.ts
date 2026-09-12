import { Response } from 'express'

import { UnauthorizedError } from '../errors/errors'
import { responseData } from '../schemas/response'
import LessonService from '../services/LessonService'
import {
    CreateLessonRequest,
    GetLessonByIdRequest,
    PassLessonRequest,
    SaveLessonCodeRequest,
} from '../validators/api/lessonSchema'

class LessonController {
    // [POST] /lessons?course_id=&chapter_id=
    createLesson = async (req: CreateLessonRequest, res: Response) => {
        const { course_id, chapter_id } = req.query

        const decoded = req.decoded

        if (!decoded) {
            throw new UnauthorizedError({ message: 'Unauthorized' })
        }

        const lesson = await LessonService.createLesson({
            ...req.body,
            course_id,
            chapter_id,
            currentUserId: decoded.sub,
        })

        res.status(201).json(responseData(lesson))
    }

    // [GET] /lessons/:lesson_id
    getLessonById = async (req: GetLessonByIdRequest, res: Response) => {
        const { lesson_id } = req.params

        const decoded = req.decoded

        const lesson = await LessonService.getLessonById({ lessonId: lesson_id, currentUserId: decoded?.sub })

        res.json(responseData(lesson))
    }

    saveLessonCode = async (req: SaveLessonCodeRequest, res: Response) => {
        const { files } = req.body
        const { lesson_id } = req.params

        const decoded = req.decoded

        const userCode = await LessonService.saveLessonCode({
            lessonId: lesson_id,
            currentUserId: decoded?.sub,
            files,
        })

        res.json(responseData(userCode))
    }

    passLesson = async (req: PassLessonRequest, res: Response) => {
        const { lesson_id } = req.params

        const decoded = req.decoded

        const lesson = await LessonService.passLesson({
            lessonId: lesson_id,
            currentUserId: decoded?.sub,
        })

        res.json(responseData(lesson))
    }
}

export default new LessonController()
