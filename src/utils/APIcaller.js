import axios from 'axios';
/** Import From File */
import * as config from './../constants/config';
import { getItemLocalStore } from './handleLocalStore';

export default function APIcaller(
  endpoint,
  method = 'GET',
  header = {},
  body = {}
) {
  /** Header Req */
  const headers = {
    'content-type': 'application/json; charset=utf-8',
    token: getItemLocalStore('token'),
    accountid: getItemLocalStore('accountid'),
    ...header,
  };

  return axios({
    method,
    headers,
    url: `${config.endpoint.url}/${config.endpoint.api}/${endpoint}`,
    data: { ...body },
  });
}
