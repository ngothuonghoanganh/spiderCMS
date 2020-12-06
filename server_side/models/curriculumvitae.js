'use strict';
module.exports = (sequelize, DataTypes) => {
  var curriculumVitae = sequelize.define('curriculumVitae', {
    profileId: DataTypes.INTEGER,
    typeObjectId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    priority: DataTypes.INTEGER,
    company: DataTypes.STRING,
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  curriculumVitae.associate = function(models) {
    // associations can be defined here
    curriculumVitae.belongsTo(models.typeObject, {foreignKey: 'typeObjectId', targetKey: 'id' });
    curriculumVitae.belongsTo(models.profile, {foreignKey: 'profileId', targetKey: 'id' });
  };
  return curriculumVitae;
};