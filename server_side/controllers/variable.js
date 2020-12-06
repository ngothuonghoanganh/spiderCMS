const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  setVariable(req, res) {
    if (!helpers.checkVariable(req.body.key)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.variable.findOrCreate({
      where: {
        key: req.body.key,
      },
      defaults: {
        data: req.body.data || '',
      },
    }).spread((variable, created) => {
      if (created) {
        return helpers.handleResponse(res, 'insertSuccess', { data: variable.dataValues });
      }

      return variable.updateAttributes({
        data: req.body.data || '',
      }).then(updated => helpers.handleResponse(res, 'updateSuccess', { data: updated.dataValues }));
    });
  },

  getVariable(req, res) {
    if (!helpers.checkVariable(req.body.key)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.variable.findOne({
      where: {
        key: req.body.key,
      },
    }).then((variable) => {
      if (!helpers.checkVariable(variable)) {
        return helpers.handleResponse(res, 'notFound');
      }

      return helpers.handleResponse(res, 'getOneSuccess', { data: variable.dataValues });
    });
  },
};
