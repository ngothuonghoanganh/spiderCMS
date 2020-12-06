'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('leaveManagements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      profileId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'profiles',
          key: 'id',
        },
      },
      startDate: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      endDate: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      reason: {
        allowNull: true,
        type: Sequelize.STRING
      },
      dayOff: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      approveLeaveRequest: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('leaveManagements');
  }
};