'use strict';
module.exports = (sequelize, DataTypes) => {
  const project = sequelize.define('project', {
    projectName: DataTypes.STRING,
    clientId: DataTypes.INTEGER,
    projectType: DataTypes.STRING,
    startDate: DataTypes.INTEGER,
    endDate: DataTypes.INTEGER
  }, {});
  project.associate = function (models) {
    // associations can be defined here
    project.hasMany(models.resourcePlanning, {
      as: 'resourceplannings',
      foreignKey: 'projectId',
      sourceKey: 'id',
    });

    project.belongsTo(models.client, {
      foreignKey: 'clientId',
      sourceKey: 'id',
    });
  };
  return project;
};