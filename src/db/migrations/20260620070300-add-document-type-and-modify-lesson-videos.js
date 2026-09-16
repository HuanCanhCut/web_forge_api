'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add 'DOCUMENT' to the ENUM type of lessons
        await queryInterface.changeColumn('lessons', 'type', {
            type: Sequelize.ENUM('VIDEO', 'CODING', 'QUESTION', 'DOCUMENT'),
            allowNull: false,
            defaultValue: 'VIDEO',
        })

        // Ensure thumbnail_path in lesson_videos is NOT NULL
        await queryInterface.changeColumn('lesson_videos', 'thumbnail_path', {
            type: Sequelize.STRING,
            allowNull: false,
        })

        // Ensure video_path in lesson_videos is NOT NULL
        await queryInterface.changeColumn('lesson_videos', 'video_path', {
            type: Sequelize.STRING,
            allowNull: false,
        })
    },

    async down(queryInterface, Sequelize) {
        // Revert 'DOCUMENT' from the ENUM type of lessons
        await queryInterface.changeColumn('lessons', 'type', {
            type: Sequelize.ENUM('VIDEO', 'CODING', 'QUESTION'),
            allowNull: false,
            defaultValue: 'VIDEO',
        })

        // Revert thumbnail_path to its previous state (allowNull: false since migration 20260618124858)
        await queryInterface.changeColumn('lesson_videos', 'thumbnail_path', {
            type: Sequelize.STRING,
            allowNull: false,
        })

        // Revert video_path to its previous state (allowNull: false)
        await queryInterface.changeColumn('lesson_videos', 'video_path', {
            type: Sequelize.STRING,
            allowNull: false,
        })
    },
}
