import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import errorHandler from './../../utils/handlerError';
import { get } from 'lodash';

export function createPosition(id, data, callback) {
  const req = APIcaller(`${endpoint.position}`, 'POST', {
    token: getItemLocalStore('token'),
    accountid: getItemLocalStore('accountid'),
  }, {
    ...data,
    departmentId: id,
  });
  return () => {
    req.then((res) => {
      const message = get(res, 'data.responseKey');
      if (res.data.responseKey === responses.insertSuccess) {
        return callback(true);
      }
      return callback(false, 'FAILED!!!!!', res.data.message, errorHandler(message));
    });
  };
}
