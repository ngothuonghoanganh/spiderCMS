import * as constant from './constants';

const updatePass = (state = '', action) => {
  switch (action.type) {
    case constant.UPDATE_SUCCESS:
      return {
        updateSuccess: action.isSuccess,
      };
    case constant.UPDATE_FAIL:
      return {
        message: action.message,
      };
    default:
      return state;
  }
};

export default updatePass;
