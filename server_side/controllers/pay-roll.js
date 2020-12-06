const helpers = require('../services/helpers');
const model = require('../config/model');

module.exports = {
  //create one payroll

  async createOne(req, res) {
    try {
      const profileId = parseInt(req.query.profileId);
      console.log(profileId);
      let {
        basicSalary,
        bonus,
        mealAllowance,
        conveyanceAllowance,
        workDayPerMonth,
        month,
        year,
        advancePayment,
      } = req.body;
      if (
        !helpers.checkVariable(profileId) ||
        !helpers.checkVariable(month) ||
        !helpers.checkVariable(year)
      ) {
        return helpers.handleResponse(res, 'missingParams');
      }
      console.log(req.body);

      //check payroll and timesheet is emty
      const isEmtyPayRoll = await model.payRolls.find({
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });

      // console.log(isEmtyPayRoll);

      if (helpers.checkArray(isEmtyPayRoll)) {
        return helpers.handleResponse(res, 'isUsing', {
          message: 'this month had pay roll you should update it.',
        });
      }

      const timesheets = await model.totalTimeSheets.find({
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });
      if (!helpers.checkArray(timesheets)) {
        return helpers.handleResponse(res, 'noData', {
          message: "this month or year don't have time sheet",
        });
      }

      //set data default for null data
      if (!helpers.checkVariable(bonus)) bonus = 0;
      if (!helpers.checkVariable(mealAllowance)) mealAllowance = 0;
      if (!helpers.checkVariable(conveyanceAllowance)) conveyanceAllowance = 0;
      if (!helpers.checkVariable(advancePayment)) advancePayment = 0;
      //update day must work in month
      if (helpers.checkVariable(workDayPerMonth)) {
        await model.totalTimeSheets.update({
          dayMustWork: parseFloat(workDayPerMonth),
        }, {
          where: {
            profileId: profileId,
            month: month,
            year: year,
          },
        });
      }

      const timeSheets = await model.totalTimeSheets.find({
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });
      //auto create salary for this month
      const workingPayment =
        (parseFloat(basicSalary) / timeSheets.dayMustWork) * (timeSheets.totalWorkingHours / 8);

      const overTimePayment =
        (parseFloat(basicSalary) / timeSheets.dayMustWork / 8) *
        timeSheets.totalOverTimeHours *
        1.5;
      console.log(overTimePayment)
      const grossSalary =
        parseFloat(workingPayment) +
        parseFloat(overTimePayment) +
        parseFloat(bonus) +
        parseFloat(mealAllowance) +
        parseFloat(conveyanceAllowance);
      const netSalary = grossSalary - parseFloat(advancePayment);

      //create pay roll
      const payroll = await model.payRolls.create({
        profileId: profileId,
        month: month,
        year: year,
        grossSalary: grossSalary,
        advancePayment: parseFloat(advancePayment),
        netSalary: netSalary,
      });

      await model.salary.create({
        payrollId: payroll.id,
        basicSalary: parseFloat(basicSalary),
        workingPayment: workingPayment,
        overTimePayment: overTimePayment,
      });

      await model.benefits.create({
        payrollId: payroll.id,
        bonus: parseFloat(bonus),
        mealAllowance: parseFloat(mealAllowance),
        conveyanceAllowance: parseFloat(conveyanceAllowance),
      });

      let result = [];
      const profile = await model.profile.find({
        where: {
          id: profileId,
        },
      });

      const payRoll = await model.payRolls.find({
        include: [{
            model: model.salary,
          },
          {
            model: model.benefits,
          },
        ],
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });
      result.push({
        profileId: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        month: payRoll.month,
        year: payRoll.year,
        grossSalary: payRoll.grossSalary,
        advancePayment: payRoll.advancePayment,
        netSalary: payRoll.netSalary,
        basicSalary: payRoll.basicSalary,
        benefit: payRoll.benefit,
      });
      return helpers.handleResponse(res, 'insertSuccess', {
        data: result,
        // getTimeSheet
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  //get All payroll

  async getAll(req, res) {
    try {
      const month = req.query.month;
      const year = req.query.year;

      if (!helpers.checkVariable(month) || !helpers.checkVariable(year)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      const profiles = await model.profile.findAll();

      const payRolls = await model.payRolls.findAll({
        include: [{
            model: model.salary,
          },
          {
            model: model.benefits,
          },
        ],
        where: {
          month: month,
          year: year,
        },
      });

      const timesheets = await model.totalTimeSheets.findAll({
        where: {
          month: month,
          year: year,
        },
      });

      let payroll = [];
      if (helpers.checkArray(timesheets)) {

        profiles.forEach((profile) => {
          payRolls.forEach((payRoll) => {
            timesheets.forEach((timesheet) => {
              if (
                profile.id === payRoll.profileId &&
                profile.id === timesheet.profileId
              ) {
                payroll.push({
                  profileId: profile.id,
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  month: payRoll.month,
                  year: payRoll.year,
                  totalWorkingHours: timesheet.totalWorkingHours,
                  totalOverTimeHours: timesheet.totalOverTimeHours,
                  grossSalary: payRoll.grossSalary,
                  advancePayment: payRoll.advancePayment,
                  netSalary: payRoll.netSalary,
                  salary: payRoll.salary,
                  benefit: payRoll.benefit,
                });
              }
            });
          });
        });
      } else {
        profiles.forEach((profile) => {
          payRolls.forEach((payRoll) => {

            if (
              profile.id === payRoll.profileId
            ) {
              payroll.push({
                profileId: profile.id,
                firstName: profile.firstName,
                lastName: profile.lastName,
                month: payRoll.month,
                year: payRoll.year,
                totalWorkingHours: 0,
                totalOverTimeHours: 0,
                grossSalary: payRoll.grossSalary,
                advancePayment: payRoll.advancePayment,
                netSalary: payRoll.netSalary,
                salary: payRoll.salary,
                benefit: payRoll.benefit,
              });
            }
          });
        });
      }

      return helpers.handleResponse(res, 'getListSuccess', {
        data: payroll,
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },

  //update one payroll

  async updateOne(req, res) {
    try {
      const profileId = req.query.profileId;
      const month = req.query.month;
      const year = req.query.year;
      let {
        basicSalary,
        bonus,
        mealAllowance,
        conveyanceAllowance,
        workDayPerMonth,
        advancePayment,
      } = req.body;
      if (
        !helpers.checkVariable(profileId) ||
        !helpers.checkVariable(month) ||
        !helpers.checkVariable(year)
      ) {
        return helpers.handleResponse(res, 'missingParams');
      }

      //set data default for null data
      if (!helpers.checkVariable(bonus)) bonus = 0;
      if (!helpers.checkVariable(mealAllowance)) mealAllowance = 0;
      if (!helpers.checkVariable(conveyanceAllowance)) conveyanceAllowance = 0;
      if (!helpers.checkVariable(advancePayment)) advancePayment = 0;
      if (!helpers.checkVariable(workDayPerMonth)) workDayPerMonth = 30;

      const timesheet = await model.totalTimeSheets.find({
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });

      if (!helpers.checkVariable(timesheet)) {
        return helpers.handleResponse(res, 'noData', {
          message: "this month or year don't have time sheet",
        });
      }
      //update day must work in month
      await model.totalTimeSheets.update({
        dayMustWork: workDayPerMonth,
      }, {
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });

      const timeSheets = await model.totalTimeSheets.find({
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });

      let workingPayment, overTimePayment, grossSalary, netSalary;

      if (helpers.checkVariable(timeSheets)) {
        workingPayment =
          (parseFloat(basicSalary) / timeSheets.dayMustWork) * (timeSheets.totalWorkingHours / 8);
        overTimePayment =
          (parseFloat(basicSalary) / timeSheets.dayMustWork / 8) *
          timeSheets.totalOverTimeHours *
          1.5;
        grossSalary =
          workingPayment +
          overTimePayment +
          parseFloat(bonus) +
          parseFloat(mealAllowance) +
          parseFloat(conveyanceAllowance);
        netSalary = grossSalary - parseFloat(advancePayment);
      } else {
        workingPayment = 0;
        overTimePayment = 0;
        grossSalary =
          workingPayment +
          overTimePayment +
          parseFloat(bonus) +
          parseFloat(mealAllowance) +
          parseFloat(conveyanceAllowance);
        netSalary = grossSalary - parseFloat(advancePayment);
      }


      await model.payRolls.update({
        advancePayment: advancePayment,
        grossSalary: grossSalary,
        netSalary: netSalary,
      }, {
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });

      const payroll = await model.payRolls.find({
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });

      await model.benefits.update({
        bonus: bonus,
        mealAllowance: mealAllowance,
        conveyanceAllowance: conveyanceAllowance,
      }, {
        where: {
          payrollId: payroll.id,
        },
      });

      await model.salary.update({
        basicSalary: basicSalary,
        overTimePayment: overTimePayment,
        workingPayment: workingPayment,
      }, {
        where: {
          payrollId: payroll.id,
        },
      });

      let result = [];
      const payRoll = await model.payRolls.find({
        include: [{
            model: model.salary,
          },
          {
            model: model.benefits,
          },
        ],
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });

      const profile = await model.profile.find({
        where: {
          id: payRoll.profileId,
        },
      });

      result.push({
        profileId: timesheet.profileId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        dayMustWork: timesheet.dayMustWork,
        payRoll: payRoll,
        month: timesheet.month,
        year: timesheet.year,
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

  //delete one payroll

  async deleteOne(req, res) {
    try {
      const payrollId = req.query.payrollId;
      if (!helpers.checkVariable(payrollId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      await model.salary.destroy({
        where: {
          payrollId: payrollId,
        },
      });
      await model.benefits.destroy({
        where: {
          payrollId: payrollId,
        },
      });
      await model.payRolls.destroy({
        where: {
          id: payrollId,
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

  async getOne(req, res) {
    try {
      const profileId = req.query.profileId;
      const month = req.query.month;
      const year = req.query.year;
      if (
        !helpers.checkVariable(profileId) ||
        !helpers.checkVariable(month) ||
        !helpers.checkVariable(year)
      ) {
        return helpers.handleResponse(res, 'missingParams');
      }

      const profile = await model.profile.findAll({
        where: {
          id: profileId,
        },
      });

      const timesheet = await model.totalTimeSheets.findAll({
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });

      const payRoll = await model.payRolls.findAll({
        include: [{
            model: model.salary,
          },
          {
            model: model.benefits,
          },
        ],
        where: {
          profileId: profileId,
          month: month,
          year: year,
        },
      });

      return helpers.handleResponse(res, 'getListSuccess', {
        data: {
          profile,
          timesheet,
          payRoll,
        },
      });
    } catch (error) {
      console.log(error);
      return helpers.handleResponse(res, 'error', {
        error: error.name,
      });
    }
  },
  async getOneById(req, res) {
    try {
      const payrollId = req.query.payrollId;
      if (!helpers.checkVariable(payrollId)) {
        return helpers.handleResponse(res, 'missingParams');
      }

      let result = [];
      const payRoll = await model.payRolls.find({
        include: [{
            model: model.salary,
          },
          {
            model: model.benefits,
          },
        ],
        where: {
          id: payrollId,
        },
      });

      const timesheet = await model.totalTimeSheets.find({
        where: {
          profileId: payRoll.profileId,
          month: payRoll.month,
          year: payRoll.year,
        },
      });

      const profile = await model.profile.find({
        where: {
          id: payRoll.profileId,
        },
      });
      if (helpers.checkVariable(timesheet)) {
        result.push({
          profileId: payRoll.profileId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          dayMustWork: timesheet.dayMustWork,
          payRoll: payRoll,
          month: payRoll.month,
          year: payRoll.year,
        });
      } else {
        result.push({
          profileId: payRoll.profileId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          dayMustWork: 0,
          payRoll: payRoll,
          month: payRoll.month,
          year: payRoll.year,
        });
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

  async clonePayroll(req, res) {
    try {
      const {
        oldMonth,
        oldYear,
        newMonth,
        newYear
      } = req.body;
      // console.log(req.body)
      if (
        !helpers.checkVariable(oldMonth) ||
        !helpers.checkVariable(oldYear) ||
        !helpers.checkVariable(newMonth) ||
        !helpers.checkVariable(newYear)
      ) {
        return helpers.handleResponse(res, 'missingParams');
      }
      const deletePR = await model.payRolls.findAll({
        where: {
          month: newMonth,
          year: newYear,
        },
      });

      for (const pr of deletePR) {
        await model.benefits.destroy({
          where: {
            payrollId: pr.id,
          },
        });

        await model.salary.destroy({
          where: {
            payrollId: pr.id,
          },
        });

        await model.payRolls.destroy({
          where: {
            id: pr.id,
          },
        });
      }

      const payRolls = await model.payRolls.findAll({
        include: [{
            model: model.salary,
          },
          {
            model: model.benefits,
          },
        ],
        where: {
          month: oldMonth,
          year: oldYear,
        },
      });

      for (const payRoll of payRolls) {

        const payroll = await model.payRolls.create({
          profileId: payRoll.profileId,
          month: newMonth,
          year: newYear,
          grossSalary: payRoll.grossSalary,
          advancePayment: payRoll.advancePayment,
          netSalary: payRoll.netSalary,
        });

        await model.salary.create({
          payrollId: payroll.id,
          basicSalary: payRoll.salary.basicSalary,
          workingPayment: 0,
          overTimePayment: 0,
        });

        await model.benefits.create({
          payrollId: payroll.id,
          bonus: payRoll.benefit.bonus,
          mealAllowance: payRoll.benefit.mealAllowance,
          conveyanceAllowance: payRoll.benefit.conveyanceAllowance,
        });
      }

      const profiles = await model.profile.findAll();

      const pr = await model.payRolls.findAll({
        include: [{
            model: model.salary,
          },
          {
            model: model.benefits,
          },
        ],
        where: {
          month: newMonth,
          year: newYear,
        },
      });

      let result = [];
      profiles.forEach((profile) => {
        pr.forEach((payRoll) => {
          if (profile.id === payRoll.profileId) {
            result.push({
              profileId: profile.id,
              firstName: profile.firstName,
              lastName: profile.lastName,
              month: payRoll.month,
              year: payRoll.year,
              grossSalary: payRoll.grossSalary,
              advancePayment: payRoll.advancePayment,
              netSalary: payRoll.netSalary,
              salary: payRoll.salary,
              benefit: payRoll.benefit,
            });
          }
        });
      });
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