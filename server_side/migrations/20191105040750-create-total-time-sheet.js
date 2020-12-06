'use strict';
const helpers = require('../services/helpers');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('totalTimeSheets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      totalWorkingHours: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      totalOverTimeHours: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      totalHours: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      workDay: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      dayMustWork: {
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
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('totalTimeSheets');
  },
};
