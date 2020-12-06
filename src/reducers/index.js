import { combineReducers } from 'redux';
import visible from '../components/Header/reducer';
import minimized from '../components/Sidebar/reducer';
import logInResult from '../containers/Login/reducer';
import checkForgot from '../containers/ForgotPassword/reducer';
import updatePass from '../containers/UpdatePassword/reducer';
import createUser from '../containers/Register/reducer';
import roles from './../containers/Roles/reducer';
// import profileData from './../containers/EditProfile/reducer';
import profileResult from './../containers/EditEmployee/reducer';
import profileUser from './../containers/EditProfile/reducer';
import positionData from './../containers/Department/reducer';
import { theme } from '../containers/Settings/reducer';
import timesheetUpdating from '../containers/EditTimesheet/reducer';
import payrollUpdating from '../containers/EditPayroll/reducer';
import payrollFetching from '../containers/Payroll/reducer';

const appReducer = combineReducers({
  visible,
  minimized,
  logInResult,
  checkForgot,
  updatePass,
  createUser,
  theme,
  roles,
  profileResult,
  // profileData,
  profileUser,
  positionData,
  timesheetUpdating,
  payrollUpdating,
  payrollFetching,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOG_OUT_SUCCESS' || action.type === 'CLEAR_MESSAGE') {
    state = undefined;
  }
  return appReducer(state, action) || null;
};

export default rootReducer;
