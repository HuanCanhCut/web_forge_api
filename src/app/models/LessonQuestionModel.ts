import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'

class LessonQuestion extends Model<InferAttributes<LessonQuestion>, InferCreationAttributes<LessonQuestion>> {
    declare id: CreationOptional<string>
    declare lesson_id: string
    declare option: string
    declare is_correct: CreationOptional<boolean>
    declare explanation: string | null
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' })
    }
}

LessonQuestion.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv7,
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
        option: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        is_correct: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        explanation: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'lesson_questions',
        sequelize,
    },
)

export default LessonQuestion
