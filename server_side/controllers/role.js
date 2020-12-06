const model = require('../config/model');
const helpers = require('../services/helpers');

function handleUpdate(res, role, fields) {
  return role.updateAttributes(fields)
    .then(updated => helpers.handleResponse(res, 'updateSuccess', { data: updated.dataValues }));
}

module.exports = {
  getAll(req, res) {
    model.role.findAll()
      .then((results) => {
        if (!helpers.checkVariable(results)) {
          return helpers.handleResponse(res, 'notFound');
        }

        const arrData = [];
        const arrPromise = [];

        results.forEach((element) => {
          const promiseItem = element.getAccountRoles()
            .then((accountRoles) => {
              if (!helpers.checkArray(accountRoles)) {
                return false;
              }

              return true;
            });

          arrPromise.push(promiseItem);
          arrData.push(element.dataValues);
        });

        return Promise.all(arrPromise).then((checkResults) => {
          let count = 0;

          checkResults.forEach((isUsing) => {
            arrData[count].isUsing = isUsing || false;
            count += 1;
          });
          let data =[];
          for (const arrdata of arrData) {
            if(arrdata.rolename !=='superadmin'){
              data.push(arrdata);
            }
          }
          return helpers.handleResponse(res, 'getListSuccess', { data: data });
        });
      });
  },

  getOneById(req, res) {
    if (!helpers.checkVariable(req.query.roleId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.role.findById(req.query.roleId)
      .then((result) => {
        if (!helpers.checkVariable(result)) {
          return helpers.handleResponse(res, 'notFound');
        }

        return helpers.handleResponse(res, 'getOneSuccess', { data: result.dataValues });
      });
  },

  getOneByName(req, res) {
    if (!helpers.checkVariable(req.query.roleName)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.role.findOne({
      where: {
        rolename: req.query.roleName,
      },
    })
      .then((result) => {
        if (!helpers.checkVariable(result)) {
          return helpers.handleResponse(res, 'notFound');
        }

        return helpers.handleResponse(res, 'getOneSuccess', { data: result.dataValues });
      });
  },

  createOne(req, res) {
    if (!helpers.checkVariable(req.body.rolename)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.role.isExisted(req.body.rolename)
      .then((isExisted) => {
        if (isExisted) {
          return helpers.handleResponse(res, 'objectExisted', { message: 'role name existed' });
        }

        model.role.create(req.body)
          .then((newRole) => {
            model.permission.findAll()
              .then((permissions) => {
                const arrPromise = [];

                permissions.forEach((permission) => {
                  const objectInsert = {
                    roleId: newRole.dataValues.id,
                    permissionId: permission.dataValues.id,
                    isActive: 0,
                  };

                  const promiseInsert = model.rolePermission.create(objectInsert)
                    .then(rolePermission => rolePermission.dataValues);

                  arrPromise.push(promiseInsert);
                });

                return Promise.all(arrPromise).then((results) => {
                  if (helpers.checkVariable(results)) {
                    return helpers.handleResponse(res, 'insertSuccess', { data: newRole.dataValues, message: 'create profile successfully' });
                  }
                });
              });
          });
      });
  },

  updateOne(req, res) {
    if (!helpers.checkVariable(req.body.roleId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    if (!helpers.checkVariable(req.body.fields)) {
      return helpers.handleResponse(res, 'noData');
    }

    return model.role.findById(req.body.roleId)
      .then((role) => {
        if (!helpers.checkVariable(role)) {
          return helpers.handleResponse(res, 'notFound');
        }

        if (helpers.checkVariable(req.body.fields.rolename)) {
          if (role.dataValues.rolename === req.body.fields.rolename) {
            return handleUpdate(res, role, req.body.fields);
          }
        }

        return model.role.isExisted(req.body.fields.rolename)
          .then((isRoleExisted) => {
            if (isRoleExisted) {
              return helpers.handleResponse(res, 'objectExisted', { message: 'role name existed' });
            }

            return handleUpdate(res, role, req.body.fields);
          });
      });
  },

  deleteOne(req, res) {
    if (!helpers.checkVariable(req.body.roleId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.role.findById(req.body.roleId)
      .then((role) => {
        if (!helpers.checkVariable(role)) {
          return helpers.handleResponse(res, 'notFound');
        }

        return model.rolePermission.destroy({
          where: {
            roleId: req.body.roleId,
          },
        }).then(() => role.destroy({ force: true })
          .then(() => helpers.handleResponse(res, 'deleteSuccess'))
          .catch(err => helpers.handleResponse(res, 'error', { message: 'can not delete this role', data: { error: err.name } })));
      });
  },
};
