const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  // Get all type of Curriculum Vitae
  getAllTypes(req, res) {
    return model.typeObject.findAll({
      where: {
        objectUse: 'cv'
      }
    }).then((CVTypes) => {
      if (!helpers.checkArray(CVTypes)) {
        return helpers.handleResponse(res, 'notFound');
      }

      let dataSend = [];
      CVTypes.forEach((item) => {
        dataSend.push(item.dataValues);
      });

      return helpers.handleResponse(res, 'getListSuccess', {
        data: dataSend
      });
    });
  },

  //create cv
  createCV(req, res) {
    if (!helpers.checkArray(req.body.datas) || !helpers.checkVariable(req.body.profileId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.curriculumVitae.bulkCreate(req.body.datas)
      .then(() => helpers.handleResponse(res, 'insertSuccess'))
      .catch(error => helpers.handleResponse(res, 'error', {
        error: error.name
      }));
  },


  //update cv
  updateCV(req, res) {
    if (!helpers.checkArray(req.body.datas) || !helpers.checkVariable(req.body.profileId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.curriculumVitae.destroy({
      where: {
        profileId: req.body.profileId,
      },
    }).then(() => {
      return model.curriculumVitae.bulkCreate(req.body.datas)
        .then(() => helpers.handleResponse(res, 'updateSuccess'))
        .catch(error => helpers.handleResponse(res, 'error', {
          error: error.name
        }));
    });
  },


  //get cv
  getOneCV(req, res) {
    if (!helpers.checkVariable(req.query.profileId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.curriculumVitae.findAll({
      where: {
        profileId: req.query.profileId
      },
      include: [{
        model: model.typeObject
      }]
    }).then((rows) => {
      if (!helpers.checkArray(rows)) {
        return helpers.handleResponse(res, 'notFound');
      }

      let cleanData = [];
      rows.forEach((row) => {
        cleanData.push(row.dataValues);
      });

      return helpers.handleResponse(res, 'getListSuccess', {
        data: cleanData
      });
    });
  },

  //delete 1 row cv
  deleteOne(req, res) {
    if (!helpers.checkVariable(req.body.cvId)) {
      return helpers.handleResponse(res, 'missingParams');
    }

    return model.curriculumVitae.destroy({
        where: {
          id: req.body.cvId,
        },
      }).then(() => helpers.handleResponse(res, 'deleteSuccess'))
      .catch(err => helpers.handleResponse(res, 'error', {
        message: 'can not delete this row',
        data: {
          error: err.name
        }
      }));
  },

  //delete full cv
  deleteFull(req, res) {
    if (!helpers.checkVariable(req.body.profileId)) {
      return helpers.handleResponse(res, 'missingParams');
    }
    return model.curriculumVitae.destroy({
        where: {
          profileId: req.body.profileId,
        },
      }).then(() => helpers.handleResponse(res, 'deleteSuccess'))
      .catch(err => helpers.handleResponse(res, 'error', {
        message: 'can not delete this CV',
        data: {
          error: err.name
        }
      }));
  },
}