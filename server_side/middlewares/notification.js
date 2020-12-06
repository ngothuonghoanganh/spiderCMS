const model = require('../config/model');
const helpers = require('../services/helpers');
const config = require('../config/const');

module.exports = {
  getNotifications(req, res, next) {
    if (config.arrPassToken.indexOf(req.params.key) !== -1) {
      return next('route');
    }
    let profileId = req.accountObj.profileId;
    if (!helpers.checkVariable(profileId)) {
      return next();
    }
    
    return model.notification.findAll({
      where: {
        to: profileId
      },
      limit: config.limitLoadNotification,
      attributes: ['id', 'from', 'isRead', 'createdAt'],
      order: [['id', 'DESC']],
      include: [
        {
          model: model.content,
          required: false,
          as: 'ContentRef',
          attributes: ['id', 'title', 'teaser', 'description', 'type'],
        },
      ],
    }).then((notifications) => {
      if (!helpers.checkArray(notifications)) {
        return next();
      }
      res.notifications = [];
      notifications.forEach((notification) => {
        res.notifications.push(notification.dataValues);
      });
      
      return next();
    });
  },
};
