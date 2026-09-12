import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'

class Notification extends Model<InferAttributes<Notification>, InferCreationAttributes<Notification>> {
    declare id: CreationOptional<string>
    declare content: string
    declare metadata: Record<string, any> | null
    declare actor_id: string
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.belongsTo(models.User, { foreignKey: 'actor_id', as: 'actor' })
        this.hasMany(models.NotificationRecipient, { foreignKey: 'notification_id', as: 'recipients' })
        this.hasOne(models.NotificationRecipient, { foreignKey: 'notification_id', as: 'recipient' }) // find by current user
    }
}

Notification.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv7,
        },
        content: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('metadata') as string | null
                return rawValue ? JSON.parse(rawValue) : null
            },
        },
        actor_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    },
    {
        tableName: 'notifications',
        sequelize,
        indexes: [
            {
                fields: ['actor_id'],
            },
        ],
    },
)

export default Notification
