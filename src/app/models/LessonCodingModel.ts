import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'

class LessonCoding extends Model<InferAttributes<LessonCoding>, InferCreationAttributes<LessonCoding>> {
    declare id: CreationOptional<string>
    declare lesson_id: string
    declare hints: string | null
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' })
        this.hasMany(models.LessonCodingFile, { foreignKey: 'coding_id', as: 'files' })
        this.hasMany(models.TestCase, { foreignKey: 'lesson_coding_id', as: 'test_cases' })
    }
}

LessonCoding.init(
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
        hints: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'lesson_codings',
        sequelize,
    },
)

export default LessonCoding
