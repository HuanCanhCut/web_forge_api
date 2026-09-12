import jwt from 'jsonwebtoken'
import { Socket } from 'socket.io'

const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    try {
        const cookies = socket.handshake.headers.cookie

        const token = cookies
            ?.split('; ')
            .find((row: string) => row.startsWith('access_token='))
            ?.split('=')[1]

        let decoded: string | jwt.JwtPayload | undefined

        if (token) {
            try {
                decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string)

                if (decoded) {
                    socket.data.decoded = decoded
                }
            } catch (_) {
                //
            }
        }

        next()
    } catch (_) {
        next()
    }
}

export default socketAuthMiddleware
