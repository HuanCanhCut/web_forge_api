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
        await queryInterface.createTable('lessons', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            chapter_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'chapters',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            uploaded_by: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            duration: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            order: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            type: {
                type: Sequelize.ENUM('VIDEO', 'CODING', 'QUESTION'),
                allowNull: false,
                defaultValue: 'VIDEO',
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
        await queryInterface.dropTable('chapter_lessons')
    },
}
