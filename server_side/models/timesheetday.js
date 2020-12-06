'use strict';
module.exports = (sequelize, DataTypes) => {
  const timeSheetDay = sequelize.define(
    'timeSheetDay',
    {
      profileId: DataTypes.INTEGER,
      date: DataTypes.INTEGER,
      project: DataTypes.STRING,
      task: DataTypes.STRING,
      workingHours: DataTypes.DOUBLE,
      overTimeHours: DataTypes.DOUBLE,
      totalHours: DataTypes.DOUBLE,
      note: DataTypes.STRING,
      createdAt: DataTypes.INTEGER,
      updatedAt: DataTypes.INTEGER,
    },
    {}
  );
  timeSheetDay.associate = function(models) {
    // associations can be defined here
  };
  return timeSheetDay;
};
