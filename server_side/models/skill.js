'use strict';
module.exports = (sequelize, DataTypes) => {
  const skill = sequelize.define('skill', {
    skillName: DataTypes.STRING,
    groupSkillId: DataTypes.INTEGER
  }, {});
  skill.associate = function(models) {
    skill.hasMany(models.skillMatrix, {
      as: 'skillmatrix',
      foreignKey: 'skillId',
      sourceKey: 'id',
    });
  };
  return skill;
};