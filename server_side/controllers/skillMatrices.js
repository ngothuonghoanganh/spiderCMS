const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  async createOne(req, res) {
    try {
      const profileId = req.query.profileId;
      const { skillName, level } = req.body;

      if (
        !helpers.checkVariable(profileId) ||
        !helpers.checkVariable(skillName) ||
        !helpers.checkVariable(level)
      ) {
        helpers.handleResponse(res, 'missingParams');
      }

      const skill = await model.skill.find({
        where: {
          skillName: skillName,
        },
      });

      const skillmatrix = await model.skillMatrix.create({
        profileId: profileId,
        skillId: skill.id,
        groupSkillId: skill.groupSkillId,
        level: level,
      });

      return helpers.handleResponse(res, 'insertSuccess', {
        data: skillmatrix,
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
      const skillMatrixId = req.query.skillMatrixId;
      if (!helpers.checkVariable(skillMatrixId)) {
        helpers.handleResponse(res, 'missingParams');
      }
      const skillMatrix = await model.skillMatrix.find({
        include: [
          {
            model: model.skill,
          },
          {
            model: model.groupSkill,
          },
        ],
        where: {
          id: skillMatrixId,
        },
      });

      return helpers.handleResponse(res, 'getOneSuccess', {
        data: skillMatrix,
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
      let result = [];
      let skillmatrix = [];
      const profiles = await model.profile.findAll({
        where: {
          isActive: 1,
          haveAccount: 0,
        },
      });
      const skillMatrices = await model.skillMatrix.findAll({
        include: { model: model.skill },
      });

      for (const profile of profiles) {
        for (const skillMatrix of skillMatrices) {
          if (profile.id === skillMatrix.profileId) {
            skillmatrix.push(skillMatrix);
          }
        }
        result.push({
          profileId: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          skillmatrix,
        });
        skillmatrix = [];
      }

      result = result.filter(({ skillmatrix }) => skillmatrix.length > 0);

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
      const skillMatrixId = req.query.skillMatrixId;
      const level = req.body.level;
      if (
        !helpers.checkVariable(skillMatrixId) ||
        !helpers.checkVariable(level)
      ) {
        helpers.handleResponse(res, 'missingParams');
      }

      await model.skillMatrix.update(
        {
          level: level,
        },
        {
          where: {
            id: skillMatrixId,
          },
        }
      );

      const skillMatrix = await model.skillMatrix.find({
        include: [
          {
            model: model.skill,
          },
          {
            model: model.groupSkill,
          },
        ],
        where: {
          id: skillMatrixId,
        },
      });

      return helpers.handleResponse(res, 'updateSuccess', {
        data: skillMatrix,
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
      const skillMatrixId = req.query.skillMatrixId;
      if (!helpers.checkVariable(skillMatrixId)) {
        helpers.handleResponse(res, 'missingParams');
      }

      await model.skillMatrix.destroy({
        where: {
          id: skillMatrixId,
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
