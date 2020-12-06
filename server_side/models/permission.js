
module.exports = (sequelize, DataTypes) => {
  const permission = sequelize.define('permission', {
    name: DataTypes.STRING.BINARY,
    description: DataTypes.STRING.BINARY,
    permissionGroupId: DataTypes.INTEGER,
    label: DataTypes.STRING.BINARY,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  permission.associate = function (models) {
    // associations can be defined here
    permission.belongsTo(models.permissionGroup, { as: 'PermissionGroup', foreignKey: 'permissionGroupId', targetKey: 'id' });
    permission.hasMany(models.accountPermission, { as: 'AccountPermissions', foreignKey: 'permissionId', sourceKey: 'id' });
    permission.hasMany(models.rolePermission, { as: 'RolePermissions', foreignKey: 'permissionId', sourceKey: 'id' });
  };
  return permission;
};
