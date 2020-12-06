import * as constant from './constants';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';

export const actGetTimesheet = (timesheet) => {
  return {
    type: constant.GET_TIMESHEET,
    timesheet,
  };
};

export const actUpdateTimesheet = (timesheet) => {
  return {
    type: constant.UPDATE_TIMESHEET,
    timesheet,
  };
};

export const actGetTimesheetRequest = (id, callback) => {
  return (dispatch) => {
    return APIcaller(
      `${endpoint.timesheet}?timesheetId=${id}`,
      'GET',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      },
      {}
    )
      .then((res) => {
        console.log(res);

        dispatch(actGetTimesheet(res.data.data[0]));
      })
      .then(() => {
        callback();
      });
  };
};

export const actUpdateTimesheetRequest = (timesheet, callback) => {
  return (dispatch) => {
    return APIcaller(
      `${endpoint.timesheet}?timesheetId=${timesheet.id}`,
      'PATCH',
      {},
      timesheet
    )
      .then((res) => {
        dispatch(actUpdateTimesheet(res.data.data));
      })
      .then(() => {
        callback();
      });
  };
};
