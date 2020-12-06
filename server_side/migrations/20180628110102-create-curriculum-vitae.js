'use strict';
const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('curriculumVitaes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      profileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'profiles',
          key: 'id',
        },
      },
      typeObjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'typeObjects',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT
      },
      priority: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      company: {
        type: Sequelize.STRING
      },
      from: {
        type: Sequelize.STRING
      },
      to: {
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('curriculumVitaes');
  }
};