import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'
import Chapter from './ChapterModel'
import LessonCoding from './LessonCodingModel'
import LessonQuestion from './LessonQuestionModel'
import LessonVideo from './LessonVideoModel'
import UserLessonCode from './UserLessonCodeModel'
import { LESSON_TYPE, type LessonType } from '~/types/lesson.type'

class Lesson extends Model<InferAttributes<Lesson>, InferCreationAttributes<Lesson>> {
    declare id: CreationOptional<string>
    declare chapter_id: string
    declare uploaded_by: string
    declare title: string
    declare content: string
    declare order: CreationOptional<number>
    declare type: CreationOptional<LessonType>
    declare created_at?: Date
    declare updated_at?: Date

    /**
     *
     * Virtual fields
     */

    declare video?: LessonVideo | null
    declare coding?: LessonCoding | null
    declare answers?: LessonQuestion[] | null
    declare user_codes?: UserLessonCode[] | null
    declare chapter?: Chapter | null

    declare prev_lesson_id?: CreationOptional<string | null>
    declare next_lesson_id?: CreationOptional<string | null>

    static associate(models: any) {
        this.belongsTo(models.Chapter, { foreignKey: 'chapter_id', as: 'chapter' })
        this.belongsTo(models.User, { foreignKey: 'uploaded_by', as: 'uploader' })
        this.hasOne(models.LessonVideo, { foreignKey: 'lesson_id', as: 'video' })
        this.hasOne(models.LessonCoding, { foreignKey: 'lesson_id', as: 'coding' })
        this.hasMany(models.LessonQuestion, { foreignKey: 'lesson_id', as: 'answers' })
        this.hasMany(models.UserLessonCode, { foreignKey: 'lesson_id', as: 'user_codes' })
        this.hasOne(models.UserLessonProgress, { foreignKey: 'lesson_id', as: 'progress' })
    }
}

Lesson.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv7,
        },
        chapter_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'chapters',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        uploaded_by: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        type: {
            type: DataTypes.ENUM(...Object.values(LESSON_TYPE)),
            allowNull: false,
            defaultValue: 'VIDEO',
        },
    },
    {
        tableName: 'lessons',
        sequelize,
    },
)

export default Lesson
