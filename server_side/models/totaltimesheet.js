'use strict';
module.exports = (sequelize, DataTypes) => {
  const totalTimeSheet = sequelize.define(
    'totalTimeSheets',
    {
      profileId: DataTypes.INTEGER,
      month: DataTypes.INTEGER,
      year: DataTypes.INTEGER,
      totalWorkingHours: DataTypes.DOUBLE,
      totalOverTimeHours: DataTypes.DOUBLE,
      totalHours: DataTypes.DOUBLE,
      workDay: DataTypes.DOUBLE,
      dayMustWork: DataTypes.DOUBLE,
    },
    {}
  );
  totalTimeSheet.associate = function(models) {
    // associations can be defined here
    totalTimeSheet.belongsTo(models.profile, {
      foreignKey: 'profileId',
      sourceKey: 'id',
    });
  };
  return totalTimeSheet;
};
