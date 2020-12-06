import * as constant from './constants';

const initialState = {};

const payrollFetching = (state = initialState, action) => {
  switch (action.type) {
    case constant.GET_PAYROLL:
      return action.payroll;
    default:
      return state;
  }
};

export default payrollFetching;
