import * as constant from './constants';

const checkForgot = (state = '', action) => {
  switch (action.type) {
    case constant.FORGOT_SUCCESS:
      return {
        forgot: action.payload,
        isTrue: true,
      };
    case constant.FORGOT_FAIL:
      return {
        message: action.message,
      };
    default:
      return state;
  }
};

export default checkForgot;
