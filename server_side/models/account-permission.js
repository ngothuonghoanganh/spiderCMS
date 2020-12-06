
module.exports = (sequelize, DataTypes) => {
  const accountPermission = sequelize.define('accountPermission', {
    accountId: DataTypes.INTEGER,
    permissionId: DataTypes.INTEGER,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  accountPermission.associate = function (models) {
    // associations can be defined here
    accountPermission.belongsTo(models.account, { as: 'Account', foreignKey: 'accountId', targetKey: 'id' });
    accountPermission.belongsTo(models.permission, { as: 'Permission', foreignKey: 'permissionId', targetKey: 'id' });
  };
  return accountPermission;
};
