import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'

class CourseCategory extends Model<InferAttributes<CourseCategory>, InferCreationAttributes<CourseCategory>> {
    declare id: CreationOptional<string>
    declare name: string
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.hasMany(models.Course, { foreignKey: 'category_id', as: 'courses' })
    }
}

CourseCategory.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv7,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: 'course_categories',
        sequelize,
    },
)

export default CourseCategory
