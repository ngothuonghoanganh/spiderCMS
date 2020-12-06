
const _ = require('underscore');

module.exports = (sequelize, DataTypes) => {
  const account = sequelize.define('account', {
    username: DataTypes.STRING.BINARY,
    password: DataTypes.STRING.BINARY,
    isLogin: DataTypes.INTEGER,
    profileId: DataTypes.INTEGER,
    tokenId: DataTypes.INTEGER,
    isActive: DataTypes.INTEGER,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  account.associate = function (models) {
    // associations can be defined here
    account.belongsTo(models.profile, { as: 'Profile', foreignKey: 'profileId', targetKey: 'id' });
    account.belongsTo(models.token, { as: 'Token', foreignKey: 'tokenId', targetKey: 'id' });
    account.hasMany(models.accountPermission, { as: 'AccountPermissions', foreignKey: 'accountId', sourceKey: 'id' });
    account.hasMany(models.activeMail, { as: 'ActiveEmails', foreignKey: 'accountId', sourceKey: 'id' });
    account.hasMany(models.accountRole, { as: 'AccountRoles', foreignKey: 'accountId', sourceKey: 'id' });
  };

  account.isExisted = function (username) {
    return new Promise(result => account.findOne({
      where: {
        username,
      },
    }).then((row) => {
      if (_.isNull(row) || _.isUndefined(row)) {
        result(false);
      }
      result(true);
    }));
  };

  account.isExistedById = function (accountId) {
    return new Promise(result => account.findById(accountId)
      .then((row) => {
        if (_.isNull(row) || _.isUndefined(row)) {
          result(false);
        }
        result(true);
      }));
  };

  return account;
};
