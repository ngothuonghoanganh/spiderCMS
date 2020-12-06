'use strict';
module.exports = (sequelize, DataTypes) => {
  const payRoll = sequelize.define('payRolls', {
    profileId: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    grossSalary: DataTypes.DOUBLE,
    advancePayment:DataTypes.DOUBLE,
    netSalary: DataTypes.DOUBLE,
  }, {});
  payRoll.associate = function (models) {

    payRoll.belongsTo(models.salary, {
      foreignKey: 'id',
      targetKey: 'payrollId'
    });
    payRoll.belongsTo(models.benefits, {
      foreignKey: 'id',
      targetKey: 'payrollId'
    });
  };
  return payRoll;
};