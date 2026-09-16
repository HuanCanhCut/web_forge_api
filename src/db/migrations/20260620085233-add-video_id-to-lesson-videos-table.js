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
        try {
            await queryInterface.sequelize.transaction(async (t) => {
                await queryInterface.addColumn('lesson_videos', 'video_id', {
                    type: Sequelize.STRING,
                    allowNull: true,
                })
                await queryInterface.changeColumn(
                    'lesson_videos',
                    'video_path',
                    {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    { transaction: t },
                )
            })
        } catch (error) {
            console.log(error)
            // transaction auto rollback here
        }
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        try {
            await queryInterface.sequelize.transaction(async (t) => {
                await queryInterface.removeColumn('lesson_videos', 'video_id')
                await queryInterface.changeColumn(
                    'lesson_videos',
                    'video_path',
                    {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    { transaction: t },
                )
            })
        } catch (error) {
            console.log(error)
            // transaction auto rollback here
        }
    },
}
