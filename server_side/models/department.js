

const _ = require('underscore');

module.exports = (sequelize, DataTypes) => {
  const department = sequelize.define('department', {
    name: DataTypes.STRING.BINARY,
    description: DataTypes.TEXT,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  department.associate = function (models) {
    // associations can be defined here
    department.hasMany(models.position, { as: 'Positions', foreignKey: 'departmentId', sourceKey: 'id' });
  };

  department.isExisted = function (name) {
    return new Promise(result => department.findOne({
      where: {
        name,
      },
    }).then((row) => {
      if (_.isNull(row) || _.isUndefined(row)) {
        result(false);
      }
      result(true);
    }));
  };

  department.isExistedById = function (id) {
    return new Promise(result => department.findOne({
      where: {
        id,
      },
    }).then((row) => {
      if (_.isNull(row) || _.isUndefined(row)) {
        result(false);
      }
      result(true);
    }));
  };

  department.deleteOne = function (departmentId) {
    return department.destroy({
      where: {
        id: departmentId,
      },
    });
  };

  return department;
};
