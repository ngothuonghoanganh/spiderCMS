const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  setPermissionForAccount(req, res) {
    if (!helpers.checkVariable(req.body.accountId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    if (!helpers.checkArray(req.body.permissions)) {
      return helpers.handleResponse(res, 'noData', {
        message: 'have no any permission to set',
      });
    }

    // Delete all private account's permission.
    model.accountPermission
      .destroy({
        where: {
          accountId: req.body.accountId,
        },
      })
      .then(() => {
        const arrObjectInsert = [];

        req.body.permissions.forEach((permission) => {
          arrObjectInsert.push({
            accountId: req.body.accountId,
            permissionId: permission,
          });
        });

        return model.accountPermission
          .bulkCreate(arrObjectInsert)
          .then(() => helpers.handleResponse(res, 'updateSuccess'))
          .catch((error) =>
            helpers.handleResponse(res, 'error', {
              error: error.name,
            })
          );
      });
  },

  async getCurrentAccountPermissions(req, res) {
    if (!helpers.checkVariable(req.query.accountId)) {
      return helpers.handleResponse(res, 'missingParams');
    }
    if (!(await model.account.isExistedById(req.query.accountId))) {
      return helpers.handleResponse(res, 'notFound');
    }
    const permissions = await model.permission.findAll();

    const arrayPermissions = [];
    permissions.forEach((permission) => {
      arrayPermissions.push(permission);
    });

    const accountPermissions = await model.accountPermission.findAll({
      where: {
        accountId: req.query.accountId,
      },
    });

    const arrayAccountPermissions = [];
    if (helpers.checkArray(accountPermissions)) {
      accountPermissions.forEach((accountPermission) => {
        arrayAccountPermissions.push(accountPermission.dataValues);
      });
    }

    const arrayOfPermission = [];
    arrayPermissions.forEach((permission) => {
      let accountPermissionFound = null;

      for (let i = 0; i < arrayAccountPermissions.length; i += 1) {
        if (permission.id === arrayAccountPermissions[i].permissionId) {
          accountPermissionFound = arrayAccountPermissions[i];
          break;
        }
      }

      const accountId = helpers.checkVariable(accountPermissionFound)
        ? accountPermissionFound.accountId
        : req.query.accountId;
      arrayOfPermission.push({
        accountId,
        id: permission.id,
        permissionName: permission.label,
        permissionGroupId: permission.permissionGroupId,
        isActive: helpers.checkVariable(accountPermissionFound) ? 1 : 0,
      });
    });

    const groupPermission = await model.permissionGroup.findAll();

    const arrayResponse = [];
    let permission = [];

    for (const groupPermissions of groupPermission) {
      arrayOfPermission.forEach((arrayOfPermissions) => {
        if (groupPermissions.id === arrayOfPermissions.permissionGroupId  && groupPermissions.name !== 'super admin') {
          permission.push(arrayOfPermissions);
        }
      });
      if(groupPermissions.name !== 'super admin'){
        arrayResponse.push({
          groupPermissionId: groupPermissions.id,
          groupPermissionName: groupPermissions.name,
          permission,
        });
      }
      permission = [];
    }
    return helpers.handleResponse(res, 'getListSuccess', {
      data: arrayResponse,
    });
  },
};
