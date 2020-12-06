import { get } from 'lodash';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import errorHandler from '../../utils/handlerError';

export function showTreePosition(departmentId, callback) {
  const req = APIcaller(
    `${endpoint.positionChart}?departmentId=${departmentId}`,
    'GET',
    {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    }
  );
  return () => {
    req.then((res) => {
      const message = get(res, 'data.responseKey');
      console.log(res);

      if (message === responses.getListSuccess) {
        const freshData = get(res, 'data.freshData');
        const listposition = get(res, 'data.data');
        return callback(true, listposition, freshData);
      }
      return callback(false, errorHandler(message));
    });
  };
}
