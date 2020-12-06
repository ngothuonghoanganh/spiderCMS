import React from 'react';
import moment from 'moment';
import $ from 'jquery';
import { get } from 'lodash';
import { connect } from 'react-redux';
import './index.css';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { Redirect } from 'react-router-dom';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { endpoint } from '../../constants/config';
import { alertPopup, confirmPopup } from '../../utils/alertPopup';
import errorHandler from '../../utils/handlerError';
import { Link } from 'react-router-dom';
import ListItem from './listItem';
import { DatePicker } from 'antd';
import { actGetPayrollRequest } from './actions';

const { MonthPicker } = DatePicker;
const MONTH_FORMAT = 'MM/YYYY';
// const m = d.getMonth() + 1;
// const y = d.getFullYear();

class Payroll extends React.Component {
  constructor(props) {
    super(props);

    const { history } = this.props;
    const d = new Date();
    let m = '';
    let y = '';
    if (history.location.state && history.location.state) {
      m = history.location.state.month;
      y = history.location.state.year;
    } else {
      m = d.getMonth() + 1;
      y = d.getFullYear();
    }

    this.state = {
      listPayroll: [],
      loading: false,
      grossSalary: '',
      netSalary: '',
      profileId: '',
      month: m,
      year: y,
      basicSalary: '',
      workingPayment: '',
      overTimePayment: '',
      bonus: '',
      conveyanceAllowance: '',
      mealAllowance: '',
    };

    this.dataTable = React.createRef();
  }

