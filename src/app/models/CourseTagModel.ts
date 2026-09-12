import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'

class CourseTag extends Model<InferAttributes<CourseTag>, InferCreationAttributes<CourseTag>> {
    declare id: CreationOptional<string>
    declare name: string
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.hasMany(models.Course, { foreignKey: 'tag_id', as: 'courses' })
    }
}

CourseTag.init(
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
        tableName: 'course_tags',
        sequelize,
    },
)

export default CourseTag
