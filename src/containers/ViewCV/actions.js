import { get } from 'lodash';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import errorHandler from '../../utils/handlerError';

export function getListTypeCV(callback) {
  const req = APIcaller(`${endpoint.getTypeCV}`, 'GET', {
    token: getItemLocalStore('token'),
    accountid: getItemLocalStore('accountid'),
  });
  return () => {
    req.then((res) => {
      const message = get(res, 'data.responseKey');
      if (message === responses.getListSuccess) {
        const listTypeCV = get(res, 'data.data');
        return callback(true, listTypeCV);
      }
      return callback(false, errorHandler(message));
    });
  };
}
