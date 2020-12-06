'use strict';
module.exports = (sequelize, DataTypes) => {
  const client = sequelize.define('client', {
    clientName: DataTypes.STRING,
    taxCode: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    telephone: DataTypes.INTEGER,
    contactPoint: DataTypes.STRING,
  }, {});
  client.associate = function(models) {
    // associations can be defined here
  };
  return client;
};