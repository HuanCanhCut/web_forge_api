import { Express, Request, Response } from 'express'

import authRoute from './auth'
import courseRoute from './course'
import lessonRoute from './lesson'
import meRoute from './me'
import notificationRoute from './notification'
import s3Route from './s3'
import searchRoute from './search'
import statsRoute from './stats'
import errorHandler from '~/app/errors/errorHandler'

const route = (app: Express) => {
    app.use('/api/auth', authRoute)
    app.use('/api/me', meRoute)
    app.use('/api/s3', s3Route)
    app.use('/api/courses', courseRoute)
    app.use('/api/lessons', lessonRoute)
    app.use('/api/search', searchRoute)
    app.use('/api/notifications', notificationRoute)
    app.use('/api/stats', statsRoute)

    app.all('/{*any}', (req: Request, res: Response) => {
        res.status(404).json({
            status: 404,
            message: `Can't find ${req.originalUrl} on this server!`,
        })
    })

    app.use(errorHandler)
}

export default route
