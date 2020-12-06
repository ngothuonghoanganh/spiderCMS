
const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('activeMails', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    token: {
      type: Sequelize.STRING.BINARY,
    },
    accountId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'accounts',
        key: 'id',
      },
    },
    isUsed: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
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
  down: queryInterface => queryInterface.dropTable('activeMails'),
};
