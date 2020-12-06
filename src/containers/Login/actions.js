import { get } from 'lodash';
import * as constant from './constants';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import handlerEror from '../../utils/handlerError';
import handleLocalStore from './../../utils/handleLocalStore';
import { loadProfile } from '../EditEmployee/actions';

export default function logIn(username, password, remember) {
  const request = APIcaller(endpoint.login, 'post', null, {
    username,
    password,
    remember,
  });
  return (dispatch) => {
    dispatch({
      type: constant.LOGIN_REQUEST_PENDING,
      loading: true,
    });
    request.then((response) => {
      console.log('response', response);

      const responseDatadata = get(response, 'data', {});
      const userData = get(responseDatadata, 'data', {});
      const { responseKey, token } = responseDatadata;
      const { id, permissions, rolePermissions, profile } = userData;
      const localStoreData = {
        token,
        userData,
        accountid: id,
        listPermissions: rolePermissions
          ? rolePermissions.concat(permissions)
          : permissions,
      };
      if (responseKey === responses.loginSuccess) {
        handleLocalStore(localStoreData);
        dispatch({
          type: constant.LOG_IN_SUCCESS,
          payload: responseDatadata,
        });
        dispatch(loadProfile(profile));
      } else {
        dispatch({
          type: constant.LOG_IN_FAIL,
          message: handlerEror(responseKey),
        });
      }
    });
  };
}
