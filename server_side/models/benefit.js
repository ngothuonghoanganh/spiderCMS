'use strict';
module.exports = (sequelize, DataTypes) => {
  const benefit = sequelize.define('benefits', {
    payrollId: DataTypes.INTEGER,
    bonus: DataTypes.DOUBLE,
    mealAllowance: DataTypes.DOUBLE,
    conveyanceAllowance: DataTypes.DOUBLE
  }, {});
  benefit.associate = function (models) {
    // associations can be defined here
  };
  return benefit;
};