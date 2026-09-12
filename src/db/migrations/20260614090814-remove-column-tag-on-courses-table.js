'use strict'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { v7: uuidv7 } = require('uuid')

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
                await queryInterface.addColumn(
                    'courses',
                    'tag_id',
                    {
                        type: Sequelize.UUID,
                        allowNull: true,
                    },
                    {
                        transaction: t,
                    },
                )

                const [courses] = await queryInterface.sequelize.query(
                    `SELECT id, tag FROM courses WHERE tag IS NOT NULL`,
                    {
                        transaction: t,
                    },
                )

                const groupedByTag = { ...Object.groupBy(courses, (course) => course.tag) }

                for (const key in groupedByTag) {
                    const tagId = uuidv7()

                    await queryInterface.sequelize.query(
                        `INSERT INTO course_tags (id, name) VALUES ('${tagId}', '${key}')`,
                        {
                            transaction: t,
                        },
                    )

                    for (let i = 0; i < groupedByTag[key].length; i++) {
                        const id = groupedByTag[key][i].id

                        await queryInterface.sequelize.query(
                            `
                                UPDATE courses
                                SET tag_id = '${tagId}'
                                WHERE id = '${id}'
                            `,
                            {
                                transaction: t,
                            },
                        )
                    }
                }

                await queryInterface.changeColumn(
                    'courses',
                    'tag_id',
                    {
                        type: Sequelize.UUID,
                        allowNull: false,
                        references: {
                            model: 'course_tags',
                            key: 'id',
                        },
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                    },
                    {
                        transaction: t,
                    },
                )

                await queryInterface.removeColumn('courses', 'tag', {
                    transaction: t,
                })
            })

            // If the execution reaches this line, the transaction has been committed successfully
            // `result` is whatever was returned from the transaction callback (the `user`, in this case)
        } catch (error) {
            console.log('Migration failed: ', error)

            throw error

            // If the execution reaches this line, an error occurred.
            // The transaction has already been rolled back automatically by Sequelize!
        }
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.removeColumn('courses', 'tag_id')
        await queryInterface.sequelize.query('DELETE FROM course_tags')
    },
}
