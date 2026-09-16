'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('courses', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.UUID,
            },
            category_id: {
                allowNull: true,
                type: Sequelize.UUID,
                references: {
                    model: 'course_categories',
                    key: 'id',
                },
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            },
            level: {
                allowNull: false,
                type: Sequelize.ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED'),
            },
            description: {
                allowNull: false,
                type: Sequelize.TEXT,
            },
            thumbnail_path: {
                allowNull: true,
                type: Sequelize.STRING(255),
            },
            status: {
                allowNull: false,
                type: Sequelize.ENUM('PUBLISHED', 'ARCHIVED'),
                defaultValue: 'PUBLISHED',
            },
            sort_order: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            slug: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            },
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('courses')
    },
}
