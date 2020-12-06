import React from 'react';
import moment from 'moment';
import { get } from 'lodash';
import $ from 'jquery';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { endpoint } from '../../constants/config';
import { alertPopup } from '../../utils/alertPopup';
import errorHandler from '../../utils/handlerError';
import ListItem from './ListItem';
import { DatePicker } from 'antd';
import './index.css';
import { constant } from '../../constants/constant';
import { Redirect } from 'react-router-dom';
const { readOneTimeSheet } = constant.permissions;

const { MonthPicker } = DatePicker;
const MONTH_FORMAT = 'MM/YYYY';
const d = new Date();
const m = d.getMonth() + 1;
const y = d.getFullYear();

class Timesheets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listTimesheet: [],
      month: m,
      year: y,
    };
    this.dataTable = React.createRef();
  }

  componentDidMount() {
    const { month, year } = this.state;
    APIcaller(
      `${endpoint.viewAllTimesheet}?month=${month}&year=${year}`,
      'GET',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      }
    )
      .then((res) => {
        const message = get(res, 'data.responseKey');
        if (message === responses.getListSuccess) {
          this.setState({
            listTimesheet: res.data.data,
          });
        } else {
          alertPopup('FAILED!!!!', errorHandler(message));
        }
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
            { width: '50%', targets: 1 },
            { width: '30%', targets: 2 },
            { width: '20%', targets: 3 },
            { width: '20%', targets: 4 },
          ],
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
      });
  }

  handleChangeMonth = (monthSelected) => {
    const time = moment(monthSelected).format('MM/YYYY');

    this.setState(
      {
        month: time.slice(0, 2),
        year: time.slice(3, 8),
      },
      () => {
        const { month, year } = this.state;

        APIcaller(
          `${endpoint.viewAllTimesheet}?month=${month}&year=${year}`,
          'GET',
          {
            token: getItemLocalStore('token'),
            accountid: getItemLocalStore('accountid'),
          }
        ).then((res) => {
          const message = get(res, 'data.responseKey');
          if (message === responses.getListSuccess) {
            this.setState({
              listTimesheet: res.data.data,
            });
          } else {
            alertPopup('FAILED!!!!', errorHandler(message));
          }
        });
      }
    );
  };

  showListTimesheet = (listTimesheet) => {
    let result = null;
    if (listTimesheet.length > 0) {
      result = listTimesheet.map((list, index) => (
        <ListItem key={index} list={list} index={index} />
      ));
    }
    return result;
  };

  // Kiem tra ngay trong tuan (tru T7 CN)
  isWeekday = (year, month, day) => {
    var date = new Date(`${month} ${day}, ${year}`).getDay();
    return date !== 0 && date !== 6;
  };

  // Tinh so ngay lam viec trong thang
  getWeekdaysInMonth = (month, year) => {
    var days = new Date(year, month, 0).getDate();
    var weekdays = 0;
    for (var i = 0; i < days; i++) {
      if (this.isWeekday(year, month, i + 1)) weekdays++;
    }
    return weekdays;
  };

  render() {
    let { listTimesheet, month, year } = this.state;
    const listPermissions = getItemLocalStore('listPermissions');
    return (
      <div className="container-fluid">
        {listPermissions.includes(readOneTimeSheet) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Timesheet Management</h3>
            </div>
            <div className="container-fluid mt-3">
              <div className="form-inline mb-3">
                <label className="col-form-label">Month:</label>

                <MonthPicker
                  className="ml-2"
                  defaultValue={moment(`${m}/${y}`, MONTH_FORMAT)}
                  onChange={this.handleChangeMonth}
                  format={MONTH_FORMAT}
                  placeholder="Insert month and year"
                />
              </div>
              <div className="form-inline mb-3">
                <label className="col-form-label">Work days per month:</label>
                <input
                  disabled
                  id="workDayPerMonth"
                  type="number"
                  min="0"
                  max="23"
                  className="form-control ml-2"
                  name="workDayPerMonth"
                  value={this.getWeekdaysInMonth(month, year)}
                />
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
                      <th>Employee Name</th>
                      <th>Working Hours</th>
                      <th>Overtime Hours</th>
                      <th>Total Hours</th>
                    </tr>
                  </thead>
                  <tbody>{this.showListTimesheet(listTimesheet)}</tbody>
                </table>
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

export default Timesheets;
