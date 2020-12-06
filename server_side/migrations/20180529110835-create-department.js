'use strict';
const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('departments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING.BINARY,
        unique: true
      },
      description: {
        type: Sequelize.TEXT
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
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('departments');
  }
};