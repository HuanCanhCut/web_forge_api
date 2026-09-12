import { Request } from 'express'

import { UserRole } from './types/user.type'

export interface JwtPayload {
    sub: string
    role: UserRole
    jti: string
    iat: number
    exp: number
}

export interface IRequest extends Request {
    decoded?: JwtPayload
}
