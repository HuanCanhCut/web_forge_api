'use strict'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { v7: uuidv7 } = require('uuid')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'course_categories',
            [
                {
                    id: uuidv7(),
                    name: 'HTML & CSS',
                },
                {
                    id: uuidv7(),
                    name: 'JavaScript',
                },
                {
                    id: uuidv7(),
                    name: 'TypeScript',
                },
                {
                    id: uuidv7(),
                    name: 'React',
                },
                {
                    id: uuidv7(),
                    name: 'Next.js',
                },
                {
                    id: uuidv7(),
                    name: 'Express.js',
                },
            ],
            {
                ignoreDuplicates: true,
            },
        )
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('course_categories', null, {})
    },
}
