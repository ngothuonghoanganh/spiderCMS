'use strict';
const helpers = require('../services/helpers');
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('timeSheetDays', {
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
      date: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      project: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      task: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      workingHours: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      overTimeHours: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      totalHours: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      note: {
        allowNull: true,
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('timeSheetDays');
  },
};
