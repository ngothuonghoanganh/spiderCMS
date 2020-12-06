
const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('permissionGroups', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING.BINARY,
    },
    label: {
      allowNull: false,
      type: Sequelize.STRING.BINARY,
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
  down: queryInterface => queryInterface.dropTable('permissionGroups'),
};
