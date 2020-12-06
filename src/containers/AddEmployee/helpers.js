import { get } from 'lodash';
import axios from 'axios';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import errorHandler from '../../utils/handlerError';

export function addProfile(data, callback) {
  const req = APIcaller(
    endpoint.profileid,
    'POST',
    {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    },
    { ...data }
  );
  return () => {
    req.then((res) => {
      const message = get(res, 'data.responseKey');
      

      if (res.data.responseKey === responses.insertSuccess) {
        const profile = get(res, 'data.data');
        return callback(true, profile);
      }
      return callback(false, errorHandler(message));
    });
  };
}

export const addProfilePosition = (data, callback) => {
  APIcaller(
    `${endpoint.profilePosition}`,
    'POST',
    {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    },
    { ...data }
  ).then(callback);
};

export function uploadImage(file, callback) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('profileId', 'new');
  const req = axios.post(`${endpoint.url}/${endpoint.image_upload}`, formData, {
    headers: {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    },
  });
  return () => {
    req.then((res) => {
      const message = get(res, 'data.responseKey');
      const url = get(res, 'data.data.url');
      console.log('res ', res);

      if (url) {
        return callback(true, url);
      }
      return callback(false, errorHandler(message));
    });
  };
}
