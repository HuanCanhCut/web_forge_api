import { Op } from 'sequelize'

import { Notification, NotificationRecipient, User } from '../models'
import { GetNotificationCursor } from '../validators/api/notificationSchema'
import { decodeCursor, encodeCursor } from '~/utils/cursor'
import handleServiceError from '~/utils/handleServiceError'

class NotificationService {
    getNotifications = async ({
        cursor,
        limit,
        currentUserId,
    }: {
        cursor: string | undefined
        limit: string
        currentUserId: string
    }) => {
        try {
            let whereConditions = {}

            if (cursor) {
                const { last_id } = decodeCursor<GetNotificationCursor>(cursor)

                whereConditions = {
                    ...whereConditions,
                    id: {
                        [Op.lt]: last_id,
                    },
                }
            }

            const [notifications, unseenCount] = await Promise.all([
                Notification.findAll({
                    where: whereConditions,
                    include: [
                        {
                            model: User,
                            as: 'actor',
                        },
                        {
                            model: NotificationRecipient,
                            as: 'recipient',
                            where: {
                                recipient_id: currentUserId,
                            },
                            required: true,
                        },
                    ],
                    limit: Number(limit) + 1,
                    order: [['id', 'DESC']],
                }),
                NotificationRecipient.count({
                    where: {
                        recipient_id: currentUserId,
                        is_seen: false,
                    },
                }),
            ])

            const hasNextPage = notifications.length > Number(limit)

            const data = hasNextPage ? notifications.slice(0, Number(limit)) : notifications

            const nextCursor = hasNextPage
                ? encodeCursor<GetNotificationCursor>({ last_id: data[data.length - 1].id })
                : null

            return { notifications: data, nextCursor, unseenCount }
        } catch (error) {
            return handleServiceError(error)
        }
    }

    markAllAsSeen = async ({ currentUserId }: { currentUserId: string }) => {
        try {
            await NotificationRecipient.update(
                {
                    is_seen: true,
                    seen_at: new Date(),
                },
                {
                    where: {
                        recipient_id: currentUserId,
                    },
                },
            )
        } catch (error) {
            return handleServiceError(error)
        }
    }

    markAsRead = async ({ currentUserId, id }: { currentUserId: string; id: string }) => {
        try {
            await NotificationRecipient.update(
                {
                    is_read: true,
                    read_at: new Date(),
                },
                {
                    where: {
                        recipient_id: currentUserId,
                        notification_id: id,
                    },
                },
            )
        } catch (error) {
            return handleServiceError(error)
        }
    }
}

export default new NotificationService()
