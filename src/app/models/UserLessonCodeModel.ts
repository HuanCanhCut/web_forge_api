import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'

class UserLessonCode extends Model<InferAttributes<UserLessonCode>, InferCreationAttributes<UserLessonCode>> {
    declare id: CreationOptional<string>
    declare lesson_id: string
    declare user_id: string
    declare file_name: string
    declare code: string
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' })
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    }
}

UserLessonCode.init(
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
        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        tableName: 'user_lesson_codes',
        sequelize,
        indexes: [
            {
                unique: true,
                fields: ['lesson_id', 'user_id', 'file_name'],
                name: 'user_lesson_codes_lesson_id_user_id_file_name_unique',
            },
        ],
    },
)

export default UserLessonCode
