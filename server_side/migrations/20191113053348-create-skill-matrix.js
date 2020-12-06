'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('skillMatrices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      profileId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'profiles',
          key: 'id',
        }
      },
      skillId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'skills',
          key: 'id',
        }
      },
      groupSkillId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'groupSkills',
          key: 'id',
        }
      },
      level: {
        allowNull: true,
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('skillMatrices');
  }
};