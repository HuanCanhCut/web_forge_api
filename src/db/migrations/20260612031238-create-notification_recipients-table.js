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
        await queryInterface.createTable('notification_recipients', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
            },
            notification_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'notifications',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            recipient_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            is_read: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_seen: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            seen_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            read_at: {
                type: Sequelize.DATE,
                allowNull: true,
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

        await queryInterface.addIndex('notification_recipients', ['recipient_id', 'is_read'])
        await queryInterface.addIndex('notification_recipients', ['recipient_id', 'is_seen'])
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('notification_recipients')
    },
}
