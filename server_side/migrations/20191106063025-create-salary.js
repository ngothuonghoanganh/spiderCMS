'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('salaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      payrollId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'payRolls',
          key: 'id',
        },
      },
      basicSalary: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      workingPayment: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      overTimePayment: {
        allowNull: false,
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
    return queryInterface.dropTable('salaries');
  }
};