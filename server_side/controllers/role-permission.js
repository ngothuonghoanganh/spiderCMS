const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  getAllByRole(req, res) {
    if (!helpers.checkVariable(req.query.roleId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    const query = `CALL loadPermissionWithRole(${req.query.roleId});`;
    // console.log(query)

    return model.sequelize.query(query).then((results) => {
      if (!helpers.checkArray(results)) {
        return helpers.handleResponse(res, 'notFound');
      }

      let arrData = [];
      for (const item of results) {
        arrData.push(item);
      }

      return helpers.handleResponse(res, 'getListSuccess', {
        message: 'get role\'s permissions successfully',
        data: arrData
      });
    });
  },

  updateAllByRole(req, res) {
    if (!helpers.checkVariable(req.body.roleId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    if (!helpers.checkArray(req.body.rolePermissionsData)) {
      return helpers.handleResponse(res, 'noData');
    }

    const arrPromise = [];

    req.body.rolePermissionsData.forEach((record) => {
      const promiseItem = model.rolePermission.findOne({
        where: {
          roleId: record.roleId,
          permissionId: record.id,
        },
      }).then((rowFound) => {
        // Only spadmin can update permission spadmin.
        let isActive = record.isActive;
        if (record.permissionId === 1) {
          if (req.accountObj.dataValues.id === 1) {
            isActive = record.isActive;
          } else {
            isActive = 0;
          }
        }

        return rowFound.updateAttributes({
          isActive,
        }).then(updated => updated.dataValues);
      });

      arrPromise.push(promiseItem);
    });

    return Promise.all(arrPromise).then(results => helpers.handleResponse(res, 'updateSuccess', {
      data: results
    }));
  },
};