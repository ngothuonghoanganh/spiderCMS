import { get, isEmpty } from 'lodash';
import * as constant from './constants';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import errorHandler from '../../utils/handlerError';
export function updateProfile(id, data, callback) {
  const req = APIcaller(
    `${endpoint.profileid}?profileId=${id}`,
    'PATCH',
    {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    },
    {
      profileId: id,
      fields: {
        ...data,
      },
    }
  );
  return (dispatch) => {
    req.then((res) => {
      const dataRes = get(res, 'data.data');
      if (dataRes) {
        dispatch({
          type: constant.UPDATE_PROFILE,
          payload: data,
        });
        return callback(true);
      }
      return callback(false, 'FAILED!!!!', errorHandler(dataRes.message));
    });
  };
}
export function changePassWord(data, callback) {
  const { password, confirmPassword, account } = data;
  const { username } = account;
  const req = APIcaller(
    `${endpoint.changePassword}`,
    'PATCH',
    {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    },
    {
      password,
      username,
    }
  );
  return () => {
    if (password === confirmPassword) {
      req.then((res) => {
        if (res.data.responseKey === responses.updateSuccess) {
          return callback(true);
        }
        return callback(false, 'FAILED!!!!!!', errorHandler(res.data.message));
      });
    } else {
      return callback(
        false,
        'FAILED!!!!!',
        'Update password failed! Please try again!'
      );
    }
  };
}
export function loadDataProfile(id) {
  const req = APIcaller(`${endpoint.profileid}?profileId=${id}`, 'GET', {
    token: getItemLocalStore('token'),
    accountid: getItemLocalStore('accountid'),
  });
  return (dispatch) => {
    req.then((res) => {
      const data = get(res, 'data.data');
      // console.log('res', res);

      // const message = get(res, 'data.responseKey');
      if (!isEmpty(data)) {
        dispatch(loadProfileUser(data));
      }
      // else {
      //   alertPopup(false, 'FAILED!!!!', errorHandler(message));
      // }
    });
  };
}
export const loadProfileUser = (data) => ({
  type: constant.LOAD_DATA_USER,
  payload: data,
});
