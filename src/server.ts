import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import morgan from 'morgan'

import './config/env'
import setupGlobalErrorHandling from './app/errors/globalError'
import SocketConfig from './config/socket/index'
import setupSocketConnection from './socket'
setupGlobalErrorHandling()

import { cert, initializeApp } from 'firebase-admin'

import './app/queue'
import * as database from './config/database/index'
import { redisClient } from './config/redis'
import route from './routes/index'
const app = express()
const server = http.createServer(app)

const allowedOrigins: string[] = ['https://h9n.dev', 'http://localhost:3000']

const corsOptions: cors.CorsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // allow requests from any origin
        if (!origin) return callback(null, true)

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(null, false)
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Refresh-Token-Required', 'x-refresh-token-required'],
    credentials: true,
    maxAge: 86400,
}

app.use(cors(corsOptions))

initializeApp({
    credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
})

// connect to db
database.connect()

// connect to redis
;(async () => {
    await redisClient.connect()
})()

// create s3 bucket (We are using R2, so we don't create buckets automatically.)
// ;(async () => {
//     await initializeBucket()
// })()

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// make express trust the proxy of the load balancer (nginx)
// so that we can get the correct protocol and host from the request
app.set('trust proxy', 1)

app.get('/api/health', (req, res) => {
    res.json({ message: 'System is healthy.' })
})

route(app)

const io = SocketConfig.init(server, allowedOrigins)

// setup socket connection
setupSocketConnection(io)

server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
