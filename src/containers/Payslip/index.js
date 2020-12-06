import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import './index.css';
import { endpoint } from '../../constants/config';
import { alertPopup } from '../../utils/alertPopup';
import errorHandler from '../../utils/handlerError';
import { DatePicker } from 'antd';
import { constant } from '../../constants/constant';
import { Redirect } from 'react-router-dom';
const { readPaySlip } = constant.permissions;
const { MonthPicker } = DatePicker;
const MONTH_FORMAT = 'MM/YYYY';

const d = new Date();
const m = d.getMonth() + 1;
const y = d.getFullYear();

// const { readPaySlip } = constant.permissions;

class Payslip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listPayslip: { profile: [], timesheet: [], payRoll: [] },
      month: m,
      year: y,
    };
  }

  componentDidMount() {
    const { month, year } = this.state;
    const { match } = this.props;
    const profileId = match.params.id;

    APIcaller(
      `${endpoint.payslip}?month=${month}&year=${year}&profileId=${profileId}`,
      'GET',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      }
    ).then((res) => {
      const message = get(res, 'data.responseKey');
      const listPayslip = get(res, 'data.data');

      if (message === responses.getListSuccess) {
        this.setState({
          listPayslip,
        });
      } else {
        alertPopup('FAILD!!!!', errorHandler(message));
      }
    });
  }

  handleChangeMonth = (monthSelected) => {
    const { match } = this.props;
    const profileId = match.params.id;
    this.setState(
      {
        month: moment(monthSelected)
          .format('MM/DD/YYYY')
          .slice(0, 2),
        year: moment(monthSelected)
          .format('MM/DD/YYYY')
          .slice(6, 10),
      },
      () => {
        const { month, year } = this.state;

        APIcaller(
          `${endpoint.payslip}?month=${month}&year=${year}&profileId=${profileId}`,
          'GET',
          {
            token: getItemLocalStore('token'),
            accountid: getItemLocalStore('accountid'),
          }
        ).then((res) => {
          const message = get(res, 'data.responseKey');
          const listPayslip = get(res, 'data.data');
          if (message === responses.getListSuccess) {
            this.setState({
              listPayslip,
            });
          } else {
            alertPopup('FAILD!!!!', errorHandler(message));
          }
        });
      }
    );
  };

  render() {
    const { listPayslip } = this.state;
    let salary, benefit;
    let profile = listPayslip.profile;
    let timesheet = listPayslip.timesheet;
    let payroll = listPayslip.payRoll;
    if (profile.length) {
      profile = profile[0];
    }
    if (timesheet.length) {
      timesheet = timesheet[0];
    }
    if (payroll.length) {
      payroll = payroll[0];
      salary = payroll.salary;
      benefit = payroll.benefit;
    }
    // console.log(profile, timesheet, payroll, salary, benefit);

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
    });
    const listPermission = getItemLocalStore('listPermissions');
    return (
      <div className="container-fluid">
        {listPermission.includes(readPaySlip) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Payslip</h3>
            </div>
            <div className="container-fluid mt-3 pb-5">
              <div className="row form-group">
                <label className="col-2 col-lg-1 col-form-label">Month:</label>
                <div className="col-5">
                  <MonthPicker
                    defaultValue={moment(`${m}/${y}`, MONTH_FORMAT)}
                    onChange={this.handleChangeMonth}
                    format={MONTH_FORMAT}
                    placeholder="Insert month and year"
                  />
                </div>
              </div>
              <div className="row list-totalTS">
                <div className="row col-12 col-md-7 col-lg-6">
                  <div className="col-5 col-md-6 col-lg-5">
                    {profile ? (
                      <React.Fragment>
                        <li>Employee Name:</li>
                        <li>Date of birth:</li>
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                    {timesheet ? (
                      <React.Fragment>
                        <li>Total Hours:</li>
                        <li>Working Dates:</li>
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                    {salary ? (
                      <React.Fragment>
                        <li>Basic Salary:</li>
                        <li>Working Payment:</li>
                        <li>Overtime Payment:</li>
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="col-4 col-md-6">
                    {profile ? (
                      <React.Fragment>
                        <p>{profile.firstName + ' ' + profile.lastName}</p>
                        <p>{moment(profile.birthday).format('MM/DD/YYYY')}</p>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <p></p>
                        <p></p>
                      </React.Fragment>
                    )}

                    {timesheet ? (
                      <React.Fragment>
                        <p>{timesheet.totalHours}</p>
                        <p>{timesheet.workDay}</p>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <p></p>
                        <p></p>
                      </React.Fragment>
                    )}
                    {salary ? (
                      <React.Fragment>
                        <p>{formatter.format(salary.basicSalary)}</p>
                        <p>{formatter.format(salary.workingPayment)}</p>
                        <p>{formatter.format(salary.overTimePayment)}</p>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <p></p>
                        <p></p>
                        <p></p>
                      </React.Fragment>
                    )}
                  </div>
                </div>
                <div className="row col-12 col-md-5 col-lg-6">
                  <div className="col-5 col-md-10 col-lg-6">
                    {benefit ? (
                      <React.Fragment>
                        <li>Bonus:</li>
                        <li>Meal Allowance:</li>
                        <li>Conveyance Allowance:</li>
                        <li>Gross Salary:</li>
                        <li>Advance Payment:</li>
                        <li>Net Salary:</li>
                      </React.Fragment>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="col-2">
                    {benefit ? (
                      <React.Fragment>
                        <p>{formatter.format(benefit.bonus)}</p>
                        <p>{formatter.format(benefit.mealAllowance)}</p>
                        <p>{formatter.format(benefit.conveyanceAllowance)}</p>
                        <p>{formatter.format(payroll.grossSalary)}</p>
                        <p>{formatter.format(payroll.advancePayment)}</p>
                        <p>{formatter.format(payroll.netSalary)}</p>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

export default Payslip;
