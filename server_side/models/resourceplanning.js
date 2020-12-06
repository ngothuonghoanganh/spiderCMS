'use strict';
module.exports = (sequelize, DataTypes) => {
  const resourcePlanning = sequelize.define('resourcePlanning', {
    profileId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
  }, {});
  resourcePlanning.associate = function (models) {
    // associations can be defined here
  };
  return resourcePlanning;
};