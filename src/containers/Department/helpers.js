import { get } from 'lodash';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import errorHandler from '../../utils/handlerError';

export function loadDepartment(callback) {
  const req = APIcaller(`${endpoint.departments}`, 'GET', {
    token: getItemLocalStore('token'),
    accountid: getItemLocalStore('accountid'),
  });
  return () => {
    req.then((res) => {
      console.log(res);

      if (res.data.responseKey === responses.getListSuccess) {
        const departmentData = get(res, 'data.data', '');
        departmentData.forEach((element) => {
          element.isActive = false;
        });
        const department = [...departmentData];
        return callback(true, department);
      }
      return callback(false, 'FAILED!!!!', errorHandler(res.data.responseKey));
    });
  };
}

export function loadPosition(departmentId, callback) {
  const req = APIcaller(
    `${endpoint.positions}?departmentId=${departmentId}`,
    'GET',
    {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    }
  );
  return () => {
    req.then((res) => {
      console.log(res);

      const positionData = get(res, 'data.data');
      if (res.data.responseKey === responses.getListSuccess) {
        return callback(true, positionData);
      }
      return callback(false, 'FAILED!!!!', errorHandler(res.data.responseKey));
    });
  };
}
