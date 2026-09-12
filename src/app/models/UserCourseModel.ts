import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'

class UserCourse extends Model<InferAttributes<UserCourse>, InferCreationAttributes<UserCourse>> {
    declare id: CreationOptional<string>
    declare user_id: string
    declare course_id: string
    declare status: 'ENROLLED' | 'COMPLETED'
    declare completed_at: Date | null
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
        this.belongsTo(models.Course, { foreignKey: 'course_id', as: 'course' })
    }
}

UserCourse.init(
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
        status: {
            type: DataTypes.ENUM('ENROLLED', 'COMPLETED'),
            allowNull: false,
        },
        completed_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'user_courses',
        sequelize,
        indexes: [
            {
                fields: ['user_id', 'course_id'],
            },
        ],
    },
)

export default UserCourse
