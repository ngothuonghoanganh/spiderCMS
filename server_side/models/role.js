
const _ = require('underscore');

module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('role', {
    rolename: DataTypes.STRING.BINARY,
    description: DataTypes.STRING.BINARY,
    level: DataTypes.INTEGER,
    label: DataTypes.STRING.BINARY,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  role.associate = function (models) {
    // associations can be defined here
    // role.hasMany(models.account, {as: 'Accounts', foreignKey: 'roleId', sourceKey: 'id'});
    role.hasMany(models.rolePermission, { as: 'RolePermissions', foreignKey: 'roleId', sourceKey: 'id' });
    role.hasMany(models.accountRole, { as: 'AccountRoles', foreignKey: 'roleId', sourceKey: 'id' });
  };

  role.isExisted = function (name) {
    return new Promise(result => role.findOne({
      where: {
        rolename: name,
      },
    }).then((row) => {
      if (_.isNull(row) || _.isUndefined(row)) {
        result(false);
      }

      result(true);
    }));
  };

  return role;
};
