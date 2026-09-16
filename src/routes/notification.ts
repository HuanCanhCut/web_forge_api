import express from 'express'

import NotificationController from '~/app/controllers/NotificationController'
import { validate } from '~/app/middlewares/validate'
import verifyToken from '~/app/middlewares/verifyToken'
import { idSchema } from '~/app/validators/api/commonSchema'
import { getNotificationSchema } from '~/app/validators/api/notificationSchema'

const router = express.Router()

router.get('/', validate(getNotificationSchema), verifyToken, NotificationController.getNotifications)
router.patch('/seen', verifyToken, NotificationController.markAllAsSeen)
router.patch('/:id/read', validate(idSchema), verifyToken, NotificationController.markAsRead)

export default router
