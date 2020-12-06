const model = require('../config/model');
const helpers = require('../services/helpers');
const config = require('../config/const');
var lruCache = require('../cache/lru-cache');

module.exports = {
  /**
   * Handle check token before routing.
   */
  checkToken(req, res, next) {
    if (config.arrPassToken.indexOf(req.params.key) !== -1) {
      return next('route');
    }

    const token = req.headers.token;
    const accountID = req.headers.accountid;

    // if have no token
    if (!helpers.checkVariable(token) || !helpers.checkVariable(accountID)) {
      return helpers.handleResponse(res, 'authen', { message: 'missing token or account id' });
    }

    var dataFromCache = lruCache.get(token);

    if (helpers.checkVariable(dataFromCache)) {
      let mapTokenAccount = lruCache.get(`accountID_${accountID}`);

      if (mapTokenAccount != token) {
        return helpers.handleResponse(res, 'authen', { message: 'wrong token or token is old' });
      }

      // if token is expired
      if (dataFromCache.tokenExpire <= helpers.getNow()) {
        return helpers.handleResponse(res, 'authen', { message: 'token expired' });
      }

      req.accountObj = dataFromCache;
      req.accountTOken = token;

      return next();
    } else {
      return model.token.findOne({
        where: {
          token,
        },
      }).then((row) => {
        if (!helpers.checkVariable(row)) {
          return helpers.handleResponse(res, 'authen', { message: 'not found this token' });
        }

        // if token is expired
        if (row.dataValues.expiredAt <= helpers.getNow()) {
          return helpers.handleResponse(res, 'authen', { message: 'token expired' });
        }

        // if token is wrong or token is old (need have account ID)
        return model.account.findById(accountID)
          .then((result) => {
            if (!helpers.checkVariable(result)) {
              return helpers.handleResponse(res, 'authen', { message: 'not found any account' });
            }

            if (row.dataValues.id !== result.dataValues.tokenId) {
              return helpers.handleResponse(res, 'authen', { message: 'wrong token or token is old' });
            }

            result.tokenExpire = row.dataValues.expiredAt;
            lruCache.set(row.dataValues.token, result);
            req.accountObj = result;
            req.accountTOken = row.dataValues.token;

            return next();
          });
      });
    }
  },
};