  componentDidMount() {
    const { month, year } = this.state;
    const { onGetPayroll } = this.props;
    onGetPayroll(month, year);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps && nextProps.payrollFetching) {
      const { payrollFetching } = nextProps;
      this.setState(
        {
          listPayroll: payrollFetching,
        },
        () => {
          this.setState({
            loading: true,
          });
          const t = $(this.dataTable.current).DataTable({
            destroy: true,
            columnDefs: [{ orderable: false, targets: [1, -1] }],
            lengthMenu: [
              [10, 25, 50, -1],
              [10, 25, 50, 'All'],
            ],
          });
          if (t.context.length !== 0) {
            t.column(0)
              .nodes()
              .map((cell, i) => (cell.innerHTML = i + 1))
              .draw();
          }
        }
      );
    }
  };

  handleChangeMonth = (monthSelected) => {
    this.setState(
      {
        month: monthSelected.month() + 1,
        year: monthSelected.year(),
      },
      () => {
        const { month, year } = this.state;

        APIcaller(`${endpoint.payrolls}?month=${month}&year=${year}`).then(
          (res) => {
            console.log(res);
            const message = get(res, 'data.responseKey');
            if (message === responses.getListSuccess) {
              this.setState({
                listPayroll: res.data.data,
              });
            } else {
              alertPopup('FAILED!!!!', errorHandler(message));
            }
          }
        );
      }
    );
  };

  onDelete = (id) => {
    const { listPayroll } = this.state;

    APIcaller(
      `${endpoint.payrolls}?payrollId=${id}`,
      'DELETE',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      },
      {}
    ).then((res) => {
      if (res.data.message === 'delete successfully') {
        this.setState({
          loading: false,
        });
      }
      const index = this.findIndex(listPayroll, id);
      if (index !== -1) {
        listPayroll.splice(index, 1);
        this.setState({
          listPayroll,
        });
      }
    });
  };

  handleChange = (oldMonth, oldYear, newMonth, newYear) => {
    APIcaller(`${endpoint.payrolls}?month=${oldMonth}&year=${oldYear}`, 'GET', {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    })
      .then((res) => {
        const message = get(res, 'data.responseKey');
        if (message === responses.getListSuccess) {
          this.setState({
            listPayroll: res.data.data,
          });
        } else {
          alertPopup('FAILED!!!!', errorHandler(message));
        }
      })
      .then(() => {
        this.setState(
          {
            month: newMonth,
            year: newYear,
          },
          () => {
            const { month, year } = this.state;
            APIcaller(
              `${endpoint.payrolls}?month=${month}&year=${year}`,
              'GET',
              {
                token: getItemLocalStore('token'),
                accountid: getItemLocalStore('accountid'),
              }
            ).then((res) => {
              const message = get(res, 'data.responseKey');
              if (message === responses.getListSuccess) {
                this.setState({
                  listPayroll: res.data.data,
                });
              } else {
                alertPopup('FAILED!!!!', errorHandler(message));
              }
            });
          }
        );
      });
  };

  onClone = (oldMonth, oldYear, newMonth, newYear) => {
    APIcaller(
      `${endpoint.payrollClone}`,
      'POST',
      {},
      {
        oldMonth,
        oldYear,
        newMonth,
        newYear,
      }
    ).then((res) => {
      const message = res.data.responseKey;
      if (message !== responses.insertSuccess) {
        alertPopup('FAILD!!!', message);
      } else {
        this.handleChange(oldMonth, oldYear, newMonth, newYear);
      }
    });
  };

  findIndex(listPayroll, id) {
    let result = -1;
    listPayroll.forEach((payroll, index) => {
      if (payroll.benefit.payrollId === id) {
        result = index;
      }
    });
    return result;
  }

  daysInMonth = () => {
    const { month, year } = this.state;
    return new Date(year, month, 0).getDate();
  };

  isWeekday = (year, month, day) => {
    var date = new Date(`${month} ${day}, ${year}`).getDay();
    return date !== 0 && date !== 6;
  };

  getWeekdaysInMonth = (month, year) => {
    var days = this.daysInMonth();
    var weekdays = 0;
    for (var i = 0; i < days; i++) {
      if (this.isWeekday(year, month, i + 1)) weekdays++;
    }
    return weekdays;
  };

  showListPayroll = (listPayroll) => {
    let result = null;
    if (listPayroll.length > 0) {
      result = listPayroll.map((list, index) => (
        <ListItem
          key={index}
          list={list}
          index={index}
          onDelete={this.onDelete}
        />
      ));
    }
    return result;
  };

  render() {
    const { listPayroll, month, year } = this.state;
    const listPermission = getItemLocalStore('listPermissions');
    const workDayPerMonth = this.getWeekdaysInMonth(month, year);

    if (listPermission.includes('readPayRoll')) {
      return (
        <div className="container-fluid">
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Payroll Management</h3>
            </div>
            <div className="container-fluid mt-3">
              <div className="table-width">
                <div className="form-inline mb-3">
                  <label className="col-form-label">Month:</label>

                  <MonthPicker
                    className="ml-2"
                    onChange={this.handleChangeMonth}
                    format={MONTH_FORMAT}
                    value={moment(`${month}/${year}`, MONTH_FORMAT)}
                    placeholder="Insert month and year"
                  />

                  {listPayroll.length !== 0 ? (
                    <button
                      type="button"
                      className="btn btn-orange ml-3 mr-3"
                      onClick={() => {
                        if (month === 12) {
                          confirmPopup(
                            'Clone Payroll',
                            `Do you want to clone all Payroll from ${month}/${year} to 1/${parseInt(
                              year
                            ) + 1} ?`,
                            () => {
                              this.onClone(month, year, 1, year + 1);
                            }
                          );
                        } else {
                          confirmPopup(
                            'Clone Payroll',
                            `Do you want to clone all Payroll from ${month}/${year} to ${parseInt(
                              month
                            ) + 1}/${year} ?`,
                            () => {
                              this.onClone(month, year, month + 1, year);
                            }
                          );
                        }
                      }}>
                      Clone
                    </button>
                  ) : (
                    ''
                  )}
                </div>
                <div className="form-inline mb-3">
                  <label className="col-form-label mr-2">
                    Work days per month:
                  </label>
                  <input
                    disabled
                    id=" = this.getWeekdaysInMonth(month, year);"
                    type="number"
                    min="0"
                    max="23"
                    className="form-control"
                    name=" = this.getWeekdaysInMonth(month, year);"
                    value={this.getWeekdaysInMonth(month, year)}
                  />
                </div>
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
                  {listPermission.includes('createPayRoll') ? (
                    <Link
                      to={{
                        pathname: `/${endpoint.addPayroll}`,
                        state: {
                          month: month,
                          year: year,
                          workDayPerMonth: workDayPerMonth,
                        },
                      }}
                      className="btn btn-orange float-right">
                      Add
                    </Link>
                  ) : (
                    ''
                  )}
                </div>
                <div>
                  <table
                    ref={this.dataTable}
                    cellSpacing="0"
                    className="table-responsive table table-bordered table-hover bg-white"
                    style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <React.Fragment>
                          <th>No.</th>
                          <th>Employee Name</th>
                          <th>Basic Salary</th>
                          <th>Working Hours</th>
                          <th>Working Payment</th>
                          <th>Overtime Hours</th>
                          <th>Overtime Payment</th>
                          <th>Bonus</th>
                          <th>Conveyance Allowance</th>
                          <th>Meal Allowance</th>
                          <th>Gross Salary</th>
                          <th>Advance Payment</th>
                          <th>Net Salary</th>
                          <th />
                        </React.Fragment>
                      </tr>
                    </thead>
                    <tbody>{this.showListPayroll(listPayroll)}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <Redirect to="/" />;
  }
}

const mapStateToProps = (state) => {
  return {
    payrollFetching: state.payrollFetching,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    onGetPayroll: (month, year) => {
      dispatch(actGetPayrollRequest(month, year));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Payroll);
