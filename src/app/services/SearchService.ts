import { Course } from '../models'
import { sequelize } from '~/config/database'
import handleServiceError from '~/utils/handleServiceError'

class SearchService {
    search = async ({ q }: { q: string }) => {
        try {
            const [courses] = await Promise.all([
                Course.findAll({
                    where: sequelize.literal(
                        `MATCH(title, description) AGAINST(${sequelize.escape(q + '*')} IN BOOLEAN MODE)`,
                    ),
                    limit: 5,
                }),
            ])

            return {
                courses: courses.map((course) => {
                    return {
                        id: course.get('id'),
                        name: course.get('title'),
                        description: course.get('description'),
                        type: 'courses',
                        image_url: course.get('thumbnail_url'),
                    }
                }),
            }
        } catch (error) {
            return handleServiceError(error)
        }
    }
}

export default new SearchService()
