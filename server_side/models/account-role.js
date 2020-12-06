
module.exports = (sequelize, DataTypes) => {
  const accountRole = sequelize.define('accountRole', {
    accountId: DataTypes.INTEGER,
    roleId: DataTypes.INTEGER,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  accountRole.associate = function (models) {
    // associations can be defined here
    accountRole.belongsTo(models.account, { as: 'Account', foreignKey: 'accountId', targetKey: 'id' });
    accountRole.belongsTo(models.role, { as: 'Role', foreignKey: 'roleId', targetKey: 'id' });
  };

  accountRole.setRoles = function (accountId, roles) {
    // Delete all private account's role.
    return accountRole.destroy({
      where: {
        accountId,
      },
    })
      .then(() => {
        const arrPromise = [];

        roles.forEach((item) => {
          const promiseItem = accountRole.create({
            accountId,
            roleId: item,
          }).then(inserted => inserted.dataValues);

          arrPromise.push(promiseItem);
        });

        return Promise.all(arrPromise).then(results => results).catch(error => error);
      });
  };

  return accountRole;
};
