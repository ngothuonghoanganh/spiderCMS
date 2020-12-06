const model = require('../config/model');
const helpers = require('../services/helpers');

module.exports = {
  //goup skill
  async createOneGroupSkill(req, res) {
    try {
      const { groupSkillName } = req.body;

      console.log(groupSkillName);
      if (!helpers.checkVariable(groupSkillName)) {
        helpers.handleResponse(res, 'missingParams');
      }

      //check existed for group skill
      const groupSkills = await model.groupSkill.findAll({
        where: {
          groupSkillName: groupSkillName,
        },
      });

      if (helpers.checkArray(groupSkills)) {
        return helpers.handleResponse(res, 'dataExisted', {
          message: 'this groupSkill is Existed',
        });
      }

      //create group skill
      const groupSkill = await model.groupSkill.create({
        groupSkillName: groupSkillName,
      });

      return helpers.handleResponse(res, 'insertSuccess', {
        data: groupSkill,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getOneGroupSkill(req, res) {
    try {
      const { groupSkillId } = req.query;

      if (!helpers.checkVariable(groupSkillId)) {
        helpers.handleResponse(res, 'missingParams');
      }
      const groupSkill = await model.groupSkill.find({
        where: {
          id: groupSkillId,
        },
      });
      return helpers.handleResponse(res, 'getOneSuccess', {
        data: groupSkill,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getAllGroupSkill(req, res) {
    try {
      const groupSkills = await model.groupSkill.findAll();
      return helpers.handleResponse(res, 'getListSuccess', {
        data: groupSkills,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async updateGroupSkill(req, res) {
    try {
      const groupSkillId = req.query.groupSkillId;
      const groupSkillName = req.body.groupSkillName;
      if (!helpers.checkVariable(groupSkillId)) {
        helpers.handleResponse(res, 'missingParams');
      }

      await model.groupSkill.update(
        {
          groupSkillName: groupSkillName,
        },
        {
          where: {
            id: groupSkillId,
          },
        }
      );
      const groupSkill = await model.groupSkill.find({
        where: {
          id: groupSkillId,
        },
      });
      return helpers.handleResponse(res, 'updateSuccess', {
        data: groupSkill,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async deleteGroupSkill(req, res) {
    try {
      const groupSkillId = req.query.groupSkillId;
      if (!helpers.checkVariable(groupSkillId)) {
        helpers.handleResponse(res, 'missingParams');
      }
      await model.skill.destroy({
        where: {
          groupSkillId: groupSkillId,
        },
      });
      await model.groupSkill.destroy({
        where: {
          id: groupSkillId,
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

  //skill

  async createOneSkill(req, res) {
    try {
      const { groupSkillId, skillName } = req.body;

      if (
        !helpers.checkVariable(groupSkillId) ||
        !helpers.checkVariable(skillName)
      ) {
        helpers.handleResponse(res, 'missingParams');
      }
      //check existed for group skill
      const groupSkill = await model.groupSkill.find({
        where: {
          id: groupSkillId,
        },
      });

      if (!helpers.checkArray(groupSkill)) {
        return helpers.handleResponse(res, 'noData', {
          message: 'this groupSkill is not Existed',
        });
      }

      const skill = await model.skill.create({
        skillName: skillName,
        groupSkillId: groupSkill.id,
      });

      return helpers.handleResponse(res, 'insertSuccess', {
        data: {
          skill,
        },
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getOneSkill(req, res) {
    try {
      const skillId = req.query.skillId;

      if (!helpers.checkVariable(skillId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      const skill = await model.skill.find({
        where: {
          id: skillId,
        },
      });

      return helpers.handleResponse(res, 'getOneSuccess', {
        data: {
          skill,
        },
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getAllSkill(req, res) {
    try {
      const skills = await model.groupSkill.findAll({
        include: ['skill'],
      });
      return helpers.handleResponse(res, 'getListSuccess', {
        data: skills,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getSkillsByGroup(req, res) {
    try {
      const { groupSkillId } = req.query;
      if (!helpers.checkVariable(groupSkillId)) {
        return helpers.handleResponse(res, 'missingParams');
      }
      const skills = await model.groupSkill.findAll({
        include: ['skill'],
        where: {
          id: groupSkillId,
        },
      });
      return helpers.handleResponse(res, 'getOneSuccess', {
        data: skills,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async updateSkill(req, res) {
    try {
      const { skillName } = req.body;
      const skillId = req.query.skillId;
      if (!helpers.checkVariable(skillId)) {
        helpers.handleResponse(res, 'missingParams');
      }

      //check existed group skill

      await model.skill.update(
        {
          skillName: skillName,
        },
        {
          where: {
            id: skillId,
          },
        }
      );

      const skill = await model.skill.find({
        where: {
          id: skillId,
        },
      });

      return helpers.handleResponse(res, 'updateSuccess', {
        data: skill,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async deleteSkill(req, res) {
    try {
      const skillId = req.query.skillId;
      if (!helpers.checkVariable(skillId)) {
        helpers.handleResponse(res, 'missingParams');
      }

      await model.skill.destroy({
        where: {
          id: skillId,
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
