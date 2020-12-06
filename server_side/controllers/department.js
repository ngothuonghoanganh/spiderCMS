const model = require('../config/model');
const helpers = require('../services/helpers');

function handleUpdate(res, department, fields) {
  return department
    .updateAttributes(fields)
    .then((updated) =>
      helpers.handleResponse(res, 'updateSuccess', { data: updated.dataValues })
    )
    .catch((err) =>
      helpers.handleResponse(res, 'error', { data: { error: err.name } })
    );
}

module.exports = {
  createOne(req, res) {
    if (!helpers.checkVariable(req.body.name)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.department
      .isExisted(req.body.name)
      .then((isDepartmentExisted) => {
        if (isDepartmentExisted) {
          return helpers.handleResponse(res, 'objectExisted');
        }

        return model.department
          .create(req.body)
          .then((newDepartment) =>
            helpers.handleResponse(res, 'insertSuccess', {
              data: newDepartment.dataValues,
            })
          )
          .catch((err) =>
            helpers.handleResponse(res, 'error', { data: { error: err.name } })
          );
      });
  },

  updateOne(req, res) {
    if (!helpers.checkVariable(req.body.departmentId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    if (!helpers.checkVariable(req.body.fields)) {
      return helpers.handleResponse(res, 'noData');
    }

    // required name.
    if (!helpers.checkVariable(req.body.fields.name.trim())) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.department
      .findById(req.body.departmentId)
      .then((department) => {
        let departmentName = req.body.fields.name.trim();
        if (!helpers.checkVariable(department)) {
          return helpers.handleResponse(res, 'notFound');
        }

        if (department.dataValues.name === departmentName) {
          return handleUpdate(res, department, req.body.fields);
        }

        return model.department
          .isExisted(departmentName)
          .then((isDepartmentExisted) => {
            if (isDepartmentExisted) {
              return helpers.handleResponse(res, 'objectExisted', {
                message: "department's name is existed",
              });
            }

            return handleUpdate(res, department, req.body.fields);
          });
      });
  },

  deleteOne(req, res) {
    if (!helpers.checkVariable(req.body.departmentId)) {
      return helpers.handleResponse(res, 'missingParams');
    }
    return model.department
      .isExistedById(req.body.departmentId)
      .then((isDepartmentExisted) => {
        if (!isDepartmentExisted) {
          return helpers.handleResponse(res, 'notFound');
        }

        return model.position
          .findAll({
            where: {
              departmentId: req.body.departmentId,
            },
          })
          .then((positions) => {
            if (!helpers.checkArray(positions)) {
              model.department.deleteOne(req.body.departmentId);

              return helpers.handleResponse(res, 'deleteSuccess');
            }

            const positionIds = [];

            positions.forEach((position) => {
              positionIds.push(position.dataValues.id);
            });

            return model.profilePosition
              .findAll({
                where: {
                  positionId: { $in: positionIds },
                },
              })
              .then((profilePositions) => {
                if (helpers.checkArray(profilePositions)) {
                  return helpers.handleResponse(res, 'isUsing');
                }

                return model.position
                  .destroy({
                    where: {
                      departmentId: req.body.departmentId,
                    },
                  })
                  .then(() => {
                    model.department.deleteOne(req.body.departmentId);

                    return helpers.handleResponse(res, 'deleteSuccess');
                  });
              });
          });
      });
  },

  getAll(req, res) {
    return model.department
      .findAll()
      .then((departments) =>
        helpers.handleResponse(res, 'getListSuccess', { data: departments })
      );
  },
};
