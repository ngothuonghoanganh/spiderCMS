import React from 'react';
import moment from 'moment';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import VirtualizedSelect from 'react-virtualized-select';
import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import { get } from 'lodash';
import { Link, Redirect } from 'react-router-dom';
import { endpoint } from '../../constants/config';
import { connect } from 'react-redux';
import './index.css';
import { DatePicker } from 'antd';
import { actGetTimesheetRequest, actUpdateTimesheetRequest } from './actions';
import { constant } from '../../constants/constant';
import { getItemLocalStore } from '../../utils/handleLocalStore';
const { updateTimeSheet } = constant.permissions;
const DATE_FORMAT = 'MM/DD/YYYY';

class EditTimesheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listProjectId: [],
      projectId: null,
      selectedProjectId: '',
      loading: false,
      date: '',
      project: '',
      workingHours: '',
      overTimeHours: '',
      task: '',
      note: '',
    };
  }

  componentDidMount = () => {
    const { match, onGetTimesheet } = this.props;
    const id = match.params.id;
    // console.log(id);
    if (id) {
      onGetTimesheet(id, () => {
        APIcaller(`${endpoint.projects}`).then((res) => {
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
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.timesheetUpdating) {
      const { timesheetUpdating } = nextProps;
      const dateFormated = moment(timesheetUpdating.date).format('MM/DD/YYYY');
      this.setState({
        date: dateFormated,
        selectedProjectId: timesheetUpdating.project,
        workingHours: timesheetUpdating.workingHours,
        overTimeHours: timesheetUpdating.overTimeHours,
        task: timesheetUpdating.task,
        note: timesheetUpdating.note,
      });
    }
  }

  handleChangeDate = (date, name) => {
    const dateFormated = moment(date)
      .format('MM/DD/YYYY')
      .slice(0, 10);
    this.setState({
      [name]: dateFormated,
    });
  };

  handleChange = (name, value) => {
    this.setState({ [name]: value }, () => {
      console.log(this.state.projectId);
    });
  };

  onChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  };

  onSave = (e) => {
    e.preventDefault();
    const {
      projectId,
      date,
      workingHours,
      overTimeHours,
      task,
      note,
    } = this.state;
    const { id } = this.props.timesheetUpdating;
    const { history, onUpdateTimesheet } = this.props;
    const timesheet = {
      id: id,
      date: date,
      projectId: projectId,
      workingHours: workingHours,
      overTimeHours: overTimeHours,
      task: task,
      note: note,
    };

    onUpdateTimesheet(timesheet, () => {
      // history.goBack();
      const month = history.location.state.month;
      const year = history.location.state.year;
      const profileId = history.location.state.profileId;
      history.push(`/${endpoint.viewTimesheet}/${profileId}`, {
        month: month,
        year: year,
      });
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
      date,
      workingHours,
      overTimeHours,
      task,
      note,
    } = this.state;
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
    const dateMustWork = this.getWeekdaysInMonth(
      moment(date).month() + 1,
      moment(date).year()
    );
    const listPermissions = getItemLocalStore('listPermissions');

    const hourOutsourcing = dateMustWork * 8;
    const isOutsourcing =
      projectId &&
      listProjectId.length &&
      listProjectId.filter(({ id }) => id === projectId)[0].projectType ===
        'Outsourcing';
    const profileId =
      history.location.state && history.location.state.profileId
        ? history.location.state.profileId
        : null;
    return (
      <div className="container-fluid">
        {listPermissions.includes(updateTimeSheet) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Edit Information</h3>
              <span className="card-subtitle">
                Please fill out the form below completely
              </span>
            </div>
            <div className="wrap-form pt-3 pb-5">
              <form className="form-horizontal" onSubmit={this.onSave}>
                <div className="row form-group">
                  <label
                    htmlFor="project"
                    className="col-4 col-md-2 col-form-label ts-form-label">
                    Date<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <DatePicker
                      value={moment(date, DATE_FORMAT)}
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
                      options={listProjectId}
                      simpleValue
                      onChange={(value) => {
                        this.handleChange('projectId', value);
                      }}
                      value={projectId}
                      labelKey="projectName"
                      valueKey="id"
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="workingHours"
                    className="col-4 col-md-2 col-form-label ts-form-label">
                    Working Hours<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <input
                      id="workingHours"
                      type="number"
                      required
                      min="1"
                      max={isOutsourcing ? '' + hourOutsourcing : '8'}
                      className="form-control"
                      name="workingHours"
                      value={workingHours}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="overTimeHours"
                    className="col-4 col-md-2 col-form-label ts-form-label">
                    Over Time Hours<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <input
                      id="overTimeHours"
                      type="number"
                      required
                      min="0"
                      max="16"
                      className="form-control"
                      name="overTimeHours"
                      value={overTimeHours}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="row form-group">
                  <label
                    htmlFor="overTime"
                    className="col-4 col-md-2 col-form-label ts-form-label">
                    Tasks<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <input
                      id="task"
                      type="text"
                      required
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
                    className="col-4 col-md-2 col-form-label ts-form-label">
                    Note
                  </label>
                  <div className="col-md-8">
                    <textarea
                      type="text"
                      rows="4"
                      className="form-control"
                      id="note"
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

const mapStateToProps = (state) => {
  return {
    timesheetUpdating: state.timesheetUpdating,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    onGetTimesheet: (id, callback) => {
      dispatch(actGetTimesheetRequest(id, callback));
    },
    onUpdateTimesheet: (timesheet, callback) => {
      dispatch(actUpdateTimesheetRequest(timesheet, callback));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTimesheet);
