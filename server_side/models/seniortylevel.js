'use strict';
module.exports = (sequelize, DataTypes) => {
  const seniortyLevel = sequelize.define('seniortyLevel', {
    spicingId: DataTypes.INTEGER,
    levelName: DataTypes.INTEGER

  }, {});
  seniortyLevel.associate = function(models) {
    // associations can be defined here

  };
  return seniortyLevel;
};