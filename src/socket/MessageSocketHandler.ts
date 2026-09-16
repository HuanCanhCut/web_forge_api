// const socketAuthMiddleware = require('./middlewares/auth')
import { Socket } from 'socket.io'

import { ClientToServerEvents, InterServerEvents, ServerToClientEvents } from '~/types/socket.type'

class MessageSocketHandler {
    private socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents>

    constructor(socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents>) {
        this.socket = socket

        // socket.on('JOIN_COMMENTS', this.JOIN_COMMENTS.bind(this))
    }
}

export default MessageSocketHandler
