import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'
import Lesson from './LessonModel'

class Chapter extends Model<InferAttributes<Chapter>, InferCreationAttributes<Chapter>> {
    declare id: CreationOptional<string>
    declare course_id: string
    declare title: string
    declare order: number
    declare created_at?: Date
    declare updated_at?: Date

    /**
     * Virtual fields
     */
    declare duration?: number

    /**
     *
     * Foreign key fields
     */
    declare lessons?: Lesson[] | null

    static associate(models: any) {
        this.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' })
        this.hasMany(models.Lesson, { foreignKey: 'chapter_id', as: 'lessons' })
    }
}

Chapter.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv7,
        },
        course_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'courses',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        tableName: 'chapters',
        sequelize,
    },
)

export default Chapter
