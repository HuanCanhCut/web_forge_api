import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'

export type ProgressStatus = 'IN_PROGRESS' | 'COMPLETED'

class UserLessonProgress extends Model<
    InferAttributes<UserLessonProgress>,
    InferCreationAttributes<UserLessonProgress>
> {
    declare id: CreationOptional<string>
    declare user_id: string
    declare lesson_id: string
    declare status: CreationOptional<ProgressStatus>
    declare completed_at: Date | null
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
        this.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' })
    }
}

UserLessonProgress.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv7,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        lesson_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'lessons',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        status: {
            type: DataTypes.ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'),
            allowNull: false,
            defaultValue: 'NOT_STARTED',
        },
        completed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'user_lesson_progress',
        sequelize,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'lesson_id'],
                name: 'user_lesson_progress_unique',
            },
        ],
    },
)

export default UserLessonProgress
