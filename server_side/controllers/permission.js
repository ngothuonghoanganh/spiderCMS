const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  getOne(req, res) {
    if (!helpers.checkVariable(req.query.permissionId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.permission.findById(req.query.permissionId)
      .then((row) => {
        if (!helpers.checkVariable(row)) {
          return helpers.handleResponse(res, 'notFound', { message: 'not found any permission' });
        }

        return helpers.handleResponse(res, 'getListSuccess', { data: row.dataValues, message: 'get permission successfully' });
      });
  },

  createOne(req, res) {
    if (!helpers.checkVariable(req.body.name) || !helpers.checkVariable(req.body.description)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.permission.create({
      name: req.body.name,
      description: req.body.description,
    }).then((inserted) => {
      if (!helpers.checkVariable(inserted)) {
        return helpers.handleResponse(res, 'error');
      }

      return helpers.handleResponse(res, 'insertSuccess', { data: inserted.dataValues });
    });
  },

  deleteOne(req, res) {
    if (!helpers.checkVariable(req.body.permissionId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.permission.findById(req.body.permissionId)
      .then((row) => {
        if (!helpers.checkVariable(row)) {
          return helpers.handleResponse(res, 'notFound');
        }
        return row.destroy().then(() => helpers.handleResponse(res, 'deleteSuccess')); // ex: task.destroy({ force: true })
      });
  },

  updateOne(req, res) {
    if (!helpers.checkVariable(req.body.permissionId)
        || !helpers.checkVariable(req.body.name)
        || !helpers.checkVariable(req.body.description)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    model.permission.findById(req.body.permissionId)
      .then(row => row.updateAttributes({
        name: req.body.name,
        description: req.body.description,
      })).then(() => helpers.handleResponse(res, 'updateSuccess'));
  },
};
