'use strict';
module.exports = (sequelize, DataTypes) => {
  const rates = sequelize.define('rates', {
    spicingId: DataTypes.INTEGER,
    levelId: DataTypes.INTEGER,
    hourPrice: DataTypes.INTEGER,
    monthprice: DataTypes.INTEGER,
  }, {});
  rates.associate = function (models) {
    // associations can be defined here
  };
  return rates;
};