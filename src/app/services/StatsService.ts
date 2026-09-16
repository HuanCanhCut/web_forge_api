import { User } from '../models'

class StatsService {
    getStats = async () => {
        const user_count = await User.count()

        return {
            user_count,
        }
    }
}

export default new StatsService()
