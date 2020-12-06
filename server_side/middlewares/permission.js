const model = require('../config/model');
const helpers = require('../services/helpers');
const config = require('../config/const');
var lruCache = require('../cache/lru-cache');

module.exports = {
  getAccountPermissions(req, res, next) {
    if (config.arrPassToken.indexOf(req.params.key) !== -1) {
      return next('route');
    }

    var account = req.accountObj;

    return new Promise((resolve) => {
      if (Array.isArray(account.dataValues.permissions)) {
        resolve(account);
      } else {
        const query = `CALL loadAccountPermissionByAccountId(${account.dataValues.id});`;

        return model.sequelize.query(query).then((results) => {
          const arrAccountPermissions = [];

          if (helpers.checkArray(results)) {
            results.forEach((item) => {
              arrAccountPermissions.push(item.name);
            });
          }

          account.dataValues.permissions = arrAccountPermissions;
          resolve(account);
        });
      }
    }).then((account) => {
      if (helpers.checkArray(account.dataValues.rolePermissions)) {
        return next('route');
      } else {
        const query2 = `CALL loadAccountRolePermissionByAccountId(${account.dataValues.id});`;

        return model.sequelize.query(query2).then((results2) => {
          const arrRolePermissions = [];

          if (helpers.checkArray(results2)) {
            results2.forEach((item) => {
              arrRolePermissions.push(item.name);
            });
          }

          account.dataValues.rolePermissions = arrRolePermissions;

          let token = req.accountTOken;
          lruCache.update(token, account);

          return next('route');
        });
      }
    });
  },

  checkPermission(req, res, next, dataChecking) {
    if (helpers.checkVariable(req.accountObj)) {
      if (!helpers.checkArray(dataChecking)) {
        return next();
      }

      if (
        helpers.isContainArray(
          req.accountObj.dataValues.rolePermissions,
          dataChecking
        ) ||
        helpers.isContainArray(
          req.accountObj.dataValues.permissions,
          dataChecking
        )
      ) {
        return next();
      }

      return helpers.handleResponse(res, 'noPermission', {
        message: 'you have no permission to access this feature',
      });
    }

    return next();
  },
};
