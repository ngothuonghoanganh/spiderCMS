import { get } from 'lodash';
import * as constant from './constants';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import handlerEror from '../../utils/handlerError';
import * as responses from '../../constants/response';

export const clearMessage = () => ({
  type: 'CLEAR_MESSAGE',
});

export default function register(username, email, password) {
  const request = APIcaller(endpoint.register, 'POST', null, {
    username,
    email,
    password,
  });
  return (dispatch) => {
    dispatch({
      type: constant.REQUEST_PENDING,
      loading: true,
    });
    request.then((response) => {
      const data = get(response, 'data', {});
      const { responseKey } = data;
      if (responseKey === responses.createSuccess) {
        dispatch({
          type: constant.REGISTER_SUCCESS,
        });
      } else {
        dispatch({
          type: constant.REGISTER_FAIL,
          message: handlerEror(responseKey),
        });
      }
    });
  };
}
