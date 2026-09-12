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
        await queryInterface.createTable('lesson_videos', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            lesson_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'lessons',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            thumbnail_path: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            video_path: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            video_provider: {
                type: Sequelize.ENUM('UPLOAD', 'YOUTUBE'),
                allowNull: false,
            },
            duration: {
                type: Sequelize.INTEGER,
                allowNull: false,
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
        await queryInterface.dropTable('lesson_videos')
    },
}
