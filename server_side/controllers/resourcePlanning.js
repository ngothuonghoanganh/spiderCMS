const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  async createOne(req, res) {
    try {
      const profileId = parseInt(req.query.profileId);
      const dataResource = req.body.dataResource;
      if (!helpers.checkVariable(profileId)) {
        helpers.handleResponse(res, 'missingParams');
      }

      for (const resource of dataResource) {
        const resourcePlannings = await model.resourcePlanning.findAll({
          where: {
            profileId: profileId,
            projectId: resource.projectId,
            month: resource.month,
            year: resource.year,
          },
        });

        if (helpers.checkArray(resourcePlannings)) {
          return helpers.handleResponse(res, 'dataExisted', {
            message: `${resource.month}/${resource.year} had resourcePlanning`,
          });
        }
      }
      console.log(profileId);
      let result = [];

      for (const resource of dataResource) {
        console.log(resource.projectId);
        const resourcePlanning = await model.resourcePlanning.create({
          profileId: profileId,
          projectId: resource.projectId,
          month: resource.month,
          year: resource.year,
        });
        result.push(resourcePlanning);
      }

      return helpers.handleResponse(res, 'insertSuccess', {
        data: result,
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
      const resourcePlanningId = req.query.resourcePlanningId;
      if (!helpers.checkVariable(resourcePlanningId)) {
        helpers.handleResponse(res, 'missingParams');
      }

      const resourcePlanning = await model.resourcePlanning.find({
        where: {
          id: resourcePlanningId,
        },
      });
      return helpers.handleResponse(res, 'getOneSuccess', {
        data: resourcePlanning,
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
      const { year } = req.query;

      if (!helpers.checkVariable(year)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      let resourcePlannings = [],
        planning = [];
      const profile = await model.profile.findAll({
        where: {
          haveAccount: 0,
        },
      });

      const project = await model.project.findAll();

      const resource = await model.resourcePlanning.findAll({
        where: {
          year,
        },
      });

      profile.forEach((profiles) => {
        resource.forEach((resources) => {
          project.forEach((projects) => {
            if (
              resources.profileId === profiles.id &&
              projects.id === resources.projectId
            ) {
              planning.push({
                id: resources.id,
                projectId: projects.id,
                name: projects.projectName,
                month: resources.month,
                year: resources.year,
              });
            }
          });
        });
        resourcePlannings.push({
          id: profiles.id,
          firstName: profiles.firstName,
          lastName: profiles.lastName,
          planning: planning,
        });
        planning = [];
      });

      let result = [];

      resourcePlannings.forEach((resourcePlanning) => {
        if (resourcePlanning.planning.length > 0) {
          result.push(resourcePlanning);
        }
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

  async update(req, res) {
    try {
      const profileId = parseInt(req.query.profileId);
      const dataResource = req.body.dataResource;
      if (!helpers.checkVariable(profileId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      await model.resourcePlanning.destroy({
        where: {
          profileId: profileId,
        },
      });

      let result = [];

      for (const resource of dataResource) {
        console.log(resource.projectId);
        const resourcePlanning = await model.resourcePlanning.create({
          profileId: profileId,
          projectId: resource.projectId,
          month: resource.month,
          year: resource.year,
        });
        result.push(resourcePlanning);
      }

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

  async delete(req, res) {
    try {
      const profileId = req.query.profileId;
      const { year } = req.body;

      if (!helpers.checkVariable(profileId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      await model.resourcePlanning.destroy({
        where: {
          profileId,
          year,
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

  async CloneResoucres(req, res) {
    try {
      const { oldYear, newYear } = req.body;

      if (!helpers.checkVariable(oldYear) || !helpers.checkVariable(newYear)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      await model.resourcePlanning.destroy({
        where: {
          year: newYear,
        },
      });

      const oldResources = await model.resourcePlanning.findAll({
        where: {
          year: oldYear,
        },
      });

      let result = [];
      for (const resource of oldResources) {
        console.log(resource.projectId);
        const resourcePlanning = await model.resourcePlanning.create({
          profileId: resource.profileId,
          projectId: resource.projectId,
          month: resource.month,
          year: newYear,
        });
        result.push(resourcePlanning);
      }
      return helpers.handleResponse(res, 'insertSuccess', {
        data: result,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },
};
