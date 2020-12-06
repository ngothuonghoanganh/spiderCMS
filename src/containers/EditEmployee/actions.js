import { get } from 'lodash';
import * as constant from './constants';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import errorHandler from '../../utils/handlerError';
export function loadData(id, callback) {
  const req = APIcaller(`${endpoint.profileid}?profileId=${id}`, 'GET', {
    token: getItemLocalStore('token'),
    accountid: getItemLocalStore('accountid'),
  });
  return (dispatch) => {
    req.then((res) => {
      const data = get(res, 'data.data', {});
      if (data) {
        return dispatch(loadProfile(data));
      }
      return callback(false, 'FAILED!!!!', errorHandler(res.data.responseKey));
    });
  };
}
export const loadProfile = (data) => ({
  type: constant.LOAD_DATA,
  payload: data,
});

export function updateEProfile(id, data, callback) {
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
    },
  );
  return () => {
    req.then((res) => {
      const dataRes = get(res, 'data.data');
      if (dataRes) {
        return callback(true);
      }
      return callback(false, 'FAILED!!!!', errorHandler(dataRes.message));
    });
  };
}
