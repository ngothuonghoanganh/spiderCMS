
const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('accountPermissions', {
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
    permissionId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'permissions',
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
  down: queryInterface => queryInterface.dropTable('accountPermissions'),
};
