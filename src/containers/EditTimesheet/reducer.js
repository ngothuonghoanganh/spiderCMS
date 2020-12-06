import * as constant from './constants';

const initialState = {};

const timesheetUpdating = (state = initialState, action) => {
  switch (action.type) {
    case constant.GET_TIMESHEET:
      return action.timesheet;
    case constant.UPDATE_TIMESHEET:
      return action.timesheet;
    default:
      return state;
  }
};

export default timesheetUpdating;
