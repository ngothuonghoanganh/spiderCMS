'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('resourcePlannings', {
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
      projectId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'projects',
          key: 'id',
        },
      },
      month: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      year: {
        allowNull: true,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('resourcePlannings');
  }
};