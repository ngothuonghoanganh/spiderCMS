const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  getPermissionsGroup(req, res) {
    model.permissionGroup.findAll()
      .then((groups) => {
        const arrGroup = [];
        const arrPromise = [];

        groups.forEach((group) => {
          const promiseItem = group.getPermissions().then((permissions) => {
            const arrPermission = [];
            permissions.forEach((permission) => {
              arrPermission.push(permission.dataValues);
            });

            return arrPermission;
          });

          arrPromise.push(promiseItem);

          arrGroup.push(group.dataValues);
        });

        return Promise.all(arrPromise).then((results) => {
          let count = 0;
          arrGroup.forEach((group) => {
            group.permissions = results[count];
            count += 1;
          });

          return helpers.handleResponse(res, 'getListSuccess', { data: arrGroup, message: 'get group succesfully' });
        });
      });
  },

  getAll(req, res) {
    model.permissionGroup.findAll()
      .then((results) => {
        const arrData = [];
        results.forEach((group) => {
          arrData.push(group.dataValues);
        });
        return helpers.handleResponse(res, 'getListSuccess', { data: arrData, message: 'get group succesfully' });
      });
  },

  getOne(req, res) {
    if (!helpers.checkVariable(req.query.groupId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.permissionGroup.findById(req.query.groupId)
      .then((group) => {
        if (!helpers.checkVariable(group)) {
          return helpers.handleResponse(res, 'notFound');
        }

        return helpers.handleResponse(res, 'getOneSuccess', { data: group.dataValues, message: 'get group succesfully' });
      });
  },
};
