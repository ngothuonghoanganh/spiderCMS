

const _ = require('underscore');

module.exports = (sequelize, DataTypes) => {
  const position = sequelize.define('position', {
    name: DataTypes.STRING.BINARY,
    key: DataTypes.STRING.BINARY,
    description: DataTypes.TEXT,
    level: DataTypes.INTEGER,
    departmentId: DataTypes.INTEGER,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  position.associate = function (models) {
    // associations can be defined here
    position.belongsTo(models.department, { as: 'Department', foreignKey: 'departmentId', targetKey: 'id' });
    position.hasMany(models.profilePosition, { as: 'ProfilePositions', foreignKey: 'positionId', sourceKey: 'id' });
  };

  position.isExisted = function (key, departmentId) {
    return new Promise(result => position.findOne({
      where: {
        key,
        departmentId,
      },
    }).then((row) => {
      if (_.isNull(row) || _.isUndefined(row)) {
        result(false);
      }
      result(true);
    }));
  };

  position.isExistedById = function (positionId) {
    return new Promise(result => position.findOne({
      where: {
        id: positionId,
      },
    }).then((row) => {
      if (_.isNull(row) || _.isUndefined(row)) {
        result(false);
      }
      result(true);
    }));
  };

  return position;
};
