import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'

class LessonCodingFile extends Model<InferAttributes<LessonCodingFile>, InferCreationAttributes<LessonCodingFile>> {
    declare id: CreationOptional<string>
    declare coding_id: string
    declare file_name: string
    declare code: string
    declare read_only: boolean
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.belongsTo(models.LessonCoding, { foreignKey: 'coding_id', as: 'coding' })
    }
}

LessonCodingFile.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv7,
        },
        coding_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'lesson_codings',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        read_only: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: 'lesson_coding_files',
        sequelize,
    },
)

export default LessonCodingFile
