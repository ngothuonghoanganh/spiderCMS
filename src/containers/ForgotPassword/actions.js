import _ from 'lodash';
import * as constant from './constants';
import { endpoint } from '../../constants/config';
import APIcaller from '../../utils/APIcaller';
import handlerEror from '../../utils/handlerError';
import * as responses from '../../constants/response';

export default function forgot(email) {
  const request = APIcaller(endpoint.forgot, 'post', null, { email });
  return (dispatch) => {
    request.then((response) => {
      const data = _.get(response, 'data', {});
      const { responseKey } = data;
      if (responseKey === responses.getOneSuccess) {
        dispatch({
          type: constant.FORGOT_SUCCESS,
          payload: response.data.data,
        });
      } else {
        dispatch({
          type: constant.FORGOT_FAIL,
          message: handlerEror(responseKey),
        });
      }
    });
  };
}
