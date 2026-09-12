import jwt from 'jsonwebtoken'

import { JwtPayload } from '~/type'

const decodedToken = (token: string): JwtPayload | null => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    } catch (error) {
        /**
         * only throw error if token is expired
         * because expired token will be handled by global error handler to required refresh token
         */
        if (error instanceof jwt.TokenExpiredError) {
            throw error
        }

        return null
    }
}

export default decodedToken
