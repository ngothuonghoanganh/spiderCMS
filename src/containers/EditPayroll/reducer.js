import * as constant from './constants';

const initialState = {};

const payrollUpdating = (state = initialState, action) => {
  switch (action.type) {
    case constant.GET_PAYROLL:
      return action.payroll;
    case constant.UPDATE_PAYROLL:
      return action.payroll;
    default:
      return state;
  }
};

export default payrollUpdating;
