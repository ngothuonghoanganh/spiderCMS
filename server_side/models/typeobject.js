'use strict';
module.exports = (sequelize, DataTypes) => {
  var typeObject = sequelize.define('typeObject', {
    objectUse: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  typeObject.associate = function(models) {
    // associations can be defined here
    typeObject.hasMany(models.curriculumVitae, { as: 'CurriculumVitaes', foreignKey: 'typeObjectId', sourceKey: 'id' });
  };
  return typeObject;
};