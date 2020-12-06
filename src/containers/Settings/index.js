import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import $ from 'jquery';
import {
  changeTheme,
  loadCron,
  setCron,
  loadBirthdayNotification,
} from './actions';
import './Settings.css';
import * as constant from './constants';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { alertPopup } from '../../utils/alertPopup';
import Loading from '../../components/Loading';
import { WARNING, ERROR_SETCRON } from '../../constants/messages';
import { constant as constantGlobal } from '../../constants/constant';
import { Redirect } from 'react-router-dom';
const {
  readSetting,
  createSetting,
  updateSetting,
} = constantGlobal.permissions;
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: '',
      switchButton: true,
      switchButtonNoti: true,
      period: '',
      minute: '',
      day: '',
      fullDate: '',
      loading: true,
    };
  }

  componentWillMount() {
    this.props.loadCron((callback, data = {}) => {
      this.setObjState(data);
    });
    this.props.loadBirthdayNotification((result, data = {}) => {
      this.setNotiState(data);
    });
  }

  onSubmit = (e) => {
    const { switchButton, hours, minute, day, date } = this.state;
    e.preventDefault();
    if (switchButton && (hours || minute || day || date)) {
      this.props.setCron(this.state, 'deleteAvatarsTemp');
    } else {
      alertPopup(WARNING, ERROR_SETCRON);
    }
  };
  onSubmitNoti = (e) => {
    const {
      switchButtonNoti,
      hoursNoti,
      minuteNoti,
      dayNoti,
      dateNoti,
    } = this.state;
    this.setState({
      switchButton: switchButtonNoti,
      hour: hoursNoti,
      minute: minuteNoti,
      day: dateNoti,
      date: dateNoti,
    });
    e.preventDefault();
    if (switchButtonNoti && (hoursNoti || minuteNoti || dayNoti || dateNoti)) {
      this.props.setCron(this.state, 'showBirthdayNotification');
    } else {
      alertPopup(WARNING, ERROR_SETCRON);
    }
  };

  onSwitch = () => {
    $('.form-set-time-clear-db').toggle();
    this.setState({
      switchButton: !this.state.switchButton,
    });
  };

  onSwitchnotific = () => {
    $('.form-set-time-show-noti').toggle();
    this.setState({
      switchButtonNoti: !this.state.switchButtonNoti,
    });
  };
  setObjState = (cronData) => {
    const cronJSON = JSON.parse(cronData || {});
    const time = cronJSON.time.toString();
    let objTime = '';

    if (time.indexOf('/') < 1) {
      const arr = time.split(' ');
      objTime = {
        minute: arr[1],
        hour: arr[2],
        date: arr[3],
        month: arr[4],
        day: arr[5],
      };
    }
    this.setState({
      loading: false,
      // switchButton: cronJSON.active,
      name: cronJSON.name,
      day: objTime.day,
      hours: objTime.hour,
      minute: objTime.minute,
      date: objTime.date,
    });

    if (objTime.day !== '*') {
      this.setState({
        period: 'week',
      });
    } else if (objTime.month !== '*') {
      let fullDate;
      fullDate = moment(fullDate).set({
        date: objTime.date,
        month: objTime.month - 1,
      });
      this.setState({
        period: 'year',
        fullDate,
      });
    } else if (objTime.date !== '*') {
      this.setState({
        period: 'month',
      });
    } else if (objTime.hour !== '*') {
      this.setState({
        period: 'day',
      });
    } else {
      this.setState({
        period: 'hour',
      });
    }
  };
  setNotiState = (cronData) => {
    const cronJSON = cronData || {};
    const time = cronJSON.hasOwnProperty('time')
      ? cronJSON.time.toString()
      : '';
    let objTime = '';

    if (time.indexOf('/') < 1) {
      const arr = time.split(' ');
      objTime = {
        minuteNoti: arr[1],
        hourNoti: arr[2],
        dateNoti: arr[3],
        monthNoti: arr[4],
        dayNoti: arr[5],
      };
    }

    this.setState({
      loading: false,
      // switchButtonNoti: cronJSON.active,
      nameNoti: cronJSON.name,
      dayNoti: objTime.dayNoti,
      hoursNoti: objTime.hourNoti,
      minuteNoti: objTime.minuteNoti,
      dateNoti: objTime.dateNoti,
    });

    if (objTime.dayNoti !== '*') {
      this.setState({
        periodNoti: 'week',
      });
    } else if (objTime.monthNoti !== '*') {
      const fullDateNoti = moment(fullDateNoti).set({
        dateNoti: objTime.dateNoti,
        monthNoti: objTime.monthNoti - 1,
      });
      this.setState({
        periodNoti: 'year',
        fullDateNoti,
      });
    } else if (objTime.dateNoti !== '*') {
      this.setState({
        periodNoti: 'month',
      });
    } else if (objTime.hourNoti !== '*') {
      this.setState({
        periodNoti: 'day',
      });
    } else {
      this.setState({
        periodNoti: 'hour',
      });
    }
  };
  changePeriodNoti = (periodNoti) => {
    this.setState({
      periodNoti: periodNoti.value,
      minuteNoti: '',
      hoursNoti: '',
      dayNoti: '',
      dateNoti: '',
      fullDateNoti: '',
    });
  };
  changePeriod = (period) => {
    this.setState({
      period: period.value,
      minute: '',
      hours: '',
      day: '',
      date: '',
      fullDate: '',
    });
  };
  changeMinuteNoti = (minuteNoti) => {
    this.setState({ minuteNoti: minuteNoti.value });
  };
  changeMinute = (minute) => {
    this.setState({ minute: minute.value });
  };
  changeHoursNoti = (hoursNoti) => {
    this.setState({ hoursNoti: hoursNoti.value });
  };
  changeHours = (hours) => {
    this.setState({ hours: hours.value });
  };
  changeDayNoti = (dayNoti) => {
    this.setState({ dayNoti: dayNoti.value });
  };
  changeDay = (day) => {
    this.setState({ day: day.value });
  };
  changeDateNoti = (dateNoti) => {
    this.setState({ dateNoti: dateNoti.value });
  };
  changeDate = (date) => {
    this.setState({ date: date.value });
  };
  handleChange = (fullDate) => {
    this.setState({ fullDate });
  };
  handleChangeNoti = (fullDateNoti) => {
    this.setState({ fullDateNoti });
  };
  chooseTheme = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
    this.props.changeTheme(value);
  };

  render() {
    const {
      // color,
      switchButton,
      name,
      nameNoti,
      periodNoti,
      minuteNoti,
      hoursNoti,
      dayNoti,
      dateNoti,
      period,
      minute,
      hours,
      date,
      day,
      loading,
      switchButtonNoti,
    } = this.state;
    // const arrRoles = getItemLocalStore('userData.roles');
    // const listRoles = [];
    // if (arrRoles) {
    //   let arrLength = 0;
    //   arrLength = arrRoles.length;
    //   for (let i = 0; i < arrLength; i += 1) {
    //     if (arrRoles[i] && arrRoles[i].id) {
    //       listRoles.push(arrRoles[i].id);
    //     }
    //   }
    // }
    const listPermission = getItemLocalStore('listPermissions');

    return listPermission.includes(createSetting) ||
      listPermission.includes(readSetting) ||
      listPermission.includes(updateSetting) ? (
      <div className="container-fluid settings">
        <div className="form-add card-border-orange card-settings bg-white">
          <div className="card-header card-header-divider pb-2">
            <h3>Settings</h3>
          </div>
          <form
            className={
              listPermission.includes(createSetting)
                ? 'wrap-form'
                : 'wrap-form pb-5'
            }
            onSubmit={this.onSubmit}>
            {loading && <Loading />}
            {(listPermission.includes(readSetting) ||
              listPermission.includes(updateSetting)) && (
              <div className="row form-group">
                <label className="col-md-4 col-form-label ">
                  Change theme color:
                </label>
                <div className="col-md-8 pt-2">
                  <div className="form-check form-check-inline">
                    <label className="form-check-label form-check-label ">
                      <input
                        required
                        type="radio"
                        id="inline-radio1"
                        value="light"
                        onChange={this.chooseTheme}
                        name="color"
                        className="form-check-input form-check-input"
                      />
                      Light
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <label className="form-check-label form-check-label ">
                      <input
                        required
                        type="radio"
                        id="inline-radio2"
                        value="dark"
                        onChange={this.chooseTheme}
                        checked="checked"
                        name="color"
                        className="form-check-input form-check-input"
                      />
                      Dark
                    </label>
                  </div>
                </div>
              </div>
            )}
            {listPermission.includes(createSetting) && (
              <div className="row mt-3">
                <div className="col-md-4 col-lg-3">
                  <span className="mt-1">Auto clear database:</span>
                </div>
                <div className="col-md-8 col-lg-6">
                  <div className="row ">
                    <div className="col-9 col-md-9">
                      <span className="pb-1">{name}</span>
                      <div className="dropdown-divider"></div>
                    </div>
                    <div className="col-2 col-md-2 text-right pr-0">
                      <label className="switch">
                        <input
                          type="checkbox"
                          onChange={this.onSwitch}
                          checked={switchButton}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                  <div className="row form-set-time-clear-db">
                    <div className="form-check">
                      <span className="form-check-label">
                        Every
                        <Select
                          className="cron-block cron-block-period"
                          clearable={false}
                          value={period}
                          onChange={this.changePeriod}
                          options={constant.PERIOD}
                          placeholder="Select"
                        />
                        {period === 'hour' || period === 'day'
                          ? [
                              <div className="cron-block">
                                <div>at</div>
                                {period === 'day' && (
                                  <span className="mr-2">
                                    <Select
                                      placeholder="HH"
                                      className="d-inline-flex mr-2"
                                      clearable={false}
                                      value={hours}
                                      onChange={this.changeHours}
                                      options={constant.HOURS}
                                    />
                                    :
                                  </span>
                                )}
                                <Select
                                  placeholder="mm"
                                  className="d-inline-flex"
                                  clearable={false}
                                  value={minute}
                                  onChange={this.changeMinute}
                                  options={constant.TIME}
                                />
                                {period === 'hour' && (
                                  <div>minutes past the hour</div>
                                )}
                              </div>,
                            ]
                          : [
                              period === 'week' ||
                              period === 'month' ||
                              period === 'year'
                                ? [
                                    <div className="cron-block">
                                      {period === 'week'
                                        ? [
                                            <React.Fragment>
                                              <div>on</div>
                                              <Select
                                                placeholder="ddd"
                                                className="d-inline-flex"
                                                clearable={false}
                                                value={day}
                                                onChange={this.changeDay}
                                                options={constant.DAYS}
                                              />
                                            </React.Fragment>,
                                          ]
                                        : [
                                            <React.Fragment>
                                              <div>on the</div>
                                              {period === 'year'
                                                ? [
                                                    <div className="d-inline-block">
                                                      <DatePicker
                                                        selected={
                                                          this.state.fullDate
                                                        }
                                                        onChange={
                                                          this.handleChange
                                                        }
                                                        dateFormat="DD/MM"
                                                        placeholderText="DD/MM"
                                                        showYearDropdown
                                                        dateFormatCalendar="MMMM"
                                                        scrollableYearDropdown
                                                      />
                                                    </div>,
                                                  ]
                                                : [
                                                    <Select
                                                      placeholder="DD"
                                                      className="d-inline-flex"
                                                      clearable={false}
                                                      value={date}
                                                      onChange={this.changeDate}
                                                      options={constant.DATE}
                                                    />,
                                                  ]}
                                            </React.Fragment>,
                                          ]}
                                      <span className="ml-2 mr-2">at</span>
                                      <Select
                                        placeholder="HH"
                                        className="d-inline-flex mr-2"
                                        clearable={false}
                                        value={hours}
                                        onChange={this.changeHours}
                                        options={constant.HOURS}
                                      />
                                      :
                                      <Select
                                        placeholder="mm"
                                        className="d-inline-flex ml-2"
                                        clearable={false}
                                        value={minute}
                                        onChange={this.changeMinute}
                                        options={constant.TIME}
                                      />
                                    </div>,
                                  ]
                                : '',
                            ]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {listPermission.includes(createSetting) && (
              <div className="row form-set-time-clear-db mt-4">
                <label className="col-md-4 col-lg-3 control-label"></label>
                <div className="col-md-5 col-lg-6 mb-3">
                  <button type="submit" className="btn btn-orange">
                    Save
                  </button>
                  {/* <button className="btn btn-secondary ml-1">Cancel</button> */}
                </div>
              </div>
            )}
          </form>

          {listPermission.includes(createSetting) && (
            <form className="wrap-form">
              {loading && <Loading />}
              <div className="row mt-3">
                <div className="col-md-4 col-lg-3">
                  <span className="mt-1">Auto show notification:</span>
                </div>
                <div className="col-md-8 col-lg-6">
                  <div className="row ">
                    <div className="col-9 col-md-9">
                      <span className="pb-1">{nameNoti}</span>
                      <div className="dropdown-divider"></div>
                    </div>
                    <div className="col-2 col-md-2 text-right pr-0">
                      <label className="switch">
                        <input
                          type="checkbox"
                          onChange={this.onSwitchnotific}
                          checked={switchButtonNoti}
                        />
                        <span className="slider round"></span>
                      </label>
                    </div>
                  </div>
                  <div className="row form-set-time-show-noti">
                    <div className="form-check">
                      <span className="form-check-label">
                        Every
                        <Select
                          className="cron-block cron-block-period"
                          clearable={false}
                          value={periodNoti}
                          onChange={this.changePeriodNoti}
                          options={constant.PERIOD}
                          placeholder="Select"
                        />
                        {periodNoti === 'hour' || periodNoti === 'day'
                          ? [
                              <div className="cron-block">
                                <div>at</div>
                                {periodNoti === 'day' && (
                                  <span className="mr-2">
                                    <Select
                                      placeholder="HH"
                                      className="d-inline-flex mr-2"
                                      clearable={false}
                                      value={hoursNoti}
                                      onChange={this.changeHoursNoti}
                                      options={constant.HOURS}
                                    />
                                    :
                                  </span>
                                )}
                                <Select
                                  placeholder="mm"
                                  className="d-inline-flex"
                                  clearable={false}
                                  value={minuteNoti}
                                  onChange={this.changeMinuteNoti}
                                  options={constant.TIME}
                                />
                                {periodNoti === 'hour' && (
                                  <div>minutes past the hour</div>
                                )}
                              </div>,
                            ]
                          : [
                              periodNoti === 'week' ||
                              periodNoti === 'month' ||
                              periodNoti === 'year'
                                ? [
                                    <div className="cron-block">
                                      {periodNoti === 'week'
                                        ? [
                                            <React.Fragment>
                                              <div>on</div>
                                              <Select
                                                placeholder="ddd"
                                                className="d-inline-flex"
                                                clearable={false}
                                                value={dayNoti}
                                                onChange={this.changeDayNoti}
                                                options={constant.DAYS}
                                              />
                                            </React.Fragment>,
                                          ]
                                        : [
                                            <React.Fragment>
                                              <div>on the</div>
                                              {periodNoti === 'year'
                                                ? [
                                                    <div className="d-inline-block">
                                                      <DatePicker
                                                        selected={
                                                          this.state
                                                            .fullDateNoti
                                                        }
                                                        onChange={
                                                          this.handleChangeNoti
                                                        }
                                                        dateFormat="DD/MM"
                                                        placeholderText="DD/MM"
                                                        showYearDropdown
                                                        dateFormatCalendar="MMMM"
                                                        scrollableYearDropdown
                                                      />
                                                    </div>,
                                                  ]
                                                : [
                                                    <Select
                                                      placeholder="DD"
                                                      className="d-inline-flex"
                                                      clearable={false}
                                                      value={dateNoti}
                                                      onChange={
                                                        this.changeDateNoti
                                                      }
                                                      options={constant.DATE}
                                                    />,
                                                  ]}
                                            </React.Fragment>,
                                          ]}
                                      <span className="ml-2 mr-2">at</span>
                                      <Select
                                        placeholder="HH"
                                        className="d-inline-flex mr-2"
                                        clearable={false}
                                        value={hoursNoti}
                                        onChange={this.changeHoursNoti}
                                        options={constant.HOURS}
                                      />
                                      :
                                      <Select
                                        placeholder="mm"
                                        className="d-inline-flex ml-2"
                                        clearable={false}
                                        value={minuteNoti}
                                        onChange={this.changeMinuteNoti}
                                        options={constant.TIME}
                                      />
                                    </div>,
                                  ]
                                : '',
                            ]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row form-set-time-show-noti mt-4">
                <label className="col-md-4 col-lg-3 control-label"></label>
                <div className="col-md-5 col-lg-6 mb-3">
                  <button
                    type="submit"
                    className="btn btn-orange"
                    onClick={this.onSubmitNoti}>
                    Save
                  </button>
                  {/* <button className="btn btn-secondary ml-1">Cancel</button> */}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    ) : (
      <Redirect to="/" />
    );
  }
}

Settings.propTypes = {
  changeTheme: PropTypes.func,
  loadCron: PropTypes.func,
  setCron: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    changeTheme: bindActionCreators(changeTheme, dispatch),
    loadCron: bindActionCreators(loadCron, dispatch),
    setCron: bindActionCreators(setCron, dispatch),
    loadBirthdayNotification: bindActionCreators(
      loadBirthdayNotification,
      dispatch
    ),
  };
}

export default connect(null, mapDispatchToProps)(Settings);
