import React from 'react';
import moment from 'moment';
import * as responses from '../../constants/response';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import { get } from 'lodash';
import { Link, Redirect } from 'react-router-dom';
import APIcaller from '../../utils/APIcaller';
import { alertPopup } from '../../utils/alertPopup';
import { endpoint } from '../../constants/config';
import errorHandler from '../../utils/handlerError';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { DatePicker } from 'antd';
import './index.css';
import { constant } from '../../constants/constant';
const { createTimeSheet } = constant.permissions;
const DATE_FORMAT = 'MM/DD/YYYY';
const d = new Date();
const m = d.getMonth() + 1;
const y = d.getFullYear();

class AddTimesheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listProjectId: [],
      projectId: null,
      date: moment(d).format(DATE_FORMAT),
      projectName: '',
      workingHours: '',
      overTimeHours: '',
      task: '',
      note: '',
    };
  }

  componentDidMount() {
    APIcaller(`${endpoint.projects}`).then((res) => {
      console.log(res.data);
      const message = get(res, 'data.responseKey');
      if (message === responses.getListSuccess) {
        const listProject = res.data.data.map(
          ({ id, projectName, projectType }) => ({
            id,
            projectName,
            projectType,
          })
        );
        listProject.forEach((projects) => {
          if (projects.projectName === this.state.selectedProjectId) {
            this.setState({
              projectId: projects.id,
            });
          }
        });
        this.setState({
          listProjectId: listProject,
        });
      }
    });
  }

  handleSelectDate = (selectedDate) => {
    const date = moment(selectedDate).format(DATE_FORMAT);
    this.setState({
      date,
    });
  };

  handleChange = (name, value) => {
    this.setState({ [name]: value }, () => {
      console.log(this.state);
    });
  };

  onChange = (e) => {
    const { name, type, value } = e.target;
    if (type !== 'checkbox') {
      this.setState({
        [name]: value,
      });
    }
  };

  onSave = (e) => {
    e.preventDefault();
    const { history } = this.props;
    const {
      date,
      projectId,
      workingHours,
      overTimeHours,
      task,
      note,
    } = this.state;
    const profileId = history.location.state.profileId;
    const month = history.location.state.month;
    const year = history.location.state.year;

    APIcaller(
      `${endpoint.createtimesheet}?profileId=${profileId}`,
      'POST',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      },
      {
        date,
        projectId,
        workingHours,
        overTimeHours,
        task,
        note,
      }
    ).then((res) => {
      const message = get(res, 'data.responseKey');
      if (message === responses.insertSuccess) {
        history.push(`/${endpoint.viewTimesheet}/${profileId}`, {
          month: month,
          year: year,
        });
      } else {
        alertPopup('FAILED!!!!', errorHandler(message));
      }
    });
  };

  disabledDate = (current) => {
    // Can not select days of last month
    return current < moment().startOf('month');
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
    const {
      listProjectId,
      projectId,
      workingHours,
      overTimeHours,
      task,
      date,
      note,
    } = this.state;
    console.log(this.state);

    const listPermissions = getItemLocalStore('listPermissions');

    const { history } = this.props;
    let month = moment(new Date()).month() + 1;
    let year = moment(new Date()).year();
    if (
      history.location.state &&
      history.location.state.month &&
      history.location.state.year
    ) {
      month = history.location.state.month;
      year = history.location.state.year;
    }
    const profileId =
      history.location.state && history.location.state.profileId
        ? history.location.state.profileId
        : null;
    const dateMustWork = this.getWeekdaysInMonth(
      moment(date).month() + 1,
      moment(date).year()
    );
    const hourOutsourcing = dateMustWork * 8;
    const isOutsourcing =
      projectId &&
      listProjectId.filter(({ id }) => id === projectId)[0].projectType ===
        'Outsourcing';
    return (
      <div className="container-fluid">
        {listPermissions.includes(createTimeSheet) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Timesheet Information</h3>
              <span className="card-subtitle">
                Please fill out the form below completely
              </span>
            </div>
            <div className="wrap-form pt-3 pb-5">
              <form className="form-horizontal" onSubmit={this.onSave}>
                <div className="row form-group">
                  <label
                    htmlFor="salary"
                    className="col-4 col-md-2 col-form-label ts-form-label">
                    Date<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <DatePicker
                      defaultValue={moment(`${m}/${d}/${y}`, DATE_FORMAT)}
                      format={DATE_FORMAT}
                      disabledDate={this.disabledDate}
                      onChange={this.handleSelectDate}
                      placeholder="Insert date"
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="project"
                    className="col-4 col-md-2 col-form-label ts-form-label">
                    Project<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <VirtualizedSelect
                      required
                      options={listProjectId}
                      simpleValue
                      onChange={(value) => {
                        console.log(value);

                        this.handleChange('projectId', value);
                      }}
                      autoFocus={true}
                      value={projectId}
                      labelKey="projectName"
                      valueKey="id"
                      placeholder="Project"
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="workingHours"
                    className="col-4 col-md-2 col-form-label ts-form-label ">
                    Working Hours<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <input
                      required
                      type="number"
                      min="1"
                      max={isOutsourcing ? '' + hourOutsourcing : '8'}
                      placeholder="Working Hours"
                      className="form-control"
                      id="workingHours"
                      name="workingHours"
                      value={workingHours}
                      onChange={this.onChange}
                    />
                  </div>
                </div>

                <div className="row form-group">
                  <label
                    htmlFor="overTimeHours"
                    className="col-4 col-md-2 col-form-label ts-form-label "
                    placeholder="Holiday">
                    Over Time Hours<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <input
                      type="number"
                      min="0"
                      required
                      className="form-control"
                      id="overTimeHours"
                      placeholder="Over Time Hours"
                      name="overTimeHours"
                      value={overTimeHours}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="task"
                    className="col-4 col-md-2 col-form-label ts-form-label ">
                    Tasks<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <input
                      required
                      id="task"
                      type="text"
                      placeholder="Tasks"
                      className="form-control"
                      name="task"
                      value={task}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="note"
                    className="col-4 col-md-2 col-form-label ts-form-label ">
                    Note
                  </label>
                  <div className="col-md-8">
                    <textarea
                      id="note"
                      type="text"
                      rows="4"
                      placeholder="Note"
                      className="form-control"
                      name="note"
                      value={note}
                      onChange={this.onChange}
                    />
                  </div>
                </div>

                <div className="row form-group">
                  <div className="col-4 col-md-2 col-fake-label"></div>
                  <div className="col-md-8">
                    <button
                      type="submit"
                      className="btn btn-orange"
                      // onClick={this.onSave}
                      // to={{
                      //   pathname: `/${endpoint.viewTimesheet}/${profileId}`,
                      //   state: { month: month, year: year },
                      // }}
                    >
                      Save
                    </button>
                    <Link
                      className="btn btn-secondary ml-3"
                      to={{
                        pathname: `/${endpoint.viewTimesheet}/${profileId}`,
                        state: { month: month, year: year },
                      }}>
                      Cancel
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

export default AddTimesheet;
