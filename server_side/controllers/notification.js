const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  async getAllNotifications(req, res) {
    try {
      // console.log(req)
      if (!helpers.checkVariable(req.query.profileId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      const arrNotification = await model.notification.findAll({
        where: {
          to: req.query.profileId
        },
        include: [{
          model: model.content,
          required: false,
          as: 'ContentRef',
          attributes: ['id', 'title', 'teaser', 'description', 'type', 'content'],
        }, ],
      });
      // console.log(arrNotification)

      return helpers.handleResponse(res, 'getListSuccess', {
        data: arrNotification
      });
    } catch (error) {
      console.log(error)
    }
  },
};