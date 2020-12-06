const model = require('../config/model');
const helpers = require('../services/helpers');
const dateformat = require('dateformat');
const moment = require('moment');

function getBusinessDatesCount(startDate, endDate) {
  let startDateMoment = moment(startDate);
  let endDateMoment = moment(endDate);
  let days = Math.round(startDateMoment.diff(endDateMoment, 'days') * -1 + 1);
  do {
    if (startDateMoment.day() === 0) {
      days--;
    }
    if (startDateMoment.day() === 6) {
      days--;
    }
    startDateMoment = startDateMoment.add(1, 'days');
  } while (
    Math.round(startDateMoment.diff(endDateMoment, 'days') * -1 + 1) !== 0
  );

  return days;
}

//Usage
module.exports = {
  async createLeaveManagement(req, res) {
    try {
      const profileId = req.query.profileId;
      const { reason, startDate, endDate } = req.body;
      const stDate = new Date(startDate);
      const eDate = new Date(endDate);
      var numOfDates = getBusinessDatesCount(stDate, eDate);
      if (!helpers.checkVariable(profileId)) {
        helpers.handleResponse(res, 'missingParams');
      }

      console.log(profileId);
      const leaveManagement = await model.leaveManagement.create({
        profileId: profileId,
        startDate: helpers.dateToInt(startDate),
        endDate: helpers.dateToInt(endDate),
        reason: reason,
        dayOff: numOfDates,
        approveLeaveRequest: false,
      });

      return helpers.handleResponse(res, 'insertSuccess', {
        data: leaveManagement,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getLeaveManagement(req, res) {
    try {
      const leaveId = req.query.leaveId;

      if (!helpers.checkVariable(leaveId)) {
        helpers.handleResponse(res, 'missingParams');
      }

      const leaveManagement = await model.leaveManagement.find({
        where: {
          id: leaveId,
        },
      });
      const startDate = new Date(leaveManagement.startDate * 1000);
      const endDate = new Date(leaveManagement.endDate * 1000);
      const result = [];

      result.push({
        profileId: leaveManagement.profileId,
        startDate: dateformat(startDate, 'mm/dd/yyyy'),
        endDate: dateformat(endDate, 'mm/dd/yyyy'),
        reason: leaveManagement.reason,
        dayOff: leaveManagement.dayOff,
        approveLeaveRequest: leaveManagement.approveLeaveRequest,
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

  async updateLeaveManagement(req, res) {
    try {
      const leaveId = req.query.leaveId;
      const { reason, startDate, endDate } = req.body;

      if (!helpers.checkVariable(leaveId)) {
        helpers.handleResponse(res, 'missingParams');
      }

      const checkLeave = await model.leaveManagement.find({
        where: {
          id: leaveId,
        },
      });

      const stDate = new Date(startDate);
      const eDate = new Date(endDate);
      var numOfDates = getBusinessDatesCount(stDate, eDate);
      if (checkLeave.approveLeaveRequest === true) {
        return helpers.handleResponse(res, 'missingParams');
      }
      await model.leaveManagement.update(
        {
          startDate: helpers.dateToInt(startDate),
          endDate: helpers.dateToInt(endDate),
          reason: reason,
          dayOff: numOfDates,
        },
        {
          where: {
            id: leaveId,
          },
        }
      );
      const leaveManagement = await model.leaveManagement.findAll({
        where: {
          id: leaveId,
        },
      });
      return helpers.handleResponse(res, 'updateSuccess', {
        data: leaveManagement,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  async getAllLeaveInMonth(req, res) {
    try {
      const year = req.query.year;
      const month = req.query.month;

      if (!helpers.checkVariable(year) || !helpers.checkVariable(month)) {
        helpers.handleResponse(res, 'missingParams');
      }
      const employees = await model.profile.findAll({
        where: {
          haveAccount: 0,
        },
      });

      const leaveManagements = await model.leaveManagement.findAll();

      const result = [];

      for (const emp of employees) {
        for (const leaveManagement of leaveManagements) {
          const startDate = new Date(leaveManagement.startDate * 1000);
          const endDate = new Date(leaveManagement.endDate * 1000);
          if (
            parseInt(dateformat(startDate, 'mm')) === parseInt(month) &&
            parseInt(dateformat(startDate, 'yyyy')) === parseInt(year) &&
            leaveManagement.profileId === emp.id
          ) {
            result.push({
              employee: emp,
              leaveManagement: {
                id: leaveManagement.id,
                reason: leaveManagement.reason,
                dayOff: leaveManagement.dayOff,
                startDate: dateformat(startDate, 'mm/dd/yyyy'),
                endDate: dateformat(endDate, 'mm/dd/yyyy'),
                approveLeaveRequest: leaveManagement.approveLeaveRequest,
              },
            });
          }
        }
      }
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

  async deleteOneLeave(req, res) {
    try {
      const leaveId = req.query.leaveId;

      if (!helpers.checkVariable(leaveId)) {
        helpers.handleResponse(res, 'missingParams');
      }
      const checkLeave = await model.leaveManagement.find({
        where: {
          id: leaveId,
        },
      });

      if (checkLeave.approveLeaveRequest === true) {
        return helpers.handleResponse(res, 'missingParams');
      }

      await model.leaveManagement.destroy({
        where: {
          id: leaveId,
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

  async reportDayOff(req, res) {
    try {
      const year = req.query.year;
      const result = [];
      let leaveMonth = [];
      let dayOff = 0;

      if (!helpers.checkVariable(year)) {
        helpers.handleResponse(res, 'missingParams');
      }
      const employees = await model.profile.findAll({
        where: {
          haveAccount: 0,
        },
      });
      const leaves = await model.leaveManagement.findAll();
      // console.log(leaves)
      for (const emp of employees) {
        for (let month = 1; month <= 12; month++) {
          for (const leaveManagement of leaves) {
            const startDate = new Date(leaveManagement.startDate * 1000);
            if (
              parseInt(dateformat(startDate, 'mm')) === parseInt(month) &&
              parseInt(dateformat(startDate, 'yyyy')) === parseInt(year) &&
              leaveManagement.profileId === emp.id
            ) {
              dayOff += leaveManagement.dayOff;
            }
          }
          leaveMonth.push({
            month: month,
            year: year,
            dayOff: dayOff,
          });
          dayOff = 0;
        }
        result.push({
          firstName: emp.firstName,
          lastName: emp.lastName,
          leaveMonth: leaveMonth,
        });
        leaveMonth = [];
      }

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

  async updateApproveLeaveRequest(req, res) {
    try {
      const leaveId = req.query.leaveId;

      if (!helpers.checkVariable(leaveId)) {
        helpers.handleResponse(res, 'missingParams');
      }

      await model.leaveManagement.update(
        {
          approveLeaveRequest: true,
        },
        {
          where: {
            id: leaveId,
          },
        }
      );
      const leaveManagement = await model.leaveManagement.findAll({
        where: {
          id: leaveId,
        },
      });
      return helpers.handleResponse(res, 'updateSuccess', {
        data: leaveManagement,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },
};
