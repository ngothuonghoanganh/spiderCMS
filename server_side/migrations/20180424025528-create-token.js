
const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('tokens', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    token: {
      type: Sequelize.STRING.BINARY,
    },
    expiredAt: {
      type: Sequelize.STRING.BINARY,
      defaultValue: helpers.getNow(),
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
  down: queryInterface => queryInterface.dropTable('tokens'),
};
