'use strict';
const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('typeObjects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      objectUse: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
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
    }).then(() => {
      return queryInterface.addConstraint('typeObjects',  ['objectUse', 'name'], {
        type: 'unique',
        name: 'unique_objectUse_name'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('typeObjects');
  }
};