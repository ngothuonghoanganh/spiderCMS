
module.exports = (sequelize, DataTypes) => {
  const content = sequelize.define('content', {
    title: DataTypes.STRING,
    teaser: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  content.associate = function (models) {
    // associations can be defined here
    content.belongsTo(models.typeObject, { foreignKey: 'type', targetKey: 'id' });
  };
  return content;
};
