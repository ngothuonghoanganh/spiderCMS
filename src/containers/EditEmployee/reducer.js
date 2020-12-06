import * as constant from './constants';
import { getItemLocalStore } from '../../utils/handleLocalStore';

const initialState = {
  avatar: getItemLocalStore('userData.profile.avatar'),
};

const profileResult = (state = initialState, action) => {
  switch (action.type) {
    case constant.LOAD_DATA:
      return {
        data: action.payload,
      };
    case constant.LOAD_DATA_REQUEST:
      return {
        loading: action.loading,
      };
    case constant.UPDATE_PROFILE: {
      return {
        data: action.payload,
      };
    }
    default:
      return state;
  }
};

export default profileResult;
