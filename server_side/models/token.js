
module.exports = (sequelize, DataTypes) => {
  const token = sequelize.define('token', {
    token: DataTypes.STRING.BINARY,
    expiredAt: DataTypes.STRING.BINARY,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  token.associate = function (models) {
    // associations can be defined here
    token.hasMany(models.account, { as: 'Tokens', foreignKey: 'tokenId', sourceKey: 'id' });
  };
  return token;
};
