'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clientId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'clients',
          key: 'id',
        },
      },
      projectName: {
        allowNull: true,
        type: Sequelize.STRING
      },
      projectType: {
        allowNull: true,
        type: Sequelize.STRING
      },
      startDate: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      endDate: {
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
    return queryInterface.dropTable('projects');
  }
};