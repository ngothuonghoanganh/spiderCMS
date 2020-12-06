const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  setRoleForAccount(req, res) {
    if (!helpers.checkVariable(req.body.accountId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    if (!helpers.checkArray(req.body.roles)) {
      return helpers.handleResponse(res, 'noData');
    }

    return model.accountRole.setRoles(req.body.accountId, req.body.roles)
      .then(() => helpers.handleResponse(res, 'updateSuccess'));
  },

  getOne(req, res) {
    if (!helpers.checkVariable(req.query.accountId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.accountRole.findAll({
      where: {
        accountId: req.query.accountId,
      },
    }).then((results) => {
      const dataResult = [];

      if (helpers.checkArray(results)) {
        results.forEach((row) => {
          dataResult.push(row.dataValues.roleId);
        });
      }

      return helpers.handleResponse(res, 'getListSuccess', { data: dataResult });
    });
  },
};
