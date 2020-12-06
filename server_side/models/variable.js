
module.exports = (sequelize, DataTypes) => {
  const variable = sequelize.define('variable', {
    key: DataTypes.STRING.BINARY,
    data: DataTypes.TEXT,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  variable.associate = function (models) {
    // associations can be defined here
  };
  return variable;
};
