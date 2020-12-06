'use strict';

const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('positions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING.BINARY
      },
      key: {
        type: Sequelize.STRING.BINARY
      },
      description: {
        type: Sequelize.TEXT
      },
      level: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      departmentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'departments',
          key: 'id',
        },
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
    return queryInterface.dropTable('positions');
  }
};