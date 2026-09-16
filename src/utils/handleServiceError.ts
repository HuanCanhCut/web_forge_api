import { AppError, InternalServerError } from '~/app/errors/errors'

const handleServiceError = (error: any): never => {
    if (error instanceof AppError) {
        throw error
    }

    throw new InternalServerError({ message: error.message + ' ' + error.stack, error })
}

export default handleServiceError
