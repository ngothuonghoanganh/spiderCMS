import * as constant from './constants';
import APIcaller from '../../utils/APIcaller';
import * as responses from '../../constants/response';
import { get } from 'lodash';
import { endpoint } from '../../constants/config';
import { alertPopup } from '../../utils/alertPopup';
import errorHandler from '../../utils/handlerError';
import { getItemLocalStore } from '../../utils/handleLocalStore';

export const actGetPayroll = (payroll) => {
  return {
    type: constant.GET_PAYROLL,
    payroll,
  };
};

export const actUpdatePayroll = (payroll) => {
  return {
    type: constant.UPDATE_PAYROLL,
    payroll,
  };
};

export const actGetPayrollRequest = (id) => {
  return (dispatch) => {
    return APIcaller(
      `${endpoint.payrollApi}?payrollId=${id}`,
      'GET',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      },
      {}
    ).then((res) => {
      console.log(res);
      const message = get(res, 'data.responseKey');
      if (message === responses.getListSuccess) {
        dispatch(actGetPayroll(res.data.data[0]));
      } else {
        alertPopup('FAILED!!!!', errorHandler(message));
      }
    });
  };
};

export const actUpdatePayrollRequest = (id, month, year, payroll, callback) => {
  return (dispatch) => {
    return APIcaller(
      `${endpoint.payrolls}?profileId=${id}&month=${month}&year=${year}`,
      'PATCH',
      {},
      payroll
    )
      .then((res) => {
        dispatch(actUpdatePayroll(res.data.data[0]));
      })
      .then(() => {
        callback();
      });
  };
};
