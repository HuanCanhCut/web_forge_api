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

        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: '',
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: '',
            },
            nickname: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: '',
                unique: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            avatar_path: {
                type: Sequelize.STRING,
                allowNull: true,
                defaultValue: null,
            },
            password: {
                type: Sequelize.TEXT,
                allowNull: false,
                defaultValue: '',
            },
            role: {
                type: Sequelize.ENUM('admin', 'user'),
                allowNull: false,
                defaultValue: 'user',
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            is_blocked: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            blocked_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: null,
            },
            blocked_by: {
                type: Sequelize.UUID,
                allowNull: true,
                defaultValue: null,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            },
            blocked_reason: {
                type: Sequelize.TEXT,
                allowNull: true,
                defaultValue: null,
            },
            sign_in_provider: {
                type: Sequelize.ENUM('email', 'google.com', 'github.com'),
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
        await queryInterface.dropTable('users')
    },
}
