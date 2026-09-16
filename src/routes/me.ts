import express from 'express'
const router = express.Router()

import MeController from '../app/controllers/MeController'
import verifyToken from '~/app/middlewares/verifyToken'

router.get('/', verifyToken, MeController.getCurrentUser)

export default router
