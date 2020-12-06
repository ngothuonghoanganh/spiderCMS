
const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('roles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    rolename: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING.BINARY,
    },
    description: {
      type: Sequelize.STRING.BINARY,
    },
    level: {
      type: Sequelize.INTEGER,
      defaultValue: 3,
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
  down: queryInterface => queryInterface.dropTable('roles'),
};
