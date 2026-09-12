import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'

class RefreshToken extends Model<InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>> {
    declare id: CreationOptional<string>
    declare user_id: string
    declare refresh_token: string
    declare created_at?: Date
    declare updated_at?: Date

    static associate(models: any) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    }
}

RefreshToken.init(
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
        refresh_token: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
    },
    {
        tableName: 'refresh_tokens',
        sequelize,
        indexes: [
            {
                fields: ['user_id', 'refresh_token'],
                name: 'refresh_token_idx',
            },
        ],
    },
)

export default RefreshToken
