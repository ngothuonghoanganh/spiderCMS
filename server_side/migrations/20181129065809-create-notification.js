const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('notifications', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    from: {
      type: Sequelize.STRING,
    },
    to: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'profiles',
        key: 'id',
      },
    },
    content: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'contents',
        key: 'id',
      },
    },
    type: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'typeObjects',
        key: 'id',
      },
    },
    isRead: {
      type: Sequelize.INTEGER,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Notifications'),
};
