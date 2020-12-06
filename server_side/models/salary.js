'use strict';
module.exports = (sequelize, DataTypes) => {
  const salary = sequelize.define('salary', {
    payrollId: DataTypes.INTEGER,
    basicSalary: DataTypes.DOUBLE,
    workingPayment: DataTypes.DOUBLE,
    overTimePayment: DataTypes.DOUBLE
  }, {});
  salary.associate = function(models) {
    // associations can be defined here
  };
  return salary;
};