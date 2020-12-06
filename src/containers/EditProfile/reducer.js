
import * as constant from './constants';
import { getItemLocalStore } from '../../utils/handleLocalStore';

const initialState = {
  avatar: getItemLocalStore('userData.profile.avatar'),
};

const profileUser = (state = initialState, action) => {
  switch (action.type) {
    case constant.UPDATE_PROFILE:
      return {
        data: action.payload,
      };
    case constant.LOAD_DATA_USER:
      return {
        data: action.payload,
      };
    default:
      return state;
  }
};

export default profileUser;
