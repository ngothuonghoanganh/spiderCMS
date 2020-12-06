import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import { get } from 'lodash';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import errorHandler from './../../utils/handlerError';

export function createDepartment(data, callback) {
  const req = APIcaller(`${endpoint.department}`, 'POST', {
    token: getItemLocalStore('token'),
    accountid: getItemLocalStore('accountid'),
  }, {
    ...data,
  });
  return () => {
    req.then((res) => {
      const message = get(res, 'data.responseKey');
      if (res.data.responseKey === responses.insertSuccess) {
        return callback(true);
      }
      return callback(false, errorHandler(message));
    });
  };
}
