import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'
import { resolveStorageUrl } from './helpers/resolveStorageUrl'

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>
    declare first_name: string
    declare last_name: string
    declare full_name?: string
    declare nickname: string
    declare email?: string | null
    declare password?: string
    declare avatar_path: string | null
    declare avatar_url: CreationOptional<string>
    declare role: 'admin' | 'user'
    declare is_active: boolean
    declare is_blocked: boolean
    declare blocked_at: CreationOptional<Date>
    declare blocked_by: CreationOptional<string>
    declare blocked_reason: CreationOptional<string>
    declare provider_uid: string | null
    declare sign_in_provider: 'email' | 'google.com' | 'github.com'
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.hasMany(models.RefreshToken, { foreignKey: 'user_id', as: 'refresh_tokens' })
        this.hasMany(models.Notification, { foreignKey: 'actor_id', as: 'sent_notifications' })
        this.hasMany(models.NotificationRecipient, { foreignKey: 'recipient_id', as: 'received_notifications' })
        this.hasMany(models.Lesson, { foreignKey: 'uploaded_by', as: 'uploaded_lessons' })
        this.hasMany(models.UserLessonCode, { foreignKey: 'user_id', as: 'lesson_codes' })
        this.hasMany(models.UserLessonProgress, { foreignKey: 'user_id', as: 'lesson_progresses' })
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv7,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
        },
        full_name: {
            type: DataTypes.VIRTUAL,
            allowNull: true,
            get() {
                const full_name = `${this.first_name} ${this.last_name}`
                return full_name.trim()
            },
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        avatar_path: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '',
            get() {
                // Hide avatar_path from serialized output.
                // Use getDataValue('avatar_path') to access the raw value.
                return undefined
            },
        },
        avatar_url: {
            type: DataTypes.VIRTUAL,
            allowNull: true,
            get() {
                return resolveStorageUrl(this.getDataValue('avatar_path'))
            },
        },

        password: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: '',
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            allowNull: false,
            defaultValue: 'user',
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        is_blocked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        blocked_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
        blocked_by: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: null,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        blocked_reason: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
        },
        provider_uid: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
            get() {
                // Hide provider_uid from serialized output.
                // Use getDataValue('provider_uid') to access the raw value.
                return undefined
            },
        },
        sign_in_provider: {
            type: DataTypes.ENUM('email', 'google.com', 'github.com'),
            allowNull: false,
        },
    },
    {
        tableName: 'users',
        sequelize,
        defaultScope: {
            attributes: {
                exclude: ['password', 'email'],
            },
        },
        scopes: {
            withPassword: {
                attributes: {
                    exclude: ['email'],
                },
            },
            withEmail: {
                attributes: {
                    exclude: ['password'],
                },
            },
        },
    },
)

export default User
