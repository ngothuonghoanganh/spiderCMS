const helpers = require('../services/helpers');
const model = require('../config/model');
const pageSuccess = require('../config/server').activeMailSuccessPage;

module.exports = {
  activeAccount(req, res) {
    if (!helpers.checkVariable(req.query.enc)) {
      return helpers.handleResponse(res, 'badRequest', { message: 'not found any token' });
    }

    const query = `CALL activeEmail('${req.query.enc}')`;

    return model.sequelize.query(query).then(() => res.redirect(pageSuccess));
  },
};
