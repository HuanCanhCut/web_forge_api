import { NextFunction, Request, Response } from 'express'

import { responseData } from '../schemas/response'
import StatsService from '../services/StatsService'

class StatsController {
    getStats = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await StatsService.getStats()

            res.json(responseData(stats))
        } catch (error) {
            return next(error)
        }
    }
}

export default new StatsController()
