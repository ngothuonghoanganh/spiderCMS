
module.exports = (sequelize, DataTypes) => {
  const rolePermission = sequelize.define('rolePermission', {
    roleId: DataTypes.INTEGER,
    permissionId: DataTypes.INTEGER,
    description: DataTypes.STRING.BINARY,
    isActive: DataTypes.INTEGER,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  rolePermission.associate = function (models) {
    // associations can be defined here
    rolePermission.belongsTo(models.role, { as: 'Role', foreignKey: 'roleId', targetKey: 'id' });
    rolePermission.belongsTo(models.permission, { as: 'Permission', foreignKey: 'permissionId', targetKey: 'id' });
  };
  return rolePermission;
};
