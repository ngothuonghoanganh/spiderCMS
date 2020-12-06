const helpers = require('../services/helpers');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('profiles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    firstName: {
      type: Sequelize.STRING.BINARY,
    },
    lastName: {
      type: Sequelize.STRING.BINARY,
    },
    position: {
      type: Sequelize.STRING.BINARY,
    },
    skype: {
      type: Sequelize.STRING.BINARY,
    },
    birthday: {
      type: Sequelize.STRING.BINARY,
    },
    gender: {
      type: Sequelize.STRING.BINARY,
    },
    employeeType: {
      type: Sequelize.STRING,
    },
    phone: {
      allowNull:true,
      type: Sequelize.STRING.BINARY,
    },
    maritalStatus: {
      type: Sequelize.ENUM,
      defaultValue: 'single',
      values: ['single', 'married', 'divorced', 'widowed']
    },
    avatar: {
      type: Sequelize.STRING.BINARY,
    },
    startDate: {
      type: Sequelize.STRING.BINARY,
    },
    endDate: {
      type: Sequelize.STRING.BINARY,
    },
    email: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING.BINARY,
    },
    isActive: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    haveAccount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    isPromoted: {
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
  down: queryInterface => queryInterface.dropTable('profiles'),
};