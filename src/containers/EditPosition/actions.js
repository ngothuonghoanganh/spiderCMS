import { get } from 'lodash';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import errorHandler from '../../utils/handlerError';

export function loadPositionData(id, callback) {
  const req = APIcaller(`${endpoint.position}?positionId=${id}`, 'GET', {
    token: getItemLocalStore('token'),
    accountid: getItemLocalStore('accountid'),
  });
  return () => {
    req.then((res) => {
      if (res.data.responseKey === responses.getOneSuccess) {
        const positionData = get(res, 'data.data');
        if (positionData) {
          return callback(true, positionData);
        }
      }
      return callback(false, 'FAILED!!!!!', errorHandler(res.data.responseKey));
    });
  };
}
export function updatePosition(id, data, callback) {
  const req = APIcaller(`${endpoint.position}`, 'PATCH', {
    token: getItemLocalStore('token'),
    accountid: getItemLocalStore('accountid'),
  }, {
    positionId: id,
    fields: {
      ...data,
    },
  });
  return () => {
    req.then((res) => {
      if (res.data.responseKey === responses.updateSuccess) {
        return callback(true);
      }
      return callback(false, 'FAILED!!!!', errorHandler(res.data.responseKey));
    });
  };
}
