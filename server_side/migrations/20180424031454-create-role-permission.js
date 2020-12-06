
const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('rolePermissions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    roleId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'roles',
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
    description: {
      type: Sequelize.STRING.BINARY,
    },
    isActive: {
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
  down: queryInterface => queryInterface.dropTable('rolePermissions'),
};
