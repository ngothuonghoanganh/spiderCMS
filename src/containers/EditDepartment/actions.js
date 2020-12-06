
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import errorHandler from '../../utils/handlerError';
export function updateDepartment(data, callback) {
  const req = APIcaller(`${endpoint.department}`, 'PATCH', {
    token: getItemLocalStore('token'),
    accountid: getItemLocalStore('accountid'),
  }, {
    departmentId: data.departmentId,
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
export function deleteDepartment(id, callback) {
  const req = APIcaller(`${endpoint.department}`, 'DELETE', {
    token: getItemLocalStore('token'),
    accountid: getItemLocalStore('accountid'),
  }, {
    departmentId: id,
  });
  return () => {
    req.then((res) => {
      if (res.data.responseKey === responses.deleteSuccess) {
        return callback(true);
      }
      return callback(false, 'FAILED!!!!', errorHandler(res.data.responseKey));
    });
  };
}
