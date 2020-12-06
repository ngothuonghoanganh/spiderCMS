import React from 'react';
import moment from 'moment';
import $ from 'jquery';
import { get } from 'lodash';
import * as responses from '../../constants/response';
import './index.css';
import APIcaller from '../../utils/APIcaller';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import ListItemTimesheet from './ListItem';
import { Link, Redirect } from 'react-router-dom';
import { endpoint } from '../../constants/config';
import { alertPopup } from '../../utils/alertPopup';
import errorHandler from '../../utils/handlerError';
import { DatePicker } from 'antd';

const { MonthPicker } = DatePicker;
const MONTH_FORMAT = 'MM/YYYY';

class Timesheet extends React.Component {
  constructor(props) {
    super(props);
    this.dataTable = React.createRef();
    const { history } = this.props;

    const d = new Date();
    let m = '';
    let y = '';
    if (
      history.location.state &&
      history.location.state.month &&
      history.location.state.year
    ) {
      m = history.location.state.month;
      y = history.location.state.year;
    } else {
      m = d.getMonth() + 1;
      y = d.getFullYear();
    }
    const list = this.props;

    this.state = {
      listTimesheets: [],
      listTotalTimesheets: [],
      profileId: list.match.params.id,
      fullName: '',
      loading: true,
      month: m,
      year: y,
      selectedDate: '',
      project: '',
      workingHours: '',
      overTimeHours: '',
      totalHours: '',
      note: '',
    };
  }

  componentDidMount() {
    const { profileId, month, year } = this.state;

    //Get name Employee
    APIcaller(`${endpoint.profile}?profileId=${profileId}`, 'GET', {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    }).then((res) => {
      const message = get(res, 'data.responseKey');
      const data = get(res, 'data.data');
      console.log(res);
      if (message === responses.getOneSuccess) {
        this.setState({
          fullName: data.firstName + ' ' + data.lastName,
        });
      } else {
        alertPopup('FAILD!!!!', errorHandler(message));
      }
    });

    // Get total timesheets
    APIcaller(
      `${endpoint.timesheetstotal}?month=${month}&year=${year}&profileId=${profileId}`,
      'GET',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      }
    ).then((res) => {
      const message = get(res, 'data.responseKey');
      const lisTTTS = get(res, 'data.data');
      if (message === responses.getListSuccess) {
        this.setState({
          listTotalTimesheets: lisTTTS,
        });
      }
      // else {
      //   alertPopup('FAILD!!!!', errorHandler(message));
      // }
    });

