import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'

class NotificationRecipient extends Model<
    InferAttributes<NotificationRecipient>,
    InferCreationAttributes<NotificationRecipient>
> {
    declare id: CreationOptional<string>
    declare notification_id: string
    declare recipient_id: string
    declare is_read: CreationOptional<boolean>
    declare is_seen: CreationOptional<boolean>
    declare seen_at: Date | null
    declare read_at: Date | null
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.belongsTo(models.Notification, { foreignKey: 'notification_id', as: 'notification' })
        this.belongsTo(models.User, { foreignKey: 'recipient_id', as: 'recipient' })
    }
}

NotificationRecipient.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv7,
        },
        notification_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'notifications',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        recipient_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_seen: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        seen_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        read_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'notification_recipients',
        sequelize,
        defaultScope: {
            attributes: {
                exclude: ['seen_at', 'read_at'],
            },
        },
        indexes: [
            {
                fields: ['recipient_id', 'is_read'],
            },
            {
                fields: ['recipient_id', 'is_seen'],
            },
        ],
    },
)

export default NotificationRecipient
