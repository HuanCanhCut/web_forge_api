import express from 'express'

import SearchController from '~/app/controllers/SearchController'
import { validate } from '~/app/middlewares/validate'
import { searchSchema } from '~/app/validators/api/searchSchema'

const router = express.Router()

router.get('/', validate(searchSchema), SearchController.search)

export default router
