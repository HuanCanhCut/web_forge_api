import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'

class TestCase extends Model<InferAttributes<TestCase>, InferCreationAttributes<TestCase>> {
    declare id: CreationOptional<string>
    declare assertion: string // json type
    declare lesson_coding_id: string
    declare name: string | null
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.belongsTo(models.LessonCoding, { foreignKey: 'lesson_coding_id', as: 'lessonCoding' })
    }
}

TestCase.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv7,
        },
        assertion: {
            type: DataTypes.JSON,
            allowNull: false,
            get() {
                const rawValue = this.getDataValue('assertion')
                if (typeof rawValue === 'string') {
                    try {
                        return JSON.parse(rawValue)
                    } catch {
                        return rawValue
                    }
                }
                return rawValue
            },
        },
        lesson_coding_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'lesson_codings',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'test_cases',
        sequelize,
    },
)

export default TestCase
