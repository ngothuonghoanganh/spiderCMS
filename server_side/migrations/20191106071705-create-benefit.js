'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('benefits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      payrollId: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      bonus: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      mealAllowance: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      conveyanceAllowance: {
        allowNull: true,
        type: Sequelize.DOUBLE
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
    return queryInterface.dropTable('benefits');
  }
};