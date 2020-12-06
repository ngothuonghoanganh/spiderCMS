
const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('accountRoles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    accountId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'accounts',
        key: 'id',
      },
    },
    roleId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'roles',
        key: 'id',
      },
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
  down: queryInterface => queryInterface.dropTable('accountRoles'),
};
