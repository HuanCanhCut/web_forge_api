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
        await queryInterface.addConstraint('user_lesson_codes', {
            fields: ['lesson_id', 'user_id', 'file_name'],
            type: 'unique',
            name: 'user_lesson_codes_lesson_id_user_id_file_name_unique',
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeConstraint(
            'user_lesson_codes',
            'user_lesson_codes_lesson_id_user_id_file_name_unique',
        )
    },
}
