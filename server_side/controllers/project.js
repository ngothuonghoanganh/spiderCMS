const model = require('../config/model');
const helpers = require('../services/helpers');
const dateformat = require('dateformat');

module.exports = {
  async createOneProject(req, res) {
    try {
      const {
        projectName,
        projectType,
        startDate,
        endDate,
        clientId
      } = req.body;
      if (
        !helpers.checkVariable(projectName) ||
        !helpers.checkVariable(clientId)
      ) {
        helpers.handleResponse(res, 'missingParams');
      }

      const projects = await model.project.findAll({
        where: {
          clientId: clientId,
          projectName: projectName,
        },
      });

      if (helpers.checkArray(projects)) {
        return helpers.handleResponse(res, 'dataExisted', {
          message: 'this project is Existed',
        });
      }

      await model.project.create({
        projectName: projectName,
        clientId: clientId,
        projectType: projectType,
        startDate: helpers.dateToInt(startDate),
        endDate: helpers.dateToInt(endDate),
      });

      const project = await model.project.findAll({
        where: {
          projectName: projectName,
          clientId: clientId,
          projectType: projectType,
          startDate: helpers.dateToInt(startDate),
          endDate: helpers.dateToInt(endDate),
        },
      });

      return helpers.handleResponse(res, 'insertSuccess', {
        data: project,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getOneProject(req, res) {
    try {
      const projectId = req.query.projectId;
      if (!helpers.checkVariable(projectId)) {
        helpers.handleResponse(res, 'missingParams');
      }

      const result = [];

      const project = await model.project.find({
        include: {
          model: model.client,
        },
        where: {
          id: projectId,
        },
      });

      const startDate = new Date(project.startDate * 1000);
      const endDate = new Date(project.endDate * 1000);

      result.push({
        id: project.id,
        projectName: project.projectName,
        projectType: project.projectType,
        client: project.client,
        startDate: dateformat(startDate, 'mm/dd/yyyy'),
        endDate: dateformat(endDate, 'mm/dd/yyyy'),
      });
      return helpers.handleResponse(res, 'getOneSuccess', {
        data: result,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getAllProject(req, res) {
    try {
      const result = [];

      const projects = await model.project.findAll({
        include: {
          model: model.client,
        },
      });

      projects.forEach((project) => {
        const startDate = new Date(project.startDate * 1000);
        const endDate = new Date(project.endDate * 1000);
        console.log(project.projectName, startDate);

        result.push({
          id: project.id,
          projectName: project.projectName,
          projectType: project.projectType,
          client: project.client,
          startDate: dateformat(startDate, 'mm/dd/yyyy'),
          endDate: dateformat(endDate, 'mm/dd/yyyy'),
        });
      });
      return helpers.handleResponse(res, 'getListSuccess', {
        data: result,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async updateProject(req, res) {
    try {
      const projectId = req.query.projectId;
      const {
        projectName,
        projectType,
        startDate,
        endDate,
        clientId
      } = req.body;
      if (!helpers.checkVariable(projectId)) {
        helpers.handleResponse(res, 'missingParams');
      }
      await model.project.update({
        projectName: projectName,
        projectType: projectType,
        clientId: clientId,
        startDate: helpers.dateToInt(startDate),
        endDate: helpers.dateToInt(endDate),
      }, {
        where: {
          id: projectId,
        },
      });

      const result = [];

      const project = await model.project.find({
        include: {
          model: model.client,
        },
        where: {
          id: projectId,
        },
      });

      const StartDate = new Date(project.startDate * 1000);
      const EndDate = new Date(project.endDate * 1000);

      result.push({
        id: project.id,
        projectName: project.projectName,
        projectType: project.projectType,
        client: project.client,
        startDate: dateformat(StartDate, 'mm/dd/yyyy'),
        endDate: dateformat(EndDate, 'mm/dd/yyyy'),
      });

      return helpers.handleResponse(res, 'updateSuccess', {
        data: result,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async deleteProject(req, res) {
    try {
      const projectId = req.query.projectId;
      if (!helpers.checkVariable(projectId)) {
        return helpers.handleResponse(res, 'missingParams');
      }
      await model.project.destroy({
        where: {
          id: projectId,
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
};