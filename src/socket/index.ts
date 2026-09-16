import { Server, Socket } from 'socket.io'

import MessageSocketHandler from './MessageSocketHandler'
import socketAuthMiddleware from './socketMiddleware'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from '~/types/socket.type'

const setupSocketConnection = (io: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>) => {
    io.use(socketAuthMiddleware)

    io.on('connection', (socket: Socket) => {
        if (socket.data.decoded) {
            socket.join(`user:${socket.data.decoded.sub}`)

            console.log(
                `\x1b[36m===>>>Socket connected: ${socket.data.decoded.sub} with socketid ${socket.id}!!!`,
                '\x1b[0m',
            )
        } else {
            console.log(`\x1b[31m===>>>Socket connected with NO auth!!!`, '\x1b[0m')
        }

        new MessageSocketHandler(socket)

        socket.on('disconnect', async () => {
            console.log(
                `\x1b[33m===>>>Socket ${socket.data?.decoded?.sub ?? 'unknown'} disconnected with socketid ${socket.id}!!!`,
                '\x1b[0m',
            )
        })
    })
}

export default setupSocketConnection
