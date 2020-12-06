'use strict';
module.exports = (sequelize, DataTypes) => {
  const spicingModel = sequelize.define('spicingModel', {
    spicingName: DataTypes.STRING
  }, {});
  spicingModel.associate = function(models) {
    // associations can be defined here
  };
  return spicingModel;
};