import _ from 'lodash';
import * as constant from './constants';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import * as responses from '../../constants/response';
import { deleteLocalStore, getItemLocalStore } from '../../utils/handleLocalStore';

export const toggleSidebar = (visible) => ({
  type: constant.TOGGLE_SIDEBAR,
  visible,
});

export function logOut(username) {
  const token = getItemLocalStore('token');
  const accountid = getItemLocalStore('accountid');
  const request = APIcaller(endpoint.logout, 'post', { token, accountid }, { username });
  return (dispatch) => {
    request.then((response) => {
      const data = _.get(response, 'data', {});
      const { responseKey, message } = data;
      if (responseKey === responses.logoutSuccess) {
        deleteLocalStore();
        dispatch({
          type: constant.LOG_OUT_SUCCESS,
        });
        window.location.href = '/signin';
      } else {
        dispatch({
          type: constant.LOG_OUT_FAIL,
          message,
        });
      }
    });
  };
}
