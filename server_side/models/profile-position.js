'use strict';
module.exports = (sequelize, DataTypes) => {
  var profilePosition = sequelize.define('profilePosition', {
    profileId: DataTypes.INTEGER,
    positionId: DataTypes.INTEGER,
    parentInChart: DataTypes.INTEGER,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  profilePosition.associate = function(models) {
    profilePosition.belongsTo(models.profile, { as: 'Profile', foreignKey: 'profileId', targetKey: 'id' });
    profilePosition.belongsTo(models.position, { foreignKey: 'positionId', targetKey: 'id' });
  };

  //SELECT pp1.*, COUNT(pp2.parentInChart) as 'childnumber' FROM profilePositions pp1 LEFT JOIN profilePositions pp2 ON pp1.id = pp2.parentInChart WHERE pp1.profileId = 34 AND pp1.positionId = 13 GROUP BY pp1.id
  profilePosition.loadProfilePositionDetail = function (profilePositionId) {
    let query = `CALL loadProfilePositionDetail(${profilePositionId});`;

    return sequelize.query(query).then((result) => {
      return result;
    });
  };


  return profilePosition;
};