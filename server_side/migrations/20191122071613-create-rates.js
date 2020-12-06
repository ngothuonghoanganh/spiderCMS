'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('rates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      spicingId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'spicingModels',
          key: 'id',
        },
      },
      levelId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'seniortyLevels',
          key: 'id',
        },
      },
      hourPrice: {
        type: Sequelize.INTEGER
      },
      monthprice: {
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
    return queryInterface.dropTable('rates');
  }
};