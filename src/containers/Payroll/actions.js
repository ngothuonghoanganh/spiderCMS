import * as constant from './constants';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import * as responses from '../../constants/response';
import { get } from 'lodash';
import { getItemLocalStore } from '../../utils/handleLocalStore';

export const actGetPayroll = (payroll) => {
  return {
    type: constant.GET_PAYROLL,
    payroll,
  };
};

export const actGetPayrollRequest = (month, year) => {
  return (dispatch) => {
    return APIcaller(
      `${endpoint.payrolls}?month=${month}&year=${year}`,
      'GET',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      }
    ).then((res) => {
      console.log(res.data.data);
      const message = get(res, 'data.responseKey');
      if (message === responses.getListSuccess) {
        dispatch(actGetPayroll(res.data.data));
      }
    });
  };
};

// export const actHandleChangeMonthRequest = (monthSelected) => {
//   return (dispatch) => {
//     const month = monthSelected.slice(0, 2);
//     const year = monthSelected.slice(3, 8);
//     return APIcaller(
//       `${endpoint.payrolls}?month=${month}&year=${year}`,
//       'GET',
//       {
//         token: getItemLocalStore('token'),
//         accountid: getItemLocalStore('accountid'),
//       }
//     ).then((res) => {
//       console.log(res, month, year);
//       dispatch(actHandleChangeMonth(res.data.data));
//     });
//   };
// };
