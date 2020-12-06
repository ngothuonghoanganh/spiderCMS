const model = require('../config/model');
const helpers = require('../services/helpers');
const dateformat = require('dateformat');

module.exports = {
  async createTimeSheet(req, res) {
    try {
      const profileId = parseInt(req.query.profileId);
      let { date, projectId, task, workingHours, overTimeHours, note } = req.body;

      let totalHours = 0;
      console.log(projectId);
      const project = await model.project.find({
        where: {
          id: parseInt(projectId),
        },
      });
      if (!helpers.checkVariable(profileId)) {
        return helpers.handleResponse(res, 'missingParams');
      }
      console.log(date);
      if (!helpers.checkVariable(workingHours)) workingHours = 0;
      if (!helpers.checkVariable(overTimeHours)) overTimeHours = 0;

      totalHours = parseFloat(workingHours) + parseFloat(overTimeHours);
      // console.log(totalTime);
      const mDate = helpers.dateToInt(date);

      const timesheets = await model.timeSheetDay.find({
        where: {
          profileId: profileId,
          date: mDate,
        },
      });

      if (helpers.checkArray(timesheets)) {
        return helpers.handleResponse(res, 'dataExisted');
      }

      //create time sheet
      const timesheet = await model.timeSheetDay.create({
        profileId: profileId,
        date: parseInt(mDate),
        project: project.projectName,
        task: task,
        workingHours: workingHours,
        overTimeHours: overTimeHours,
        totalHours: totalHours,
        note: note,
      });

      return helpers.handleResponse(res, 'insertSuccess', {
        data: timesheet,
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
      const profileId = req.query.profileId;
      const month = req.query.month;
      const year = req.query.year;

      if (!helpers.checkVariable(month) || !helpers.checkVariable(profileId)) {
        return helpers.handleResponse(res, 'missingParams');
      }
      let result = [];
      const timeSheets = await model.timeSheetDay.findAll({
        where: {
          profileId: profileId,
        },
      });

      timeSheets.forEach((timeSheet) => {
        const date = new Date(timeSheet.date * 1000);
        const MONTH = dateformat(date, 'mm');
        const YEAR = dateformat(date, 'yyyy');

        if (
          parseInt(MONTH) === parseInt(month) &&
          parseInt(YEAR) === parseInt(year)
        ) {
          result.push({
            id: timeSheet.id,
            profileId: timeSheet.profileId,
            date: helpers.dateString(timeSheet.date),
            project: timeSheet.project,
            task: timeSheet.task,
            workingHours: timeSheet.workingHours,
            overTimeHours: timeSheet.overTimeHours,
            totalHours: timeSheet.totalHours,
            note: timeSheet.note,
          });
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

  async getOne(req, res) {
    try {
      const timesheetId = req.query.timesheetId;

      if (!helpers.checkVariable(timesheetId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      const timesheet = await model.timeSheetDay.findAll({
        where: {
          Id: timesheetId,
        },
      });
      let TimeSheet = [];

      timesheet.forEach((ts) => {
        const dateObj = new Date(ts.date * 1000);
        TimeSheet.push({
          id: ts.id,
          profileId: ts.profileId,
          date: dateformat(dateObj, 'mm/dd/yyyy HH:MM:ss'),
          project: ts.project,
          task: ts.task,
          workingHours: ts.workingHours,
          overTimeHours: ts.overTimeHours,
          totalHours: ts.totalHours,
          note: ts.note,
        });
      });
      return helpers.handleResponse(res, 'getListSuccess', {
        data: TimeSheet,
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
      const timesheetId = req.query.timesheetId;
      if (!helpers.checkVariable(timesheetId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      await model.timeSheetDay.destroy({
        where: {
          Id: timesheetId,
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
      const timesheetId = req.query.timesheetId;
      const { date, projectId, task, workingHours, overTimeHours, note } = req.body;
      let totalHours = parseFloat(workingHours) + parseFloat(overTimeHours);

      const mDate = helpers.dateToInt(date);

      if (
        !helpers.checkVariable(timesheetId) ||
        !helpers.checkVariable(projectId)
      ) {
        return helpers.handleResponse(res, 'missingParams');
      }

      console.log(req.body);
      const project = await model.project.find({
        where: {
          id: parseInt(projectId),
        },
      });
      await model.timeSheetDay.update(
        {
          date: mDate,
          project: project.projectName,
          task: task,
          workingHours: workingHours,
          overTimeHours: overTimeHours,
          totalHours: totalHours,
          note: note,
        },
        {
          where: {
            Id: timesheetId,
          },
        }
      );

      const result = await model.timeSheetDay.findOne({
        where: {
          Id: timesheetId,
        },
      });
      return helpers.handleResponse(res, 'updateSuccess', {
        message: 'change timesheet successfully',
        data: result,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getAllTotalTimeSheetByProfileId(req, res) {
    try {
      const profileId = req.query.profileId;
      const month = req.query.month;
      const year = req.query.year;
      const dayMustWork = req.body.dayMustWork;
      let totalWorkingHours = 0,
      totalOverTimeHours = 0,
      totalHours = 0,
        workDay;

      if (!helpers.checkVariable(month) || !helpers.checkVariable(profileId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      const totalTimeSheet = await model.totalTimeSheets.findAll({
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });

      let result = [];
      const timeSheets = await model.timeSheetDay.findAll({
        where: {
          profileId: profileId,
        },
      });

      timeSheets.forEach((timeSheet) => {
        const date = new Date(timeSheet.date * 1000);
        const MONTH = dateformat(date, 'mm');
        const YEAR = dateformat(date, 'yyyy');
        if (
          parseInt(MONTH) === parseInt(month) &&
          parseInt(YEAR) === parseInt(year)
        ) {
          result.push({
            id: timeSheet.id,
            profileId: timeSheet.profileId,
            date: helpers.dateString(timeSheet.date),
            project: timeSheet.project,
            workingHours: timeSheet.workingHours,
            overTimeHours: timeSheet.overTimeHours,
            note: timeSheet.note,
          });
        }
      });

      result.forEach((timesheets) => {
        totalWorkingHours += timesheets.workingHours;
        totalOverTimeHours += timesheets.overTimeHours;
      });
      totalHours = totalWorkingHours + totalOverTimeHours;
      workDay = totalHours / 8;
      if (!helpers.checkArray(totalTimeSheet)) {
        const create = await model.totalTimeSheets.create({
          profileId: profileId,
          month: parseInt(month),
          year: parseInt(year),
          totalWorkingHours: totalWorkingHours,
          totalOverTimeHours: totalOverTimeHours,
          totalHours: totalHours,
          workDay: workDay,
          dayMustWork: dayMustWork,
        });

        let data = [];

        data.push(create);

        return helpers.handleResponse(res, 'getListSuccess', {
          data: data,
        });
      } else {
        const totalTS = await model.totalTimeSheets.find({
          where: {
            profileId: profileId,
            month: month,
            year: year,
          },
        });
        console.log(totalTS.id);
        await model.totalTimeSheets.update(
          {
            month: parseInt(month),
            year: parseInt(year),
            totalWorkingHours: totalWorkingHours,
            totalOverTimeHours: totalOverTimeHours,
            totalHours: totalHours,
            workDay: workDay,
            dayMustWork: dayMustWork,
          },
          {
            where: {
              id: totalTS.id,
            },
          }
        );
        const update = await model.totalTimeSheets.findAll({
          where: {
            profileId: profileId,
            month: month,
            year: year,
          },
        });

        return helpers.handleResponse(res, 'getListSuccess', {
          data: update,
        });
      }
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getAllTotal(req, res) {
    try {
      const { month, year } = req.query;

      if (!helpers.checkVariable(month) || !helpers.checkVariable(year)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      const timeSheets = await model.totalTimeSheets.findAll({
        include: {
          model: model.profile,
          where: {
            haveAccount: 0,
            isActive: 1,
          },
        },
        where: {
          month: month,
          year: year,
        },
      });

      console.log(timeSheets);

      return helpers.handleResponse(res, 'getListSuccess', {
        data: timeSheets,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },
};
