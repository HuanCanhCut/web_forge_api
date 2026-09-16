import { NextFunction, Response } from 'express'

import { UnauthorizedError } from '../errors/errors'
import { responseCursorPagination } from '../schemas/response'
import NotificationService from '../services/NotificationService'
import { IdRequest } from '../validators/api/commonSchema'
import { GetNotificationRequest } from '~/app/validators/api/notificationSchema'

class NotificationController {
    // [GET] /api/notifications
    getNotifications = async (req: GetNotificationRequest, res: Response, next: NextFunction) => {
        try {
            const { limit, cursor } = req.query

            const decoded = req.decoded

            if (!decoded) {
                throw new UnauthorizedError({ message: 'Unauthorized' })
            }

            const { notifications, nextCursor, unseenCount } = await NotificationService.getNotifications({
                cursor,
                limit,
                currentUserId: decoded.sub,
            })

            res.json(
                responseCursorPagination({
                    req,
                    data: notifications,
                    limit: Number(limit),
                    next_cursor: nextCursor,
                    unseen_count: unseenCount,
                }),
            )
        } catch (error) {
            return next(error)
        }
    }

    // [PATCH] /api/notifications/seen
    markAllAsSeen = async (req: GetNotificationRequest, res: Response, next: NextFunction) => {
        try {
            const decoded = req.decoded

            if (!decoded) {
                throw new UnauthorizedError({ message: 'Unauthorized' })
            }

            await NotificationService.markAllAsSeen({
                currentUserId: decoded.sub,
            })

            res.sendStatus(204)
        } catch (error) {
            return next(error)
        }
    }

    // [PATCH] /api/notifications/:id/read
    markAsRead = async (req: IdRequest, res: Response, next: NextFunction) => {
        try {
            const decoded = req.decoded
            const { id } = req.params

            if (!decoded) {
                throw new UnauthorizedError({ message: 'Unauthorized' })
            }

            await NotificationService.markAsRead({
                currentUserId: decoded.sub,
                id,
            })

            res.sendStatus(204)
        } catch (error) {
            return next(error)
        }
    }
}

export default new NotificationController()
