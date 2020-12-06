'use strict';
module.exports = (sequelize, DataTypes) => {
  const leaveManagement = sequelize.define('leaveManagement', {
    profileId: DataTypes.INTEGER,
    startDate: DataTypes.INTEGER,
    endDate: DataTypes.INTEGER,
    reason: DataTypes.STRING,
    dayOff: DataTypes.INTEGER,
    approveLeaveRequest: DataTypes.BOOLEAN
  }, {});
  leaveManagement.associate = function (models) {
    // associations can be defined here
  };
  return leaveManagement;
};