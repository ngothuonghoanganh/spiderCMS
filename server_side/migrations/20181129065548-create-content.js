const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('contents', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
    },
    teaser: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'typeObjects',
        key: 'id',
      },
    },
    content: {
      type: Sequelize.TEXT,
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
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Contents'),
};
