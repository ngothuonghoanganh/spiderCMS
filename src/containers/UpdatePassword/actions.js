import _ from 'lodash';
import * as constant from './constants';
import { endpoint } from '../../constants/config';
import APIcaller from '../../utils/APIcaller';
import handlerEror from '../../utils/handlerError';
import * as responses from '../../constants/response';

export default function updatePassword(username, password) {
  const request = APIcaller(endpoint.updatePass, 'patch', null, { username, password });
  return (dispatch) => {
    request.then((response) => {
      const data = _.get(response, 'data', {});
      const { responseKey } = data;
      if (responseKey === responses.updateSuccess) {
        dispatch({
          type: constant.UPDATE_SUCCESS,
          isSuccess: true,
        });
      } else {
        dispatch({
          type: constant.UPDATE_FAIL,
          message: handlerEror(responseKey),
        });
      }
    });
  };
}
