import { NextFunction, Response } from 'express'

import { responseData } from '../schemas/response'
import SearchService from '../services/SearchService'
import { SearchRequest } from '../validators/api/searchSchema'

class SearchController {
    search = async (req: SearchRequest, res: Response, next: NextFunction) => {
        try {
            const { q } = req.query

            const searchResult = await SearchService.search({ q })

            res.json(responseData(searchResult))
        } catch (error) {
            return next(error)
        }
    }
}

export default new SearchController()
