

module.exports = (sequelize, DataTypes) => {
  const permissionGroup = sequelize.define('permissionGroup', {
    name: DataTypes.STRING.BINARY,
    label: DataTypes.STRING.BINARY,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  permissionGroup.associate = function (models) {
    // associations can be defined here
    permissionGroup.hasMany(models.permission, { as: 'Permissions', foreignKey: 'permissionGroupId', sourceKey: 'id' });
  };
  return permissionGroup;
};
