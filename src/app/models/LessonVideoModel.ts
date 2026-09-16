import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'
import { resolveStorageUrl } from './helpers/resolveStorageUrl'
import { VideoProvider } from '~/types/course.type'

class LessonVideo extends Model<InferAttributes<LessonVideo>, InferCreationAttributes<LessonVideo>> {
    declare id: CreationOptional<string>
    declare lesson_id: string
    declare thumbnail_path: string
    declare video_path: string
    declare video_provider: VideoProvider
    declare video_id: string | null
    declare duration: number
    declare created_at?: Date
    declare updated_at?: Date

    /**
     * Virtual fields
     */
    declare thumbnail_url: string | null
    declare video_url: string | null

    static associate(models: any) {
        this.belongsTo(models.Lesson, { foreignKey: 'lesson_id', as: 'lesson' })
    }
}

LessonVideo.init(
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
        thumbnail_path: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return undefined
            },
        },
        thumbnail_url: {
            type: DataTypes.VIRTUAL,
            allowNull: true,
            get() {
                return resolveStorageUrl(this.getDataValue('thumbnail_path'))
            },
        },
        video_path: {
            // this path for upload file path
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                return undefined
            },
        },
        video_url: {
            type: DataTypes.VIRTUAL,
            allowNull: true,
            get() {
                const provider = this.getDataValue('video_provider')
                const path = this.getDataValue('video_path')

                switch (provider) {
                    case 'UPLOAD':
                        return resolveStorageUrl(path)
                    case 'YOUTUBE':
                        return `https://www.youtube.com/watch?v=${this.getDataValue('video_id')}`
                }
            },
        },
        video_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        video_provider: {
            type: DataTypes.ENUM('UPLOAD', 'YOUTUBE'),
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'lesson_videos',
        sequelize,
    },
)

export default LessonVideo
