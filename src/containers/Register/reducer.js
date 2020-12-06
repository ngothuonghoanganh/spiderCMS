import * as constant from './constants';

const createUser = (state = '', action) => {
  switch (action.type) {
    case constant.REGISTER_SUCCESS:
      return {
        addUser: action.payload,
        isRegistered: true,
      };
    case constant.REGISTER_FAIL:
      return {
        message: action.message,
      };
    case constant.REQUEST_PENDING:
      return {
        loading: action.loading,
      };
    default:
      return state;
  }
};

export default createUser;
