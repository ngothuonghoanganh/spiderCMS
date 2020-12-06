
module.exports = (sequelize, DataTypes) => {
  const notification = sequelize.define('notification', {
    from: DataTypes.STRING,
    to: DataTypes.INTEGER,
    content: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    isRead: DataTypes.INTEGER,
    createdAt: DataTypes.STRING,
    updatedAt: DataTypes.STRING,
  }, {
    timestamps: false,
  });
  notification.associate = function (models) {
    // associations can be defined here
    notification.belongsTo(models.profile, { as: 'Profile', foreignKey: 'to', targetKey: 'id' });
    notification.belongsTo(models.content, { as: 'ContentRef', foreignKey: 'content', targetKey: 'id' });
    notification.belongsTo(models.typeObject, { foreignKey: 'type', targetKey: 'id' });
  };
  return notification;
};
