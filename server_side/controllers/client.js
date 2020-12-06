const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  async createOne(req, res) {
    try {
      const {
        clientName,
        taxCode,
        address,
        email,
        telephone,
        contactPoint
      } = req.body;

      if (!helpers.checkVariable(clientName)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      const client = await model.client.create({
        clientName: clientName,
        taxCode: taxCode,
        address: address,
        email: email,
        telephone: telephone,
        contactPoint: contactPoint
      });

      return helpers.handleResponse(res, 'insertSuccess', {
        data: client,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getOne(req, res) {
    try {
      const clientId = req.query.clientId;
      if (!helpers.checkVariable(clientId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      const client = await model.client.findAll({
        where: {
          id: clientId,
        },
      });

      return helpers.handleResponse(res, 'getOneSuccess', {
        data: client,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getAll(req, res) {
    try {
      const clients = await model.client.findAll();

      return helpers.handleResponse(res, 'getListSuccess', {
        data: clients,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async deleteOne(req, res) {
    try {
      const clientId = req.query.clientId;
      if (!helpers.checkVariable(clientId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      await model.client.destroy({
        where: {
          id: clientId,
        },
      });

      return helpers.handleResponse(res, 'deleteSuccess');
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async update(req, res) {
    try {
      const clientId = req.query.clientId;
      const {
        clientName,
        taxCode,
        address,
        email,
        telephone,
        contactPoint
      } = req.body;
      if (
        !helpers.checkVariable(clientId) ||
        !helpers.checkVariable(clientName)
      ) {
        return helpers.handleResponse(res, 'missingParams');
      }

      await model.client.update({
        clientName: clientName,
        taxCode: taxCode,
        address: address,
        email: email,
        telephone: telephone,
        contactPoint: contactPoint
      }, {
        where: {
          id: clientId,
        },
      });

      const client = await model.client.findAll({
        where: {
          id: clientId,
        },
      });

      return helpers.handleResponse(res, 'updateSuccess', {
        data: client,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },
};