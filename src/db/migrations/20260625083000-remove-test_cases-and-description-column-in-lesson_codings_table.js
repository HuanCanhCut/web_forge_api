'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('lesson_codings', 'test_cases')
        await queryInterface.removeColumn('lesson_codings', 'description')
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('lesson_codings', 'test_cases', {
            type: Sequelize.JSON,
            allowNull: false,
        })

        await queryInterface.addColumn('lesson_codings', 'description', {
            type: Sequelize.STRING,
            allowNull: true,
        })
    },
}
