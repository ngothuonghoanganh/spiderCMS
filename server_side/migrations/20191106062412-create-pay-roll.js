'use strict';
const helpers = require('../services/helpers')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('payRolls', {
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
      month: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      year: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      grossSalary: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      advancePayment: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      netSalary: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: helpers.getNow(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: helpers.getNow(),
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('payRolls');
  }
};