    // Get timesheets
    APIcaller(
      `${endpoint.timesheets}?month=${month}&year=${year}&profileId=${profileId}`,
      'GET',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      }
    )
      .then((res) => {
        const message = get(res, 'data.responseKey');

        // let listTSSort = [];
        // if (listTS) {
        // }
        if (message === responses.getListSuccess) {
          const listTS = get(res, 'data.data');
          const listTSSort = listTS.sort(this.compare);

          this.setState({
            listTimesheets: listTSSort,
          });
        }
        // else {
        //   alertPopup('FAILED!!!!', errorHandler(message));
        // }
      })
      .then(() => {
        this.setState({
          loading: false,
        });
        const t = $(this.dataTable.current).DataTable({
          destroy: true,
          columnDefs: [
            { orderable: false, targets: [1, -1] },
            { width: '10%', targets: 0 },
            { width: '30%', targets: 1 },
            { width: '30%', targets: 2 },
            { width: '40%', targets: 3 },
            { width: '20%', targets: 4 },
          ],
          lengthMenu: [
            [10, 25],
            [10, 31],
          ],
        });
        if (t.context.length !== 0) {
          t.column(0)
            .nodes()
            .map((cell, i) => (cell.innerHTML = i + 1))
            .draw();
        }
      });
  }

  handleChangeMonth = (monthSelected) => {
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
        const { profileId, month, year } = this.state;

        APIcaller(
          `${endpoint.timesheetstotal}?month=${month}&year=${year}&profileId=${profileId}`,
          'GET',
          {
            token: getItemLocalStore('token'),
            accountid: getItemLocalStore('accountid'),
          }
        ).then((res) => {
          const message = get(res, 'data.responseKey');
          const lisTTTS = get(res, 'data.data');
          if (message === responses.getListSuccess) {
            this.setState({
              listTotalTimesheets: lisTTTS,
            });
          } else {
            alertPopup('FAILED!!!!', errorHandler(message));
          }
        });

        APIcaller(
          `${endpoint.timesheets}?month=${month}&year=${year}&profileId=${profileId}`,
          'GET',
          {
            token: getItemLocalStore('token'),
            accountid: getItemLocalStore('accountid'),
          }
        ).then((res) => {
          const message = get(res, 'data.responseKey');
          const listTS = get(res, 'data.data');
          const listTSSort = listTS.sort(this.compare);
          if (message === responses.getListSuccess) {
            this.setState({
              listTimesheets: listTSSort,
            });
          } else {
            alertPopup('FAILD!!!!', errorHandler(message));
          }
        });
      }
    );
  };

  onDelete = (id) => {
    const { listTimesheets, profileId, month, year } = this.state;
    APIcaller(
      `${endpoint.timesheet}?timesheetId=${id}`,
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
      const index = this.findIndex(listTimesheets, id);
      if (index !== -1) {
        listTimesheets.splice(index, 1);
        this.setState({
          listTimesheets,
        });
      }
    });

    APIcaller(
      `${endpoint.timesheetstotal}?month=${month}&year=${year}&profileId=${profileId}`,
      'GET',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      }
    ).then((res) => {
      const message = get(res, 'data.responseKey');
      if (message === responses.getListSuccess) {
        this.setState({
          listTotalTimesheets: res.data.data,
        });
      } else {
        alertPopup('FAILED!!!!', errorHandler(message));
      }
    });
  };

  findIndex(listTimesheets, id) {
    let result = -1;
    listTimesheets.forEach((timesheet, index) => {
      if (timesheet.id === id) {
        result = index;
      }
    });
    return result;
  }

  showListTS = (listTS) => {
    let result = null;
    if (listTS.length > 0) {
      result = listTS.map((list, index) => (
        <ListItemTimesheet
          key={index}
          list={list}
          index={index}
          onDelete={this.onDelete}
        />
      ));
    }
    return result;
  };

  handleSelectDate = (date, name) => {
    this.setState({
      [name]: date,
    });
  };

  handleChange = (e) => {
    const { name, type, value } = e.target;
    if (type !== 'checkbox') {
      this.setState({
        [name]: value,
      });
    }
  };

  // onSave = (e) => {
  //   e.preventDefault();

  //   const {
  //     profileId,
  //     month,
  //     year,
  //     selectedDate,
  //     project,
  //     workingHours,
  //     overTimeHours,
  //     totalHours,
  //     note,
  //   } = this.state;
  //   const date = moment(selectedDate).format('MM/DD/YYYY');

  //   APIcaller(
  //     `${endpoint.createtimesheet}?profileId=${profileId}`,
  //     'POST',
  //     {
  //       token: getItemLocalStore('token'),
  //       accountid: getItemLocalStore('accountid'),
  //     },
  //     {
  //       date,
  //       project,
  //       workingHours,
  //       overTimeHours,
  //       totalHours,
  //       note,
  //     }
  //   ).then((res) => {
  //     const message = get(res, 'data.responseKey');
  //     if (res.data.responseKey === responses.insertSuccess) {
  //       const data = get(res, 'data.data');
  //       if (data) {
  //         APIcaller(
  //           `${endpoint.timesheets}?month=${this.state.month}&year=${this.state.year}&profileId=${profileId}`,
  //           'GET',
  //           {
  //             token: getItemLocalStore('token'),
  //             accountid: getItemLocalStore('accountid'),
  //           }
  //         ).then((res) => {
  //           const message = get(res, 'data.responseKey');
  //           if (message === responses.getListSuccess) {
  //             this.setState({
  //               listTimesheets: res.data.data,
  //             });
  //           } else {
  //             alertPopup('FAILD!!!!', errorHandler(message));
  //           }
  //         });
  //       }
  //     } else {
  //       alertPopup('DATA IS EXISTED!!!!', errorHandler(message));
  //     }
  //   });

  //   APIcaller(
  //     `${endpoint.timesheetstotal}?month=${month}&year=${year}&profileId=${profileId}`,
  //     'GET',
  //     {
  //       token: getItemLocalStore('token'),
  //       accountid: getItemLocalStore('accountid'),
  //     }
  //   ).then((res) => {
  //     const message = get(res, 'data.responseKey');
  //     if (message === responses.getListSuccess) {
  //       this.setState({
  //         listTotalTimesheets: res.data.data,
  //       });
  //     } else {
  //       alertPopup('FAILED!!!!', errorHandler(message));
  //     }
  //   });
  //   this.setState({
  //     selectedDate: '',
  //     project: '',
  //     workingHours: '',
  //     overTimeHours: '',
  //     totalHours: '',
  //     note: '',
  //   });
  // };

  onReset = (e) => {
    e.preventDefault();
    this.setState({
      selectedDate: '',
      project: '',
      workingHours: '',
      overTimeHours: '',
      totalHours: '',
      note: '',
    });
  };

  compare = (a, b) => {
    let comparison = 0;
    let aD = a.date;
    let bD = b.date;
    if (aD > bD) {
      comparison = 1;
    } else if (aD < bD) {
      comparison = -1;
    }
    return comparison;
  };

  render() {
    const {
      listTimesheets,
      listTotalTimesheets,
      profileId,
      fullName,
      month,
      year,
    } = this.state;
    const listTTTS = listTotalTimesheets[0];
    const listPermission = getItemLocalStore('listPermissions');
    // const { history } = this.props;

    if (listPermission.includes('readOneTimeSheet')) {
      return (
        <div className="container-fluid">
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Timesheet</h3>
            </div>
            <div className="container-fluid mt-3">
              <div className="row">
                <div className="col-12 col-md-5 col-lg-4 form-group form-inline month-picker-ts">
                  <label className="col-form-label">Month:</label>

                  <MonthPicker
                    className="ml-2"
                    defaultValue={moment(`${month}/${year}`, MONTH_FORMAT)}
                    onChange={this.handleChangeMonth}
                    format={MONTH_FORMAT}
                    placeholder="Insert month and year"
                  />
                </div>
                <div className="col-12 col-md-7">
                  {listTTTS ? (
                    <div className="row list-totalTS">
                      <div className="col-4 col-md-5 col-lg-4">
                        <p>Employee Name:</p>
                        <p>Working Hours</p>
                        <p>Overtime Hours</p>
                        <p>Total Hours</p>
                        <p>Working Days:</p>
                      </div>
                      <div className="col-5">
                        <p>{fullName}</p>
                        <p>{listTTTS.totalWorkingHours}</p>
                        <p>{listTTTS.totalOverTimeHours}</p>
                        <p>{listTTTS.totalHours}</p>
                        <p>{listTTTS.workDay}</p>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="d-flex pb-2 mb-3">
                <Link
                  to={{
                    pathname: `/${endpoint.addTimesheet}`,
                    state: { profileId: profileId, month: month, year: year },
                  }}
                  className="btn btn-orange float-right">
                  Add
                </Link>
              </div>
              <div>
                <table
                  ref={this.dataTable}
                  cellSpacing="0"
                  className="table-responsive table table-bordered table-hover bg-white"
                  style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>No.</th>
                      <th>Date</th>
                      <th>Project</th>
                      <th>Tasks</th>
                      <th>Working Hours</th>
                      <th>Overtime Hours</th>
                      <th>Total Hours</th>
                      <th>Note</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>{this.showListTS(listTimesheets)}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <Redirect to="/" />;
  }
}

export default Timesheet;
