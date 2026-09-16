import { NotFoundError } from '../errors/errors'
import { User } from '../models'
import handleServiceError from '~/utils/handleServiceError'

class UserService {
    getUserById = async (id: string) => {
        try {
            const user = await User.findByPk(id)

            if (!user) {
                throw new NotFoundError({ message: 'User not found' })
            }

            return user
        } catch (error) {
            return handleServiceError(error)
        }
    }
}

export default new UserService()
