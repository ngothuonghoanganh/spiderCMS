const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  async create(req, res) {
    try {

      let {
        spicingName,
        levelName,
        hourPrice,
        monthPrice
      } = req.body;
      if (!helpers.checkVariable(spicingName) || !helpers.checkVariable(levelName)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      const spicingmodel = await model.spicingModel.find({
        where: {
          spicingName: spicingName
        }
      });

      if (helpers.checkArray(spicingmodel)) {
        const level = await model.seniortyLevel.create({
          spicingId: spicingmodel.id,
          levelName: levelName
        });

        const rate = await model.rates.create({
          spicingId: spicingmodel.id,
          levelId: level.id,
          hourPrice: hourPrice,
          monthprice: monthPrice
        });

        return helpers.handleResponse(res, 'insertSuccess', {
          data: {
            spicingmodel,
            level,
            rate
          }
        });
      }

      //set default price
      if (!helpers.checkVariable(spicingName) || !helpers.checkVariable(levelName)) {
        hourPrice = 0;
        monthPrice = 0;
      }

      const spicing = await model.spicingModel.create({
        spicingName: spicingName
      });

      const level = await model.seniortyLevel.create({
        spicingId: spicing.id,
        levelName: levelName
      });

      const rate = await model.rates.create({
        spicingId: spicing.id,
        levelId: level.id,
        hourPrice: hourPrice,
        monthprice: monthPrice
      });

      return helpers.handleResponse(res, 'insertSuccess', {
        data: {
          spicing,
          level,
          rate
        }
      });
    } catch (error) {
      console.log(error)
      return helpers.handleResponse(res, 'error', {
        error: error.name
      });
    }
  },

  async getOne(req, res) {
    try {
      const ratesId = req.query.ratesId
      if (!helpers.checkVariable(ratesId)) {
        return helpers.handleResponse(res, 'missingParams');
      }
      const spicing = await model.sequelize.query(`select * from spicingModels, seniortyLevels,rates 
      where spicingModels.id=seniortyLevels.spicingId and seniortyLevels.id=rates.levelId 
      and rates.id=${ratesId}`, {
        type: model.sequelize.QueryTypes.SELECT
      })

      return helpers.handleResponse(res, 'getListSuccess', {
        data: {
          spicing
        }
      })
    } catch (error) {
      console.log(error)
      return helpers.handleResponse(res, 'error', {
        error: error.name
      });
    }
  },

  async updateOne(req, res) {
    try {
      const {
        hourPrice,
        monthPrice
      } = req.body;
      const ratesId = req.query.ratesId
      if (!helpers.checkVariable(ratesId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      await model.rates.update({
        hourPrice: hourPrice,
        monthprice: monthPrice
      }, {
        where: {
          id: ratesId
        }
      });

      const spicing = await model.sequelize.query(`select * from spicingModels, seniortyLevels,rates 
      where spicingModels.id=seniortyLevels.spicingId and seniortyLevels.id=rates.levelId 
      and rates.id=${ratesId}`, {
        type: model.sequelize.QueryTypes.SELECT
      });

      return helpers.handleResponse(res, 'updateSuccess', {
        data: spicing
      });
    } catch (error) {
      console.log(error)
      return helpers.handleResponse(res, 'error', {
        error: error.name
      });
    }
  },

  async getAll(req, res) {
    try { 
      const spicing = await model.sequelize.query(`select * from spicingModels, seniortyLevels,rates 
      where spicingModels.id=seniortyLevels.spicingId and seniortyLevels.id=rates.levelId`, {
        type: model.sequelize.QueryTypes.SELECT
      });

      return helpers.handleResponse(res, 'getListSuccess', {
        data: spicing
      });
    } catch (error) {
      console.log(error)
      return helpers.handleResponse(res, 'error', {
        error: error.name
      });
    }
  },

  async deleteRates(req, res) {
    try {
      const ratesId = req.query.ratesId
      if (!helpers.checkVariable(ratesId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      const rates = await model.rates.find({
        where: {
          id: ratesId
        }
      });

      await model.rates.destroy({
        where: {
          id: ratesId
        }
      });

      await model.seniortyLevel.destroy({
        where: {
          id: rates.levelId
        }
      });

      return helpers.handleResponse(res, 'deleteSuccess');
    } catch (error) {
      console.log(error)
      return helpers.handleResponse(res, 'error', {
        error: error.name
      });
    }
  },

  async deleteAll(req, res) {
    try {
      const spicingId = req.query.spicingId
      if (!helpers.checkVariable(spicingId)) {
        return helpers.handleResponse(res, 'missingParams');
      }


      await model.rates.destroy({
        where: {
          spicingId: spicingId
        }
      });

      await model.seniortyLevel.destroy({
        where: {
          spicingId: spicingId
        }
      });

      await model.spicingModel.destroy({
        where: {
          id: spicingId
        }
      });

      return helpers.handleResponse(res, 'deleteSuccess');
    } catch (error) {
      console.log(error)
      return helpers.handleResponse(res, 'error', {
        error: error.name
      });
    }
  }
}