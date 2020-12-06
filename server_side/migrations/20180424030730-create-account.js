
const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('accounts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    username: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING.BINARY,
    },
    password: {
      type: Sequelize.STRING.BINARY,
    },
    isLogin: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    profileId: {
      type: Sequelize.INTEGER,
      unique: true,
      references: {
        model: 'profiles',
        key: 'id',
      },
    },
    tokenId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'tokens',
        key: 'id',
      },
    },
    isActive: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
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

  down: queryInterface => queryInterface.dropTable('accounts'),
};
