import express from 'express'

import StatsController from '~/app/controllers/StatsController'

const router = express.Router()

router.get('/', StatsController.getStats)

export default router
