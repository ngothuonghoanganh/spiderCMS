'use strict';
module.exports = (sequelize, DataTypes) => {
  const groupSkill = sequelize.define(
    'groupSkill',
    {
      groupSkillName: DataTypes.STRING,
    },
    {}
  );
  groupSkill.associate = function(models) {
    groupSkill.hasMany(models.skillMatrix, {
      as: 'skillmatrix',
      foreignKey: 'groupSkillId',
      sourceKey: 'id',
    });

    groupSkill.hasMany(models.skill, {
      as: 'skill',
      foreignKey: 'groupSkillId',
      sourceKey: 'id',
    });
  };
  return groupSkill;
};
