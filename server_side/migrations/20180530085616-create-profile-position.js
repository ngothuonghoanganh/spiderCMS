'use strict';
const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('profilePositions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      profileId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'profiles',
          key: 'id',
        },
      },
      positionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'positions',
          key: 'id',
        },
      },
      parentInChart: {
        type: Sequelize.INTEGER,
        references: {
          model: 'profilePositions',
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
    }).then(() => {
      return queryInterface.addConstraint('profilePositions',  ['profileId', 'positionId'], {
        type: 'unique',
        name: 'unique_position_profile'
      })
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('profilePositions');
  }
};