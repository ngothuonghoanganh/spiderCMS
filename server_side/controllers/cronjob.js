const helpers = require('../services/helpers');
const cron = require('../jobs/cron');

module.exports = {
  resetJob(req, res) {
    if (!helpers.checkVariable(req.query.key)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    cron.restartTask(req.query.key);

    return helpers.handleResponse(res, 'restartSuccess');
  },
};
