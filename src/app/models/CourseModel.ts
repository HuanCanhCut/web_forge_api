import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize'
import { v7 as uuidv7 } from 'uuid'

import { sequelize } from '../../config/database'
import Chapter from './ChapterModel'
import { resolveStorageUrl } from './helpers/resolveStorageUrl'
import { COURSE_LEVELS, COURSE_STATUS, CourseLevel, CourseStatus } from '~/types/course.type'

class Course extends Model<InferAttributes<Course>, InferCreationAttributes<Course>> {
    declare id: CreationOptional<string>
    declare category_id: string | null
    declare tag_id: string
    declare level: CourseLevel
    declare title: string
    declare description: string
    declare detail: string | null
    declare thumbnail_path: string | null
    declare status: CreationOptional<CourseStatus>
    declare sort_order: CreationOptional<number>
    declare slug: string
    declare student_count: CreationOptional<number>
    declare created_by: string | null
    declare created_at?: Date
    declare updated_at?: Date

    /**
     * Virtual field
     */
    declare thumbnail_url: string | null
    declare is_joined?: boolean
    declare chapters?: Chapter[] | null

    static associate(models: any) {
        this.belongsTo(models.CourseCategory, { foreignKey: 'category_id', as: 'category' })
        this.belongsTo(models.CourseTag, { foreignKey: 'tag_id', as: 'tag' })
        this.belongsTo(models.User, { foreignKey: 'created_by', as: 'creator' })
        this.hasMany(models.UserCourse, { foreignKey: 'course_id', as: 'user_courses' })
        this.hasMany(models.Chapter, { foreignKey: 'course_id', as: 'chapters' })
    }
}

Course.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: uuidv7,
        },
        category_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'course_categories',
                key: 'id',
            },
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        },
        level: {
            type: DataTypes.ENUM(...Object.values(COURSE_LEVELS)),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        detail: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        thumbnail_path: {
            type: DataTypes.STRING(255),
            allowNull: true,
            get() {
                // Hide thumbnail_path from serialized output.
                // Use getDataValue('thumbnail_path') to access the raw value.
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
        status: {
            type: DataTypes.ENUM(...Object.values(COURSE_STATUS)),
            allowNull: false,
            defaultValue: 'PUBLISHED',
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 999,
        },
        slug: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        tag_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'course_tags',
                key: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        student_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        created_by: {
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

        // Virtual fields
        is_joined: {
            type: DataTypes.VIRTUAL,
            allowNull: true,
            get() {
                if (this.getDataValue('is_joined') === undefined) {
                    return undefined // Do not expose the field if it was not selected in the query.
                }

                return Boolean(this.getDataValue('is_joined'))
            },
        },
    },
    {
        tableName: 'courses',
        sequelize,
        defaultScope: {
            where: {
                status: 'PUBLISHED',
            },
        },
        indexes: [
            {
                type: 'FULLTEXT',
                fields: ['title', 'description'],
                name: 'idx_courses_title_description_ft',
            },
        ],
    },
)

export default Course
