import * as constant from './constants';

const logInResult = (state = '', action) => {
  switch (action.type) {
    case constant.LOG_IN_SUCCESS:
      return {
        login: action.payload.data,
      };
    case constant.LOG_IN_FAIL:
      return {
        message: action.message,
      };
    case constant.LOGIN_REQUEST_PENDING:
      return {
        loading: action.loading,
      };
    default:
      return state;
  }
};

export default logInResult;
