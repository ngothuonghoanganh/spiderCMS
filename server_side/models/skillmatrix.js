'use strict';
module.exports = (sequelize, DataTypes) => {
  const skillMatrix = sequelize.define('skillMatrix', {
    profileId: DataTypes.INTEGER,
    profileId: DataTypes.INTEGER,
    groupSkillId: DataTypes.INTEGER,
    skillId: DataTypes.INTEGER,
    level: DataTypes.INTEGER
  }, {});
  skillMatrix.associate = function (models) {
    skillMatrix.belongsTo(models.skill, {
      foreignKey: 'id',
      sourceKey: 'skillId',
    });
    skillMatrix.belongsTo(models.groupSkill, {
      foreignKey: 'id',
      sourceKey: 'goupSkillId',
    });
    skillMatrix.hasMany(models.groupSkill, {
      as:'groupskill',
      foreignKey: 'id',
      sourceKey: 'goupSkillId',
    });
  };
  return skillMatrix;
};