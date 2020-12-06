
module.exports = (sequelize, DataTypes) => {
  const activeMail = sequelize.define('activeMail', {
    token: DataTypes.STRING.BINARY,
    accountId: DataTypes.INTEGER,
    isUsed: DataTypes.INTEGER,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  activeMail.associate = function (models) {
    // associations can be defined here
    activeMail.belongsTo(models.account, { as: 'Account', foreignKey: 'accountId', targetKey: 'id' });
  };
  return activeMail;
};
