import { NextFunction, Request, Response } from 'express'

import decodedToken from '../../utils/decodedToken'
import { UnauthorizedError } from '../errors/errors'
import { responseData, responsePagination } from '../schemas/response'
import CourseService from '../services/CourseService'
import { CreateChapterRequest } from '../validators/api/chapterSchema'
import {
    CreateCourseRequest,
    GetCourseByIdRequest,
    GetCoursesRequest,
    RegisterCourseRequest,
} from '../validators/api/courseSchema'

class CourseController {
    // [POST] /courses
    createCourse = async (req: CreateCourseRequest, res: Response, next: NextFunction) => {
        try {
            const { title, description, category_id, level, upload_id, slug, tag_id, detail } = req.body

            const decoded = req.decoded

            if (!decoded) {
                throw new UnauthorizedError({ message: 'Unauthorized' })
            }

            const course = await CourseService.createCourse({
                title,
                description,
                category_id,
                level,
                upload_id,
                currentUserId: decoded.sub,
                slug,
                tag_id,
                detail,
            })

            res.status(201).json(responseData(course))
        } catch (error) {
            return next(error)
        }
    }

    // [GET] /courses
    getCourses = async (req: GetCoursesRequest, res: Response, next: NextFunction) => {
        try {
            const { page, per_page, trending, level, category_id, tag_id, q } = req.query
            const { access_token } = req.cookies

            const decoded = decodedToken(access_token)

            const { courses, total } = await CourseService.getCourses({
                page: Number(page),
                per_page: Number(per_page),
                trending: trending === 'true',
                level,
                category_id,
                tag_id,
                q,
                currentUserId: decoded?.sub,
            })

            res.json(
                responsePagination({
                    req,
                    data: courses,
                    total,
                    count: courses.length,
                    current_page: Number(page),
                    per_page: Number(per_page),
                }),
            )
        } catch (error) {
            return next(error)
        }
    }

    // [GET] /courses/categories
    getCategories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await CourseService.getCategories()

            res.json(responseData(categories))
        } catch (error) {
            return next(error)
        }
    }

    // [GET] /courses/tags
    getAllTags = async (req: Request, res: Response) => {
        const tags = await CourseService.getAllTags()

        res.json(responseData(tags))
    }

    // [POST] /courses/:course_id/chapters
    createChapter = async (req: CreateChapterRequest, res: Response) => {
        const { title } = req.body
        const { course_id } = req.params

        const chapter = await CourseService.createChapter({ title, course_id })

        res.status(201).json(responseData(chapter))
    }

    // [GET] /courses/:course_id
    getCourseBySlug = async (req: GetCourseByIdRequest, res: Response) => {
        const { slug } = req.params

        const { access_token } = req.cookies

        const decoded = decodedToken(access_token)

        const course = await CourseService.getCourseById({ slug, currentUserId: decoded?.sub })

        res.json(responseData(course))
    }

    registerCourse = async (req: RegisterCourseRequest, res: Response) => {
        const { course_id } = req.params

        const decoded = req.decoded

        const course = await CourseService.registerCourse({ course_id, currentUserId: decoded?.sub })

        res.status(201).json(responseData(course))
    }
}

export default new CourseController()
