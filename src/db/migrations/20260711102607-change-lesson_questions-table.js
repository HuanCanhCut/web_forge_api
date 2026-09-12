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
                await queryInterface.removeColumn('lesson_questions', 'options', { transaction: t })
                await queryInterface.removeColumn('lesson_questions', 'answer', { transaction: t })
                await queryInterface.removeColumn('lesson_questions', 'question', { transaction: t })

                await queryInterface.addColumn(
                    'lesson_questions',
                    'option',
                    {
                        type: Sequelize.TEXT,
                        allowNull: false,
                    },
                    { transaction: t },
                )

                await queryInterface.addColumn(
                    'lesson_questions',
                    'is_correct',
                    {
                        type: Sequelize.BOOLEAN,
                        allowNull: false,
                        defaultValue: false,
                    },
                    { transaction: t },
                )

                await queryInterface.addColumn(
                    'lesson_questions',
                    'explanation',
                    {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                    { transaction: t },
                )
            })
        } catch (error) {
            console.log(error)
            throw error
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
                await queryInterface.addColumn(
                    'lesson_questions',
                    'options',
                    {
                        type: Sequelize.JSON,
                        allowNull: false,
                        defaultValue: '{}',
                    },
                    { transaction: t },
                )
                await queryInterface.addColumn(
                    'lesson_questions',
                    'answer',
                    {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    { transaction: t },
                )

                await queryInterface.addColumn(
                    'lesson_questions',
                    'question',
                    {
                        type: Sequelize.TEXT,
                        allowNull: false,
                    },
                    { transaction: t },
                )

                await queryInterface.removeColumn('lesson_questions', 'option', { transaction: t })
                await queryInterface.removeColumn('lesson_questions', 'is_correct', { transaction: t })
                await queryInterface.removeColumn('lesson_questions', 'explanation', { transaction: t })
            })
        } catch (error) {
            console.log(error)
            throw error
        }
    },
}
